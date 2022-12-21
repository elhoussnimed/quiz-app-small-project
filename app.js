const quiz = document.querySelector(".container");
const questionContainer = document.querySelector(".question");
const responsesContainer = document.querySelector(".responses");
const submitBtn = document.querySelector(".submit");
const reloadBtn = document.querySelector(".reload");
const result = document.querySelector(".result");

let fetchedQuestions;
let currentQuestion = 0;
let correctAnswers = 0;

function fetchQuestionsFromJsonFile() {
  fetch("quiz-data.json")
    .then((response) => response.json())
    .then((questions) => {
      fetchedQuestions = questions;
      appendDataToDom();
    });
}
fetchQuestionsFromJsonFile();

submitBtn.addEventListener("click", () => {
  getCheckedInput();
  checkiFUserChooseResponse();
});

function appendDataToDom() {
  const question = fetchedQuestions[currentQuestion].question;
  const responses = fetchedQuestions[currentQuestion].responses;
  questionContainer.innerHTML = "";
  responsesContainer.innerHTML = "";

  questionContainer.innerHTML = question;
  responses.forEach((res, index) => {
    const response = `
        <div class="response">
            <input type="radio" data-name="${res.data}" data-answer="${res.isCorrect}" name="response" id="response-${index}">
            <label for="response-${index}">${res.data}</label>
        </div>
        `;
    responsesContainer.innerHTML += response;
  });
}

function getNextQuestion() {
  if (currentQuestion < fetchedQuestions.length - 1) {
    currentQuestion++;
  } else if (currentQuestion >= fetchedQuestions.length - 1) {
    showResultAndRestartQuiz();
    currentQuestion = 0;
  }
  appendDataToDom();
}

function showResultAndRestartQuiz() {
  const inputs = [...responsesContainer.querySelectorAll("input")];
  const score = document.querySelector(".score");
  // show result
  quiz.style.display = "none";
  result.style.display = "block";
  score.innerHTML = `${correctAnswers}/${fetchedQuestions.length}`;
  // restart quiz
  reloadBtn.addEventListener("click", () => {
    location.reload();
  });
}

function getCheckedInput() {
  const inputs = [...responsesContainer.querySelectorAll("input")];
  let checkedInput;
  let inputAnswer;

  inputs.forEach((input) => {
    if (input.checked) {
      checkedInput = input;
      inputAnswer = input.dataset.answer;
      // check if the response is true
      if (inputAnswer === "true") {
        correctAnswers++;
      }
    }
  });
}

function checkiFUserChooseResponse() {
  const inputs = [...responsesContainer.querySelectorAll("input")];
  const isAllInputsChecked = inputs.some((input) => input.checked);
  if (isAllInputsChecked) {
    getNextQuestion();
  } else {
    chooseAnswer();
  }
}

function chooseAnswer() {
  const warningMsg = document.querySelector(".chooseanswer");
  warningMsg.style.display = "block";
  setTimeout(() => {
    warningMsg.style.display = "none";
  }, 1500);
}
