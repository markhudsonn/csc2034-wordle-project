from flask import Flask, jsonify, request, render_template
from flask_cors import CORS
import wordle
import uuid

app = Flask(__name__)
CORS(app)

sessions = {}

def create_session_id():
  return str(uuid.uuid4())

def get_or_create_session(session_id):
  if session_id not in sessions:
    sessions[session_id] = wordle.Game()
  return sessions[session_id]

@app.route('/')
def index():
  return render_template('index.html')

@app.errorhandler(AssertionError)
def handle_assertion_error(e):
  return jsonify({"message": str(e)}), 400

@app.errorhandler(Exception)
def handle_exception(e):
  return jsonify({"message": str(e)}), 500

@app.route('/api/new_game', methods=['POST'])
def new_game():
  session_id = create_session_id()
  sessions[session_id] = wordle.Game()  
  return jsonify({"message": "New game has started", "session_id": session_id}), 200

@app.route('/api/get_hint', methods=['GET'])
def get_hint():
  session_id = request.args.get('session_id')
  game = get_or_create_session(session_id)
  hint = game.get_hint()
  return jsonify({"hint": hint, "session_id": session_id}), 200

@app.route('/api/make_guess', methods=['POST'])
def make_guess():
  data = request.json
  word = data['word']
  session_id = data.get('session_id')
  game = get_or_create_session(session_id)
  game.make_guess(word)
  return jsonify({"message": "Guess: " + word + " has been made", "session_id": session_id}), 200

@app.route('/api/make_hard_guess', methods=['POST'])
def make_hard_guess():
  data = request.json
  word = data['word']
  session_id = data.get('session_id')
  game = get_or_create_session(session_id)
  game.hard_guess(word)
  return jsonify({"message": "Hard guess: " + word + " has been made", "session_id": session_id}), 200

@app.route('/api/get_state', methods=['GET'])
def get_state():
  session_id = request.args.get('session_id')
  game = get_or_create_session(session_id)
  state = game.gstate.name
  return jsonify({"state": state, "session_id": session_id}), 200

@app.route('/api/get_guesses', methods=['GET'])
def get_guesses():
  session_id = request.args.get('session_id')
  game = get_or_create_session(session_id)
  guesses = [guess.to_dict() for guess in game.guesses]
  return jsonify({"guesses": guesses, "session_id": session_id}), 200

@app.route('/api/get_answer', methods=['GET'])
def get_answer():
  session_id = request.args.get('session_id')
  game = get_or_create_session(session_id)
  answer = game.get_answer()
  return jsonify({"answer": answer, "session_id": session_id}), 200

@app.route('/api/get_remaining_guesses', methods=['GET'])
def get_remaining_guesses():
  session_id = request.args.get('session_id')
  game = get_or_create_session(session_id)
  remaining_guesses = wordle.MAX_GUESSES - len(game.guesses) 
  return jsonify({"remaining_guesses": remaining_guesses, "session_id": session_id}), 200

if __name__ == '__main__':
    app.run(debug=True)