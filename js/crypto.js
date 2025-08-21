// Генерация случайной соли
function generateSalt(length = 16) {
    const array = new Uint8Array(length);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

// Первое хэширование (SHA-256)
async function firstHash(password, salt) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password + salt);
    const hash = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
}

// Второе хэширование (bcrypt-like с использованием PBKDF2)
async function secondHash(firstHashResult, salt, iterations = 10000) {
    const encoder = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey(
        'raw',
        encoder.encode(firstHashResult),
        { name: 'PBKDF2' },
        false,
        ['deriveBits']
    );

    const derivedBits = await crypto.subtle.deriveBits(
        {
            name: 'PBKDF2',
            salt: encoder.encode(salt),
            iterations: iterations,
            hash: 'SHA-256'
        },
        keyMaterial,
        256
    );

    return Array.from(new Uint8Array(derivedBits)).map(b => b.toString(16).padStart(2, '0')).join('');
}

// Двойное хэширование пароля
async function doubleHashPassword(password) {
    const salt = generateSalt();
    const firstHashResult = await firstHash(password, salt);
    const finalHash = await secondHash(firstHashResult, salt);
    return { hash: finalHash, salt: salt };
}

// Проверка пароля
async function verifyPassword(password, storedHash, storedSalt) {
    const firstHashResult = await firstHash(password, storedSalt);
    const testHash = await secondHash(firstHashResult, storedSalt);
    return testHash === storedHash;
}
