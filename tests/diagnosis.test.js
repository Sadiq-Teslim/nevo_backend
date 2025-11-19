const request = require('supertest');
const express = require('express');
const { submitAssessment } = require('../src/diagnosis');
const { signup, login, authMiddleware } = require('../src/auth');

const app = express();
app.use(express.json());
app.post('/signup', signup);
app.post('/login', login);
app.post('/assessment/submit', authMiddleware(['student']), submitAssessment);

describe('Diagnosis Engine', () => {
  let token;
  beforeAll(async () => {
    await request(app)
      .post('/signup')
      .send({ name: 'Student', email: 'student2@example.com', password: 'pass', role: 'student' });
    const res = await request(app)
      .post('/login')
      .send({ email: 'student2@example.com', password: 'pass' });
    token = res.body.token;
  });

  it('should submit assessment and get diagnosis', async () => {
    const answers = [
      { type: 'attention', value: 5 },
      { type: 'social', value: 3 },
      { type: 'reading', value: 2 }
    ];
    const res = await request(app)
      .post('/assessment/submit')
      .set('Authorization', `Bearer ${token}`)
      .send({ answers });
    expect(res.statusCode).toBe(200);
    expect(res.body.primary).toBeDefined();
    expect(res.body.recommendedLearningMethod).toBeDefined();
  });
});
