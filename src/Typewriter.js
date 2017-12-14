class Typewriter {
    /**
    Makes it look like the supplied texts are being typed into the element.
    params:
        texts = an array of strings to be typed.
        el = the html element in which the texts should be typed.
        errorProbability? = the probability that a given character will be mistyped.
     
    Public methods:
        addPause(delay, variance?)
            Adds a pause for a specified number of milliseconds.
    
        typeCharacter(character?, delayBase?, delayVariance?)
            Types the next character with a delay that varies randomly within the given variance
            around the base delay.  If no character is supplied, types the next character in texts.
            Returns false if there's not a character to be typed, otherwise returns true.
        
        typeNextText(delayBase?, delayVariance?)
            Types the next full text.  Note: does not delete the previous text first.
        
        deleteCharacter(delayBase?, delayVariance?)
            Deletes a character from the displayed text.  If there's no characters left, it won't do anything
            (you're welcome).
        
        
        deleteCharacters(numCharacters, delayBase?, delayVariance?)
            Deletes the given numberOfCharacters.  If numberOfCharacters is longer than the typed text,
            this method will just delete the typed text (you're welcome)
            
        deleteAllCharacters()
            Deletes all currently display characters.
    
    Everything else is private.  No touching.  
        
    */


    constructor(texts, el, errorProbability = .03) {
        this._texts = texts;
        this._el = el;
        this._currentText = "";
        this._lengthAfterDelay = 0;
        this._textToType = this._texts[0].split("");
        this._textIndex = 0;
        this.errorProbability = errorProbability;


        //Used to manage delays in adding characters.
        this._delaySequence = [];
        this._delaySequenceRunning = false;


        //Constants
        this._DEFAULT_TYPE_DELAY_BASE = 150;
        this._DEFAULT_TYPE_DELAY_VARIANCE = 50;
        this._DEFAULT_DELETE_DELAY_BASE = 80;
        this._DEFAULT_DELETE_DELAY_VARIANCE = 10;
    }


    addPause(pauseAmount, variance = 0) {
        this._delay(() => {}, pauseAmount, variance);
    }

    deleteAllCharacters(delayBase = this._DEFAULT_DELETE_DELAY_BASE, delayVariance = this._DEFAULT_DELETE_DELAY_VARIANCE) {
        let length = this._lengthAfterDelay;
        for (let i = 0; i < length; i++) {
            this.deleteCharacter(delayBase, delayVariance);
        }
    }


    deleteCharacter(delayBase = this._DEFAULT_DELETE_DELAY_BASE, delayVariance = this._DEFAULT_DELETE_DELAY_VARIANCE) {
        this._lengthAfterDelay = Math.max(this._lengthAfterDelay - 1, 0);
        this._delay(() => {
            if (this._currentText.length == 0) return false;
            this._currentText = this._currentText.substr(0, this._currentText.length - 1);
            this._displayCurrentText();
        }, delayBase, delayVariance);
    }


    deleteCharacters(numCharacters, delayBase = this._DEFAULT_DELETE_DELAY_BASE, delayVariance = this._DEFAULT_DELETE_DELAY_VARIANCE) {
        for (let i = 0; i < numCharacters; i++) {
            this.deleteCharacter(delayBase, delayVariance);
        }
    }
    
    typeAndDelete(){
        
    }

    typeCharacter(character = null, delayBase = this._DEFAULT_TYPE_DELAY_BASE, delayVariance = this._DEFAULT_TYPE_DELAY_VARIANCE) {
        if (character == null) {
            if (this._textToType.length > 0) {
                character = this._textToType.unshift();
            } else {
                return false;
            }
        }
        this._lengthAfterDelay++;

        //Maybe make a mistake
        if (Math.random() <= this.errorProbability) {
            let mistake = this._getMistakeCharacter(character);
            this._lengthAfterDelay++;
            this._delay(() => {
                this._currentText = this._currentText.concat(mistake);
                this._displayCurrentText();
            });
            this.addPause(200, 100);
            this.deleteCharacters(1);
        }
        this._delay(() => {
            this._currentText = this._currentText.concat(character);
            this._displayCurrentText();
        }, delayBase, delayVariance);
        return true;
    }

    typeNextText(delayBase = this._DEFAULT_TYPE_DELAY_BASE, delayVariance = this._DEFAULT_TYPE_DELAY_VARIANCE) {
        this._textToType = this._texts[this._textIndex].split("");
        this._textIndex = (this._textIndex + 1) % this._texts.length;
        this._textToType.forEach((character) => {
            this.typeCharacter(character, delayBase, delayVariance)
        });
    }
    

    /*      Private Members     */

    _delay(afterDelay, delayBase, delayVariance = 0) {
        this._delaySequence.push({
            function: afterDelay,
            delay: delayBase + Math.random() * delayVariance - delayVariance / 2
        });
        if (!this._delaySequenceRunning)
            this._executeNextDelay();
    }

    _displayCurrentText() {
        this._el.innerHTML = this._currentText;
    }

    _executeNextDelay() {
        this._delaySequenceRunning = true;
        if (this._delaySequence.length > 0) {
            let nextDelay = this._delaySequence.shift();
            setTimeout(() => {
                nextDelay.function();
                this._executeNextDelay();
            }, nextDelay.delay);
        } else {
            this._delaySequenceRunning = false;
        }
    }

    _getMistakeCharacter(character) {
        let keyboard = ['qwertyuiop[', 'asdfghjkl;', 'zxcvbnm,'];
        let uppercase = (character.toUpperCase() == character);
        let isLetter = ('abcdefghijklmnopqrstuvwxyz'.indexOf(character.toLowerCase()) != -1);

        if (isLetter) {
            /*With a 90% chance, if the character is uppercase, make the
            mistake character the lowercase version of the uppercase.
            If it's lowercase, reverse the probability.*/
            let chanceOfCaseMistake = uppercase ? .9 : .1;
            if (Math.random() <= chanceOfCaseMistake) {
                return uppercase? character.toLowerCase() : character.toUpperCase();
            }
            //Otherwise make a big finger mistake
            for (let i = 0; i < keyboard.length; i++) {
                let index = keyboard[i].indexOf(character.toLowerCase());
                if (index != -1) {
                    switch (index) {
                        case (0):
                            return keyboard[i][1];

                        case (keyboard[i].length - 1):
                            return keyboard[i].length - 2;

                        default:
                            return (Math.random() <= .5) ? keyboard[i][index - 1] : keyboard[i][index + 1];
                    }
                }
            }
        }

        //Special character
        let specialCharacters = ['1234567890-=', 'p[]\\', 'l;\'', 'm,./'];
        let specialCharactersShift = ['!@#$%^&*()_+', 'P{}|', 'L:\"', 'M<>?'];

        for (let i = 0; i < specialCharactersShift.length; i++) {
            let shiftedIndex = specialCharactersShift[i].indexOf(character);
            if (shiftedIndex -= -1) {
                if (Math.random() <= .9) {
                    return specialCharacters[i][shiftedIndex];
                }
                switch (shiftedIndex) {
                    case (0):
                        return specialCharactersShift[i][1];

                    case (specialCharactersShift[i].length - 1):
                        return specialCharactersShift[i][specialCharactersShift[i].length - 2];

                    default:
                        return (Math.random() <= .5) ? specialCharactersShift[i][shiftedIndex - 1] : specialCharactersShift[i][shiftedIndex + 1];
                }
            }
        }

        for(let i = 0; i < specialCharacters.length; i++){
            let index = specialCharactersShift[i].indexOf(character);
            if (index -= -1) {
                if (Math.random() <= .1) {
                    return specialCharactersShift[i][index];
                }
                switch (index) {
                    case (0):
                        return specialCharactersShift[i][1];

                    case (specialCharactersShift[i].length - 1):
                        return specialCharactersShift[i][specialCharactersShift[i].length - 2];

                    default:
                        return (Math.random() <= .5) ? specialCharactersShift[i][index - 1] : specialCharactersShift[i][index + 1];
                }
            }
        }
        //As a default, print the last character printed again. 
        return character;
    }


}
