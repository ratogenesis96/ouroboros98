document.addEventListener('DOMContentLoaded', function() {
    const registerForm = document.getElementById('registerForm');
    const messageDiv = document.getElementById('message');

    if (registerForm) {
        registerForm.addEventListener('submit', async function(e) {
            e.preventDefault();

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

            // Проверка существования пользователя
            if (await db.userExists(login)) {
                showMessage('Пользователь с таким логином уже существует', 'error');
                return;
            }

            // Хэширование пароля
            try {
                const { hash: passwordHash, salt } = await doubleHashPassword(password);

                // Сохранение пользователя
                const success = await db.registerUser({
                    firstname,
                    lastname,
                    login,
                    passwordHash,
                    salt
                });

                if (success) {
                    showMessage('Регистрация успешна!', 'success');
                    setTimeout(() => {
                        window.location.href = 'login.html';
                    }, 2000);
                } else {
                    showMessage('Ошибка при регистрации', 'error');
                }
            } catch (error) {
                console.error('Registration error:', error);
                showMessage('Ошибка при регистрации', 'error');
            }
        });
    }

    function showMessage(text, type) {
        messageDiv.textContent = text;
        messageDiv.className = type;
    }
});
