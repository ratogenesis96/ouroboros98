
console.log('Скрипт auth.js загружен');

// обработчик выбора роли
document.getElementById('userRole').addEventListener('change', function() {
    const role = this.value;
    const codeField = document.getElementById('codeField');
    const accessCodeInput = document.getElementById('accessCode');
    
    if (role === '1' || role === '2') {
        codeField.classList.remove('hidden');
        accessCodeInput.setAttribute('required', 'true');
    } else {
        codeField.classList.add('hidden');
        accessCodeInput.removeAttribute('required');
    }
});


document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded');
    
    const registerForm = document.getElementById('registerForm');
    const loginForm = document.getElementById('loginForm');
    
    // ✅ ДОБАВЬТЕ ПРОВЕРКУ!
    if (registerForm) {
        console.log('Register form found');
        registerForm.addEventListener('submit', handleRegister);
    } else {
        console.log('Register form not found');
    }
    
    if (loginForm) {
        console.log('Login form found');
        loginForm.addEventListener('submit', handleLogin);
    } else {
        console.log('Login form not found');
    }
    
    // ✅ Проверка для выбора роли
    const roleSelect = document.getElementById('userRole');
    if (roleSelect) {
        roleSelect.addEventListener('change', function() {
            // ваш код
        });
    }
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

// Функция проверки кодового слова
async function verifyAccessCode(code, roleId) {
    // Кодовые слова (в реальном проекте храните на сервере!)
    const accessCodes = {
        1: 'ADMIN_SECRET_2024', // Код для администратора
        2: 'TEACHER_CODE_123'   // Код для учителя
    };
    
    return code === accessCodes[roleId];
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





