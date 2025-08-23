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
            
            const users = JSON.parse(localStorage.getItem('users')) || [];
            
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
                ID_Roles: userData.roleId || 3, // По умолчанию студент
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
        const users = JSON.parse(localStorage.getItem('users')) || [];
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

    async userExists(login) {
        const user = await this.findUserByLogin(login);
        return user !== null;
    }

    // Проверка прав доступа
    canCreateQuiz(user) {
        return user && (user.ID_Roles === 1 || user.ID_Roles === 2); // admin или teacher
    }

    // Методы для работы с тестами
    async createQuiz(quizData, userId) {
        try {
            const quizzes = JSON.parse(localStorage.getItem('quizzes')) || [];
            const newQuiz = {
                ID: Date.now(),
                Title: quizData.title,
                Description: quizData.description,
                ID_Creator: userId,
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
}

// Создаем глобальный экземпляр базы данных
const db = new Database();

