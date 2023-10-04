import mysql.connector
from dotenv import dotenv_values

secret = dotenv_values('.env')

def connectToDB():
    dbconfig = {
        "host": "127.0.0.1",
        "port": 3306,
        "user": secret["mysql_user"], 
        "password": secret["mysql_pwd"],
        "database": "taipei_trip",
    }
    try:
        connectionPool = mysql.connector.pooling.MySQLConnectionPool(pool_name="taipei_trip", pool_size=5, **dbconfig)
        print("建立connectionPool成功")
        return connectionPool
    except Exception as ex:
        print("建立connectionPool失敗...\n錯誤訊息：",ex)
        return False    

connectionPool = connectToDB()

def connectDB():
    if(connectionPool):
        return connectionPool.get_connection()
    else:
        return False

def insert(execute_str:str, execute_args: tuple):
    connection = connectDB()
    if(not connection):
        return False
    
    cursor = connection.cursor() 
    try:
        print("開始執行insertData")
        cursor.execute(execute_str, execute_args)
        connection.commit()
    except Exception as ex:
        print(f"insert error msg = ${ex}")
        return False
    finally:
        cursor.close()
        connection.close()
    print("insert Data 成功！！")
    return True

def find(query_str, query_args=None):
    connection = connectDB()
    if(not connection):
        return False
    cursor = connection.cursor(dictionary=True)
    try:
        cursor.execute(query_str, query_args)
        result = cursor.fetchall()
    except Exception as ex:
        print(f"memberInfo查詢失敗，錯誤訊息為\n${ex}")
        return False
    finally:
        cursor.close()
        connection.close()
    print(f"dbConnector result = ${result}")
    if(result):
        return result[0]
    else:
        return False
    
def delete(execute_str: str, execute_args: tuple):
    connection = connectDB()
    if(not connection):
        return False
    cursor = connection.cursor()
    try:
        cursor.execute(execute_str, execute_args)
        connection.commit()
        print("刪除成功！")
    except Exception as e:
        print("刪除失敗，錯誤訊息\n",e)
        return False
    finally:
        cursor.close()
        connection.close()
        return True
    
def update(execute_str: str, execute_args: tuple):
    connection = connectDB()
    if(not connection):
        return False
    cursor = connection.cursor()
    try:
        cursor.execute(execute_str, execute_args)
    except Exception as e:
        print("更新失敗，錯誤訊息\n",e)
        return False
    finally:
        change_row = cursor.rowcount
        if(change_row == 0):
            print("更新失敗，尚未找到符合條件的目標。")
            return False
        connection.commit()
        print("更新成功！")
        cursor.close()
        connection.close()
        return True
        
if __name__ == '__main__':
    pass


