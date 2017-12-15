# Typewriter

I decided to take a stab at a javascript typewriter.
    
The typewriter performs operations works asynchronously.  Think of each method as adding a number of operations to a "delay sequence" or queue.  Therefore, please DON'T code things like:
    
```javascript
while(true){
    typewriter.typeNextText()
    typeWriter.deleteAllCharacters();
}
```

The delay sequence would get HUGE.  Not good. Use typewriter.play(). If you want to get your hands dirty and monitor the delaySequence, it's provided as a get-only property.


Params |
---|---
`texts` | an array of strings to be typed.
`el` | the html element in which the texts should be typed.
`errorProbability?` | the probability that a given character will be mistyped.


###Properties:

isTyping 
Returns a boolean.  True if the typewriter is currently typing, false if otherwise.

delaySequence
Returns the a deep copy of the current delaysequence: a queue containing all operations and their delays.

### Public methods:
**Just a note about delays:**
DelayBase = number of milliseconds, on average, typing a character, deleting a character, or pausing will take
DelayVariance = number of milliseconds the delay will vary randomly around the base.  Must be <= base.

`pause(delayBase?, delayVariance?)`
    Adds a pause for a specified number of milliseconds.

`deleteCharacter(delayBase?, delayVariance?)`
    Deletes a character from the displayed text.  If there's no characters left, it won't do anything (you're welcome).

`deleteCharacters(numCharacters, delayBase?, delayVariance?)`
    Deletes the given numberOfCharacters.  If numberOfCharacters is longer than the typed text, this method will just delete the typed text (you're welcome).

`deleteAllCharacters(delayBase?, delayVariance?)`
    Deletes all currently display characters.

`play(playParamObject?)`
    Plays through the texts—types next text, pauses, deletes it, pauses, repeat.

`stop(immediately?)`
    Stops the typewriter from playing.  If immediately is false or not supplied, the typewriter will finish typing and deleting the current text.  If immediately is true, it will stop immediately.

`typeCharacter(character?, delayBase?, delayVariance?)`
    Types the next character with a delay that varies randomly within the given variance around the base delay.  If no character is supplied, types the next character in texts. Returns false if there's not a character to be typed, otherwise returns true.

`typeNextText(delayBase?, delayVariance?)`
    Types the next full text.  Note: does not delete the previous text first.

Everything else is private.  No touching.

### TODOs and Issues
* Issue with Safari: text is cut off after third line.  Although it displays once it's clicked.  Inspecting the element also displays the text.
        