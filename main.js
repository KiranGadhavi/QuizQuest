// document.addEventListener('DOMContentLoaded', function() {
    // Your initialization code here
let scoreElement = document.querySelector('#current-score') ;
let score = 0;
let ProgressElement = document.querySelector('#Progress') ;
let Progress = 0;
function updateScoreDisplay() {
    if (scoreElement) {
        scoreElement.textContent = `${score}/100`;
    }
    else if (ProgressElement) {
        ProgressElement.textContent = `${Progress}/10`;
    }}
// });


let currentQuestionIndex = 0;
let quizData = [];

function handleSubmit(correctAnswer) {
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
        updateScoreDisplay();

      score+= 10;
    //   scoreElement.textContent = `${score}/100`;

      Progress++;
        // ProgressElement.textContent = `${Progress}/10`;
        showResult(right_answer, 'Correct answer.');
        console.log(score);
    } else {
        showResult(wrong_answer, 'Wrong answer.');
    }

    quizSelector.classList.remove('show');
    quizSelector.classList.add('hide');
}

function showResult(element, message) {
    element.classList.remove('hide');
    element.classList.add('show');
    alert(message);
}

function initQuiz() {
    const btnSubmit = document.querySelector('#btn_submit');
    btnSubmit.addEventListener('click', function(e) {
        e.preventDefault();
        handleSubmit(quizData[currentQuestionIndex].correctAnswer);
    });
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
    console.log(questionData.correctAnswer);
    
    allAnswers.forEach(answer => {
        const labelContainer = createAnswerElement(answer);
        labelContainerParent.appendChild(labelContainer);
    });
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
    console.log("Next button clicked");
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
    if (currentQuestionIndex < quizData.length) {
        renderQuestion(quizData[currentQuestionIndex]);
    } else if (currentQuestionIndex === quizData.length) {
      // Handle end of quiz
    quizSelector.classList.add('hide');
    gameOver.classList.remove('hide');
    gameOver.classList.add('show');


        console.log("Quiz finished");
        // Handle end of quiz here
    }
}

const nextQuestionBtn = document.querySelector('#next_question_btn');
nextQuestionBtn.addEventListener('click', loadNextQuestion);

fetchQuizQuestions();