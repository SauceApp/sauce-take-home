import Database from 'better-sqlite3';

/**
 * Schema for the database
 */
const sqlSchema = `
    CREATE TABLE IF NOT EXISTS Feedback
    (
        id   INTEGER PRIMARY KEY,
        text TEXT,
        status TEXT NOT NULL,
        message TEXT
    );

    CREATE TABLE IF NOT EXISTS Highlight
    (
        id         INTEGER PRIMARY KEY,
        quote      TEXT,
        summary    TEXT,
        feedbackId INTEGER,
        FOREIGN KEY (feedbackId) REFERENCES Feedback (id)
    );
`;

/**
 * Database instance
 */
const db = new Database(":memory:");
db.exec(sqlSchema);

export default db;