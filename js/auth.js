console.log('Скрипт auth.js загружен');

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM полностью загружен');
    
    const registerForm = document.getElementById('registerForm');
    const messageDiv = document.getElementById('message');

    if (registerForm) {
        console.log('Форма регистрации найдена');
        
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
                    showMessage('Регистрация успешна! Перенаправление на страницу входа...', 'success');
                    setTimeout(() => {
                        window.location.href = 'login.html';
                    }, 2000);
                }
            } catch (error) {
                console.error('Ошибка регистрации:', error);
                showMessage(error.message || 'Ошибка при регистрации', 'error');
            }
        });
    }

    function showMessage(text, type) {
        if (messageDiv) {
            messageDiv.textContent = text;
            messageDiv.className = type;
            console.log('Сообщение:', text, 'Тип:', type);
            
            // Автоматическое скрытие сообщений через 5 секунд
            if (type === 'success') {
                setTimeout(() => {
                    messageDiv.textContent = '';
                    messageDiv.className = '';
                }, 5000);
            }
        }
    }
});
