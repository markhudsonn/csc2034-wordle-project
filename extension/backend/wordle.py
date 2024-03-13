from dataclasses import dataclass   # for defining dataclasses
from enum import Enum               # for defining enumerations
import typing                       # for type hinting
import random                       # for selecting a random answer
from typing import List             # for defining custom typed lists
from urllib.request import urlopen  # to load web data
# import ssl
from collections import Counter     # for counting letters in a word

# grab a list of words
url = 'https://raw.githubusercontent.com/tabatkins/wordle-list/main/words'
# context = ssl._create_unverified_context()
WORDS = [word.rstrip().decode('UTF-8').upper() for word in urlopen(url).readlines()]

# constants
WORD_LENGTH = 5 
MAX_GUESSES = 6

# define Word as an alias for string
Word = str

# type enumerating the three possible clue colours
Clue = Enum('Clue', ['GREEN', 'YELLOW', 'GREY'])

# type enumerating the state of the game
Gamestate =  Enum('Gamestate', ['WON', 'LOST', 'PLAYING'])

# type string for hint
Hint = str

@dataclass
class Guess:
    """
    A class to represent a guess in Wordle, which is a Word 
    plus a clue for each letter.
    """
    word: Word
    clues: List[Clue]

    @property
    def word(self) -> Word:
        return self._word

    @word.setter
    def word(self, word: Word):
        # invariant
        assert len(word) == WORD_LENGTH, "Invariant violated: len(Guess.word) <> 5"
        assert word in WORDS, "Invariant violated: word not in word list"
        self._word = word

    @property
    def clues(self) -> List[Clue]:
        return self._clues

    @clues.setter
    def clues(self, clues: Clue):
        # invariant
        assert len(clues) == WORD_LENGTH, \
            f"Invariant violated: len(Guess.clues) <> {WORD_LENGTH}"    
        assert all(clue in [Clue.GREEN, Clue.YELLOW, Clue.GREY] for clue in clues), "Invariant violated: clues not valid"          
        self._clues = clues

    def to_dict(self) -> dict:
        """
        Convert the guess to a dictionary.
        """
        return {"word": self.word, "clues": [clue.name for clue in self.clues]}

    def __repr__(self):
        """
        Custom representation for pretty printing.
        """
        cluestr = [str(self.word[i]) + ": " + \
            self.clues[i].name for i in range(WORD_LENGTH)]
        return f"{self.word}: {cluestr}"

def check_guess(word: Word, guess: Word) -> List[Clue]:
  """
  Given the answer and a guess, compute the list of 
  clues corresponding to each letter.
  """
  # pre-conditions
  assert len(word) == WORD_LENGTH, "word not correct length"
  assert len(guess) == WORD_LENGTH, "guess not correct length"
  assert word in WORDS, "word not in word list"
  assert guess in WORDS, "guess not in word list"

  clues = [Clue.GREY] * WORD_LENGTH # set all clues to grey
  
  letter_counts = Counter(word) # returns dict with letter counts

  for i, letter in enumerate(guess): # check for green clues
      if letter == word[i]:
          clues[i] = Clue.GREEN
          letter_counts[letter] -= 1

  for i, letter in enumerate(guess): # check for yellow clues
      if letter != word[i] and letter in letter_counts and letter_counts[letter] > 0:
          clues[i] = Clue.YELLOW
          letter_counts[letter] -= 1

  # post-conditions
  assert len(clues) == WORD_LENGTH, "clues not correct length"
  assert all(clue in [Clue.GREEN, Clue.YELLOW, Clue.GREY] for clue in clues), "clues not valid"

  return clues

def hint(word: Word, guesses: List[Guess]) -> Hint:
  """
  Return random letter from the word that has not been guessed yet.
  """
  # pre-conditions
  assert len(word) == WORD_LENGTH, "word not correct length"
  assert all(len(guess.word) == WORD_LENGTH for guess in guesses), "guesses not correct length"
  
  # creating set of guessed letters
  guessed_letters = set()
  for guess in guesses:
      for letter in guess.word:
          guessed_letters.add(letter)

  unguessed_letters = [letter for letter in word if letter not in guessed_letters]
  
  if not unguessed_letters:
      return None

  hint_letter = random.choice(unguessed_letters)

  # post-conditions
  assert hint_letter in word, "hint not in word"
  assert hint_letter not in guessed_letters, "hint already guessed"
  assert len(hint_letter) == 1, "hint not single letter"
  assert hint_letter.isalpha() or hint_letter.isupper(), "hint not a letter or not uppercase"

  return hint_letter

class Game:
    answer: Word
    guesses: List[Guess]
    gstate: Gamestate

    def __init__(self, answer="BELLS"):
        """
        Constructor for game.
        """
        self.answer = answer
        self.guesses = []
        self.gstate = Gamestate.PLAYING

    def make_guess(self, word: Word):
        """
        Make a guess at the wordle.
        """
        # make guesses uppercase
        word = word.upper() 

        # pre-condition
        assert self.gstate == Gamestate.PLAYING, "Game must be in play to make a guess."
        assert len(self.guesses) < MAX_GUESSES, "Cannot make more than 6 guesses."
        assert len(word) == WORD_LENGTH, "Guess must be 5 letters long."
        assert word in WORDS, "Guess must be a valid word."
        assert word in WORDS, "Guess must be a valid word."
               
        self.guesses.append(Guess(word, check_guess(self.answer, word)))
        if word == self.answer: self.gstate = Gamestate.WON
        elif len(self.guesses) == MAX_GUESSES: self.gstate = Gamestate.LOST

    def hard_guess(self, word: Word):
        """
        Make a hard guess (All green letters from previous guesses must be in the correct place and yellow letters must be present).
        """

        word = word.upper()

        # pre-condition
        assert self.gstate == Gamestate.PLAYING, "game must be in play to make guess"
        assert len(word) == WORD_LENGTH, "word not correct length"
        assert word in WORDS, "word not in word list"

        green_letters = {}
        yellow_letters = set()
        for guess in self.guesses:
            for i, letter in enumerate(guess.word):
                if guess.clues[i] == Clue.GREEN:
                    green_letters[i] = letter # add green letters to dict with index as key
                elif guess.clues[i] == Clue.YELLOW:
                    yellow_letters.add(letter)

        # post-conditions
        assert all(word[i] == letter for i, letter in green_letters.items()), "Green letters not in word at correct position"
        assert all(letter in word for letter in yellow_letters), "Yellow letters not present in word"
        
        self.guesses.append(Guess(word, check_guess(self.answer, word)))
        if word == self.answer: self.gstate = Gamestate.WON
        elif len(self.guesses) == MAX_GUESSES: self.gstate = Gamestate.LOST
            
    def get_hint(self) -> Hint:
        """
        Get a hint for the current game.
        """
        # pre-condition
        assert self.gstate == Gamestate.PLAYING, "Game must be in play to get a hint."
        return hint(self.answer, self.guesses)

    def print_state(self):
        """
        Prints a message to the user based on the current state of the game.
        """
        for guess in self.guesses: print(guess)
        if self.gstate == Gamestate.WON: print(f"You won! You took {len(self.guesses)} guesses.")
        elif self.gstate == Gamestate.LOST: print(f"You lost! The answer was: {self.answer}.")
        else: print(f"Guess the wordle, you have {MAX_GUESSES - len(self.guesses)} guesses remaining.")

    def game_over(self) -> bool:
        """
        Yields true if the game is over (won or lost), false otherwise.
        """
        return self.gstate == Gamestate.WON or self.gstate == Gamestate.LOST 

    def reset(self):
        """
        Reset the game by picking a new word, clearing the guess, and
        setting the state back to playing.
        """
        # pre-condition
        # assert self.game_over(), "Cannot reset, game in play"
        self.answer = random.choice(WORDS)
        self.guesses = []
        self.gstate = Gamestate.PLAYING

    def get_answer(self) -> Word:
        """
        Return the answer to the game and set the game state to lost.
        """
        if self.gstate == Gamestate.PLAYING:
            self.gstate = Gamestate.LOST

        return self.answer

