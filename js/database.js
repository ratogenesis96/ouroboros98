console.log('Скрипт database.js загружен');

class Database {
    constructor() {
        this.initializeData();
        console.log('База данных инициализирована (LocalStorage)');
    }

    initializeData() {
        // Инициализация ролей
        if (!localStorage.getItem('roles')) {
            const roles = [
                { ID: 1, Name: 'admin' },
                { ID: 2, Name: 'teacher' },
                { ID: 3, Name: 'student' }
            ];
            localStorage.setItem('roles', JSON.stringify(roles));
            console.log('Роли инициализированы');
        }

        // Инициализация пользователей
        if (!localStorage.getItem('users')) {
            localStorage.setItem('users', JSON.stringify([]));
            console.log('Пользователи инициализированы');
        }

        // Инициализация других таблиц
        const tables = ['classgroups', 'quizzes', 'questions', 'answers', 'results'];
        tables.forEach(table => {
            if (!localStorage.getItem(table)) {
                localStorage.setItem(table, JSON.stringify([]));
            }
        });
    }

    async registerUser(userData) {
        try {
            console.log('Регистрация пользователя:', userData.login);
            
            const users = JSON.parse(localStorage.getItem('users'));
            
            // Проверка существования пользователя
            if (users.some(user => user.Login === userData.login)) {
                throw new Error('Пользователь с таким логином уже существует');
            }

            const newUser = {
                ID: Date.now(),
                Firstname: userData.firstname,
                Lastname: userData.lastname,
                Login: userData.login,
                Password_hash: userData.passwordHash,
                Salt: userData.salt,
                ID_Roles: 3, // По умолчанию студент
                Created_at: new Date().toISOString()
            };
            
            users.push(newUser);
            localStorage.setItem('users', JSON.stringify(users));
            
            console.log('Пользователь успешно зарегистрирован:', newUser.Login);
            return true;
            
        } catch (error) {
            console.error('Ошибка регистрации:', error);
            throw error;
        }
    }

    async findUserByLogin(login) {
        try {
            const users = JSON.parse(localStorage.getItem('users'));
            const user = users.find(u => u.Login === login);
            return user || null;
        } catch (error) {
            console.error('Ошибка поиска пользователя:', error);
            return null;
        }
    }

    async userExists(login) {
        const user = await this.findUserByLogin(login);
        return user !== null;
    }

    // Дополнительные методы для других операций
    async addQuiz(quizData) {
        const quizzes = JSON.parse(localStorage.getItem('quizzes'));
        const newQuiz = {
            ID: Date.now(),
            ...quizData,
            Created_at: new Date().toISOString()
        };
        quizzes.push(newQuiz);
        localStorage.setItem('quizzes', JSON.stringify(quizzes));
        return newQuiz.ID;
    }

    async getQuizzes() {
        return JSON.parse(localStorage.getItem('quizzes'));
    }

    class Database {
    // ... существующие методы ...

    // СОЗДАНИЕ ТЕСТА
    async createQuiz(quizData, userId) {
        try {
            const quizzes = JSON.parse(localStorage.getItem('quizzes')) || [];
            const newQuiz = {
                ID: Date.now(),
                Title: quizData.title,
                Description: quizData.description,
                ID_Creator: userId,
                ID_Classgroup: quizData.classgroupId || null,
                Created_at: new Date().toISOString(),
                Is_active: true
            };
            
            quizzes.push(newQuiz);
            localStorage.setItem('quizzes', JSON.stringify(quizzes));
            return newQuiz.ID;
        } catch (error) {
            console.error('Ошибка создания теста:', error);
            throw error;
        }
    }

    // ДОБАВЛЕНИЕ ВОПРОСА
    async addQuestion(questionData, quizId) {
        try {
            const questions = JSON.parse(localStorage.getItem('questions')) || [];
            const newQuestion = {
                ID: Date.now(),
                ID_Quiz: quizId,
                Question_text: questionData.text,
                Question_type: questionData.type,
                Points: questionData.points || 1
            };
            
            questions.push(newQuestion);
            localStorage.setItem('questions', JSON.stringify(questions));
            return newQuestion.ID;
        } catch (error) {
            console.error('Ошибка добавления вопроса:', error);
            throw error;
        }
    }

    // ДОБАВЛЕНИЕ ОТВЕТА
    async addAnswer(answerData, questionId) {
        try {
            const answers = JSON.parse(localStorage.getItem('answers')) || [];
            const newAnswer = {
                ID: Date.now(),
                ID_Question: questionId,
                Answer_text: answerData.text,
                Is_correct: answerData.isCorrect ? 1 : 0
            };
            
            answers.push(newAnswer);
            localStorage.setItem('answers', JSON.stringify(answers));
            return newAnswer.ID;
        } catch (error) {
            console.error('Ошибка добавления ответа:', error);
            throw error;
        }
    }

    // ПОЛУЧЕНИЕ ТЕСТОВ
    async getQuizzes() {
        try {
            const quizzes = JSON.parse(localStorage.getItem('quizzes')) || [];
            const users = JSON.parse(localStorage.getItem('users')) || [];
            
            // Добавляем информацию о создателе
            return quizzes.map(quiz => {
                const creator = users.find(u => u.ID === quiz.ID_Creator);
                return {
                    ...quiz,
                    Creator_name: creator ? `${creator.Firstname} ${creator.Lastname}` : 'Неизвестно'
                };
            });
        } catch (error) {
            console.error('Ошибка получения тестов:', error);
            return [];
        }
    }

    // ПОЛУЧЕНИЕ ВОПРОСОВ ТЕСТА
    async getQuizQuestions(quizId) {
        try {
            const questions = JSON.parse(localStorage.getItem('questions')) || [];
            const answers = JSON.parse(localStorage.getItem('answers')) || [];
            
            return questions
                .filter(q => q.ID_Quiz === quizId)
                .map(question => ({
                    ...question,
                    Answers: answers.filter(a => a.ID_Question === question.ID)
                }));
        } catch (error) {
            console.error('Ошибка получения вопросов:', error);
            return [];
        }
    }

    // ПРОВЕРКА ПРАВ ДОСТУПА
    canCreateQuiz(user) {
        return user && (user.ID_Roles === 1 || user.ID_Roles === 2); // admin или teacher
    }
}
}

// Создаем глобальный экземпляр базы данных
const db = new Database();

