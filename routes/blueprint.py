import json
from flask import Blueprint, request
import packages.dbConnector as DC
from packages import get_data 

blueprint = Blueprint('blueprint', __name__)

@blueprint.after_request
def add_cors_headers(response):
	response.headers['Access-Control-Allow-Origin'] = "*"
	return response

@blueprint.route("/mrts")
def api_mrts():
	result = get_data.get_mrts()
	if("data" in result):
		mrts = [mrt["name"] for mrt in result["data"]]
		return_data = {
			"data": mrts
		}
		return json.dumps(return_data, ensure_ascii=False),200,{'Content-Type': "application/json; charset=utf-8"}
	elif("error" in result):
		return json.dumps({"error": True, "message": "查詢失敗"}, ensure_ascii=False),500,{'Content-Type': "application/json; charset=utf-8"}
	
@blueprint.route("/attractions")
def attraction_page():
	page = int(request.args.get("page", "0"))
	keyword = request.args.get("keyword", None)
	print(f"page = {page}, keyword = {keyword}")
	data = get_data.get_attractions(page, keyword)
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
			attraction["images"] = get_data.get_image(attraction["id"])

		return_data = {
			"nextPage": next_page,
			"data": data["data"]
		}	
		# print(f"return data:\n{return_data}")

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
	
@blueprint.route("/attraction/<attractionId>")
def api_attractions(attractionId):
	id = int(attractionId)
	data = get_data.get_one_attraction(id)
	print(f"========================/attractions/<id> route的return data:============================\n{data}")
	if(not data):
		return json.dumps({"error": True,"message":"景點編號不正確"}, ensure_ascii=False),400,{'Content-Type': "application/json; charset=utf-8"}

	if("error" in data):
		return json.dumps({"error": True, "message": data["error"]}, ensure_ascii=False),500,{'Content-Type': "application/json; charset=utf-8"}
	elif("data" in data):
		print("/att/id回傳的data:\n",data)
		return json.dumps(data, ensure_ascii=False),200,{'Content-Type': "application/json; charset=utf-8"}