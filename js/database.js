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
}

// Создаем глобальный экземпляр базы данных
const db = new Database();
