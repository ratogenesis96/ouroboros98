// Ждем полной загрузки DOM
document.addEventListener('DOMContentLoaded', function() {
    // Получаем кнопку по ID
    const button = document.getElementById('myButton');
    
    // Добавляем обработчик события
    button.addEventListener('click', function() {
        alert('Кнопка была нажата!');
        
        // Пример изменения контента
        this.textContent = 'Нажато!';
        this.style.backgroundColor = '#4CAF50';
    });
    
    // Дополнительные функции могут быть добавлены здесь
    function exampleFunction() {
        console.log('Пример функции');
    }
    
    exampleFunction();
});
