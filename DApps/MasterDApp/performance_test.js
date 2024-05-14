'use strict';

const sqlite3 = require('sqlite3').verbose();

// Function to insert a record into the SQLite table
async function insertRecord(key, state, getOrPost, responseTime) {
    let db = new sqlite3.Database('./performance_test.db', (err) => {
        if (err) {
            console.error(err.message);
        }
        console.log('Connected to the SQLite database.');
    });

    let sql = `INSERT INTO performance_record (key_length, state_length, get_or_post, response_time) VALUES (?,?,?,?)`;

    db.run(sql, [key.length, state.length, getOrPost, responseTime], function (err) {
        if (err) {
            return console.error(err.message);
        }
        console.log(`Row inserted with rowid ${this.lastID}`);
    });

    db.close((err) => {
        if (err) {
            console.error(err.message);
        }
        console.log('Close the database connection.');
    });
}


// Function to clear the performance_record table
async function clearPerformanceRecordTable() {
    let db = new sqlite3.Database('./performance_test.db', (err) => {
        if (err) {
            console.error(err.message);
        }
        console.log('Connected to the SQLite database.');
    });

    let sql = `DELETE FROM performance_record`;

    db.run(sql, function (err) {
        if (err) {
            return console.error(err.message);
        }
        console.log('Table cleared successfully.');
    });

    db.close((err) => {
        if (err) {
            console.error(err.message);
        }
        console.log('Close the database connection.');
    });
}

//// Example usage
//insertRecord('yourKey', 'yourState', 'Post', 123).then(() => {
//    console.log('Record inserted successfully.');
//}).catch((error) => {
//    console.error('Error inserting record:', error);
//});


exports.insertRecord = insertRecord;
exports.clearPerformanceRecordTable = clearPerformanceRecordTable;
