let questions = [
    // Ваши начальные вопросы (если нужны)
    {
        question: "Какой метод добавляет элемент в конец массива?",
        answers: [
            { text: "push()", correct: true },
            { text: "pop()", correct: false },
            { text: "shift()", correct: false },
            { text: "unshift()", correct: false }
        ]
    },
    {
        question: "Как объявить переменную с блочной областью видимости?",
        answers: [
            { text: "var", correct: false },
            { text: "let", correct: true },
            { text: "const", correct: true },
            { text: "variable", correct: false }
        ]
    },
    // Добавьте больше вопросов
];

if (localStorage.getItem('quiz-questions')) {
    try {
        const saved = JSON.parse(localStorage.getItem('quiz-questions'));
        if (Array.isArray(saved) && saved.length > 0) {
            questions = saved;
        }
    } catch (e) {
        console.error("Ошибка загрузки вопросов:", e);
    }
}
