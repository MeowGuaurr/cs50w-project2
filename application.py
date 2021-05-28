import os
from flask import Flask,render_template,request
from flask_socketio import SocketIO, emit,join_room,leave_room

app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
socketio = SocketIO(app, cors_allowed_origins="*")


# list of all channels except General
channelsList=[]
usersList={}
limit=100
channels={}
channels['General']=[]


@app.route("/")
def index():
    return render_template('index.html')

@socketio.on('connect')
def connect():
    emit("load channels",{'channels':channels})

@socketio.on('submit to all')
def submit_to_all(data):
    message={'text':data["mymessage"],'username':data['username'],"time":data['time']}
    channels['General'].append(message)
    if (len(channels['General'])>limit):
        channels['General'].pop(0)
    emit("announce to all",{'channels':channels},broadcast=True)

@socketio.on('come back to general')
def come_back_to_general():
    emit("announce to all",{'channels':channels},broadcast=True)

@socketio.on('new channel')
def new_channel(data):
    error=""
    if data["channel"] in channelsList or data['channel']=="General":
        error="Channel already exist. Try again."
    elif data["channel"][0].isdigit():
        error="Channel name cannot start with a number"
    elif ' ' in data['channel']:
        error="Channel name can't contain space"
    else:
        channelsList.append(data['channel'])
        #create place for future messages
        channels[data["channel"]]=[]
    emit("add channel",{'channel':data["channel"],'error':error})

@socketio.on('update users channels')
def update_users_channels(data):
    channel=data['channel']
    emit("update channels",{'channel':channel},broadcast=True)

@socketio.on('join')
def join(data):
    room = data["channel"]
    join_room(room)
    message={'text':data["mymessage"],'username':data['username'],"time":data['time']}
    channels[data["channel"]].append(message)
    if (len(channels[data["channel"]])>limit):
        channels[data["channel"]].pop(0)
    emit("joined",{'channels':channels},room=room)

@socketio.on('leave')
def leave(data):
    room = data["channel"]
    leave_room(room)
    message={'text':data["mymessage"],'username':data['username'],"time":data['time']}
    channels[data["channel"]].append(message)
    if (len(channels[data["channel"]])>limit):
        channels[data["channel"]].pop(0)
    emit("left",{'channels':channels},room=room)

@socketio.on('submit to room')
def submit_to_room(data):
    room = data["channel"]
    message={'text':data["mymessage"],'username':data['username'],"time":data['time']}
    channels[data["channel"]].append(message)
    if (len(channels[data["channel"]])>limit):
        channels[data["channel"]].pop(0)
    emit("announce to room",{'channels':channels},room=room)

@socketio.on('new username')
def new_username(data):
    username=""
    error=""
    if data['username'] in usersList:
        error="Username already exist. Try again"
    else:
        usersList[data['username']]=request.sid
        username=data["username"]
    emit("add username",{"username":username,'error':error})


