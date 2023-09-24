import mysql.connector
from dotenv import dotenv_values

secret = dotenv_values('.env')

def connectDB():
    dbconfig = {
        "host": "127.0.0.1",
        "port": 3306,
        "user": secret["mysql_user"], 
        "password": secret["mysql_pwd"],
        "database": "taipei_trip",
    }

    try:
        connectionPool = mysql.connector.pooling.MySQLConnectionPool(pool_name="taipei_trip", pool_size=5, **dbconfig)
        print("建立connectionPool成功")
    except Exception as ex:
        print("建立connectionPool失敗...\n錯誤訊息：",ex)
        return "連線資料庫失敗"
    
    return connectionPool.get_connection()

if __name__ == '__main__':
    pass


