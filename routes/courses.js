const express = require('express');
const router = express.Router();
const db = require('../db');


// 1️⃣ ADD COURSE
router.post('/add', (req, res) => {
    const { course_name, credit_hours } = req.body;

    db.query(
        'CALL insert_course(?, ?)',
        [course_name, credit_hours],
        (err) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Error adding course');
            }
            res.send({ message: 'Course added successfully' });
        }
    );
});


// 2️⃣ READ COURSES
router.get('/', (req, res) => {
    db.query('CALL get_courses()', (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error fetching courses');
        }
        res.send(results[0]);
    });
});


// 3️⃣ UPDATE COURSE
router.put('/update', (req, res) => {
    const { course_id, course_name, credit_hours } = req.body;

    db.query(
        'CALL update_course(?, ?, ?)',
        [course_id, course_name, credit_hours],
        (err) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Error updating course');
            }
            res.send({ message: 'Course updated successfully' });
        }
    );
});


// 4️⃣ DELETE COURSE
router.delete('/delete/:id', (req, res) => {
    const id = req.params.id;

    db.query(
        'CALL delete_course(?)',
        [id],
        (err) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Error deleting course');
            }
            res.send({ message: 'Course deleted successfully' });
        }
    );
});

module.exports = router;
