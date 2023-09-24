from flask import *
from routes.attractions import attractions
from routes.member import members
from flask_cors import CORS
app = Flask(__name__)
app=Flask(
	__name__,
	static_folder="public",
	static_url_path="/"
)
CORS(app)
app.config["JSON_AS_ASCII"]=False
app.config["TEMPLATES_AUTO_RELOAD"]=True
app.secret_key = "0xffffffff"
app.register_blueprint(attractions, url_prefix = "/api")
app.register_blueprint(members, url_prefix = "/api")
@app.after_request
def add_cors_headers(response):
    response.headers['Access-Control-Allow-Origin'] = "*"
    return response
#---------------------------------------------
# Pages
@app.route("/")
def index():
	return render_template("index.html")
@app.route("/attraction/<id>")
def attraction(id):
	return render_template("attraction.html")
@app.route("/booking")
def booking():
	return render_template("booking.html")
@app.route("/thankyou")
def thankyou():
	return render_template("thankyou.html")

#---------------------------------------------
		
app.run(host="0.0.0.0", port=3000, debug=True, use_reloader=True)

