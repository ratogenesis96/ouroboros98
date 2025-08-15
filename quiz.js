const startButton = document.getElementById('start-btn');
const nextButton = document.getElementById('next-btn');
const questionContainerElement = document.getElementById('question-container');
const questionElement = document.getElementById('question');
const answerButtonsElement = document.getElementById('answer-buttons');
const resultsElement = document.getElementById('results');
const adminButton = document.getElementById('admin-btn');
const adminPanel = document.getElementById('admin-panel');
const questionTextInput = document.getElementById('question-text');
const answerInputsContainer = document.getElementById('answer-inputs');
const addAnswerButton = document.getElementById('add-answer');
const saveQuestionButton = document.getElementById('save-question');
const cancelEditButton = document.getElementById('cancel-edit');
const questionsList = document.getElementById('questions-list');

let shuffledQuestions, currentQuestionIndex;
let score = 0;

startButton.addEventListener('click', startGame);
nextButton.addEventListener('click', () => {
    currentQuestionIndex++;
    setNextQuestion();
});

function startGame() {
    startButton.classList.add('hide');
    shuffledQuestions = questions.sort(() => Math.random() - 0.5);
    currentQuestionIndex = 0;
    questionContainerElement.classList.remove('hide');
    setNextQuestion();
    score = 0;
}

function setNextQuestion() {
    resetState();
    showQuestion(shuffledQuestions[currentQuestionIndex]);
}

function showQuestion(question) {
    questionElement.innerText = question.question;
    question.answers.forEach(answer => {
        const button = document.createElement('button');
        button.innerText = answer.text;
        button.classList.add('btn');
        if (answer.correct) {
            button.dataset.correct = answer.correct;
        }
        button.addEventListener('click', selectAnswer);
        answerButtonsElement.appendChild(button);
    });
}

function resetState() {
    nextButton.classList.add('hide');
    while (answerButtonsElement.firstChild) {
        answerButtonsElement.removeChild(answerButtonsElement.firstChild);
    }
}

function selectAnswer(e) {
    const selectedButton = e.target;
    const correct = selectedButton.dataset.correct;
    
    Array.from(answerButtonsElement.children).forEach(button => {
        setStatusClass(button, button.dataset.correct);
    });
    
    if (correct) {
        score++;
    }
    
    if (shuffledQuestions.length > currentQuestionIndex + 1) {
        nextButton.classList.remove('hide');
    } else {
        showResults();
    }
}

function setStatusClass(element, correct) {
    clearStatusClass(element);
    if (correct) {
        element.classList.add('correct');
    } else {
        element.classList.add('wrong');
    }
}

function clearStatusClass(element) {
    element.classList.remove('correct');
    element.classList.remove('wrong');
}

function showResults() {
    questionContainerElement.classList.add('hide');
    resultsElement.classList.remove('hide');
    resultsElement.innerHTML = `
        <h2>Тест завершен!</h2>
        <p>Ваш результат: ${score} из ${questions.length}</p>
        <button onclick="location.reload()" class="btn">Пройти снова</button>
    `;
}

adminButton.addEventListener('click', toggleAdminPanel);
addAnswerButton.addEventListener('click', addAnswerInput);
saveQuestionButton.addEventListener('click', saveQuestion);
cancelEditButton.addEventListener('click', toggleAdminPanel);

function toggleAdminPanel() {
    adminPanel.classList.toggle('hide');
    if (!adminPanel.classList.contains('hide')) {
        renderQuestionsList();
    }
}

// Функция добавления поля для ответа
function addAnswerInput() {
    const answerId = Date.now();
    const answerDiv = document.createElement('div');
    answerDiv.className = 'answer-item';
    answerDiv.innerHTML = `
        <input type="text" class="form-control answer-text" placeholder="Текст ответа">
        <input type="checkbox" class="answer-correct" id="correct-${answerId}">
        <label for="correct-${answerId}">Правильный</label>
        <button class="btn delete-answer">×</button>
    `;
    answerInputsContainer.appendChild(answerDiv);
    
    // Добавляем обработчик удаления ответа
    answerDiv.querySelector('.delete-answer').addEventListener('click', function() {
        answerInputsContainer.removeChild(answerDiv);
    });
}

// Функция сохранения вопроса
function saveQuestion() {
    const questionText = questionTextInput.value.trim();
    const answerElements = answerInputsContainer.querySelectorAll('.answer-item');
    
    if (!questionText || answerElements.length === 0) {
        alert('Заполните вопрос и добавьте хотя бы один ответ!');
        return;
    }
    
    const answers = [];
    answerElements.forEach(el => {
        const text = el.querySelector('.answer-text').value.trim();
        const correct = el.querySelector('.answer-correct').checked;
        if (text) {
            answers.push({ text, correct });
        }
    });
    
    if (answers.length === 0) {
        alert('Добавьте хотя бы один ответ!');
        return;
    }
    
    // Проверяем, что есть хотя бы один правильный ответ
    if (!answers.some(answer => answer.correct)) {
        alert('Укажите хотя бы один правильный ответ!');
        return;
    }
    
    // Добавляем новый вопрос
    const newQuestion = {
        question: questionText,
        answers: answers
    };
    
    questions.push(newQuestion);
    
    // Очищаем форму
    questionTextInput.value = '';
    answerInputsContainer.innerHTML = '';
    
    // Обновляем список вопросов
    renderQuestionsList();
    
    // Сохраняем в localStorage
    saveQuestionsToLocalStorage();
    
    alert('Вопрос сохранен!');
}

// Функция отображения списка вопросов
function renderQuestionsList() {
    questionsList.innerHTML = '';
    questions.forEach((question, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span>${index + 1}. ${question.question}</span>
            <span class="delete-question" data-index="${index}">Удалить</span>
        `;
        questionsList.appendChild(li);
    });
    
    // Добавляем обработчики удаления вопросов
    document.querySelectorAll('.delete-question').forEach(btn => {
        btn.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'));
            deleteQuestion(index);
        });
    });
}

// Функция удаления вопроса
function deleteQuestion(index) {
    if (confirm('Вы уверены, что хотите удалить этот вопрос?')) {
        questions.splice(index, 1);
        renderQuestionsList();
        saveQuestionsToLocalStorage();
    }
}

// Сохранение вопросов в localStorage
function saveQuestionsToLocalStorage() {
    localStorage.setItem('quiz-questions', JSON.stringify(questions));
}

// Загрузка вопросов из localStorage при загрузке страницы
function loadQuestionsFromLocalStorage() {
    const savedQuestions = localStorage.getItem('quiz-questions');
    if (savedQuestions) {
        questions = JSON.parse(savedQuestions);
    }
}

// Вызываем функцию загрузки при старте
document.addEventListener('DOMContentLoaded', loadQuestionsFromLocalStorage);
