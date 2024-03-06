import React, { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Input } from '@/components/ui/input'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { IoIosRefresh, IoIosWarning } from "react-icons/io";

interface Guess {
  word: string;
  clues: string[];
}

const API_URL = "http://127.0.0.1:5000/api";

function App() {
  const [state, setState] = useState<string>("Connecting...");
  const [guess, setGuess] = useState<string>("");
  const [guesses, setGuesses] = useState<Guess[]>([]);
  const [hint, setHint] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    getState();
    getGuesses();
  }, []);

  useEffect(() => {
    const timer = message && setTimeout(() => setMessage(""), 3000);
    return () => clearTimeout(timer);
  }, [message]);

  const getState = async () => {
    try {
      const response = await axios.get(`${API_URL}/get_state`);
      setState(response.data.state);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        setMessage(error.response.data.message);
      } else {
        setMessage("An unexpected error occurred");
      }
    }
  }

  const getGuesses = async () => {
    try {
      const response = await axios.get(`${API_URL}/get_guesses`);
      setGuesses(response.data.guesses);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        setMessage(error.response.data.message);
      } else {
        setMessage("An unexpected error occurred");
      }
    }
  }

  const handleGuessChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGuess(e.target.value);
  }

  const handleGuessSubmit = async (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_URL}/make_guess`, {word: guess});
      setGuess("");
      getState();
      getGuesses();
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        setMessage(error.response.data.message);
      } else {
        setMessage("An unexpected error occurred");
      }
    }
  }

  const getHint = async () => {
    try {
      const response = await axios.get(`${API_URL}/get_hint`);
      setHint(response.data.hint);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        setMessage(error.response.data.message);
      } else {
        setMessage("An unexpected error occurred");
      }
    }
  }

  const handleNewGame = async () => {
    try {
      const response = await axios.post(`${API_URL}/new_game`);
      if(response.data.message === "New game has started") {
        setState("PLAYING");
        setGuesses([]);
        setHint("");
        setGuess("");
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        setMessage(error.response.data.message);
      } else {
        setMessage("An unexpected error occurred");
      }
    }
  }

  const renderGuesses = () => {
    return (
      <div>
        <ul style={{paddingBottom: '20px'}}>
          {guesses.map((guess, index) => (
            <li key={index} style={{marginBottom: '20px'}}>
              {guess.word.split('').map((letter, letterIndex) => {
                const color = guess.clues[letterIndex] === 'GREEN' ? 'green' :
                              guess.clues[letterIndex] === 'YELLOW' ? 'orange' : 'grey';
                const status = guess.clues[letterIndex];
                return (
                  <span key={letter + letterIndex} style={{ 
                    fontWeight: 'bold', 
                    marginRight: '15px',
                    width: '60px',
                    height: '60px',
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: '8px',
                    backgroundColor: color,
                    display: 'inline-block',
                    color: status === 'GREY' ? 'black' : 'black',
                    boxShadow: `0 0 15px ${color}`,
                    fontSize: '1.5em',
                    textAlign: 'center',
                    lineHeight: '60px'
                  }}>
                    {letter}
                  </span>
                )
              })}
            </li>
          ))}
        </ul>
      </div>
    )
  }

  return (
    <div className="App">
      <h1 style={{fontSize: '2em', fontWeight: 'bold'}}>CSC2034 Wordle Game</h1>
      <b style={{ color: state === "PLAYING" ? 'black' : state === "WON" ? 'green' : 'red' }}>Game status: {state}</b>
      <Separator className="my-5" />
      
      {message && (
        <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
          <Alert variant="destructive" className="m-2" style={{ width: '50%', marginBottom: '20px' }}>
            <IoIosWarning style={{fontSize: '3em' }} />
            <AlertTitle style={{fontSize: '1.5em'}}>Error!</AlertTitle>
            <AlertDescription style={{fontSize: '1.2em'}}>
              {message}
            </AlertDescription>
          </Alert>
        </div>
      )}

      {guesses.length > 0 && renderGuesses()}
      <div style={{ margin: '0 auto', width: '30%' }}>
        <Input className="m-2" value={guess} onChange={handleGuessChange} placeholder="Enter 5 letter word..." />
        <Button className="m-2" onClick={handleGuessSubmit}>Guess</Button>
        <Button className="m-2" variant="destructive">Hard Guess</Button>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Button className="m-2" variant="outline" onClick={getHint}>Get Hint</Button>
        {hint && <div>Hint: {hint}</div>}
        <Button className="m-2" variant="ghost" onClick={handleNewGame}><IoIosRefresh /></Button>
      </div>
    </div>
  )
}

export default App;
