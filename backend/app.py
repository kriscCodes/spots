import os, json, pprint, asyncio
from flask import Flask, render_template, redirect, url_for, request, flash, send_from_directory, jsonify, Response
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user, current_user
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from places import get_locations, get_photo
from dynamic_search import DynamicSearch
from serpapi import GoogleSearch
from config import Config
# pip3 install serpapi
# pip3 install google-search-results

app = Flask(__name__, static_folder="../frontend/dist", static_url_path="/")
CORS(app)
app.config['SECRET_KEY'] = 'your_secret_key'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///users.db'
# might have to change these settings
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app, session_options={"autoflush": True})
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
    places = db.Column(db.JSON, nullable=False, default=dict)
    # events = db.Column(db.JSON, nullable=False, default=list)
    # locations = db.Column(db.JSON, nullable=False, default=list)


class Locations(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True, nullable=True)
    location = db.Column(db.String(200), unique=True, nullable=False)
    places = db.relationship('Places', backref='location', lazy=True)


class Places(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    isRestaurant = db.Column(db.Integer, nullable=False)
    name = db.Column(db.String(100), nullable=False)
    address = db.Column(db.String(200), nullable=False)
    img_url = db.Column(db.String(255), nullable=False)
    description = db.Column(db.String(255), nullable=False)
    rating = db.Column(db.Numeric(precision=5, scale=2), nullable=False, default=0)
    reviews = db.Column(db.JSON, nullable=False, default=list)
    location_id = db.Column(db.Integer, db.ForeignKey('locations.id'), nullable=False)


def create_tables():
  with app.app_context():
    db.create_all()

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))


@app.route('/api/is-logged-in', methods=['GET'])
def is_logged_in():
    is_logged_in = current_user.is_authenticated
    return jsonify({'loggedIn': is_logged_in})


@app.route('/api/get-user', methods=['GET'])
def get_user_api():
    is_logged_in = current_user.is_authenticated
    if is_logged_in:
        username = current_user.username
        return jsonify({'username': username, 'places': current_user.places})

    return jsonify({}), 401


@app.route('/api/update-locations', methods=['POST'])
def update_user_locations():
    data = request.json
    username = data['user']
    place_name = data['name']
    new_status = data['status']
    new_message = data.get('message', None)
    print(username, place_name, new_status, new_message)

    user = User.query.filter_by(username=username).first()
    place = Places.query.filter_by(name=place_name).first()
    if place and user:
        if not user.places:
            user.places = {}

        existing_entry = user.places.get(place.id, {})
        print('existing_entry', existing_entry)

        updated_entry = {
            'status': new_status,
            'message': new_message if new_message is not None else existing_entry.get('message', '')
        }

        print('updated_entry', updated_entry)

        user.places[place.id] = updated_entry
        db.session.flush()
        db.session.commit()
        print(user.places)
        return jsonify({'places': user.places}), 200

    return jsonify({'message': 'User or Place not found'}), 404


# Serves react pages
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    print('finding', path)
    if path != "" and os.path.exists(app.static_folder + '/' + path):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')


@app.route('/api/locations-events', methods=['POST'])
def get_locations_events():
    data = request.json
    location = data['location']
    print('Getting location for', location)
    record = Locations.query.filter_by(location=location).first()
    if record:
        print('found', location, 'in our records')
        places = format_places(record.places)
    else:
        print('did not find', location, 'in our records')
        places, loc, evnt = fetch_store_places(location)

    return jsonify(places=places), 200



def format_places(places):
    return [{
        'name': place.name,
        'address': place.address,
        'img_url': place.img_url,
        'description': place.description,
        'isRestaurant': place.isRestaurant
    } for place in places]


def fetch_store_places(location):
    places = []
    loc_status = 200
    evnt_status = 200
    print('fetching locations')
    locations = get_locations('restaurant', 'restaurant', location)
    print('locations', locations)
    print('fetching events')
    events = get_events(location)
    print('events', events)

    try:
        new_location = Locations.query.filter_by(location=location).first()
        if not new_location:
            new_location = Locations(location=location)
            db.session.add(new_location)
            db.session.flush()

        if locations:
            for idx, loc in enumerate(locations):
                place = create_location_dict(loc, new_location.id)
                if place:
                    places.append(place)
                    new_place = Places(**place)
                    db.session.add(new_place)
        else:
            loc_status = 404

        if events:
            for idx, evnt in enumerate(events):
                place = create_event_dict(evnt, new_location.id)
                if place:
                    places.append(place)
                    new_place = Places(**place)
                    db.session.add(new_place)
        else:
            evnt_status = 404

        db.session.commit()
    except Exception as e:
        db.session.rollback()
        print('db error, rolling back', e)
        return [], 500, 500

    return places, loc_status, evnt_status


def create_event_dict(place, id):
    if 'title' not in place:
        return None

    return {
        'name': place.get('title'),
        'address': place.get('address', [""])[0],
        'img_url': place.get('thumbnail', ""),
        'description': f'Description for {place.get("title")}',
        'isRestaurant': 0,
        'location_id': id
    }


def create_location_dict(place, id):
    if 'name' not in place:
        print('name not found')
        return None

    photo_url = ""
    inside = 'photos' in place
    print('inside', inside)
    if 'photos' in place and place['photos'][0]:
        print('ref', place['photos'][0])
        photo_url = get_photo_url(place['photos'][0])

    return {
        'name': place.get('name'),
        'address': place.get('vicinity', ""),
        'img_url': photo_url,
        'description': f'Description for {place.get("name")}',
        'isRestaurant': 1,
        'location_id': id
    }

def get_photo_url(photo):
    print('photoo',photo)
    if photo and 'photo_reference' in photo:
        ref = 'photo_reference' in photo
        print('ref?', ref)
        height = photo.get('height')
        width = photo.get('width')
        photo_id = photo.get('photo_reference')
        print('stuff', height, width, photo_id)
        return get_photo(photo_id, height, width)

    return ""


def get_events(location):
    params = {
        "api_key": Config.GOOGLE_SEARCH_API,
        "engine": "google_events",
        "q": location,
        "hl": "en",
        "google_domain": "google.com",
        "gl": "us",
        "start": "0"
    }

    response = GoogleSearch(params)
    results = response.get_dict()
    events = results['events_results']

    if not events:
        return None

    return events


@app.route('/api/query', methods=['POST'])
def query():
    data = request.json
    ds = DynamicSearch()
    result = ds.search(data['query'])
    if result:
        # print(result)
        # print((jsonify(body=result)).json)
        # return jsonify(body=result), 200
        json_data = json.dumps({"body": result}, indent=4)
        return Response(json_data, mimetype='application/json'), 200

    return jsonify(body=""), 204


@app.route('/api/place-rating-reviews', methods=['POST'])
def get_rating_reviews():
    data = request.json
    name = data['name']

    place = Places.query.filter_by(name=name).first()
    if place:
        rating = place.rating
        reviews = place.reviews

        return jsonify(rating=rating, reviews=reviews)

    return jsonify({}), 404


@app.route('/api/set-rating', methods=['POST'])
def set_rating():
    data = request.json
    name = data['name']
    rating = data['rating']

    place = Places.query.filter_by(name=name).first()
    if place:
        place.rating = rating
        db.session.commit()
        return jsonify({'message': 'Rating updated successfully'}), 200

    return jsonify({'message': 'Place not found'}), 404


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
        login_user(user)
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
    return send_from_directory(app.static_folder, "index.html")


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


@app.route('/api/user/<username>/privacy', methods=['PUT'])
def update_privacy(username):
    user = User.query.filter_by(username=username).first()
    if user:
        data = request.json
        user.visibility = data['visibility']
        db.session.commit()
        print(user.visibility)
        return jsonify({'message': 'Privacy setting updated successfully'}), 200
    return jsonify({'message': 'User not found'}), 404

@app.route('/api/user/<username>/username', methods=['PUT'])
def update_username(username):
    user = User.query.filter_by(username=username).first()
    if user:
        data = request.json
        user.username = data['user_name']
        db.session.commit()
        print(user.username)
        return jsonify({'message': 'Privacy setting updated successfully', 'new_username': user.username}), 200
    return jsonify({'message': 'User not found'}), 404
    
@app.route('/api/user/<username>/email', methods=['PUT'])
def update_email(username):
    user = User.query.filter_by(username=username).first()
    if user:
        data = request.json
        user.email = data['email']
        db.session.commit()
        print(user.email)
        return jsonify({'message': 'Email updated successfully', 'new_email': user.email}), 200
    return jsonify({'message': 'User not found'}), 404

@app.route('/api/logout', methods=['POST'])
def logout():
    logout_user()
    return jsonify({'message': 'Logged out successfully'}), 200


if __name__ == '__main__':
    create_tables()
    app.run(debug=True, port=2700)