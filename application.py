import os

from flask import Flask, session, render_template, request, redirect
from flask_socketio import SocketIO, emit, join_room, leave_room
from flask_session import Session

app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
app.config["SESSION_TYPE"] = "filesystem"
socketio = SocketIO(app)

Session(app)

socketio = SocketIO(app, manage_session=False)

@app.route("/", methods=['GET','POST'])
def index():
    return render_template('index.html')

@app.route("/chat", methods=['GET','POST'])
def chat():
    if(request.method == 'POST'):
        username = request.form['username']
        session['username'] = username
        return render_template('chat.html', session = session)

    else:
        if(session.get('username') is not None):
            return render_template('chat.html', session = session)

        else:
            return render_template(url_for('index.html'))

@socketio.on('join')
def join(data):
    username = session.get('username')
    emit('status', {'msg: username'+'is online'})

@socketio.on('text')
def message(data):
    username = session.get('username')
    emit('message', {'msg: username' +': '+ message['msg']}, data, broadcast=True)

@socketio.on('left')
def left(data):
    username = session.get('username')
    session.clear()
    emit('status',{'msg: username' +' left'})
