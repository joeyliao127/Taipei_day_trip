from packages import dbConnector as DC

def get_order_info(orderId):
    query_str = "SELECT o.orderId, o.attraction_id, o.price, a.name AS attraction_name, a.address, i.url, o.date, o.time, o.member_name, o.email, o.phone, o.payment_status FROM orders o JOIN attractions a ON o.attraction_id = a.id JOIN image i ON a.img = i.attraction WHERE o.orderId = %s limit 1"
    query_args = (orderId,)
    result = DC.find(query_str, query_args)
    print("===============查詢到的訂單資訊===============")
    print(result)
    order_info = {
        "data":{
            "number": result["orderId"],
            "price": result["price"],
            "trip":{
                "attraction":{
                    "id": result["attraction_id"],
                    "name": result["attraction_name"],
                    "address": result["address"]
                },
                "date": result["date"],
                "time": result["time"]
            },
            "contact":{
                "name": result["member_name"],
                "email": result["email"],
                "phone": result["phone"]
            },
            "status": result["payment_status"],
        }
    }
    if(result):
        return order_info
    else:
        return False


def get_all_order_info(email):
    pass

def insert_order_info(orderId:str,prime:str, attractionId:int, price:int, date:str, setTime: str, member_name:str, email:str, phone:str, member_id):
    execute_str = "INSERT INTO orders(orderId, attraction_id, price, member_name, email, phone, date, time, prime, payment_status, member_id) VALUES(%s,%s,%s,%s,%s,%s,%s,%s,%s,%s, %s)"
    execute_args = (orderId, attractionId, price, member_name, email, phone, date, setTime, prime, 0, member_id)
    print(f"order model的args = {execute_args}")
    result = DC.insert(execute_str, execute_args)
    if(result):
        return True
    else:
        return False


def is_paid(orderId):
    execute_str = "UPDATE orders SET payment_status=1 WHERE orders.orderId = %s"
    execute_args = (orderId,)
    result = DC.update(execute_str, execute_args)
    if(result):
        print(f"更新完的result = {result}")
        print("已更新付款狀態：payment = 1")
        return True
    else:
        print("order_crud：尚未找到更新目標")
        return False
    

