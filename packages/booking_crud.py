from packages import dbConnector as DC

def get_order(email: str):
    query_str = "SELECT a.id, a.name, a.address, i.url, b.date, b.time, b.price FROM booking b JOIN attractions a ON b.attractionId = a.id JOIN image i ON a.img = i.attraction WHERE b.email = %s limit 1";
    query_args = (email, )
    res = DC.find(query_str, query_args)
    print("booking curd result:", res)
    if(res):
        date = res["date"].date()        
        date = date.isoformat()
        return_data = {
        "data":{
            "attraction":{
                "id": res["id"],
                "name": res["name"],
                "address": res["address"],
                "image": res["url"],
            },
        "date": date,
        "time": res["time"],
        "price": res["price"]
        }
    }
        return return_data
    elif(res == False):
        print("booking crud：沒有找到booking結果")
        return False

def create_order(email, attractionId, date, price, time):
    remove_str = "DELETE FROM booking where email = %s"
    remove_args = (email, )
    DC.delete(remove_str, remove_args)
    execute_str = "INSERT INTO booking(email, attractionId,date, price, time) VALUES(%s, %s, %s, %s, %s)"
    execute_args = (email, attractionId, date, price, time)
    print("booking_curd執行insert")
    result = DC.insert(execute_str, execute_args)
    if(result):
        return True
    else:
        return False
    
def delete_oder(email):
    execute_str = "DELETE FROM booking WHERE email = %s"
    execute_args = (email,)
    res = DC.delete(execute_str, execute_args)
    if(res):
        print("booking_crud刪除成功")
        return True
    else:
        return False
    
