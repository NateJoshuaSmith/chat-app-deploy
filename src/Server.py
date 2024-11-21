from flask import Flask, jsonify, request
from flask_cors import CORS  # Import the CORS extension
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# In-memory store for messages
messages = []

# Configure the SQLite database URI
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'  # This will create 'app.db' file in the current directory
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False  # To avoid a warning

# Initialize SQLAlchemy with the app
db = SQLAlchemy(app)

# Define your models (tables)

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)

    # Relationship to the messages table
    messages = db.relationship('Message', backref='sender', lazy=True)

class Message(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.String(500), nullable=False)
    timestamp = db.Column(db.DateTime, default=db.func.now())  # Automatically set timestamp
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)  # Foreign key to the user

# Create all tables in the database (if they don't exist)
with app.app_context():
    db.create_all()

# Route to create a user
@app.route('/api/users', methods=['POST'])
def create_user():
    data = request.json
    new_user = User(username=data['username'])
    db.session.add(new_user)
    db.session.commit()
    return jsonify({'id': new_user.id, 'username': new_user.username}), 201

@app.route('/api/messages', methods=['GET'])
def get_messages():
    messages = Message.query.all()  # Fetch all messages from the database
    result = []
    for message in messages:
        result.append({
            'id': message.id,
            'content': message.content,
            'timestamp': message.timestamp,
            'username': message.sender.username  # Include the username here
        })
    return jsonify(result)


@app.route('/api/messages', methods=['POST'])
def post_message():
    message_data = request.json  # Get the message data from the request
    
    # Check if the necessary data is present
    if 'text' not in message_data or 'user_id' not in message_data:
        return jsonify({'error': 'Message text and user_id are required'}), 400

    # Get the user based on the user_id
    user = User.query.get(message_data['user_id'])
    
    # If no user exists with the given user_id, return an error
    if not user:
        return jsonify({'error': 'User not found'}), 404

    # Create a new message object and associate it with the user
    new_message = Message(content=message_data['text'], user_id=user.id)

    # Add the message to the database
    db.session.add(new_message)
    db.session.commit()

    # Return the new message with its associated user
    return jsonify({
        'id': new_message.id,
        'content': new_message.content,
        'timestamp': new_message.timestamp,
        'username': user.username  # Include the username here
    }), 201


if __name__ == '__main__':
    app.run(debug=True)

# from flask import Flask, jsonify, request
# from flask_cors import CORS
# from flask_sqlalchemy import SQLAlchemy

# app = Flask(__name__)
# CORS(app)  # Enable CORS for all routes

# # Configure the SQLite database URI
# app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'  # This will create 'app.db' file in the current directory
# app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False  # To avoid a warning

# # Initialize SQLAlchemy with the app
# db = SQLAlchemy(app)

# # Define your models (tables)
# class User(db.Model):
#     id = db.Column(db.Integer, primary_key=True)
#     username = db.Column(db.String(80), unique=True, nullable=False)
#     email = db.Column(db.String(120), unique=True, nullable=False)
#     messages = db.relationship('Message', backref='sender', lazy=True)

# class Message(db.Model):
#     id = db.Column(db.Integer, primary_key=True)
#     content = db.Column(db.String(500), nullable=False)
#     timestamp = db.Column(db.DateTime, default=db.func.now())  # Automatically set timestamp
#     user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)  # Foreign key to the user

# # Create the tables inside the application context
# with app.app_context():
#     db.create_all()

# # Route to create a user
# @app.route('/api/users', methods=['POST'])
# def create_user():
#     data = request.json
#     new_user = User(username=data['username'], email=data['email'])
#     db.session.add(new_user)
#     db.session.commit()
#     return jsonify({'id': new_user.id, 'username': new_user.username}), 201

# # Route to get all messages (GET request)
# @app.route('/api/messages', methods=['GET'])
# def get_messages():
#     messages = Message.query.all()
#     result = []
#     for message in messages:
#         result.append({
#             'id': message.id,
#             'content': message.content,
#             'timestamp': message.timestamp,
#             'username': message.sender.username
#         })
#     return jsonify(result)

# # Route to post a new message (POST request)
# @app.route('/api/messages', methods=['POST'])
# def post_message():
#     message_data = request.json  # Get the message data
#     if 'content' not in message_data:
#         return jsonify({'error': 'Message content is required'}), 400
    
#     user = User.query.get(message_data['user_id'])
#     if user is None:
#         return jsonify({'error': 'User not found'}), 404

#     new_message = Message(content=message_data['content'], user_id=user.id)
#     db.session.add(new_message)
#     db.session.commit()
    
#     return jsonify({'id': new_message.id, 'content': new_message.content}), 201

# if __name__ == '__main__':
#     app.run(debug=True)

