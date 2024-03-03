import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Input } from '@/components/ui/input'
import './globals.css'
import './App.css'

const API_URL = "http://127.0.0.1:5000/api";

function App() {
  const [state, setState] = useState("");
  const [guess, setGuess] = useState("");
  const [guesses, setGuesses] = useState([]);
  const [hint, setHint] = useState("");

  useEffect(() => {
    getState();
    getGuesses();
  }, []);

  const getState = async () => {
    const response = await axios.get(`${API_URL}/get_state`);
    setState(response.data.state);
  }

  const getGuesses = async () => {
    const response = await axios.get(`${API_URL}/get_guesses`);
    setGuesses(response.data.guesses);
  }

  const handleGuessChange = (e) => {
    setGuess(e.target.value);
  }

  const handleGuessSubmit = async (e) => {
    e.preventDefault();
    const response = await axios.post(`${API_URL}/make_guess`, {word: guess});
    if (response.data.message === "Guess made") {
      setGuess("");
      getState();
      getGuesses();
    }
  }

  const getHint = async () => {
    const response = await axios.get(`${API_URL}/get_hint`);
    setHint(response.data.hint);
  }

  const handleNewGame = async () => {
    const response = await axios.post(`${API_URL}/new_game`);
    if(response.data.message === "New game has started") {
      setState("PLAYING");
      setGuesses([]);
      setHint("");
      setGuess("");
    }
  }

  return (
    <div className="App">
      <h1>Wordle</h1>
      <b>Game status: {state}</b>
      <Separator />
      <Input type="text" value={guess} onChange={handleGuessChange} placeholder="Your guess here..." />
      <Button onClick={handleGuessSubmit}>Submit Guess</Button>
      <Button onClick={getHint}>Get Hint</Button>
      <Button onClick={handleNewGame}>New Game</Button>
      <br/>
      {hint && <div>Hint: {hint}</div>}
      {guesses.map((guess, i) => <div key={i}>{guess}</div>)}
    </div>
  )
}

export default App;