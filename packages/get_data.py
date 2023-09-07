from packages import dbConnector as DC

def find(execute_Str: str, execute_Args=None):  
	connection = DC.connectDB()
	cursor = connection.cursor(dictionary=True)
	try:
		cursor.execute(execute_Str, execute_Args)
		result = cursor.fetchall()
		# print("-----------result---------------\n", result)
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
		query_str = "SELECT count(*) as count FROM attractions join mrt m on attractions.mrt = m.id WHERE attractions.name LIKE %s OR m.name LIKE %s"
		query_args = ["%"+keyword+"%", "%"+keyword+"%"]
		data_count = find(query_str,query_args)
		print("=========data count=============")
		print(data_count)
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