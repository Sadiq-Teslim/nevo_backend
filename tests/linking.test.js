const request = require('supertest');
const express = require('express');
const { linkStudentToTeacher } = require('../src/linking');
const { signup, login, authMiddleware } = require('../src/auth');

const app = express();
app.use(express.json());
app.post('/signup', signup);
app.post('/login', login);
app.post('/link/student-to-teacher', authMiddleware(['student']), linkStudentToTeacher);

describe('User Linking', () => {
  let token;
  beforeAll(async () => {
    await request(app)
      .post('/signup')
      .send({ name: 'Student', email: 'student@example.com', password: 'pass', role: 'student' });
    await request(app)
      .post('/signup')
      .send({ name: 'Teacher', email: 'teacher@example.com', password: 'pass', role: 'teacher' });
    const res = await request(app)
      .post('/login')
      .send({ email: 'student@example.com', password: 'pass' });
    token = res.body.token;
  });

  it('should link student to teacher', async () => {
    const res = await request(app)
      .post('/link/student-to-teacher')
      .set('Authorization', `Bearer ${token}`)
      .send({ studentEmail: 'student@example.com', teacherEmail: 'teacher@example.com' });
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Linked successfully');
  });
});
