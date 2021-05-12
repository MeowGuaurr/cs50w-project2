import os

from flask import Flask, session, render_template, request, redirect
from flask_socketio import SocketIO, emit, join_room, leave_room
from flask_session import Session
from collections import deque

from time import localtime, asctime
from helper import log_req

app = Flask(__name__)
app.config["SECRET_KEY"] = 'SECRETKEY'
app.config["SESSION_TYPE"] = "filesystem"
socketio = SocketIO(app)


channelslist=[]
channels = {}
channels["General"]=[]

limit=100
users ={}
private_messages={}

@app.route("/")
@log_req
def index():
    return render_template('index.html')

@socketio.on('connect')
def connect():
    emit("load channels", {'channels': channels})

@socketio.on('new username')
def new_username(data):
    username=""
    error=""
    if data['username'] in users_list:
        error="Username already exist"
    else:
        users[data['username']]=request.sid
        username = data['username']

    emit('add username', {"username": username, "error": error})

@socketio.on('submit to all')
def message_to_all(data):
    message = {'text': data["my_message"], 'username':data["username"], 'time':data["time"]}
    channel['General'].append(message)

    if (len(channels['General']) > 100):
        channels['General'].pop(0)

    emit('message to all', {'channles': channels}, broadcast = True)

@socketio.on('return to general')
def return_to_general(data):
    emit('announce to all', {'channels': channels}, broadcast = True)

if __name__ == '__main__':
    socketio.run(app)
