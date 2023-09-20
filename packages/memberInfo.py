import json
import packages.dbConnector as dc

def find(query_str, query_args=None):
    connection = dc.connectDB()
    cursor = connection.cursor(dictionary=True)
    try:
        print(f"queryStr = ${query_str}\nqueryArgs = ${query_args}")
        cursor.execute(query_str, query_args)
        result = cursor.fetchall()
    except Exception as ex:
        print(f"memberInfo查詢失敗，錯誤訊息為\n${ex}")
        return False
    finally:
        cursor.close()
        connection.close()
    print(f"result = ${result}")
    if(result):
        return result[0]
    else:
        return False

def insert(execute_str : str, execute_args: tuple):
        connection = dc.connectDB()
        cursor = connection.cursor() 
        try:
            print("開始執行insertData")
            cursor.execute(execute_str, execute_args)
            connection.commit()
        except Exception as ex:
            print(f"ex = ${ex}")
            return False
        finally:
            cursor.close()
            connection.close()
        print("insert Data 成功！！")
        return True

def signup(user_info :list):
    name = user_info["name"]
    email = user_info["email"]
    password = user_info["password"]
    check_email = (email, )
    query_str = "select email from member where email = %s"
    check = find(query_args=check_email, query_str=query_str)
    if(not check):
        execute_args = (name, email, password)
        execute_str = "INSERT INTO member(name, email, password) VALUE (%s, %s, %s)"
        print("在signup呼叫insertData")
        print(f"參數：${execute_str}\n${execute_args}")
        status = insert(execute_str, execute_args)
        if(status):
            return {"status":True}
        else:
            return {"status":False, "msg":"伺服器錯誤，新增失敗"}
    else:
        return {"status": False, "msg": "email已被註冊"}


def sigin(email:str, password:str):
    query_args = (email, password)
    query_str = "SELECT * FROM member where email = %s and password = %s;"
    result = find(query_str, query_args)
    print(f"sign result = ${result}")
    if(result):
        return result
    else:
        return {"status": False, "message": "帳號或密碼錯誤"}

