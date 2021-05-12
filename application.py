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
channelText = dict()
limit=100
channelText["general"]=[]
users =[]

@app.route("/")
@log_req
def index():
    return render_template('index.html', channelslist = channelslist)

@app.route("/login", methods=['GET','POST'])
def login():
    session.clear()
    username = request.form.get("username")
    if request.method == "POST":
        if username in users:
            return "invalid, username exists"
        users.append(username)
        session['username'] = username
        session.permanent = True
        return render_template("index.html")
    else:
        return render_template("login.html")



@app.route("/new_channel", methods=['GET','POST'])
def new_channel():
    newchannel = request.form.get("channel")
    if newchannel in channelslist:
        return ("already exists")
    else:
        channelslist.append("new_channel")
        channelText[newchannel] = deque()
        return redirect("/" + newchannel)

@socketio.on("text")
def message(data):
    time = asctime(localtime())
    username = session.get('username')
    channel = session.get('channel')
    message = data["message"]
    room = session.get('channel')
    channelText[channel].append([username, message, time])
    emit('announce message', {"user": username, "message": message, "time": time}, room = room)


@socketio.on('join')
def join():
    username = session.get('username')
    room= session.get['channel']
    join_room(room)
    emit('joined', {"message": username + "joined"}, room=room)


@app.route("/<channel>")
def channel(channel):
    session['channel']= channel
    return render_template('chat.html', channelslist=channelslist, broadcast=True)

@app.route("/logout")
def log_out():
    username=session['username']

    session.clear()
    return redirect("/")

if __name__ == '__main__':
    socketio.run(app)
