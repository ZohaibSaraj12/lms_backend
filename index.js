const express = require('express');

const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// index.js
const mysql = require('mysql2');

// db variable define karna mandatory hai
const db = mysql.createConnection({
  host: process.env.DB_HOST,      // Railway environment variable
  user: process.env.DB_USER,      // Railway environment variable
  password: process.env.DB_PASS,
  database: process.env.DATABASE,
  port: process.env.DB_PORT || 3306
});

// connect to database
db.connect(err => {
  if (err) {
    console.error('Database connection failed:', err);
    return;
  }
  console.log('Connected to MySQL database!');
});


// ================= STUDENTS =================

// GET students
app.get('/students', (req, res) => {
  db.query('SELECT * FROM students', (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});

// ADD student
app.post('/students/add', (req, res) => {
  const { name, email, program } = req.body;
  db.query(
    'INSERT INTO students (name, email, program) VALUES (?, ?, ?)',
    [name, email, program],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: 'Student added' });
    }
  );
});

// DELETE student
app.delete('/students/delete/:id', (req, res) => {
  db.query(
    'DELETE FROM students WHERE student_id = ?',
    [req.params.id],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: 'Student deleted' });
    }
  );
});
// ================= ENROLLMENTS =================

// GET all enrollments
app.get('/enrollments', (req, res) => {
  const sql = `
    SELECT
      e.enrollment_id,
      s.name AS student_name,
      c.course_name
    FROM enrollments e
    JOIN students s ON e.student_id = s.student_id
    JOIN courses c ON e.course_id = c.course_id
  `;

  db.query(sql, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json(err);
    }
    res.json(result);
  });
});

// ENROLL student
app.post('/enroll', (req, res) => {
  const { student_id, course_id } = req.body;

  const sql =
    'INSERT INTO enrollments (student_id, course_id) VALUES (?, ?)';

  db.query(sql, [student_id, course_id], (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json(err);
    }
    res.json({ message: 'Student enrolled successfully' });
  });
});

// CANCEL enrollment
app.delete('/enrollments/delete/:id', (req, res) => {
  const sql =
    'DELETE FROM enrollments WHERE enrollment_id = ?';

  db.query(sql, [req.params.id], (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json(err);
    }
    res.json({ message: 'Enrollment cancelled successfully' });
  });
});

// ================= COURSES =================

// GET courses
app.get('/courses', (req, res) => {
  db.query('SELECT * FROM courses', (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});

// ADD course
app.post('/courses/add', (req, res) => {
  const { course_name, credit_hours } = req.body;
  db.query(
    'INSERT INTO courses (course_name, credit_hours) VALUES (?, ?)',
    [course_name, credit_hours],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: 'Course added' });
    }
  );
});

// DELETE course
app.delete('/courses/delete/:id', (req, res) => {
  db.query(
    'DELETE FROM courses WHERE course_id = ?',
    [req.params.id],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: 'Course deleted' });
    }
  );
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});

