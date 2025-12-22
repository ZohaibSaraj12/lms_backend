const express = require('express');
const router = express.Router();
const db = require('../db');


// 1️⃣ ADD STUDENT
router.post('/add', (req, res) => {
    const { name, email, program } = req.body;

    db.query(
        'CALL insert_student(?, ?, ?)',
        [name, email, program],
        (err) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Error adding student');
            }
            res.send({ message: 'Student added successfully' });
        }
    );
});


// 2️⃣ READ STUDENTS
router.get('/', (req, res) => {
    db.query('CALL get_students()', (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error fetching students');
        }
        res.send(results[0]); // important
    });
});


// 3️⃣ UPDATE STUDENT
router.put('/update', (req, res) => {
    const { student_id, name, email, program } = req.body;

    db.query(
        'CALL update_student(?, ?, ?, ?)',
        [student_id, name, email, program],
        (err) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Error updating student');
            }
            res.send({ message: 'Student updated successfully' });
        }
    );
});


// 4️⃣ DELETE STUDENT
router.delete('/delete/:id', (req, res) => {
    const id = req.params.id;

    db.query(
        'CALL delete_student(?)',
        [id],
        (err) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Error deleting student');
            }
            res.send({ message: 'Student deleted successfully' });
        }
    );
});

module.exports = router;
