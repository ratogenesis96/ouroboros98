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

<div class="dashboard-actions">
    <a href="quiz.html" class="btn">Пройти викторину</a>
    
    <!-- Добавьте эту кнопку -->
    <a href="editor.html" class="btn primary" id="editorBtn">Создать викторину</a>
    
    <a href="index.html" class="btn">На главную</a>
</div>

<script>
    // Скрываем кнопку, если пользователь не учитель/админ
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const editorBtn = document.getElementById('editorBtn');
    
    if (currentUser && (currentUser.ID_Roles === 1 || currentUser.ID_Roles === 2)) {
        editorBtn.style.display = 'block';
    } else {
        editorBtn.style.display = 'none';
    }
</script>
