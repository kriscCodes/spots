import os
from flask import Flask, render_template, redirect, url_for, request, flash, send_from_directory, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user, current_user
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from places import get_nearby_places

app = Flask(__name__, static_folder="../frontend/dist", static_url_path="/")
CORS(app)
app.config['SECRET_KEY'] = 'your_secret_key'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///users.db'
db = SQLAlchemy(app)
login_manager = LoginManager(app)
login_manager.login_view = 'login'
bcrypt = Bcrypt()

class User(UserMixin, db.Model):

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(150), unique=True, nullable=False)
    email = db.Column(db.String(150), unique=True, nullable=False)
    password = db.Column(db.String(150), nullable=False)
    # True means public profile
    # False means private profile
    visibility = db.Column(db.Boolean, nullable=False, default=True)
    # JSON is how sqlite allows for arrays
    friends = db.Column(db.JSON, nullable=False, default=list)
    events = db.Column(db.JSON, nullable=False, default=list)
    locations = db.Column(db.JSON, nullable=False, default=list)

def create_tables():
  with app.app_context():
    db.create_all()

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

# Serves react pages
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    print('finding', path)
    if path != "" and os.path.exists(app.static_folder + '/' + path):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')


@app.route('/api/locations', methods=['GET'])
def get_locations():
    locations = get_nearby_places(os.getenv('GOOGLE_KEY'), 'restaurant', 'restaurant')
    names = []
    for location in locations:
        name = location['name']
        if name:
            names.append(location['name'])

    return jsonify(names=names)


@app.route('/signup', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        username = request.form.get('username')
        email = request.form.get('email')
        password = request.form.get('password')
        confirm = request.form.get('confirm')

        user = User.query.filter_by(username=username).first()
        if user:
            flash('Username already exists.')
            return redirect(url_for('register'))

        if confirm != password:
            flash('Passwords do not match.')
            return redirect(url_for('register'))
        hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
        new_user = User(username=username, email=email, password=hashed_password)
        db.session.add(new_user)
        db.session.commit()
        login_user(new_user)
        return redirect(url_for('dashboard'))

    return send_from_directory(app.static_folder, "index.html")

@app.route('/api/login', methods=['GET', 'POST'])
def login():

    data = request.json
    username = data.get('username')
    password = data.get('password')
    user = User.query.filter_by(username=username).first()

    if user is None or not bcrypt.check_password_hash(user.password, password):
        return jsonify({'message': 'Login failed'}), 401
        # flash('Invalid username or password')
        # return redirect(url_for('login'))
    else:
        # login_user(user)
        return jsonify({'message': 'Login successful'}), 200

@app.route('/dashboard', methods=['GET', 'POST'])
@login_required
def dashboard():
    # Should take post & get request
    # Takes in user location which makes a call to event and/or maps api to get releveant events

    # MOCK DATA

    # Front end takes the list of events and makes a card out of them using the map function by making call to API using useEffect hook
    
    return "dashboard"

@app.route('/user/<username>', methods=['GET'])
@login_required
def user_profile(username):
    return send_from_directory(app.static_folder, "index.html")


@app.route('/api/user/<username>', methods=['GET', 'POST'])
def userinfo(username):
    # On the frontend it will be a get request with that user and if they exist return the info
    # This will be set up as an api: Here we query the DB to get the user by their username and return the necessary information so that we can send that to the front end
    user = User.query.filter_by(username=username).first()

    if not user:
        return jsonify({"message": "User not found"}), 404
    
    user_data = {
        'id': user.id,
        'username': user.username,
        'email': user.email,
        'password': user.password,
        'visibility': user.visibility,
        'friends': user.friends,
        'events': user.events,
        'locations': user.locations,
    }

    return jsonify(user_data)
    # If user is private then a private account page should be rendered
    # If user is public then you can see what the user has saved to their collection, what they've gone to, their ratings, and their other friends

@app.route('/<username>/settings', methods=['GET', 'POST'])
@login_required
def user_settings(username):
    # On the frontend it will be a post request with that user and if they exist return the info
    # This will be set up as an api: Here we query the DB to get the user by their username and return the necessary information so that we can send that to the front end
    
    # If user is private then a private account page should be rendered
    # If user is public then you can see what the user has saved to their collection, what they've gone to, their ratings, and their other friends


    
    return f'User {username}'

@app.route('/allusers', methods=['GET', 'POST'])

def allusers():
    # On the frontend it will be a post request with that user and if they exist return the info
    # This will be set up as an api: Here we query the DB to get the user by their username and return the necessary information so that we can send that to the front end
    
    # If user is private then a private account page should be rendered
    # If user is public then you can see what the user has saved to their collection, what they've gone to, their ratings, and their other friends
    users = User.query.all()
    for user in users:
        print(user.username)
    return "hi"

@app.route('/<username>', methods=['GET', 'POST'])
@login_required
def user(username):
    # On the frontend it will be a post request with that user and if they exist return the info
    # This will be set up as an api: Here we query the DB to get the user by their username and return the necessary information so that we can send that to the front end
    
    # If user is private then a private account page should be rendered
    # If user is public then you can see what the user has saved to their collection, what they've gone to, their ratings, and their other friends
    return send_from_directory(app.static_folder, "index.html")


@app.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('login'))

if __name__ == '__main__':
    create_tables()
    app.run(debug=True, port=2700)

