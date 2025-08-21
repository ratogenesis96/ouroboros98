console.log('Скрипт dashboard.js загружен');

document.addEventListener('DOMContentLoaded', function() {
    // Проверяем авторизацию
    const user = JSON.parse(localStorage.getItem('currentUser'));
    
    if (!user) {
        alert('Пожалуйста, войдите в систему');
        window.location.href = 'login.html';
        return;
    }

    // Отображаем информацию пользователя
    document.getElementById('userName').textContent = user.Firstname + ' ' + user.Lastname;
    document.getElementById('userRole').textContent = getRoleName(user.ID_Roles);

    // Обработчик выхода
    document.getElementById('logoutBtn').addEventListener('click', function() {
        localStorage.removeItem('currentUser');
        window.location.href = 'index.html';
    });

    function getRoleName(roleId) {
        const roles = {
            1: 'Администратор',
            2: 'Учитель', 
            3: 'Ученик'
        };
        return roles[roleId] || 'Неизвестная роль';
    }
});
