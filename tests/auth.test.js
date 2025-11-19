const request = require('supertest');
const express = require('express');
const { signup, login } = require('../src/auth');

const app = express();
app.use(express.json());
app.post('/signup', signup);
app.post('/login', login);

describe('Auth Endpoints', () => {
  it('should sign up a new user', async () => {
    const res = await request(app)
      .post('/signup')
      .send({ name: 'Test User', email: 'testuser@example.com', password: 'testpass', role: 'student' });
    expect(res.statusCode).toBe(200);
    expect(res.body.user.email).toBe('testuser@example.com');
  });

  it('should login an existing user', async () => {
    await request(app)
      .post('/signup')
      .send({ name: 'Test User', email: 'testlogin@example.com', password: 'testpass', role: 'student' });
    const res = await request(app)
      .post('/login')
      .send({ email: 'testlogin@example.com', password: 'testpass' });
    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
  });
});
