document.addEventListener('DOMContentLoaded', function() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const urlParams = new URLSearchParams(window.location.search);
    const quizId = urlParams.get('id');

    if (quizId) {
        startQuiz(quizId);
    } else {
        showQuizzesList();
    }

    async function showQuizzesList() {
        const quizzes = await db.getQuizzes();
        const activeQuizzes = quizzes.filter(q => q.Is_active);
        
        document.getElementById('quizzesContainer').innerHTML = activeQuizzes.map(quiz => `
            <div class="quiz-item">
                <h3>${quiz.Title}</h3>
                <p>${quiz.Description || ''}</p>
                <p><small>Автор: ${quiz.Creator_name}</small></p>
                <a href="quiz.html?id=${quiz.ID}" class="btn">Начать тест</a>
            </div>
        `).join('');
    }

    async function startQuiz(quizId) {
        const quiz = (await db.getQuizzes()).find(q => q.ID == quizId);
        const questions = await db.getQuizQuestions(quizId);

        document.getElementById('quizzesList').classList.add('hidden');
        document.getElementById('quizContainer').classList.remove('hidden');
        
        document.getElementById('quizTitle').textContent = quiz.Title;
        document.getElementById('quizDescription').textContent = quiz.Description || '';

        const questionsContainer = document.getElementById('questionsContainer');
        questionsContainer.innerHTML = questions.map((q, index) => `
            <div class="question">
                <h3>Вопрос ${index + 1}: ${q.Question_text}</h3>
                ${q.Answers.map((a, aIndex) => `
                    <label class="answer-option">
                        <input type="radio" name="question_${q.ID}" value="${a.ID}">
                        ${a.Answer_text}
                    </label>
                `).join('')}
            </div>
        `).join('');

        document.getElementById('quizForm').addEventListener('submit', function(e) {
            e.preventDefault();
            calculateResults(questions);
        });
    }

    function calculateResults(questions) {
        let score = 0;
        const results = [];

        questions.forEach(question => {
            const selectedAnswer = document.querySelector(`input[name="question_${question.ID}"]:checked`);
            const isCorrect = selectedAnswer && question.Answers.find(a => a.ID == selectedAnswer.value)?.Is_correct;
            
            if (isCorrect) score += question.Points;
            
            results.push({
                question: question.Question_text,
                selected: selectedAnswer ? question.Answers.find(a => a.ID == selectedAnswer.value).Answer_text : 'Не ответил',
                correct: question.Answers.find(a => a.Is_correct).Answer_text,
                isCorrect: !!isCorrect
            });
        });

        showResults(score, questions.reduce((sum, q) => sum + q.Points, 0), results);
    }

    function showResults(score, maxScore, results) {
        document.getElementById('quizContainer').classList.add('hidden');
        document.getElementById('resultsContainer').classList.remove('hidden');
        
        document.getElementById('score').textContent = score;
        document.getElementById('maxScore').textContent = maxScore;

        // Здесь можно сохранить результаты в базу
    }
});
