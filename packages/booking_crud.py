from packages import dbConnector as DC

def get_order():
    query_str = "SELECT * from booking where attractionId = %s"
    query_args = (10, )
    res = DC.find(query_str, query_args)
    print("booking curd result:", res)
    if(res):
        return res
    else:
        return False

def create_order(email, attractionId, date, price):
    execute_str = "INSERT INTO booking(email, attractionId,date, price) VALUES(%s, %s, %s, %s)"
    execute_args = (email, attractionId, date,price)
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
        return True
    else:
        return False
    
