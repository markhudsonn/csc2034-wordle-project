from flask import Flask, jsonify, request
from flask_cors import CORS
import wordle

app = Flask(__name__)
CORS(app)

game = wordle.Game()

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
  word = request.json.get('word')
  if word:
      game.make_guess(word)
      return jsonify({"message": "Guess made"}), 200
  else:
      return jsonify({"message": "No word received"}), 400

@app.route('/api/get_state', methods=['GET'])
def get_state():
  state = game.gstate.name
  return jsonify({"state": state}), 200

@app.route('/api/get_guesses', methods=['GET'])
def get_guesses():
  guesses = game.get_guesses_for_frontend()
  return jsonify({"guesses": guesses}), 200

if __name__ == '__main__':
  app.run(debug=True)