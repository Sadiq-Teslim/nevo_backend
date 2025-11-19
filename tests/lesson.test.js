const request = require('supertest');
const express = require('express');
const { uploadLesson } = require('../src/lesson');
const { signup, login, authMiddleware } = require('../src/auth');

const app = express();
app.use(express.json());
app.post('/signup', signup);
app.post('/login', login);
app.post('/lesson/upload', authMiddleware(['teacher']), uploadLesson);

describe('Lesson Upload', () => {
  let token;
  beforeAll(async () => {
    await request(app)
      .post('/signup')
      .send({ name: 'Teacher', email: 'teacher2@example.com', password: 'pass', role: 'teacher' });
    const res = await request(app)
      .post('/login')
      .send({ email: 'teacher2@example.com', password: 'pass' });
    token = res.body.token;
  });

  it('should upload a lesson', async () => {
    const res = await request(app)
      .post('/lesson/upload')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Sample Lesson', content: 'Lesson content here.' });
    expect(res.statusCode).toBe(200);
    expect(res.body.lesson.title).toBe('Sample Lesson');
  });
});
