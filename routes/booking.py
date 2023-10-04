import json
from flask import Blueprint, request
from packages import booking_crud as bc
from packages import jwt_token

bookings = Blueprint('booking', __name__)
content_type = {'Content-Type': "application/json; charset=utf-8"}

@bookings.route("/booking", methods=["GET", "POST", "DELETE"])
def booking():
    auth_header = request.headers.get("Authorization", None)
    print("request method = ",request.method)
    if(not auth_header):
        return json.dumps({"error": True, "message": "尚未登入帳戶"}, ensure_ascii = False), 403, content_type
    
    data = auth_header.split(" ");
    token = data[1];
    try:
        userData = jwt_token.decode_jwt_token(token)            
    except Exception as ex:
        print(f"decode失敗，錯誤訊息\n", ex)
        return json.dumps({"error": True, "message": "invalid token"}, ensure_ascii = False), 403, content_type
    finally:
        print("decode token accomplish")

    email = userData.get("email", None)

    if(request.method == "GET"):
        res = bc.get_order(email)
        if(not res):
            return json.dumps({"data": False}), 200, content_type
        print("========route GET method reuslt:=========",res)
        return json.dumps(res), 200, content_type
    elif(request.method == "POST"):
        raw_data = request.data
        json_data = json.loads(raw_data.decode('utf-8'))
        
        data = (
            email,
            json_data.get("attractionId", None),
            json_data.get("date", None),
            json_data.get("price", None),
            json_data.get("time", None)
        )
        print("route data = ", data)
        if(None in data):
            return json.dumps({"error": True, "message": "請提供完整訊息"}), 400, content_type

        res = bc.create_order(data[0], data[1], data[2], data[3], data[4])
        if(res):
            return json.dumps({"ok": True}), 200, content_type
        else:
            return json.dumps({"error": True, "message": "伺服器內部問題"}), 500,content_type
        
    elif(request.method == "DELETE"):
        if(email == None):
            return json.dumps({"error": True, "message": "請提供完整訊息"}), 400, content_type
        res = bc.delete_oder(email)
        if(res):
            return json.dumps({"ok": True}), 200, content_type
        else:
            return json.dumps({"error": True, "message": "伺服器內部問題"}), 500,content_type

