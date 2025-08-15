document.addEventListener('DOMContentLoaded', function() {
    // Элементы DOM
    const questionTextInput = document.getElementById('question-text');
    const answerInputsContainer = document.getElementById('answer-inputs');
    const addAnswerButton = document.getElementById('add-answer');
    const saveQuestionButton = document.getElementById('save-question');
    const clearFormButton = document.getElementById('clear-form');
    const questionsList = document.getElementById('questions-list');

    // Загрузка вопросов при старте
    loadQuestionsFromLocalStorage();
    renderQuestionsList();

    // Добавление поля для ответа
    addAnswerButton.addEventListener('click', addAnswerInput);

    // Сохранение вопроса
    saveQuestionButton.addEventListener('click', saveQuestion);

    // Очистка формы
    clearFormButton.addEventListener('click', clearForm);

    function addAnswerInput() {
        const answerId = Date.now();
        const answerDiv = document.createElement('div');
        answerDiv.className = 'answer-item';
        answerDiv.innerHTML = `
            <input type="text" class="form-control answer-text" placeholder="Текст ответа" required>
            <label class="correct-label">
                <input type="radio" name="correct-answer" class="answer-correct">
                Правильный
            </label>
            <button class="btn delete-answer">×</button>
        `;
        answerInputsContainer.appendChild(answerDiv);
        
        answerDiv.querySelector('.delete-answer').addEventListener('click', function() {
            answerDiv.remove();
        });
    }

    function saveQuestion() {
        const questionText = questionTextInput.value.trim();
        const answerElements = answerInputsContainer.querySelectorAll('.answer-item');
        
        // Валидация
        if (!questionText) {
            alert('Введите текст вопроса!');
            return;
        }
        
        if (answerElements.length < 2) {
            alert('Добавьте хотя бы 2 варианта ответа!');
            return;
        }
        
        const answers = [];
        let hasCorrectAnswer = false;
        
        answerElements.forEach(el => {
            const text = el.querySelector('.answer-text').value.trim();
            const correct = el.querySelector('.answer-correct').checked;
            
            if (!text) {
                alert('Все ответы должны содержать текст!');
                return;
            }
            
            if (correct) hasCorrectAnswer = true;
            
            answers.push({ text, correct });
        });
        
        if (!hasCorrectAnswer) {
            alert('Укажите правильный ответ!');
            return;
        }
        
        // Добавление нового вопроса
        questions.push({
            question: questionText,
            answers: answers
        });
        
        // Сохранение и обновление
        saveQuestionsToLocalStorage();
        renderQuestionsList();
        clearForm();
        
        alert('Вопрос успешно сохранен!');
    }

    function clearForm() {
        questionTextInput.value = '';
        answerInputsContainer.innerHTML = '';
    }

    function renderQuestionsList() {
        questionsList.innerHTML = '';
        
        if (questions.length === 0) {
            questionsList.innerHTML = '<p>Пока нет сохраненных вопросов</p>';
            return;
        }
        
        questions.forEach((question, index) => {
            const questionItem = document.createElement('div');
            questionItem.className = 'question-item';
            questionItem.innerHTML = `
                <div class="question-header">
                    <span class="question-number">${index + 1}.</span>
                    <span class="question-text">${question.question}</span>
                </div>
                <div class="question-answers">
                    ${question.answers.map((answer, i) => `
                        <div class="answer ${answer.correct ? 'correct-answer' : ''}">
                            ${i + 1}. ${answer.text}
                        </div>
                    `).join('')}
                </div>
                <div class="question-actions">
                    <button class="btn edit-btn" data-index="${index}">Редактировать</button>
                    <button class="btn delete-btn" data-index="${index}">Удалить</button>
                </div>
            `;
            
            questionsList.appendChild(questionItem);
            
            // Обработчики для кнопок
            questionItem.querySelector('.delete-btn').addEventListener('click', () => deleteQuestion(index));
            questionItem.querySelector('.edit-btn').addEventListener('click', () => editQuestion(index));
        });
    }

    function deleteQuestion(index) {
        if (confirm('Удалить этот вопрос?')) {
            questions.splice(index, 1);
            saveQuestionsToLocalStorage();
            renderQuestionsList();
        }
    }

    function editQuestion(index) {
        const question = questions[index];
        
        // Заполняем форму
        questionTextInput.value = question.question;
        answerInputsContainer.innerHTML = '';
        
        question.answers.forEach(answer => {
            addAnswerInput();
            const lastAnswer = answerInputsContainer.lastChild;
            lastAnswer.querySelector('.answer-text').value = answer.text;
            lastAnswer.querySelector('.answer-correct').checked = answer.correct;
        });
        
        // Удаляем старый вопрос при сохранении
        saveQuestionButton.onclick = function() {
            questions.splice(index, 1);
            saveQuestion();
            saveQuestionButton.onclick = saveQuestion; // Возвращаем оригинальный обработчик
        };
        
        // Прокрутка к форме
        questionTextInput.focus();
    }

    function saveQuestionsToLocalStorage() {
        localStorage.setItem('quiz-questions', JSON.stringify(questions));
    }

    function loadQuestionsFromLocalStorage() {
        const savedQuestions = localStorage.getItem('quiz-questions');
        if (savedQuestions) {
            questions = JSON.parse(savedQuestions);
        } else {
            questions = [];
        }
    }
});
