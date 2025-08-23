console.log('Скрипт редактора загружен');

document.addEventListener('DOMContentLoaded', function() {
    // Проверяем авторизацию
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const accessDenied = document.getElementById('accessDenied');
    const editorPanel = document.getElementById('editorPanel');
    const userName = document.getElementById('userName');
    const quizzesContainer = document.getElementById('quizzesContainer');
    const noQuizzesMessage = document.getElementById('noQuizzesMessage');

    // Если пользователь не авторизован
    if (!currentUser) {
        alert('Пожалуйста, войдите в систему');
        window.location.href = 'login.html';
        return;
    }

    // Показываем имя пользователя
    userName.textContent = `${currentUser.Firstname} ${currentUser.Lastname}`;

    // Проверяем права доступа
    if (!db.canCreateQuiz(currentUser)) {
        accessDenied.classList.remove('hidden');
        return;
    }

    // Показываем панель редактора
    editorPanel.classList.remove('hidden');

    // Загружаем викторины пользователя
    loadUserQuizzes();

    // Обработчик создания новой викторины
    document.getElementById('createQuizForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const title = document.getElementById('quizTitle').value.trim();
        const description = document.getElementById('quizDescription').value.trim();

        if (!title) {
            alert('Введите название викторины');
            return;
        }

        try {
            const quizId = await db.createQuiz({
                title: title,
                description: description
            }, currentUser.ID);

            alert(`Викторина "${title}" создана! ID: ${quizId}`);
            
            // Очищаем форму
            document.getElementById('quizTitle').value = '';
            document.getElementById('quizDescription').value = '';
            
            // Обновляем список викторин
            loadUserQuizzes();

        } catch (error) {
            alert('Ошибка при создании викторины: ' + error.message);
        }
    });

    // Обработчик выхода
    document.getElementById('logoutBtn').addEventListener('click', function() {
        localStorage.removeItem('currentUser');
        window.location.href = 'login.html';
    });

    // Функция загрузки викторин пользователя
    async function loadUserQuizzes() {
        try {
            const allQuizzes = await db.getQuizzes();
            const userQuizzes = allQuizzes.filter(quiz => quiz.ID_Creator === currentUser.ID);
            
            if (userQuizzes.length === 0) {
                noQuizzesMessage.style.display = 'block';
                quizzesContainer.innerHTML = '';
                return;
            }

            noQuizzesMessage.style.display = 'none';
            
            quizzesContainer.innerHTML = userQuizzes.map(quiz => `
                <div class="quiz-card">
                    <h3>${quiz.Title}</h3>
                    <p class="quiz-description">${quiz.Description || 'Без описания'}</p>
                    <div class="quiz-meta">
                        <span class="quiz-date">Создана: ${new Date(quiz.Created_at).toLocaleDateString()}</span>
                        <span class="quiz-status">${quiz.Is_active ? '✅ Активна' : '❌ Неактивна'}</span>
                    </div>
                    <div class="quiz-actions">
                        <button onclick="editQuiz(${quiz.ID})" class="btn">✏️ Редактировать</button>
                        <button onclick="toggleQuizStatus(${quiz.ID}, ${!quiz.Is_active})" class="btn ${quiz.Is_active ? 'secondary' : 'primary'}">
                            ${quiz.Is_active ? '❌ Деактивировать' : '✅ Активировать'}
                        </button>
                        <button onclick="deleteQuiz(${quiz.ID})" class="btn danger">🗑️ Удалить</button>
                    </div>
                </div>
            `).join('');

        } catch (error) {
            console.error('Ошибка загрузки викторин:', error);
            quizzesContainer.innerHTML = '<p>Ошибка загрузки викторин</p>';
        }
    }

    // Функция редактирования викторины
    window.editQuiz = function(quizId) {
        alert('Редактирование викторины ' + quizId + ' (эта функция в разработке)');
        // window.location.href = `edit-quiz.html?id=${quizId}`;
    };

    // Функция переключения статуса викторины
    window.toggleQuizStatus = async function(quizId, newStatus) {
        try {
            const quizzes = JSON.parse(localStorage.getItem('quizzes')) || [];
            const quizIndex = quizzes.findIndex(q => q.ID === quizId);
            
            if (quizIndex !== -1) {
                quizzes[quizIndex].Is_active = newStatus;
                localStorage.setItem('quizzes', JSON.stringify(quizzes));
                loadUserQuizzes();
                alert(`Викторина ${newStatus ? 'активирована' : 'деактивирована'}`);
            }
        } catch (error) {
            alert('Ошибка изменения статуса викторины');
        }
    };

    // Функция удаления викторины
    window.deleteQuiz = async function(quizId) {
        if (!confirm('Вы уверены, что хотите удалить эту викторину? Это действие нельзя отменить.')) {
            return;
        }

        try {
            const quizzes = JSON.parse(localStorage.getItem('quizzes')) || [];
            const updatedQuizzes = quizzes.filter(q => q.ID !== quizId);
            localStorage.setItem('quizzes', JSON.stringify(updatedQuizzes));
            
            loadUserQuizzes();
            alert('Викторина удалена');
        } catch (error) {
            alert('Ошибка удаления викторины');
        }
    };
});
