import mysql.connector
import json
import sys
dbconfig = {
    "host": "127.0.0.1",
    "port": 3306,
    "user": "root", 
    "password": "root",
    "database": "Taipei_Trip",
}

connectionPool = mysql.connector.pooling.MySQLConnectionPool(pool_name="website",pool_size=5,**dbconfig)

def connectionDecorator(operationFn):
    def connectDB(queryStr: str, queryArgs: tuple):
        print(f"CRUD Fn的args = {queryStr}")
        try:
            with connectionPool.get_connection() as connection:
                print("Connected to database!")
                with connection.cursor(dictionary=True) as cursor:
                    result = operationFn(cursor,connection,queryStr,queryArgs)  
                    return result
        except Exception as ex:
            print("連線失敗:")
            print(f"來自DB的錯誤訊息：{ex}")
            return False                 
    return connectDB

@connectionDecorator
def insertData(cursor, connection, execute_string:str, execute_Args:list):
    try:
        print(f"args = {execute_Args}")
        cursor.execute(execute_string, execute_Args)
        connection.commit()
        print("插入資料成功")
        return True
    except Exception as ex:
        print(f"寫入資料庫失敗，來自資料庫的錯誤訊息：\n{ex}")
        return False

def insert_attractions_table(attraction_data: list):
   execute_string = "INSERT INTO attractions(name, description, address,transport,lng,lat,category, mrt, img) VALUES(%s,%s,%s,%s,%s,%s,%s,%s,%s)"
   execute_Args = attraction_data
   insertData(execute_string, execute_Args)
   
def insert_mrt_table(mrt_data: str, index: int):
    execute_string = "INSERT INTO mrt(id,name) VALUE(%s, %s)"
    execute_Args = [index, mrt_data]
    # insertData(execute_string, execute_Args)
    
def insert_category_table(category_data: str, index: int):
    execute_string = "INSERT INTO category(id,name) VALUE(%s,%s)"
    execute_Args = [index,category_data]
    # insertData(execute_string, execute_Args)

    
def insert_image_table(img_data: str, index: int):
    execute_string = "INSERT INTO image(attraction, url) VALUES(%s, %s)"
    execute_Args = [index, img_data]
    insertData(execute_string, execute_Args)

with open(f"data/taipei-attractions.json", mode="r", encoding="utf-8") as file:
    data = json.load(file)

attractions = data["result"]["results"]
mrt_fk = []
cat_fk = []
img_fk = {}
img_counter = 1
img_dict = {}
counter = 1
for item in attractions:
    cat_name = item["CAT"]
    mrt_name = item["MRT"]
    urls = item["file"]

    if(mrt_name not in mrt_fk):
        if(mrt_name):
            mrt_fk.append(mrt_name)
            insert_mrt_table(mrt_data= mrt_name, index=mrt_fk.index(mrt_name)+1)
        elif(mrt_name == None):
            mrt_fk.append(None)
            insert_mrt_table(mrt_data= None, index=mrt_fk.index(None)+1)

    if(cat_name not in cat_fk):
        if(cat_name != "其\u3000\u3000他"):
            cat_fk.append(cat_name)
            insert_category_table(category_data=cat_name, index=cat_fk.index(cat_name)+1)
        else:
            cat_fk.append(cat_name)
            insert_category_table(category_data="其他", index=cat_fk.index(cat_name)+1)
        
    url_list = []
    url_temp_list = urls.split("https")
    check_list = ("jpg", "JPG", "png", "PNG")
    for url in url_temp_list:
        if(url[-3:] in check_list):
            insert_image_table(img_data= f"https{url}", index= counter)
            # url_list.append(f"https{url}")
    # url_list

    attraction_table = [
        item["name"],
        item["description"],
        item["address"],
        item["direction"],
        item["longitude"],
        item["latitude"],
        cat_fk.index(cat_name)+1,
        mrt_fk.index(mrt_name)+1,            
        counter
    ]
    counter += 1
        # insert_attractions_table(attraction_table)
# print(url_list)
# print(counter)
