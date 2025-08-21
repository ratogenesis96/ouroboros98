console.log('Скрипт auth.js загружен');

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM полностью загружен');
    
    // Обработка регистрации
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        console.log('Найдена форма регистрации');
        
        registerForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            console.log('Отправка формы регистрации');
            
            const firstname = document.getElementById('firstname').value;
            const lastname = document.getElementById('lastname').value;
            const login = document.getElementById('login').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;

            console.log('Данные формы:', { firstname, lastname, login });

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
                // Хэширование пароля
                const { hash: passwordHash, salt } = await doubleHashPassword(password);
                console.log('Пароль захэширован');
                
                // Сохранение пользователя
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
                } else {
                    showMessage('Ошибка при регистрации', 'error');
                }
            } catch (error) {
                console.error('Ошибка регистрации:', error);
                showMessage('Ошибка при регистрации: ' + error.message, 'error');
            }
        });
    }

    // Обработка входа
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        console.log('Найдена форма входа');
        
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            console.log('Отправка формы входа');
            
            const login = document.getElementById('login').value;
            const password = document.getElementById('password').value;

            console.log('Попытка входа для пользователя:', login);

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
        });
    }

    function showMessage(text, type) {
        const messageDiv = document.getElementById('message');
        if (messageDiv) {
            messageDiv.textContent = text;
            messageDiv.className = type;
            console.log('Сообщение:', text, 'Тип:', type);
        }
    }
});
