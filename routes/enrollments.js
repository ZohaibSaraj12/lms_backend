const express = require('express');
const router = express.Router();
const db = require('../db');


// 1️⃣ ENROLL STUDENT
router.post('/add', (req, res) => {
    const { student_id, course_id } = req.body;

    db.query(
        'CALL enroll_student(?, ?)',
        [student_id, course_id],
        (err) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Error enrolling student');
            }
            res.send({ message: 'Student enrolled successfully' });
        }
    );
});


// 2️⃣ VIEW ENROLLMENTS
router.get('/', (req, res) => {
    db.query('CALL view_enrollments()', (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error fetching enrollments');
        }
        res.send(results[0]);
    });
});


// 3️⃣ CANCEL ENROLLMENT
router.delete('/delete/:id', (req, res) => {
    const id = req.params.id;

    db.query(
        'CALL cancel_enrollment(?)',
        [id],
        (err) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Error cancelling enrollment');
            }
            res.send({ message: 'Enrollment cancelled successfully' });
        }
    );
});

module.exports = router;
