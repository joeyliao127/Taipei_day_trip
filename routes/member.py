import json
from flask import Blueprint, request
from packages import memberInfo 
import re
import jwt
import datetime
from dotenv import dotenv_values

secret = dotenv_values('.env')
members = Blueprint('members', __name__)

@members.after_request
def add_cors_headers(response):
    response.headers['Access-Control-Allow-Origin'] = "*"
    return response

def generate_jwt_token(payload,secret_key):
    expiration_time = datetime.datetime.utcnow() + datetime.timedelta(days=7)
    payload["exp"] = expiration_time
    token = jwt.encode(payload, secret_key, algorithm="HS256")
    return token

def decode_jwt_token(token, secret_key):
    data = jwt.decode(token, secret_key, algorithms="HS256")
    return data

conten_type = {'Content-Type': "application/json; charset=utf-8"}
email_regex = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
@members.after_request
def add_cors_headers(response):
	response.headers['Access-Control-Allow-Origin'] = "*"
	return response

@members.route("/user", methods=["POST"])
def signup():
    raw_data = request.data
    json_data = json.loads(raw_data.decode('utf-8'))
    email = json_data["email"]
    name = json_data["name"]
    password = json_data["password"]
    if(not (email and name and password)):
        return json.dumps({"error": True, "message": "請輸入完整的資訊"}), 400, conten_type
    userInfo = {
        "email":email,
        "name": name,
        "password": password
          }

    status = memberInfo.signup(userInfo)    
    if(status["status"]):
        return json.dumps({"ok": True}, 
            ensure_ascii=False), 200, conten_type
    else:
        msg = status["msg"]
        return json.dumps({"error": True, "message": msg}, ensure_ascii=False), 401,conten_type
        
@members.route("/user/auth", methods=["PUT", "GET"])
def sigin():
    jwt_key = secret["jwt_key"]
    if(request.method == "PUT"):
        raw_data = request.data
        json_data = json.loads(raw_data.decode('utf-8'))
       
        email = json_data["email"]
        if(not re.match(email_regex, email)):
            return json.dumps({"error": True, "msg": "請輸入正確的Email格式"}, ensure_ascii = False), 401, conten_type
        
        email = json_data["email"]
        password = json_data["password"]
        result = memberInfo.sigin(email, password)

        if("status" in result):
            return json.dumps({"error": True, "message": result["message"]}, ensure_ascii = False), 401, conten_type
        else:
            payload = result
            token = generate_jwt_token(payload, jwt_key)
            return json.dumps({"token": token}), 200, conten_type
        
    elif(request.method == "GET"):
        user_data = {}
        auth_header = request.headers.get("Authorization", None)
        if(not auth_header):
            return json.dumps({"data": None}, ensure_ascii = False), 401, conten_type
   
        data = auth_header.split(" ");
        token = data[1];

        payload = decode_jwt_token(token, jwt_key)
        user_data["data"] = {
            "id": payload["id"],
            "name": payload["name"],
            "email": payload["email"],
        }
        return json.dumps(user_data, ensure_ascii=False), 200, conten_type

