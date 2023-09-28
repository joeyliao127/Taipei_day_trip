import json
from flask import Blueprint, request
from packages import get_data 

attractions = Blueprint('attractions', __name__)

@attractions.after_request
def add_cors_headers(response):
	response.headers['Access-Control-Allow-Origin'] = "*"
	return response

@attractions.route("/mrts")
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
	
@attractions.route("/attractions")
def attraction_page():
	page = int(request.args.get("page", "0"))
	keyword = request.args.get("keyword", None)
	data = get_data.get_attractions(page, keyword)
	if("data" in data and data["data"]):
		all_page = int(data["count"]) // 12 - 1
		mod = int(data["count"]) % 12
		if(mod):
			all_page += 1
		if(page < all_page):
			next_page = page + 1
		else:
			next_page = None
		for attraction in data["data"]:
			attraction["images"] = get_data.get_image(attraction["id"])

		return_data = {
			"nextPage": next_page,
			"data": data["data"]
		}	

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
	
@attractions.route("/attraction/<attractionId>")
def api_attractions(attractionId):
	id = int(attractionId)
	data = get_data.get_one_attraction(id)
	if(not data):
		return json.dumps({"error": True,"message":"景點編號不正確"}, ensure_ascii=False),400,{'Content-Type': "application/json; charset=utf-8"}

	if("error" in data):
		return json.dumps({"error": True, "message": data["error"]}, ensure_ascii=False),500,{'Content-Type': "application/json; charset=utf-8"}
	elif("data" in data):
		return json.dumps(data, ensure_ascii=False),200,{'Content-Type': "application/json; charset=utf-8"}