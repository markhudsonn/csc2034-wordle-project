25/02/2024
First created repository, version control allows me to keep track of changes and allows me to revert to previous versions if necessary. 

Fixed SSL error when getting word list

Used assert statements for testing, this shows more clearly than print statements if the code is working as expected. If fail, they print a informative message.

Current implementation of check letter doesn't work for words with repeated letters. This is because if user gets a green letter but there are more than one of that letter in the word, the other letter will be yellow.

Hint must take into account what the user has already guessed and then pick a random letter from the remaining letters.

Implemented hint function which only returns 1 char from remaining letters unguessed. Does not say position of letter. Assumptions made are that the hint function does not return a letter that has already been guessed and does not say position of letter. It also doesn't count as a guess.

Implemented check_guess and removed check_letter. check_guess now returns a list of clues for each letter in the guess. This is a better implementation as it correctly handles repeated letters in the word so the clues are correct and more informative to the user.

Implemented hard guess which forces the user to use $$letters that are yellow or green in the next guess.

Calling hint multiple times can return the same letter $$

Exported jupyter code into python in backend folder

Then created main.py which creates endpoints for the game.

Created frontend folder with Vite and followed Shadcn installation guide 

used state and axios to get data from backend and display it on the frontend

CITE shadcn, confetti, axios, vite, flask,

Added @error handlers in flask to return assert errors to the frontend

Displayed error message on frontend.

HOW MANY GUESSES? and check guess seems to have wrong asserts for length

Changed asserts line by line so each has more meaningful error message

assumed that dont need to check word isn't digits etc as it won't be in the word list

1 assumption about get hint is number of occurances of a letter, e.g. if there are 2 a's in the word, the hint returned will be more likely to be a.

I added extra pre conditions and post conditions to new check_guess. Didn't bother for check_letter as new check_guess made it redundant.

Also added more meaningful messages to all asserts so that if they fail, the user knows what went wrong.

Assumed that player can guess same word multiple times

Maybe I should have done a formal specification?

Added get_answer to the extension game so that the user can see the answer and the game state is set to playing if not already lost. if this is called when the game is playing, the game state is set to lost to prevent cheating.

Added get guesses to display on frontend

Implemented hard guess to frontend, this makes post request to hard guess endpoint

My original hard guess implementation allowed greens to be anywhere in the word. I changed this to only allow greens to be in the same position as the original guess. This is because the user could guess a word with a green letter in the wrong position and then use hard guess to find the correct position of the green letter. This would be cheating.

EXTRA IDEAS:

Could reduce code duplication by making process_guess for hard guess and normal guess
Talk about how solutions could have better Big O performance. This would help with scalability and reduce server costs.
Some other preconditions could be cant repeat same guess
Draw diagram of how I solved check guess
Say I could do end to end testing for the frontend web app
Benefit of backend is that user's cannot cheat as answers are checked on the server


Reference Ideas:
Talk about importance of testing and different methods. I researched into X so found this was best method of testing.
Talk about how solutions could have better Big O performance. This would help with scalability and reduce server costs. Link to NY times saving money
