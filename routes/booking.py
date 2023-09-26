import json
from flask import Blueprint, request
from packages import booking_crud as bc
import jwt
import datetime
from dotenv import dotenv_values

bookings = Blueprint('booking', __name__)
content_type = {'Content-Type': "application/json; charset=utf-8"}

def get():
    pass

@bookings.route("/booking", methods=["GET", "POST", "DELETE"])
def booking():
    # auth_header = request.headers.get("Authorization", None)
    # if(not auth_header):
    #     return json.dumps({"error": True, "message": "尚未登入帳戶"}, ensure_ascii = False), 403, content_type
    # print(request.method)
    if(request.method == "GET"):
        res = bc.get_order()
        print("route reuslt:",res)
        
    elif(request.method == "POST"):
        raw_data = request.data
        json_data = json.loads(raw_data.decode('utf-8'))
        # print("booking json data = ", json_data)
        data = (
            json_data.get("email", None),
            json_data.get("attractionId", None),
            json_data.get("date", None),
            json_data.get("price", None)
        )
        print("route data = ", data)
        if(None in data):
            return json.dumps({"error": True, "message": "請提供完整訊息"}), 400, content_type

        res = bc.create_order(data[0], data[1], data[2], data[3])
        if(res):
            return json.dumps({"ok": True}), 200, content_type
        else:
            return json.dumps({"error": True, "message": "伺服器內部問題"}), 500,content_type
        
    elif(request.method == "DELETE"):
        raw_data = request.data
        json_data = json.loads(raw_data.decode('utf-8'))
        email = json_data.get("email", None)
        if(email == None):
            return json.dumps({"error": True, "message": "請提供完整訊息"}), 400, content_type
        res = bc.delete_oder(email)
        if(res):
            return json.dumps({"ok": True}), 200, content_type
        else:
            return json.dumps({"error": True, "message": "伺服器內部問題"}), 500,content_type

