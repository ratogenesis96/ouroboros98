console.log('Скрипт auth.js загружен');

// Функция проверки кодового слова
async function verifyAccessCode(code, roleId) {
    // Кодовые слова (в реальном проекте храните на сервере!)
    const accessCodes = {
        1: 'ADMIN_SECRET_2024', // Код для администратора
        2: 'TEACHER_CODE_123'   // Код для учителя
    };
    
    return code === accessCodes[roleId];
}

// Функция показа сообщений
function showMessage(text, type) {
    const messageDiv = document.getElementById('message');
    if (messageDiv) {
        messageDiv.textContent = text;
        messageDiv.className = type;
        console.log('Сообщение:', text);
    }
}

// Функция обработки регистрации
async function handleRegister(e) {
    e.preventDefault();
    console.log('Обработка регистрации');
    
    const firstname = document.getElementById('firstname').value;
    const lastname = document.getElementById('lastname').value;
    const login = document.getElementById('login').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const roleId = parseInt(document.getElementById('userRole').value);
    const accessCode = document.getElementById('accessCode')?.value || '';

    // Валидация
    if (password !== confirmPassword) {
        showMessage('Пароли не совпадают', 'error');
        return;
    }

    if (password.length < 6) {
        showMessage('Пароль должен содержать минимум 6 символов', 'error');
        return;
    }

    // Проверка кодового слова для привилегированных ролей
    if (roleId === 1 || roleId === 2) {
        if (!await verifyAccessCode(accessCode, roleId)) {
            showMessage('Неверное кодовое слово', 'error');
            return;
        }
    }

    try {
        const { hash: passwordHash, salt } = await doubleHashPassword(password);
        
        const success = await db.registerUser({
            firstname,
            lastname,
            login,
            passwordHash,
            salt,
            roleId: roleId
        });

        if (success) {
            showMessage('Регистрация успешна!', 'success');
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000);
        }
    } catch (error) {
        showMessage(error.message, 'error');
    }
}

// Функция обработки входа
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

// Основной код
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded');
    
    const registerForm = document.getElementById('registerForm');
    const loginForm = document.getElementById('loginForm');
    
    // Обработчик выбора роли (только на странице регистрации)
    const roleSelect = document.getElementById('userRole');
    if (roleSelect) {
        roleSelect.addEventListener('change', function() {
            const role = this.value;
            const codeField = document.getElementById('codeField');
            const accessCodeInput = document.getElementById('accessCode');
            
            if (role === '1' || role === '2') {
                codeField.classList.remove('hidden');
                if (accessCodeInput) {
                    accessCodeInput.setAttribute('required', 'true');
                }
            } else {
                codeField.classList.add('hidden');
                if (accessCodeInput) {
                    accessCodeInput.removeAttribute('required');
                }
            }
        });
    }
    
    // Обработка регистрации
    if (registerForm) {
        console.log('Register form found');
        registerForm.addEventListener('submit', handleRegister);
    } else {
        console.log('Register form not found');
    }
    
    // Обработка входа
    if (loginForm) {
        console.log('Login form found');
        loginForm.addEventListener('submit', handleLogin);
    } else {
        console.log('Login form not found');
    }
});
