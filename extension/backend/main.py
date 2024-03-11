from flask import Flask, jsonify, request
from flask_cors import CORS
import wordle

app = Flask(__name__)
CORS(app)

game = wordle.Game()

@app.errorhandler(AssertionError)
def handle_assertion_error(e):
  return jsonify({"message": str(e)}), 400

@app.errorhandler(Exception)
def handle_exception(e):
  return jsonify({"message": str(e)}), 500

@app.route('/api/new_game', methods=['POST'])
def new_game():
  game.reset()
  
  return jsonify({"message": "New game has started"}), 200

@app.route('/api/get_hint', methods=['GET'])
def get_hint():
  hint = game.get_hint()
  return jsonify({"hint": hint}), 200

@app.route('/api/make_guess', methods=['POST'])
def make_guess():
  word = request.json['word']
  game.make_guess(word)
  return jsonify({"message": "Guess: " + word + " has been made"}), 200

@app.route('/api/make_hard_guess', methods=['POST'])
def hard_guess():
  word = request.json['word']
  game.hard_guess(word)
  return jsonify({"message": "Hard guess: " + word + " has been made"}), 200

@app.route('/api/get_state', methods=['GET'])
def get_state():
  state = game.gstate.name
  return jsonify({"state": state}), 200

@app.route('/api/get_guesses', methods=['GET'])
def get_guesses():
  guesses = [guess.to_dict() for guess in game.guesses]
  return jsonify({"guesses": guesses}), 200

@app.route('/api/get_answer', methods=['GET'])
def get_answer():
  answer = game.get_answer()
  return jsonify({"answer": answer}), 200

@app.route('/api/get_remaining_guesses', methods=['GET'])
def get_remaining_guesses():
  remaining_guesses = wordle.MAX_GUESSES - len(game.guesses) 
  return jsonify({"remaining_guesses": remaining_guesses}), 200

if __name__ == '__main__':
  app.run(debug=True)