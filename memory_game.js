// global variables
let openedElement = null;
let matched = [];
let allowClick = true;
let seconds = 0;
let timer = null;
let counter = 0;
let counterFails = 0;
const counterElement = document.getElementById('counter');
const ratingElement = document.getElementById('rating');

// Starting the game
function startGame() {
    const faces = [1,2,3,4,5,6];
    const cards = shuffle(faces.concat(faces));
    const container = document.querySelector('.container');
    const timerElement = document.getElementById('timer');

    matched = [];
    while (container.firstChild) {
        container.removeChild(container.firstChild);
    }

    for (const card of cards) {
        //<div class="card face-1 back" id="card0"></div>
        const element = document.createElement('div');
        element.setAttribute('class', `card face-${card} back`);
        element.setAttribute('data-face', card);
      
        container.appendChild(element);
        element.addEventListener('click', cardClick, false);
    }

    seconds = 0;
    timerElement.textContent = formatTime(seconds);

    counter = 0;
    counterElement.textContent = counter;

    updateRating();
    
    clearInterval(timer);
    timer = setInterval(function() {
        seconds++;
        timerElement.textContent = formatTime(seconds);
    }, 1000);
}

function cardClick (event) {
    if (!allowClick) {
        return;
    }

    const currentClickedElement = event.target;
    const face = currentClickedElement.getAttribute('data-face');
    
    openCard(currentClickedElement);

    //How to control the cards
    if (openedElement !== null) {
        counter++;
        counterElement.textContent = counter;
        if (openedElement.getAttribute('data-face') === face) {
            console.log('MATCH');
            matched.push(face);
            match(currentClickedElement);
            openedElement = null;
            if(matched.length === 6) {
                win();
            }
        } else {
            console.log('FAIL');
            counterFails++;
            updateRating();
            fail(currentClickedElement);
            resetCard(currentClickedElement);
        }
    } else {
        openedElement = currentClickedElement;
    }

    console.log(matched);


}

function openCard(element) {
    element.classList.remove('back');
    element.removeEventListener('click', cardClick);
}
// A green border will appear to show that you have a pair
function match(currentClickedElement) {
    currentClickedElement.classList.add('match');
    openedElement.classList.add('match');
}
// A red border will appear if the cards don't match
function fail(currentClickedElement) {
    currentClickedElement.classList.add('fail');
    openedElement.classList.add('fail');
}
// The cards must be visible for a certain amount of time before flipping back
function resetCard(currentClickedElement) {
    allowClick = false;
    setTimeout(function () {
        currentClickedElement.classList.add('back');
        currentClickedElement.addEventListener('click', cardClick, false);
        openedElement.classList.add('back');
        openedElement.addEventListener('click', cardClick, false);
        currentClickedElement.classList.remove('fail');
        openedElement.classList.remove('fail');
        openedElement = null;
        allowClick = true;
        
    }, 1000);
}
//When you win the game, an alert box pops out
function win() {
    setTimeout(function () {
        const message = `Congrats you won!\nYour final rating is X and your time was ${formatTime(seconds)}.\nClick OK if you want to play again.`;
        if(confirm(message)) {
            reset();
        }
    }, 100);
}
//When you finish the game or hit the button reset
function reset() {
    startGame();
}

function updateRating() {
    let rating = 3;
    if (counterFails > 4 && counterFails < 8) {
        rating = 2;
    } else if (counterFails >= 8 && counterFails < 10) {
        rating = 1;
    } else if (counterFails >= 10) {
        rating = 0;
    }

    while (ratingElement.firstChild) {
        ratingElement.removeChild(ratingElement.firstChild);
    }
    for (let i = rating; i > 0; i--) {
        const starIcon = document.createElement('i');
        starIcon.setAttribute('class', 'fas fa-star');
        ratingElement.append(starIcon);
    }
}

startGame();
