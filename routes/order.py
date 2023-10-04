import json
import requests
import re
from flask import Blueprint, request
from packages import order_crud 
from packages import booking_crud
from packages import jwt_token
from dotenv import dotenv_values
import time

order = Blueprint('order', __name__)
content_type = {'Content-Type': "application/json; charset=utf-8"}

env_value = dotenv_values('.env')

def fetch_Tappay(order_info: dict):
    url = "https://sandbox.tappaysdk.com/tpc/payment/pay-by-prime"
    payload = {
        "prime": order_info["prime"],
        "partner_key": env_value["partner_key"],
        "merchant_id": env_value["merchant_id"],
        "details": "Taipei Trip test",
        "amount": order_info["order"]["price"],
        "cardholder": {
            "phone_number": order_info["contact"]["phone"],
            "name": order_info["contact"]["name"],
            "email": order_info["contact"]["email"],
            "zip_code": "",
            "address": "",
            "national_id":"",
        }
    }
    print(f"傳送至銀行的payload:{payload}")
    header = {
        "Content-Type": "application/json",
        "x-api-key": env_value["partner_key"],
    }
    try:
        response = requests.post(url=url, headers=header, json=payload)            
    except Exception as ex:
      print(f"ex = {ex}")
      print("尚未取得銀行授權(非預期錯誤)")
    
    if response.status_code == 200:
        json_data = response.json()
        print(json_data)
        if(json_data["status"] == 0):
            print("取得銀行授權成功，已付款")
            return True
        else:
            print("取得授權失敗")
            print("來自銀行的msg:", json_data["msg"])
            return False
    

def create_order(orderId, order_info, member_id):
    res = order_crud.insert_order_info(
        orderId= orderId,
        prime=order_info["prime"],
        attractionId=order_info["order"]["trip"]["attraction"]["id"],
        price=order_info["order"]["price"],
        date=order_info["order"]["date"],
        setTime=order_info["order"]["time"],
        member_name=order_info["contact"]["name"],
        email=order_info["contact"]["email"],
        phone=order_info["contact"]["phone"],
        member_id=member_id
    )
    if(res):
        print("新增訂單資料成功！")
        return True
    else:
        print("新增訂單資料失敗")
        return False
    
    
def verify_phone_number(phone_number: dict):
    phone_number_regex = r'^09\d{8}$'
    res = re.match(phone_number_regex, phone_number)
    if(res):
        return True
    else:
        return False
    
def verify_email(email: dict):
    email_regex = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    res = re.match(email_regex, email)
    if(res):
        return True
    else:
        return False

def throw_error_response(msg: str, status_code: int):
    return json.dumps({"error": True, "message": msg}, ensure_ascii = False), status_code, content_type

@order.route("/orders", methods=["POST"])
def orders():
    auth_header = request.headers.get("Authorization", None)
    if(not auth_header):
        return throw_error_response("尚未登入帳戶", 403)
    
    token = auth_header.split(" ")
    try:
        userData = jwt_token.decode_jwt_token(token[1])            
    except Exception as ex:
        print(f"decode失敗，錯誤訊息\n", ex)
        return throw_error_response("invalid token", 400)
    finally:
        print("decode token accomplish")
    
    member_id = userData["id"]
    order_info = request.get_json()
    is_valid_email = verify_email(order_info["contact"]["email"])
    orderId = "B"+str(int(time.time()))

    if(not is_valid_email):
        return throw_error_response("invalid email format", 400)
    is_valid_phone = verify_phone_number(order_info["contact"]["phone"])
    if(not is_valid_phone):
        return throw_error_response("invalid phone format", 400)
    
    res = create_order(orderId,order_info, member_id)
    #新增order資訊成功後，就可以像銀行請求授權
    if(res):
        is_get_authorization = fetch_Tappay(order_info)
    else:
        return throw_error_response("新增訂單失敗", 500)
    
    if(is_get_authorization):
        #若完成付款，member_email用來刪除booking table中的訂單。
        member_email = userData["email"]
        booking_crud.delete_oder(member_email)
        is_update_payment = order_crud.is_paid(orderId)
    
    if(is_update_payment):
        success_data = {
            "data":{
                "number": orderId,
                "payment":{
                    "status": 0,
                    "message": "付款成功"
                }
            }
        }
        return json.dumps(success_data), 200, content_type
    else:
        return throw_error_response("test", 200)
@order.route("/order/<orderNumber>")
def get_order(orderNumber):
    auth_header = request.headers.get("Authorization", None)
    if(not auth_header):
        return throw_error_response("尚未登入帳戶", 403)
    
    token = auth_header.split(" ")
    try:
        userData = jwt_token.decode_jwt_token(token[1])            
    except Exception as ex:
        print(f"decode失敗，錯誤訊息\n", ex)
        return throw_error_response("invalid token", 400)
    finally:
        print("decode token accomplish")

    order_info = order_crud.get_order_info(orderNumber)
    return json.dumps(order_info), 200, content_type

    