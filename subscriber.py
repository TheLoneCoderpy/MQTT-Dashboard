import json
import paho.mqtt.client as mqtt
from flask import Flask, render_template, jsonify
import subprocess

v = subprocess.run(["hostname", "-I"], text = True, capture_output = True)
ip = v.stdout.split(" ")[0]

js_file = open("static/main.js")
js_cont = js_file.read()
js_file.close()
i = js_cont.index("fetch('http://")
#print(js_cont[:i])

i2 = js_cont.index("/get_cur')")
#print(js_cont[i2:])

new_js = open("static/main2.js", "w")
new_js.write(js_cont[:i] + f"fetch('http://{ip}:9000" + js_cont[i2:])
new_js.close()

app = Flask(__name__)

BROKER = "localhost"
PORT = 1883
TOPIC = "test/topic"

messages = []

def on_connect(client, userdata, flags, rc):
	if rc == 0:
		print("Verbunden")
		client.subscribe(TOPIC)
	else:
		print("Vrb fail")

def on_message(client, userdata, msg):
	try:
		payload = msg.payload.decode()
		data = json.loads(payload)
		messages.append(data["value"])
	except json.JSONDecodeError:
		print("json fail")

@app.route("/")
def index():
	return render_template("index.html")

@app.route("/get_cur", methods = ["POST", "GET"])
def cur():
	global messages
	try:
		return jsonify({"val": messages[-1]})
	except:
		return jsonify({"val": "--"})



def main():
	client = mqtt.Client()
	client.on_connect = on_connect
	client.on_message = on_message
	client.connect(BROKER, PORT, keepalive = 60)
	client.loop_start()
	app.run(port = 9000, host = ip, debug = True)
	try:
		while True:
			pass
	except:
		client.loop_stop()
		client.disconnect()

main()