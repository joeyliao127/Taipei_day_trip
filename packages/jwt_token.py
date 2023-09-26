import jwt
import datetime
from dotenv import dotenv_values

secret_key = dotenv_values('.env')
def generate_jwt_token(payload):
    expiration_time = datetime.datetime.utcnow() + datetime.timedelta(days=7)
    payload["exp"] = expiration_time
    token = jwt.encode(payload, secret_key["jwt_key"], algorithm="HS256")
    return token

def decode_jwt_token(token):
    data = jwt.decode(token, secret_key["jwt_key"], algorithms="HS256")
    return data