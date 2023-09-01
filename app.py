from flask import *
import mysql.connector
import sys
app=Flask(
	__name__,
	static_folder="public",
	static_url_path="/"
)
app.config["JSON_AS_ASCII"]=False
app.config["TEMPLATES_AUTO_RELOAD"]=True
app.secret_key = "0xffffffff"

dbconfig = {
    "host": "127.0.0.1",
    "port": 3306,
    "user": "root", 
    "password": "root",
    "database": "Taipei_Trip",
}

try:
    connectionPool = mysql.connector.pooling.MySQLConnectionPool(pool_name="taipei_trip", pool_size=5, **dbconfig)
    print("建立connectionPool成功")
except Exception as ex:
	print("建立connectionPool失敗...\n錯誤訊息：",ex)

         
def find(execute_Str: str, execute_Args=None):  
	connection = connectionPool.get_connection()
	cursor = connection.cursor(dictionary=True)

	try:
		cursor.execute(execute_Str, execute_Args)
		result = cursor.fetchall()
	except Exception as ex:
		print(f"查詢失敗..\n錯誤訊息：{ex}")
		return {"error": "查詢失敗"}
	finally:
		cursor.close()			
		connection.close()
	return {"data": result}

def get_image(id:str):
	execute_Str = "SELECT url FROM image where attraction = %s"
	execite_Args = [int(id)]
	result = find(execute_Str, execite_Args)
	if("data" in result):
		data = result["data"]
		urls = [item["url"] for item in data]
		return urls
	else:
		print(result)
		return result

def get_one_attraction(id:int):
	execute_Str = "select a.id as id, a.name as name, a.description as description, a.address as address, a.transport as transport, a.lat as lat, a.lng as lng, c.name as category, mrt.name as mrt FROM attractions a join category c on c.id = a.category join mrt on mrt.id = a.mrt WHERE a.id = %s"
	execute_Args = [id]
	result = find(execute_Str,execute_Args)
	if("data" in result and result["data"]):
		data = result["data"][0]
		url = get_image(id)
		data["images"] = url
		# print("one_att查詢成功：\n", data)
		data = {
			"data": data
		}
		return data
	elif("data" in result and not result["data"]):
		return None
	else:
		print("get_one_att錯誤result:", result)
		return result
	
def get_attractions(page, keyword):
	count = int(page) * 12
	if(keyword):
		execute_Str = "select a.id as id, a.name as name, a.description as description, a.address as address, a.transport as transport, a.lat as lat, a.lng as lng, c.name as category, mrt.name as mrt FROM attractions a join category c on c.id = a.category join mrt on mrt.id = a.mrt WHERE a.name LIKE %s OR mrt.name LIKE %s LIMIT 12 OFFSET %s"
		execute_Args = ["%"+keyword+"%","%"+keyword+"%", count]
		data = find(execute_Str,execute_Args)
		query_str = "SELECT count(*) as count FROM attractions WHERE attractions.name LIKE %s"
		query_args = [keyword+"%"]
		data_count = find(query_str,query_args)
		data["count"] = data_count["data"][0]["count"]
		print(f"counter = {data_count}")

	else:
		execute_Str = "select a.id as id, a.name as name, a.description as description, a.address as address, a.transport as transport, a.lat as lat, a.lng as lng, c.name as category, mrt.name as mrt FROM attractions a join category c on c.id = a.category left join mrt on mrt.id = a.mrt LIMIT 12 OFFSET %s"
		execute_Args = [count]
		data = find(execute_Str, execute_Args)
		query_str = "SELECT count(*) as count FROM attractions"
		data_count = find(query_str,[])
		data["count"] = data_count["data"][0]["count"]

	if("data" in data):
		return data
	elif("error" in data):
		print("get_attractions裡面的錯誤訊息：\n",data)
		return data

def get_mrts():
	execute_Str = "SELECT m.id, m.name, COUNT(a.mrt) AS mrt_count FROM mrt m JOIN attractions a ON m.id = a.mrt GROUP BY m.name ORDER BY mrt_count DESC;"
	execute_Args = []
	result = find(execute_Str, execute_Args)
	print(f"MRT:{result}")
	if("data" in result):
		return result
	elif("error" in result):
		return result
	

#---------------------------------------------
# Pages
@app.route("/")
def index():
	return render_template("index.html")
@app.route("/attraction/<id>")
def attraction(id):
	return render_template("attraction.html")
@app.route("/booking")
def booking():
	return render_template("booking.html")
@app.route("/thankyou")
def thankyou():
	return render_template("thankyou.html")
#---------------------------------------------

@app.route("/api/attractions")
def attraction_page():
	page = int(request.args.get("page", "0"))
	keyword = request.args.get("keyword", None)
	print(f"page = {page}, keyword = {keyword}")
	data = get_attractions(page, keyword)
	if("data" in data and data["data"]):
		all_page = int(data["count"]) // 12 - 1
		mod = int(data["count"]) % 12
		print(f"all page = {all_page}")
		print(f"all page mod = {mod}")
		if(mod):
			all_page += 1
		if(page < all_page):
			next_page = page + 1
		else:
			next_page = None
		print("查詢筆數：", len(data["data"]))
		for attraction in data["data"]:
			attraction["images"] = get_image(attraction["id"])

		return_data = {
			"nextPage": next_page,
			"data": data["data"]
		}	
		print(f"return data:\n{return_data}")

		return json.dumps(return_data, ensure_ascii=False),200,{'Content-Type': "application/json; charset=utf-8"}

	elif("data" in data and len(data["data"]) == 0):
		return json.dumps({"nextPage":None,"data":None}, ensure_ascii=False),200,{'Content-Type': "application/json; charset=utf-8"}

	elif("error" in data):
		print("route收到的錯誤訊息：", data)
		err_msg = data["error"]
		error = {
			"error": True,
			"message": str(err_msg)
		}
		print("error = ", error)
		return json.dumps(error,ensure_ascii=False),500,{'Content-Type': "application/json; charset=utf-8"}

@app.route("/api/attraction/<attractionId>")
def api_attractions(attractionId):
	id = int(attractionId)
	data = get_one_attraction(id)
	print(f"========================/api/attractions/<id> route的return data:============================\n{data}")
	if(not data):
		return json.dumps({"error": True,"message":"景點編號不正確"}, ensure_ascii=False),400,{'Content-Type': "application/json; charset=utf-8"}

	if("error" in data):
		return json.dumps({"error": True, "message": data["error"]}, ensure_ascii=False),500,{'Content-Type': "application/json; charset=utf-8"}
	elif("data" in data):
		print("/api/att/id回傳的data:\n",data)
		return json.dumps(data, ensure_ascii=False),200,{'Content-Type': "application/json; charset=utf-8"}
	
		
	
@app.route("/api/mrts")
def api_mrts():
	result = get_mrts()
	if("data" in result):
		mrts = [mrt["name"] for mrt in result["data"]]
		return_data = {
			"data": mrts
		}
		return json.dumps(return_data, ensure_ascii=False),200,{'Content-Type': "application/json; charset=utf-8"}
	elif("error" in result):
		return json.dumps({"error": True, "message": "查詢失敗"}, ensure_ascii=False),500,{'Content-Type': "application/json; charset=utf-8"}
		
app.run(host="0.0.0.0", port=3000, debug=True, use_reloader=True)

