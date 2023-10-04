from flask import Blueprint, request
from packages import jwt_token

thank = Blueprint("thank", __name__)
content_type = {'Content-Type': "application/json; charset=utf-8"}

# @thank.route("/thankyou/<number>")
# def thank(number):
