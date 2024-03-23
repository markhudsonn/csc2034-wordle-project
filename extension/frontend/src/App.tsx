import React from 'react'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Input } from '@/components/ui/input'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { IoIosRefresh, IoIosWarning } from "react-icons/io";

type Guess = {
  word: string;
  clues: string[];
};

const API_URL = process.env.NODE_ENV === 'development' ? 'http://127.0.0.1:5000/api' : 'https://full-stack-wordle-backend.fly.dev/api';

function App() {
  const [state, setState] = useState<string>("Connecting...");
  const [guess, setGuess] = useState<string>("");
  const [guesses, setGuesses] = useState<Guess[]>([]);
  const [hint, setHint] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [answer, setAnswer] = useState<string>("");
  const [remainingGuesses, setRemainingGuesses] = useState<number>();

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
      if(response.data.state === "LOST") {
        getAnswer();
      }
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

  const getRemainingGuesses = async () => {
    try {
      const response = await axios.get(`${API_URL}/get_remaining_guesses`);
      setRemainingGuesses(response.data.remaining_guesses);
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
      await axios.post(`${API_URL}/make_guess`, {word: guess});
      setGuess("");
      getState();
      getGuesses();
      getRemainingGuesses();
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        setMessage(error.response.data.message);
      } else {
        setMessage("An unexpected error occurred");
      }
    }
  }

  const handleHardGuessSubmit = async (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/make_hard_guess`, {word: guess});
      setGuess("");
      getState();
      getGuesses();
      getRemainingGuesses();
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

  const getAnswer = async () => {
    try {
      const response = await axios.get(`${API_URL}/get_answer`);
      setAnswer(response.data.answer);
      return response.data.answer;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        setMessage(error.response.data.message);
      } else {
        setMessage("An unexpected error occurred");
      }
      return "";
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
        setAnswer("");
        getRemainingGuesses();
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
        <ul style={{paddingBottom: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
          {guesses.map((guess, index) => (
            <li key={index} style={{marginBottom: '20px', display: 'flex', justifyContent: 'center'}}>
              {guess.word.split('').map((letter, letterIndex) => {
                const colour = guess.clues[letterIndex] === 'GREEN' ? 'green' :
                              guess.clues[letterIndex] === 'YELLOW' ? 'orange' : 'grey';
                const status = guess.clues[letterIndex];
                return (
                  <span key={letter + letterIndex} style={{ 
                    fontWeight: 'bold', 
                    marginRight: '10px',
                    width: '60px',
                    maxWidth: '60px',
                    height: '60px',
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: '8px',
                    backgroundColor: colour,
                    display: 'flex',
                    color: status === 'GREY' ? 'black' : 'black',
                    boxShadow: `0 0 15px ${colour}`,
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
      <h1 style={{fontSize: '2em', fontWeight: 'bold'}}>Full Stack Wordle</h1>
      <b style={{ color: state === "PLAYING" ? 'black' : state === "WON" ? 'green' : 'red' }}>Game status: {state}</b>
      {state === "PLAYING" && remainingGuesses && <p>Remaining guesses: {remainingGuesses}</p>}
      <Separator className="my-5" />
      {state === "LOST" && (
        <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
          <Alert variant="default" className="m-2" style={{ width: '50%', marginBottom: '20px' }}>
            <AlertTitle style={{fontSize: '1.5em'}}>Game Over!</AlertTitle>
            <AlertDescription style={{fontSize: '1.2em'}}>
              The correct answer was: {answer || <span>Loading...</span>}
            </AlertDescription>
          </Alert>
        </div>
      )}
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
        <Input className="m-2" value={guess} onChange={handleGuessChange} maxLength={5} placeholder="Enter 5 letter word..." />
        <Button className="m-2" onClick={handleGuessSubmit}>Guess</Button>
        <Button className="m-2" variant="destructive" onClick={handleHardGuessSubmit}>Hard Guess</Button>
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