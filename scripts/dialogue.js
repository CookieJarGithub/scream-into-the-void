var dialogue_container = document.getElementById("dialogue");
var thought_bubble = document.getElementById("thought-bubble");
var is_thought_on = false;
var next_button = document.getElementById("next-dialogue");
var skip_button = document.getElementById("skip-dialogue");
var dialogue_counter = 0
var checkpoints = [9, 14, 16]
var global_delay = -1 // this is so bad lmao
var characters = [] // oh this is HORRIBLE

var SPEEDS = {
    FAST: 40,
    NORMAL: 120,
    SLOW: 240,
    PAUSE: 500
}

dialogues = [
    [
        { string: "scream into the void.", speed: SPEEDS.SLOW }
    ],
    [
        { string: "whatever is in the deepest corners of your mind,", speed: SPEEDS.FAST }
    ],
    [
        { string: "or in your heart,", speed: SPEEDS.FAST }
    ],
    [
        { string: "you can say them", speed: SPEEDS.FAST },
        { string: ",", speed: SPEEDS.PAUSE},
        { string: " here." }
    ],
    [
        { string: "nothing will hear you.", speed: SPEEDS.FAST }
    ],
    [
        { string: "nobody", speed: SPEEDS.NORMAL, classes: ["italics"] },
        { string: " ", speed: SPEEDS.PAUSE },
        { string: "will hear you.", speed: SPEEDS.FAST }
    ],
    [
        { string: "your words here will not persist.", speed: SPEEDS.FAST }
    ],
    [
        { string: "the only one here", speed: SPEEDS.FAST },
        { string: " ", speed: SPEEDS.PAUSE },
        { string: "is ", speed: SPEEDS.FAST },
        { string: "you.", speed: SPEEDS.FAST, classes: ["italics"] }
    ],
    [
        { string: "after all", speed: SPEEDS.FAST },
        { string: ",", speed: SPEEDS.PAUSE },
        { string: " you are your best listener.", speed: SPEEDS.FAST }
    ],
    // 9
    [
        { string: "go on and say whatever.", speed: SPEEDS.FAST }
    ],
    [
        { string: "interesting.", speed: SPEEDS.NORMAL }
    ],
    [
        { string: "very interesting.", speed: SPEEDS.FAST }
    ],
    [
        { string: "stay here.", speed: SPEEDS.FAST }
    ],
    [
        { string: "you will be safe.", speed: SPEEDS.FAST }
    ],
    // 14
    [
        { string: "i believe in you.", speed: SPEEDS.FAST }
    ],
    [
        { string: "your message now floats in darkness.", speed: SPEEDS.FAST }
    ],
    [
        { string: "need to say anything else?", speed: SPEEDS.FAST }
    ]
]

extra_dialogues = [

]

function revealOneCharacter(list) {
    if(list.length === 0) {
        return
    }

    var next = list.splice(0, 1)[0];
    next.span.classList.add("revealed");
    next.classes.forEach((c) => {
        next.span.classList.add(c);
    })

    var delay = next.isSpace ? 0 : next.delayAfter;
    if(global_delay >= 0) {
        delay = global_delay;
    }

    if(list.length > 0) {
        setTimeout(function() {
            revealOneCharacter(list);
        }, delay);
    }
    // shows "Next" button after dialogue is finished 
    else {
        next_button.style.visibility = "visible";
        if(dialogue_counter === 0) {
            skip_button.style.visibility = "visible";
        }
    }
}

function revealDialogue(d) {
    // appends all characters into the dialogue div
    // also pushes them into a "characters" list
    characters = [];
    d.forEach((line, index) => {
        // add space after each line.
        // if(index < d.length - 1) {
        //     line.string += " ";
        // }
        if(line.string === " ") {
            var span = document.createElement("span");
            span.textContent = " ";
            dialogue_container.append(span);
            characters.push({
                span: span,
                isSpace: false,
                delayAfter: line.speed,
                classes: line.classes || []
            });
        }

        line.string.split("").forEach(character => {
            var span = document.createElement("span");
            span.textContent = character;
            dialogue_container.append(span);
            characters.push({
                span: span,
                isSpace: character === " ",
                delayAfter: line.speed,
                classes: line.classes || []
            })
        })
    });

    // hides "Next" button once dialogue starts
    next_button.style.visibility = "hidden";
    skip_button.style.visibility = "hidden";
    revealOneCharacter(characters);
}

function clearDialogue() {
    dialogue_container.innerHTML = '';
}

function nextDialogue() {
    if(is_thought_on) {
        hideThought();
        if(dialogue_counter === checkpoints[2]) {
            dialogue_counter = checkpoints[1] + 1;
            revealDialogue(dialogues[dialogue_counter]);
            return;
        }

        dialogue_counter++;
        revealDialogue(dialogues[dialogue_counter]);
    }
    else {
        clearDialogue();
        global_delay = -1;
        
        if(dialogue_counter === checkpoints[0] || dialogue_counter === checkpoints[1] || dialogue_counter === checkpoints[2]) {
            showThought();
            return;
        }

        dialogue_counter++;
        revealDialogue(dialogues[dialogue_counter]);
    }
}

function skipDialogue() {
    clearDialogue();
    global_delay = -1;
    dialogue_counter = checkpoints[0];
    revealDialogue(dialogues[dialogue_counter]);
}

function showThought() {
    is_thought_on = true;
    thought_bubble.style.display = "block";
    next_button.innerHTML = "finish";
}

function hideThought() {
    is_thought_on = false;
    thought_bubble.value = "";
    thought_bubble.style.display = "none";
    next_button.innerHTML = "next";
}

revealDialogue(dialogues[dialogue_counter]);

document.addEventListener("mouseup", function(evt) {
    if(next_button.style.visibility === "hidden") {
        // (attempt to) skip dialogue when clicked
        global_delay = 0;
        revealOneCharacter(characters);
        next_button.style.visibility = "visible";
        if(dialogue_counter === 0) {
            skip_button.style.visibility = "visible";
        }
    }
});