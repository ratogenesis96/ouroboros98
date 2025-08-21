class Database {
    constructor() {
        this.db = null;
        this.init();
    }

    async init() {
        if (window.sqlite3) {
            this.db = new sqlite3.oo1.DB(':memory:'); // Для демонстрации в памяти
            await this.createTables();
        } else {
            console.error('SQLite3 not available');
        }
    }

    async createTables() {
        const queries = [
            `CREATE TABLE IF NOT EXISTS Roles (
                ID INTEGER PRIMARY KEY AUTOINCREMENT,
                Name TEXT UNIQUE NOT NULL
            )`,
            `CREATE TABLE IF NOT EXISTS Users (
                ID INTEGER PRIMARY KEY AUTOINCREMENT,
                Firstname TEXT NOT NULL,
                Lastname TEXT NOT NULL,
                Login TEXT UNIQUE NOT NULL,
                Password_hash TEXT NOT NULL,
                Salt TEXT NOT NULL,
                ID_Roles INTEGER DEFAULT 2,
                Created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (ID_Roles) REFERENCES Roles(ID)
            )`,
            `INSERT OR IGNORE INTO Roles (Name) VALUES
                ('admin'), ('teacher'), ('student')`
        ];

        for (const query of queries) {
            this.db.exec(query);
        }
    }

    // Регистрация пользователя
    async registerUser(userData) {
        const { firstname, lastname, login, passwordHash, salt } = userData;

        const query = `
            INSERT INTO Users (Firstname, Lastname, Login, Password_hash, Salt)
            VALUES (?, ?, ?, ?, ?)
        `;

        try {
            this.db.exec({
                sql: query,
                bind: [firstname, lastname, login, passwordHash, salt]
            });
            return true;
        } catch (error) {
            console.error('Registration error:', error);
            return false;
        }
    }

    // Поиск пользователя по логину
    async findUserByLogin(login) {
        const query = `
            SELECT u.*, r.Name as Role
            FROM Users u
            JOIN Roles r ON u.ID_Roles = r.ID
            WHERE u.Login = ?
        `;

        try {
            const result = this.db.selectValues(query, [login]);
            return result.length > 0 ? result[0] : null;
        } catch (error) {
            console.error('Find user error:', error);
            return null;
        }
    }

    // Проверка существования пользователя
    async userExists(login) {
        const query = 'SELECT 1 FROM Users WHERE Login = ?';
        const result = this.db.selectValues(query, [login]);
        return result.length > 0;
    }
}

// Инициализация базы данных
const db = new Database();
