import os, json, pprint, asyncio
from flask import Flask, render_template, redirect, url_for, request, flash, send_from_directory, jsonify, Response
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user, current_user
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from places import get_places, get_photo
from dynamic_search import DynamicSearch

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
    events = db.Column(db.JSON, nullable=False, default=list)
    locations = db.Column(db.JSON, nullable=False, default=list)


class Locations(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True, nullable=True)
    location = db.Column(db.String(200), unique=True, nullable=False)
    places = db.relationship('Places', backref='location', lazy=True)


class Places(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    address = db.Column(db.String(200), nullable=False)
    img_url = db.Column(db.String(255), nullable=False)
    description = db.Column(db.String(255), nullable=False)
    location_id = db.Column(db.Integer, db.ForeignKey('locations.id'), nullable=False)



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


@app.route('/api/locations', methods=['GET', 'POST'])
def get_locations():
    data = request.json
    curr_location = data['location']
    print(curr_location)
    location = Locations.query.filter_by(location=curr_location).first()
    if location:
        print('found location for ', location)
        print('these are the places', location.places)
        places = format_places(location.places)
    else:
        print('didn"t find location for', curr_location)
        # loop = asyncio.get_event_loop()
        # places = loop.run_until_complete(fetch_store_places(curr_location))
        places = fetch_store_places(curr_location)

    return jsonify(places=places), 200



def format_places(places):
    return [{
        'name': place.name,
        'address': place.address,
        'img_url': place.img_url,
        'description': place.description
    } for place in places]


def fetch_store_places(curr_location):
    places = []
    print('fetching...')
    fetched_places = get_places('restaurant', 'restaurant', curr_location)
    print('done fetching')
    # print('results are ', fetched_places)
    try:
        new_location = Locations.query.filter_by(location=curr_location).first()
        if not new_location:
            new_location = Locations(location=curr_location)
            db.session.add(new_location)
            # await db.session.flush()
            db.session.flush()

        for idx, fetched_place in enumerate(fetched_places):
            # print(idx, fetched_place)
            place = create_place_dict(fetched_place, new_location.id)
            if place:
                places.append(place)
                new_place = Places(**place)
                db.session.add(new_place)

        db.session.commit()
    except Exception as e:
        db.session.rollback()
        print("db error 2", e)
        return []

    return places


def create_place_dict(fetched_place, location_id):
    if 'name' not in fetched_place:
        return None
    photo_url = ""
    if 'photos' in fetched_place and fetched_place['photos'][0]:
        photo_url = get_photo_url(fetched_place['photos'][0])

    return {
        'name': fetched_place['name'],
        'address': fetched_place.get('vicinity', ""),
        'img_url': photo_url,
        'description': f'Description for {fetched_place["name"]}',
        'location_id': location_id
    }

def get_photo_url(photo):
    if photo and 'photo_reference' in photo:
        height = photo.get('height')
        width = photo.get('width')
        photo_id = photo.get('photo_reference')
        return get_photo(photo_id, height, width)

    return ""


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

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    # username = request.form.get('username')
    username = data.get('username')
    # password = request.form.get('password')
    password = data.get('password')
    user = User.query.filter_by(username=username).first()

    if user is None or not bcrypt.check_password_hash(user.password, password):
        return jsonify({'message': 'Login failed'}), 401
        # flash('Invalid username or password')
        # return redirect(url_for('login'))

    login_user(user)
    return jsonify({'message': 'Login successful'}), 200
    # return redirect(url_for('dashboard'))

@app.route('/dashboard')
@login_required
def dashboard():
    return f'Hello, {current_user.username}!'

@app.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('login'))

if __name__ == '__main__':
    create_tables()
    app.run(debug=True, port=2700)

