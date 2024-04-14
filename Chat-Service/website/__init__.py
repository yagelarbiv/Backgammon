from flask import Flask, jsonify
from flask_socketio import SocketIO
from flask_cors import CORS

def create_app():
    app = Flask(__name__)
    socketio = SocketIO(app)
    
    # Enable CORS for all routes
    CORS(app)

    @app.route('/api/data')
    def get_data():
        return jsonify({'message': 'This is data from Flask'})

    @socketio.on('message')
    def handle_message(data):
        print('Received message:', data)
        socketio.emit('response', {'data': 'Message received'})

    if __name__ == '__main__':
        socketio.run(app, debug=True)

    return app