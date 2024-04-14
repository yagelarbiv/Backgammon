from flask import Flask, jsonify
from flask_socketio import SocketIO,send,emit
from flask_cors import CORS

def create_app():
    app = Flask(__name__)
    app.config['SECRET_KEY'] = 'secret!'
    socketio = SocketIO(app, cors_allowed_origins="*")
    
    # Enable CORS for all routes
    CORS(app)
    
    app.post('/auth', async (req, res) => {
        res.send({ token: '12345' })
    })
    @socketio.on('connect')
    def handle_connect():
        print('Client connected')
        
    @socketio.on('disconnect')
    def handle_disconnect():
        print('Client disconnected')
    
    @socketio.on('message')
    def handle_message(data):
        print('Received message:', data)
        send(data, broadcast=True)
    
    @app.route('/api/data')
    def get_data():
        return jsonify({'message': 'This is data from Flask'})



    if __name__ == '__main__':
        socketio.run(app, debug=True)

    return app