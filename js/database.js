console.log('Скрипт database.js загружен');

class Database {
    constructor() {
        this.initializeData();
        console.log('База данных инициализирована');
    }

    initializeData() {
        // Инициализация данных только если их нет
        if (!localStorage.getItem('roles')) {
            localStorage.setItem('roles', JSON.stringify([
                { ID: 1, Name: 'admin' },
                { ID: 2, Name: 'teacher' },
                { ID: 3, Name: 'student' }
            ]));
            console.log('Роли инициализированы');
        }

        if (!localStorage.getItem('users')) {
            localStorage.setItem('users', JSON.stringify([]));
            console.log('Пользователи инициализированы');
        }
    }

    async registerUser(userData) {
        try {
            const users = JSON.parse(localStorage.getItem('users'));
            const newUser = {
                ID: Date.now(),
                ...userData,
                Created_at: new Date().toISOString(),
                ID_Roles: 3 // По умолчанию студент
            };
            
            users.push(newUser);
            localStorage.setItem('users', JSON.stringify(users));
            console.log('Пользователь зарегистрирован:', newUser.Login);
            return true;
        } catch (error) {
            console.error('Ошибка регистрации:', error);
            return false;
        }
    }

    async findUserByLogin(login) {
        try {
            const users = JSON.parse(localStorage.getItem('users'));
            const user = users.find(u => u.Login === login);
            console.log('Найден пользователь:', user ? user.Login : 'не найден');
            return user;
        } catch (error) {
            console.error('Ошибка поиска пользователя:', error);
            return null;
        }
    }

    async userExists(login) {
        const user = await this.findUserByLogin(login);
        return user !== null;
    }
}

// Создаем глобальный экземпляр базы данных
const db = new Database();
