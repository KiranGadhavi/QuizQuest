// Function to fetch quiz questions from the Trivia API
async function fetchQuizQuestions() {
    const url = 'https://the-trivia-api.com/api/questions?limit=10&difficulty=medium&categories=general_knowledge';
    try{

    const response = await fetch(url);
    const data = await response.json();
    // console.log('data',data) 

      const questionElement = document.querySelector(".questionFirst");
      const labelContainerParent = document.querySelector("#first_item");
      //Getting data from json
      const firstQuestion = data[0].question
      const InCorectQuestion = data[0].incorrectAnswers
      const CorectAns = data[0].correctAnswer
      // console.log('incorrect', InCorectQuestion);
      
      if (questionElement) {
        console.log ( questionElement.textContent = firstQuestion)
      } // Clear previous answers if any
      
      labelContainerParent.innerHTML = '';
      const btnSubmit = document.querySelector('#btn_submit');

     
      // Combine correct and incorrect answers and shuffle them
      const allAnswers = [CorectAns, ...InCorectQuestion].sort(() => Math.random() - 0.5);
      
      allAnswers.forEach(answer => {
        const labelContainer = document.createElement('div');
        labelContainer.className = 'questionlabel';
        labelContainerParent.appendChild(labelContainer);

        const input = document.createElement('input');
        input.className = 'circle_border';
        input.type = 'radio';
        input.name = 'answer';
        input.value = answer;

        const label = document.createElement('label');
        label.append(input);
        label.append(answer);
        labelContainer.appendChild(label);

    });
    
    btnSubmit.addEventListener('click', function(e){
      e.preventDefault();
      // console.log(allAnswers[0]);
               
      const selectedRadio = document.querySelector('input[name=answer]:checked');
      if (!selectedRadio) {
          alert('Please select an answer.');
          return;
      }

      const selectedAnswer = selectedRadio.value;
      // Check if selected answer is correct
      if (selectedAnswer === CorectAns) {
          pass();
          alert('pass answer.');

      } else {
        fail()
        alert('fail answer.');

      }
        console.log(CorectAns);
      })
      const wrong_answer = document.querySelector('.wrongAnswer');
      const right_answer = document.querySelector('.rightAnswer');
      const quizSelector = document.querySelector('.quizSelector');

      function pass(){

  if (right_answer) {
  right_answer.classList.remove('hide');
  right_answer.classList.add('show');
  }
  if (quizSelector) {

  quizSelector.classList.remove('show');
  quizSelector.classList.add('hide');
  }
}

function fail() {
  if (wrong_answer) {
  wrong_answer.classList.remove('hide');
    wrong_answer.classList.add('show');
  }
  if (quizSelector) {
    quizSelector.classList.remove('show');
    quizSelector.classList.add('hide');
  }
}
    
    return data;

} 
catch (error) {
        console.error("Error fetching quiz questions:", error);
    }
}
fetchQuizQuestions()
// console.log('Hi');
