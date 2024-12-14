from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from bson.objectid import ObjectId
import bcrypt
from urllib.parse import quote_plus
import logging

app = Flask(__name__)

# CORS configuration
CORS(app, resources={r"/*": {"origins": "http://127.0.0.1:5500", "allow_headers": "Content-Type, Authorization"}})


# MongoDB credentials (use your own)
username = "asj_aadi"
password = "Aadi123sj"
host = "localhost"
port = 27017

# Encode username and password
encoded_username = quote_plus(username)
encoded_password = quote_plus(password)

# Connection string
connection_string = f"mongodb://{encoded_username}:{encoded_password}@{host}:{port}/"

# Create MongoDB client
client = MongoClient(connection_string)

# Define database and collection
db = client.your_database_name
users = db.users

logging.basicConfig(level=logging.DEBUG)

#Signup Route
@app.route('/signup', methods=['POST', 'OPTIONS'])
def signup():
    if request.method == 'OPTIONS':
        # Handling preflight request
        response = jsonify({'message': 'OK'})
        response.headers.add('Access-Control-Allow-Origin', '*')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
        response.headers.add('Access-Control-Allow-Methods', 'POST')
        return response

    try:
        data = request.json
        required_fields = ['fullName', 'username', 'password', 'email']
        
        if not all(field in data for field in required_fields):
            return jsonify({"error": "Missing required fields"}), 400

        full_name = data['fullName']
        username = data['username']
        email = data['email']

        # Check if username already exists
        if users.find_one({"username": username}):
            return jsonify({"error": "Username already exists"}), 409

        # Hash the password
        hashed_password = bcrypt.hashpw(data['password'].encode('utf-8'), bcrypt.gensalt())

        # Store user data
        user_id = users.insert_one({
            "full_name": full_name,
            "username": username,
            "password": hashed_password,
            "email": email,
            "tasks": []
        })

        app.logger.info(f"User created with ID: {user_id.inserted_id}")
        return jsonify({"message": "User signed up successfully", "user_id": str(user_id.inserted_id)}), 201
    except Exception as e:
        app.logger.error(f"Error in signup: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500

# Login Route
@app.route('/login', methods=['POST'])
def login():
    username = request.json['username']
    password = request.json['password']

    # Fetch user details from the database
    user = users.find_one({"username": username})

    if user:
        # Validate the password
        if bcrypt.checkpw(password.encode('utf-8'), user['password']):
            return jsonify({"message": "Login successful", "user_id": str(user['_id'])}), 200
        else:
            return jsonify({"error": "Invalid username or password"}), 401
    else:
        return jsonify({"error": "User not found"}), 404

# Get User's Tasks
@app.route('/tasks/<user_id>', methods=['GET'])
def get_tasks(user_id):
    user = users.find_one({"_id": ObjectId(user_id)})

    if user:
        return jsonify({"tasks": user['tasks']}), 200
    else:
        return jsonify({"error": "User not found"}), 404

# Add Task to User
@app.route('/tasks/<user_id>', methods=['POST'])
def add_task(user_id):
    task = request.json['task']
    user = users.find_one({"_id": ObjectId(user_id)})

    if user:
        # Append the task to the user's task list
        users.update_one({"_id": ObjectId(user_id)}, {"$push": {"tasks": task}})
        return jsonify({"message": "Task added successfully"}), 200
    else:
        return jsonify({"error": "User not found"}), 404


if __name__ == '__main__':
    app.run(debug=True)