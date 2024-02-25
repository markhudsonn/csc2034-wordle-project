from dataclasses import dataclass   # for defining dataclasses
from enum import Enum               # for defining enumerations
import typing                       # for type hinting
import random                       # for selecting a random answer
from typing import List             # for defining custom typed lists
from urllib.request import urlopen  # to load web data
import ssl
from collections import Counter     # for counting letters in a word

# grab a list of words
url = 'https://raw.githubusercontent.com/tabatkins/wordle-list/main/words'
context = ssl._create_unverified_context()
WORDS = [word.rstrip().decode('UTF-8').upper() for word in urlopen(url, context=context).readlines()]

# constants
WORD_LENGTH = 5 
MAX_GUESSES = 6

# define Word as an alias for string
Word = str

# type enumerating the three possible clue colours
Clue = Enum('Clue', ['GREEN', 'YELLOW', 'GREY'])

# type enumerating the state of the game
Gamestate =  Enum('Gamestate', ['WON', 'LOST', 'PLAYING'])

# define Hint as an alias for string
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
        assert len(word) == WORD_LENGTH, \
            f"Invariant violated: len(Guess.word) <> {WORD_LENGTH}"  
        self._word = word

    @property
    def clues(self) -> List[Clue]:
        return self._clues

    @clues.setter
    def clues(self, clues: Clue):
        # invariant
        assert len(clues) == WORD_LENGTH, \
            f"Invariant violated: len(Guess.clues) <> {WORD_LENGTH}"              
        self._clues = clues

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
    # pre-condition
    assert len(word) == WORD_LENGTH and \
           len(guess) == WORD_LENGTH, "pre-check_guess failed"
           
    clues = [Clue.GREY] * WORD_LENGTH
    
    # letter_counts = {}
    # for letter in word:
    #     if letter in letter_counts:
    #         letter_counts[letter] += 1
    #     else:
    #         letter_counts[letter] = 1

    letter_counts = Counter(word)

    for i, letter in enumerate(guess):
        if letter == word[i]:
            clues[i] = Clue.GREEN
            letter_counts[letter] -= 1

    for i, letter in enumerate(guess):
        if letter != word[i] and letter in letter_counts and letter_counts[letter] > 0:
            clues[i] = Clue.YELLOW
            letter_counts[letter] -= 1

    # post-condition
    assert len(clues) == WORD_LENGTH, "post-check_guess failed"
    
    return clues

def hint(word: Word, guesses: List[Guess]) -> Hint:
    """
    Return random letter from the word that has not been guessed yet.
    """
    # pre-condition
    assert len(word) == WORD_LENGTH and \
              all(len(guess.word) == WORD_LENGTH for guess in guesses), "pre-hint failed"
    
    guessed_letters = set()
    for guess in guesses:
        for letter in guess.word:
            guessed_letters.add(letter)

    unguessed_letters = [letter for letter in word if letter not in guessed_letters]
    
    if unguessed_letters:
        hint = random.choice(unguessed_letters)
        assert len(hint) == 1 and hint.isalpha() and hint.isupper(), "post-hint failed"
        return hint
    else:
        return None

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
        assert self.gstate == Gamestate.PLAYING and \
               len(self.guesses) < MAX_GUESSES and \
               word in WORDS, "pre-guess failed."
               
        self.guesses.append(Guess(word, check_guess(self.answer, word)))
        if word == self.answer: self.gstate = Gamestate.WON
        elif len(self.guesses) == MAX_GUESSES: self.gstate = Gamestate.LOST

    def get_hint(self) -> Hint:
        """
        Get a hint for the current game.
        """
        # pre-condition
        assert self.gstate == Gamestate.PLAYING, "pre-get_hint failed."
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
        assert self.game_over(), "Cannot reset, game in play"
        self.answer = random.choice(WORDS)
        self.guesses = []
        self.gstate = Gamestate.PLAYING

# test the game
game = Game()
print("Answer:", game.answer)
game.make_guess("SELLS")
game.print_state()
game.make_guess("HELLO")
# game.print_state()
game.make_guess("STAND")
# game.print_state()
print(game.get_hint())


