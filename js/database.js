console.log('Скрипт database.js загружен');

class Database {
    constructor() {
        this.initializeData();
        console.log('База данных инициализирована (LocalStorage)');
    }

    initializeData() {
        if (!localStorage.getItem('roles')) {
            const roles = [
                { ID: 1, Name: 'admin' },
                { ID: 2, Name: 'teacher' },
                { ID: 3, Name: 'student' }
            ];
            localStorage.setItem('roles', JSON.stringify(roles));
            console.log('Роли инициализированы');
        }

        if (!localStorage.getItem('users')) {
            localStorage.setItem('users', JSON.stringify([]));
            console.log('Пользователи инициализированы');
        }

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
            
            const usersJson = localStorage.getItem('users');
            const users = usersJson ? JSON.parse(usersJson) : [];
            
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
                ID_Roles: userData.roleId || 3,
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
            const usersJson = localStorage.getItem('users');
            const users = usersJson ? JSON.parse(usersJson) : [];
            const user = users.find(u => u.Login === login);
            return user || null;
        } catch (error) {
            console.error('Ошибка поиска пользователя:', error);
            return null;
        }
    }  // ← ЗАКРЫВАЮЩАЯ СКОБКА ДОБАВЛЕНА!

    async userExists(login) {
        try {
            const user = await this.findUserByLogin(login);
            return user !== null;
        } catch (error) {
            console.error('Ошибка проверки пользователя:', error);
            return false;
        }
    }

    canCreateQuiz(user) {
        return user && (user.ID_Roles === 1 || user.ID_Roles === 2);
    }

    async createQuiz(quizData, userId) {
        try {
            const quizzesJson = localStorage.getItem('quizzes');
            const quizzes = quizzesJson ? JSON.parse(quizzesJson) : [];
            
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
            const quizzesJson = localStorage.getItem('quizzes');
            const quizzes = quizzesJson ? JSON.parse(quizzesJson) : [];
            
            const usersJson = localStorage.getItem('users');
            const users = usersJson ? JSON.parse(usersJson) : [];
            
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

const db = new Database();
