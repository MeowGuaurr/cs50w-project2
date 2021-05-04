import os

from flask import Flask, session, render_template, request, redirect
from flask_socketio import SocketIO, emit, join_room, leave_room
from flask_session import Session
from collections import deque

app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
app.config["SESSION_TYPE"] = "filesystem"
socketio = SocketIO(app)

channels={"Room": {"msg": deque([], maxlen=100), "username": "def"}}
users = {}

@app.route("/")
def index():
    return render_template('index.html')

@socketio.on('userdata')
def userdata(data):
    if 'username' in data:
        users[data['username']] = request.sid


@socketio.on('new')
def new(data):
    if data['name'] in channels:
        return false
    else:
        chanels[data['name']]={}
        channels[data['name']]['msg']= deque(maxlen=100)
        channels[data['username']]=data['username']
        emit('new', {"name": data['name']}, broadcast= True)

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

#@socketio.on('join')
#def join(data):
#    username = session.get('username')
#    emit('status', {'msg: username'+'is online'})

#@socketio.on('text')
#def message(data):
#    username = session.get('username')
#    emit('message', {'msg: username' +': '+ message['msg']}, data, broadcast=True)

#@socketio.on('left')
#def left(data):
#    username = session.get('username')
#    session.clear()
#    emit('status',{'msg: username' +' left'})
