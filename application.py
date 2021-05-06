import os

from flask import Flask, session, render_template, request, redirect
from flask_socketio import SocketIO, emit, join_room, leave_room
from flask_session import Session
from collections import deque

from time import localtime, asctime

app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
app.config["SESSION_TYPE"] = "filesystem"
socketio = SocketIO(app)

channels={}
channelslist=[]
limit=100
channels["general"]=[]

@app.route("/")
def index():
    return render_template('index.html')

@socketio.on("connect")
def connect():
    emit("channels",{"channels": channels})


@socketio.on("new channel")
def new_channel(data):
    if data['channel'] in channelslist:
        return false
    else:
        chanelslist.append(data["channel"])
        channels[data["channel"]]=[]
        emit("new channel", {"channel": data["channel"]}, broadcast= True)

#@app.route("/chat", methods=['GET','POST'])
#def chat():
#    if(request.method == 'POST'):
#       username = request.form['username']
#        session['username'] = username
#        return render_template('chat.html', session = session)

#    else:
#        if(session.get('username') is not None):
#           return render_template('chat.html', session = session)
#
#        else:
#           return render_template(url_for('index.html'))

@socketio.on('join')
def join(data):
    username = session.get('username')
    room= data["channel"]
    join_room(room)
    emit("status": username + "joined", {"channels": channels}, room=room)

#@socketio.on('text')
#def message(data):
#    username = session.get('username')
#    emit('message', {'msg: username' +': '+ message['msg']}, data, broadcast=True)

#@socketio.on('left')
#def left(data):
#    username = session.get('username')
#    session.clear()
#    emit('status',{'msg: username' +' left'})
