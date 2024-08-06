
let gameState = {
    score: 0,
    Progress: 0,
    Lives: 3,
    timeLeft: 60,
    currentQuestionIndex: 0,
    isSubmitting: false,
    lastLifeLossTime: 0
};

let elements = {
    score: document.querySelector('#current-score'),
    progress: document.querySelector('#progress'),
    lives: document.querySelector('#lives'),
    timer: document.querySelector('#timer'),
    quizSelector: document.querySelector('.quizSelector'),
    gameOver: document.querySelector('.gameOver'),
    wellDone: document.querySelector('.wellDone')
};

let quizData = [];
let timerInterval;

function updateDisplays() {
    elements.score.textContent = `${gameState.score}/100`;
    elements.progress.textContent = `${gameState.Progress}/10`;
    elements.lives.textContent = `${gameState.Lives}/3`;
    elements.timer.textContent = `${gameState.timeLeft}s`;
}

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('start-button').addEventListener('click', startQuiz);
    updateDisplays();
});

async function startQuiz() {
    document.getElementById('start-screen').style.display = 'none';
    await fetchQuizQuestions();
    renderQuestion(quizData[gameState.currentQuestionIndex]);
    initQuiz();
    startTimer();
}

function updateTimer() {
    if (gameState.timeLeft > 0) {
        gameState.timeLeft--;
        elements.timer.textContent = `${gameState.timeLeft}s`;
    } else {
        handleTimeUp();
    }
}

function handleTimeUp() {
    clearTimer();
    decreaseLives();
    if (gameState.Lives > 0) {
        loadNextQuestion();
    } else {
        endGame();
    }
}

function clearTimer() {
    clearInterval(timerInterval);
}

function startTimer() {
    gameState.timeLeft = 60;
    elements.timer.textContent = `${gameState.timeLeft}s`;
    clearInterval(timerInterval);
    timerInterval = setInterval(updateTimer, 1000);
}

function decreaseLives() {
    const currentTime = Date.now();
    if (currentTime - gameState.lastLifeLossTime > 1000) {
        gameState.Lives = Math.max(0, gameState.Lives - 1);
        gameState.lastLifeLossTime = currentTime;
        updateDisplays();
        // console.log('Current Lives:', gameState.Lives);
    }
}

function handleSubmit(correctAnswer) {
    if (gameState.isSubmitting || gameState.Lives <= 0) return;
    gameState.isSubmitting = true;
    clearTimer();

    const selectedRadio = document.querySelector('input[name=answer]:checked');
    if (!selectedRadio) {
        alert('Please select an answer.');
        gameState.isSubmitting = false;
        startTimer();
        return;
    }

    const selectedAnswer = selectedRadio.value;
    if (selectedAnswer === correctAnswer) {
        gameState.score += 10;
        gameState.Progress++;
        showResult('.rightAnswer');
    } else {
        decreaseLives();
        if (gameState.Lives <= 0) {
            endGame();
            return;
        }
        showResult('.wrongAnswer');
    }

    updateDisplays();
    elements.quizSelector.classList.add('hide');
    gameState.isSubmitting = false;
}

function showResult(selector) {
    const element = document.querySelector(selector);
    element.classList.remove('hide');
    element.classList.add('show');
}

function initQuiz() {
    const btnSubmit = document.querySelector('#btn_submit');
    btnSubmit.removeEventListener('click', handleSubmitWrapper);
    btnSubmit.addEventListener('click', handleSubmitWrapper);
}

function handleSubmitWrapper(e) {
    e.preventDefault();
    handleSubmit(quizData[gameState.currentQuestionIndex].correctAnswer);
}
async function fetchQuizQuestions() {
    try {
        const url = 'https://the-trivia-api.com/api/questions?limit=10&difficulty=medium&categories=general_knowledge';
        const response = await fetch(url);
        quizData = await response.json();
    } catch (error) {
        console.error("Error fetching quiz questions:", error);
    }
}

function renderQuestion(questionData) {
    document.querySelector(".questionFirst").textContent = questionData.question;
    const labelContainerParent = document.querySelector("#first_item");
    labelContainerParent.innerHTML = '';
    
    const allAnswers = [questionData.correctAnswer, ...questionData.incorrectAnswers].sort(() => Math.random() - 0.5);
    // console.log(questionData.correctAnswer);
    document.querySelector("#correctAnswer").textContent = questionData.correctAnswer;
    
    allAnswers.forEach(answer => {
        labelContainerParent.appendChild(createAnswerElement(answer));
    });
    
    elements.quizSelector.classList.remove('hide');
    startTimer();
}

function createAnswerElement(answer) {
    const labelContainer = document.createElement('div');
    labelContainer.className = 'questionlabel';
    labelContainer.innerHTML = `
        <label>
            <input class="circle_border" type="radio" name="answer" value="${answer}">
            ${answer}
        </label>
    `;
    return labelContainer;
}

function loadNextQuestion() {
    clearTimer();
    document.querySelector('.wrongAnswer').classList.add('hide');
    document.querySelector('.rightAnswer').classList.add('hide');
    elements.quizSelector.classList.remove('hide');

    gameState.currentQuestionIndex++;
    if (gameState.currentQuestionIndex < quizData.length) {
        renderQuestion(quizData[gameState.currentQuestionIndex]);
    } else {
        endGame();
    }
}

function endGame() {
    clearTimer();
    if (gameState.currentQuestionIndex === quizData.length && gameState.Lives > 0) {
        showWellDoneScreen();
    } else if (gameState.Lives <= 0) {
        showGameOverScreen();
    }
}

function showWellDoneScreen() {
    elements.quizSelector.classList.add('hide');
    elements.wellDone.classList.remove('hide');
    elements.wellDone.classList.add('show');
    // console.log("Well Done! Quiz completed successfully");
}

function showGameOverScreen() {
    elements.quizSelector.classList.add('hide');
    elements.gameOver.classList.remove('hide');
    // console.log("Game Over - Out of Lives");
}

function resetGameState() {
    gameState = {
        score: 0,
        Progress: 0,
        Lives: 3,
        timeLeft: 60,
        currentQuestionIndex: 0,
        isSubmitting: false,
        lastLifeLossTime: 0
    };
    updateDisplays();
}

async function loadGameAgain() {
    clearTimer();
    resetGameState();

    document.querySelectorAll('.hide').forEach(el => el.classList.remove('show'));
    elements.quizSelector.classList.remove('hide');
    elements.gameOver.classList.add('hide');
    elements.wellDone.classList.add('hide');

    await fetchQuizQuestions();
    renderQuestion(quizData[gameState.currentQuestionIndex]);
    initQuiz();
    // console.log("Game restarted");
}
function setupEventListeners() {
document.querySelector('#next_question_btn').addEventListener('click', loadNextQuestion);
document.querySelector('#next_question_btn_Incrt').addEventListener('click', loadNextQuestion);
document.querySelector('#tryAgain').addEventListener('click', () => {
    loadGameAgain().catch(error => console.error("Error restarting game:", error));
});
document.querySelector('#tryAgainWellDone').addEventListener('click', () => {
    loadGameAgain().catch(error => console.error("Error restarting game:", error));
});
}
// Call this function once when the page loads
document.addEventListener('DOMContentLoaded', setupEventListeners);