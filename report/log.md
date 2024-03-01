25/02/2024
First created repository, version control allows me to keep track of changes and allows me to revert to previous versions if necessary. 

Fixed SSL error when getting word list

Used assert statements for testing, this shows more clearly than print statements if the code is working as expected. If fail, they print a informative message.

Current implementation of check letter doesn't work for words with repeated letters. This is because if user gets a green letter but there are more than one of that letter in the word, the other letter will be yellow.

Hint must take into account what the user has already guessed and then pick a random letter from the remaining letters.

Implemented hint function which only returns 1 char from remaining letters unguessed. Does not say position of letter. Assumptions made are that the hint function does not return a letter that has already been guessed and does not say position of letter. It also doesn't count as a guess.

Implemented check_guess and removed check_letter. check_guess now returns a list of clues for each letter in the guess. This is a better implementation as it correctly handles repeated letters in the word so the clues are correct and more informative to the user.

Implemented hard guess which forces the user to use letters that are yellow or green in the next guess.

Calling hint multiple times can return the same letter



EXTRA IDEAS:

Could reduce code duplication by making process_guess for hard guess and normal guess
Talk about how solutions could have better Big O performance. This would help with scalability and reduce server costs.
Some other preconditions could be cant repeat same guess








Consider the word "bells" as the target word and the guess "sells". According to the rules of the game, the clues should be:

The first letter "s" should be YELLOW because "s" is in the word but in the wrong position.
The second letter "e" should be GREEN because it is in the correct position.
The third and fourth letters "l" should be GREEN because they are in the correct position.
The fifth letter "s" should be GREY, because there is only one "s" in the target word, and its correct position has already been accounted for by the first letter in the guess being marked YELLOW.
However, the naive implementation does not handle the last case correctly. It would incorrectly assign YELLOW to the last "s" in "sells" because it checks each letter independently, noticing that "s" appears in "bells" without accounting for the fact that the "s" has already been matched.

Solution Approach
A solution requires an approach that accounts for the frequency of each letter in both the guess and the target word. One way to achieve this is by first marking all correctly positioned letters (GREEN), then marking the remaining letters as YELLOW only if the letter exists in the target word and has not been fully matched yet. Any letters that do not meet these criteria should be marked as GREY.

Implementation Suggestions
Modify check_letter: Update check_letter to take additional information, such as the list of letters that have already been correctly guessed or the frequency of each letter in the guess and the target word. However, this might complicate the check_letter function, making it less intuitive.

Directly Compute Clues in check_guess: A better approach might be to adjust the logic within check_guess to first mark all GREEN clues, then mark YELLOW clues while keeping track of the frequency of each letter in the target word to ensure letters are not over-matched.

Letter Frequency Tracking: Before iterating through the guess, create a dictionary to count the occurrences of each letter in the target word. As you assign GREEN clues, decrement the count for the matched letters. When considering YELLOW clues, only assign them if the letter's count is greater than zero, indicating that there are still unmatched occurrences of that letter in the target word.


Reference Ideas:
Talk about importance of testing and different methods. I researched into X so found this was best method of testing.
Talk about how solutions could have better Big O performance. This would help with scalability and reduce server costs. Link to NY times saving money
