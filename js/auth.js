
console.log('Скрипт auth.js загружен');

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM полностью загружен');
    
    const registerForm = document.getElementById('registerForm');
    const loginForm = document.getElementById('loginForm');
    const messageDiv = document.getElementById('message');

    // Обработка регистрации
    if (registerForm) {
        console.log('Форма регистрации найдена');
        registerForm.addEventListener('submit', handleRegister);
    }

    // Обработка входа
    if (loginForm) {
        console.log('Форма входа найдена');
        loginForm.addEventListener('submit', handleLogin);
    }

    async function handleRegister(e) {
        e.preventDefault();
        console.log('Отправка формы регистрации');
        
        const firstname = document.getElementById('firstname').value;
        const lastname = document.getElementById('lastname').value;
        const login = document.getElementById('login').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        // Валидация
        if (password !== confirmPassword) {
            showMessage('Пароли не совпадают', 'error');
            return;
        }

        if (password.length < 6) {
            showMessage('Пароль должен содержать минимум 6 символов', 'error');
            return;
        }

        try {
            const { hash: passwordHash, salt } = await doubleHashPassword(password);
            
            const success = await db.registerUser({
                firstname,
                lastname,
                login,
                passwordHash,
                salt
            });

            if (success) {
                showMessage('Регистрация успешна! Перенаправление...', 'success');
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 2000);
            }
        } catch (error) {
            console.error('Ошибка регистрации:', error);
            showMessage(error.message, 'error');
        }
    }

    async function handleLogin(e) {
        e.preventDefault();
        console.log('Отправка формы входа');
        
        const login = document.getElementById('login').value;
        const password = document.getElementById('password').value;

        try {
            const user = await db.findUserByLogin(login);
            
            if (!user) {
                showMessage('Пользователь не найден', 'error');
                return;
            }

            const isValid = await verifyPassword(password, user.Password_hash, user.Salt);
            
            if (isValid) {
                showMessage('Вход успешен!', 'success');
                // Сохраняем пользователя в сессии
                localStorage.setItem('currentUser', JSON.stringify(user));
                
                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 1000);
            } else {
                showMessage('Неверный пароль', 'error');
            }
        } catch (error) {
            console.error('Ошибка входа:', error);
            showMessage('Ошибка при входе', 'error');
        }
    }

    function showMessage(text, type) {
        if (messageDiv) {
            messageDiv.textContent = text;
            messageDiv.className = type;
            console.log('Сообщение:', text);
        }
    }
});


