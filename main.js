// document.addEventListener('DOMContentLoaded', function() {
// Your initialization code here
//score
let scoreElement = document.querySelector('#current-score') ;
let score = 0;
scoreElement.textContent = `${score}/100`;
//progress bar
let ProgressElement = document.querySelector('#progress') ;
let Progress = 0;
ProgressElement.textContent = `${Progress}/10`;
console.log(Progress);
//lives
let LivesElement = document.querySelector('#lives') ;
let Lives = 3; 
LivesElement.textContent = `${Lives}/3`;
//timer
let TimerElement = document.querySelector('#timer') 
let timeLeft = 60;
TimerElement.textContent = `${timeLeft}s`;

document.addEventListener('DOMContentLoaded', function() {
    const startScreen = document.getElementById('start-screen');
    const startButton = document.getElementById('start-button');

    startButton.addEventListener('click', function() {
        startScreen.style.display = 'none';
        fetchQuizQuestions();
        // startTimer();
    });
});
function updateTimer() {
    if (timeLeft > 0) {
        timeLeft--;
        TimerElement.textContent = `${timeLeft}s`;
    } else {
        clearInterval(timerInterval);
        handleTimeUp();
    }
}
function handleTimeUp() {
    
    Lives--;
    updateLivesDisplay();
    if (Lives > 0 && currentQuestionIndex < quizData.length - 1) {
        loadNextQuestion();
    } else if (Lives <= 0) {
        alert('Time is up!');
        const gameOver = document.querySelector('.gameOver');
        document.querySelector('.quizSelector').classList.add('hide');
        gameOver.classList.remove('hide');
        gameOver.classList.add('show');
        console.log("Game Over - Out of Lives");
    } else if (currentQuestionIndex === quizData.length - 1) {
        console.log("Quiz finished");
        // Handle end of quiz here
        // You might want to show a quiz completion screen
    }
    
    clearTimer();
}
function clearTimer() {
    clearInterval(timerInterval);
}
function updateLivesDisplay() {
    if (LivesElement) {
        LivesElement.textContent = `${Lives}/3`;
    }
    console.log('Current Lives:', Lives); 
}

function updateScoreDisplay() {
    if (scoreElement) {
        scoreElement.textContent = `${score}/100`;
    }
    if (ProgressElement) {
        ProgressElement.textContent = `${Progress}/10`;
        console.log(Progress);

    }}
// });


let currentQuestionIndex = 0;
let quizData = [];
let isSubmitting = false;
function handleSubmit(correctAnswer) {
    if (isSubmitting) return;
    isSubmitting = true;

    const selectedRadio = document.querySelector('input[name=answer]:checked');
    if (!selectedRadio) {
        alert('Please select an answer.');
        return;
    }

    const wrong_answer = document.querySelector('.wrongAnswer');
    const right_answer = document.querySelector('.rightAnswer');
    const quizSelector = document.querySelector('.quizSelector');
    const selectedAnswer = selectedRadio.value;

    if (selectedAnswer === correctAnswer) {
    //   updateScoreDisplay
      score+= 10;
    // updateProgressDisplay
      Progress++;
      updateScoreDisplay();

      showResult(right_answer, 'Correct answer.');
        console.log(score);
    } else {
        Lives--;
        updateLivesDisplay();
        if(Lives <= 0){
    const gameOver = document.querySelector('.gameOver');
            quizSelector.classList.add('hide');
            gameOver.classList.remove('hide');
            gameOver.classList.add('show');
            console.log("Game Over - Out of Lives");
            return;
        }
        showResult(wrong_answer, 'Wrong answer.');
    }

    quizSelector.classList.remove('show');
    quizSelector.classList.add('hide');
    isSubmitting = false;
    
}
function startTimer() {
    timeLeft = 60; // Reset timer for each question
    TimerElement.textContent = `${timeLeft}s`;
    timerInterval = setInterval(updateTimer, 1000);
}
function showResult(element) {
    element.classList.remove('hide');
    element.classList.add('show');
    // alert(message);
}
let submitListenerAdded = false;
function initQuiz() {
    const btnSubmit = document.querySelector('#btn_submit');
    if (!submitListenerAdded) {
        btnSubmit.addEventListener('click', function(e) {
            e.preventDefault();
            handleSubmit(quizData[currentQuestionIndex].correctAnswer);
        });
        submitListenerAdded = true;
    }
}

async function fetchQuizQuestions() {
    try {
        const url = 'https://the-trivia-api.com/api/questions?limit=10&difficulty=medium&categories=general_knowledge';
        const response = await fetch(url);
        quizData = await response.json();
        
        renderQuestion(quizData[currentQuestionIndex]);
        initQuiz();
        
        return quizData[currentQuestionIndex];
    } catch (error) {
        console.error("Error fetching quiz questions:", error);
    }
}

function renderQuestion(questionData) {
    const questionElement = document.querySelector(".questionFirst");
    const labelContainerParent = document.querySelector("#first_item");
    
    questionElement.textContent = questionData.question;
    labelContainerParent.innerHTML = '';
    
    const allAnswers = [questionData.correctAnswer, ...questionData.incorrectAnswers].sort(() => Math.random() - 0.5);
    // console.log(questionData.correctAnswer);
    
    allAnswers.forEach(answer => {
        const labelContainer = createAnswerElement(answer);
        labelContainerParent.appendChild(labelContainer);
    });
    startTimer();
}

function createAnswerElement(answer) {
    const labelContainer = document.createElement('div');
    labelContainer.className = 'questionlabel';

    const input = document.createElement('input');
    input.className = 'circle_border';
    input.type = 'radio';
    input.name = 'answer';
    input.value = answer;

    const label = document.createElement('label');
    label.append(input);
    label.append(answer);
    labelContainer.appendChild(label);

    return labelContainer;
}

function loadNextQuestion() {
    clearTimer();
    console.log("Next button clicked");
    const quizSelector = document.querySelector('.quizSelector');
    const wrongAnswer = document.querySelector('.wrongAnswer');
    const rightAnswer = document.querySelector('.rightAnswer');

    wrongAnswer.classList.add('hide');
    rightAnswer.classList.add('hide');

    quizSelector.classList.remove('hide');
    quizSelector.classList.add('show');


    currentQuestionIndex++;
    if (currentQuestionIndex < quizData.length) {
        renderQuestion(quizData[currentQuestionIndex]);
    } else if (currentQuestionIndex === quizData.length) {
      // Handle end of quiz
    quizSelector.classList.add('hide');

        console.log("Quiz finished");
        // Handle end of quiz here
    }
}

const nextQuestionBtn = document.querySelector('#next_question_btn');
nextQuestionBtn.addEventListener('click', loadNextQuestion);

function loadNextQuestionInCrt() {
    clearTimer();
    // updateLivesDisplay();
    
    if(Lives <= 0){
        const gameOver = document.querySelector('.gameOver');
        document.querySelector('.quizSelector').classList.add('hide');
        gameOver.classList.remove('hide');
        gameOver.classList.add('show');
        console.log("Game Over - Out of Lives");
        return;
    }
    console.log("Next In correct button clicked");
    const quizSelector = document.querySelector('.quizSelector');
    const wrongAnswer = document.querySelector('.wrongAnswer');
    const rightAnswer = document.querySelector('.rightAnswer');
    const gameOver = document.querySelector('.gameOver');

    wrongAnswer.classList.add('hide');
    rightAnswer.classList.add('hide');
    gameOver.classList.add('hide');

    quizSelector.classList.remove('hide');
    quizSelector.classList.add('show');

    currentQuestionIndex++;
   
    console.log('Lives', Lives);
    if (currentQuestionIndex < quizData.length) {
        renderQuestion(quizData[currentQuestionIndex]);
    }
     else if (currentQuestionIndex === quizData.length) {
      // Handle end of quiz
        console.log("Quiz finished");
        // Handle end of quiz here
    }
   
   
}
const nextQuestionBtnInCrt = document.querySelector('#next_question_btn_Incrt');
nextQuestionBtnInCrt.addEventListener('click', loadNextQuestionInCrt);

function loadGameAgain() {
    score = 0;
    Progress = 0;
    Lives = 3;
    timeLeft = 60;
    currentQuestionIndex = 0;
    isSubmitting = false;
    submitListenerAdded = false;

    updateScoreDisplay();
    updateLivesDisplay(); 

    const quizSelector = document.querySelector('.quizSelector');
    const wrongAnswer = document.querySelector('.wrongAnswer');
    const rightAnswer = document.querySelector('.rightAnswer');
    const gameOver = document.querySelector('.gameOver');
    wrongAnswer.classList.add('hide');
    rightAnswer.classList.add('hide');
    gameOver.classList.add('hide');

    quizSelector.classList.remove('hide');
    quizSelector.classList.add('show');

    renderQuestion(quizData[currentQuestionIndex]);
    initQuiz();
    console.log("Game restarted");
    // Handle restart of game here
}

const TryAgain = document.querySelector('#tryAgain');
TryAgain.addEventListener('click', loadGameAgain);

fetchQuizQuestions();