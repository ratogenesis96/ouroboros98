// В начале каждого скрипта
const currentUser = JSON.parse(localStorage.getItem('currentUser'));
if (!currentUser) {
    window.location.href = 'login.html';
    return;
}

// Для редактора - дополнительная проверка роли
if (!db.canCreateQuiz(currentUser)) {
    alert('Доступ запрещен');
    window.location.href = 'dashboard.html';
    return;
}

document.addEventListener('DOMContentLoaded', function() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const accessDenied = document.getElementById('accessDenied');
    const editorPanel = document.getElementById('editorPanel');
    const userInfo = document.getElementById('userInfo');
    const quizzesContainer = document.getElementById('quizzesContainer');

    // ПРОВЕРКА ПРАВ ДОСТУПА
    if (!currentUser || !db.canCreateQuiz(currentUser)) {
        accessDenied.classList.remove('hidden');
        return;
    }

    // ПОКАЗЫВАЕМ РЕДАКТОР
    editorPanel.classList.remove('hidden');
    userInfo.innerHTML = `Вы вошли как: <strong>${currentUser.Firstname} ${currentUser.Lastname}</strong>`;

    // ЗАГРУЗКА ТЕСТОВ
    loadQuizzes();

    // СОЗДАНИЕ НОВОГО ТЕСТА
    document.getElementById('createQuizForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const title = document.getElementById('quizTitle').value;
        const description = document.getElementById('quizDescription').value;

        try {
            const quizId = await db.createQuiz({
                title: title,
                description: description
            }, currentUser.ID);

            alert('Тест создан! Теперь добавьте вопросы.');
            // Переходим к редактированию теста
            window.location.href = `edit-quiz.html?id=${quizId}`;
        } catch (error) {
            alert('Ошибка создания теста: ' + error.message);
        }
    });

    // ФУНКЦИЯ ЗАГРУЗКИ ТЕСТОВ
    async function loadQuizzes() {
        const quizzes = await db.getQuizzes();
        const myQuizzes = quizzes.filter(q => q.ID_Creator === currentUser.ID);

        if (myQuizzes.length === 0) {
            quizzesContainer.innerHTML = '<p>У вас пока нет тестов</p>';
            return;
        }

        quizzesContainer.innerHTML = myQuizzes.map(quiz => `
            <div class="quiz-item">
                <h3>${quiz.Title}</h3>
                <p>${quiz.Description || 'Без описания'}</p>
                <p><small>Создан: ${new Date(quiz.Created_at).toLocaleDateString()}</small></p>
                <div class="quiz-actions">
                    <a href="edit-quiz.html?id=${quiz.ID}" class="btn">Редактировать</a>
                    <button onclick="deleteQuiz(${quiz.ID})" class="btn danger">Удалить</button>
                </div>
            </div>
        `).join('');
    }

    // УДАЛЕНИЕ ТЕСТА
    window.deleteQuiz = async function(quizId) {
        if (!confirm('Удалить этот тест?')) return;

        try {
            const quizzes = JSON.parse(localStorage.getItem('quizzes')) || [];
            const updatedQuizzes = quizzes.filter(q => q.ID !== quizId);
            localStorage.setItem('quizzes', JSON.stringify(updatedQuizzes));
            
            // Также удаляем вопросы и ответы
            const questions = JSON.parse(localStorage.getItem('questions')) || [];
            const questionIds = questions.filter(q => q.ID_Quiz === quizId).map(q => q.ID);
            const updatedQuestions = questions.filter(q => q.ID_Quiz !== quizId);
            localStorage.setItem('questions', JSON.stringify(updatedQuestions));

            const answers = JSON.parse(localStorage.getItem('answers')) || [];
            const updatedAnswers = answers.filter(a => !questionIds.includes(a.ID_Question));
            localStorage.setItem('answers', JSON.stringify(updatedAnswers));

            alert('Тест удален');
            loadQuizzes();
        } catch (error) {
            alert('Ошибка удаления теста');
        }
    };
});
