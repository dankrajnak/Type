"use strict";

var texts = ["Let's build something cool.", "Let's build something inspiring.", "Let's build something sick."];
var typeWriter = new Typewriter(texts, document.getElementById('text'));

typeWriter.typeNextText();
typeWriter.addPause(2000);
typeWriter.deleteAllCharacters();
typeWriter.addPause(2000);

typeWriter.typeNextText();
typeWriter.addPause(2000);
typeWriter.deleteAllCharacters();
typeWriter.addPause(2000);
typeWriter.typeNextText();