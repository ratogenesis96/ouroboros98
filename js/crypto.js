// crypto.js - упрощенная версия для браузера
console.log('Скрипт crypto.js загружен');

// Генерация случайной соли
function generateSalt(length = 16) {
    const array = new Uint8Array(length);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

// Асинхронное хэширование с использованием SHA-256
async function hashString(str) {
    const encoder = new TextEncoder();
    const data = encoder.encode(str);
    const hash = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
}

// Двойное хэширование пароля
async function doubleHashPassword(password) {
    try {
        const salt = generateSalt();
        console.log('Соль сгенерирована');
        
        // Первое хэширование: пароль + соль
        const firstHash = await hashString(password + salt);
        console.log('Первое хэширование завершено');
        
        // Второе хэширование: хэш + соль
        const secondHash = await hashString(firstHash + salt);
        console.log('Второе хэширование завершено');
        
        return { hash: secondHash, salt: salt };
    } catch (error) {
        console.error('Ошибка хэширования:', error);
        throw error;
    }
}

// Проверка пароля
async function verifyPassword(password, storedHash, storedSalt) {
    try {
        const firstHash = await hashString(password + storedSalt);
        const testHash = await hashString(firstHash + storedSalt);
        return testHash === storedHash;
    } catch (error) {
        console.error('Ошибка проверки пароля:', error);
        return false;
    }
}
