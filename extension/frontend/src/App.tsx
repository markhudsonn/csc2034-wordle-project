import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Input } from '@/components/ui/input'
import { IoIosRefresh } from "react-icons/io";


const API_URL = "http://127.0.0.1:5000/api";

function App() {
  const [state, setState] = useState("Connecting...");
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

  const handleGuessChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGuess(e.target.value);
  }

  const handleGuessSubmit = async (e: React.FormEvent<HTMLButtonElement>) => {
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

  const renderGuesses = () => {
    return (
      <div>
        <h2>Guesses</h2>
        <ul>
          {guesses.map((guess, index) => <li key={index}>{guess}</li>)}
        </ul>
      </div>
    )
  }

  return (
    <div className="App">
      <h1 style={{fontSize: '2em', fontWeight: 'bold'}}>CSC2034 Wordle Game</h1>
      <b>Game status: {state}</b>
      <Separator className="my-10" />
      {guesses.length > 0 && renderGuesses()}
      <div style={{ margin: '0 auto', width: '50%' }}>
        <Input className="m-2" value={guess} onChange={handleGuessChange} placeholder="Enter your guess" />
        <Button className="m-2" onClick={handleGuessSubmit}>Submit Guess</Button>
        <Button className="m-2" variant="outline" onClick={getHint}>Get Hint</Button>
      </div>
      <Button className="m-2" variant="ghost" onClick={handleNewGame}><IoIosRefresh /></Button>
      <br/>
      {hint && <div>Hint: {hint}</div>}
      {state === "WON" && <div>Congratulations! You won!</div>}
    </div>
  )
}

export default App;