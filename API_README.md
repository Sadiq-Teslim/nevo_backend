# Nevo Backend API Documentation

This document describes how to use the Nevo backend from your frontend application. It covers authentication, user linking, assessment, lessons, personalization, parent tracking, and student dashboard endpoints.

---

## Authentication

### Signup
- **POST /signup**
- Body: `{ name, email, password, role }`
- Roles: `student`, `teacher`, `parent`
- Response: `{ user }`

### Login
- **POST /login**
- Body: `{ email, password }`
- Response: `{ token }`

---

## User Linking

### Link Student to Teacher
- **POST /link/student-to-teacher**
- Auth: Bearer token (student)
- Body: `{ studentEmail, teacherEmail }`
- Response: `{ message }`

### Link Student to Parent
- **POST /link/student-to-parent**
- Auth: Bearer token (student)
- Body: `{ studentEmail, parentEmail }`
- Response: `{ message }`

### Link Teacher to Student
- **POST /link/teacher-to-student**
- Auth: Bearer token (teacher)
- Body: `{ teacherEmail, studentEmail }`
- Response: `{ message }`

### Get Linked Users
- **GET /linked-users**
- Auth: Bearer token
- Response: `{ relationships: [...] }`

---

## Assessment & Diagnosis

### Submit Assessment
- **POST /assessment/submit**
- Auth: Bearer token (student)
- Body: `{ answers: [{ type, value }, ...] }`
- Response: `{ primary, secondary, recommendedLearningMethod, lessonInstructions }`

### Get Assessment Result
- **GET /assessment/result**
- Auth: Bearer token (student)
- Response: `{ diagnosis, learningStyle, assessmentScoreSummary }`

---

## Lessons

### Upload Lesson
- **POST /lesson/upload**
- Auth: Bearer token (teacher)
- Body: `{ title, content }`
- Response: `{ lesson }`

### List Lessons
- **GET /lesson/list**
- Auth: Bearer token (teacher)
- Response: `{ lessons: [...] }`

### Get Lesson by ID
- **GET /lesson/{id}**
- Auth: Bearer token
- Response: `{ lesson }`

---

## Lesson Personalization

### Personalize Lesson for Student
- **POST /lesson/{id}/personalize-for-student**
- Auth: Bearer token (student)
- Response: `{ personalizedLesson }`

### Get Student's Personalized Lessons
- **GET /student/{id}/personalized-lessons**
- Auth: Bearer token (student)
- Response: `{ lessons: [...] }`

---

## Parent Tracking

### Get Parent's Students
- **GET /parent/{id}/students**
- Auth: Bearer token (parent)
- Response: `{ students: [...] }`

### Get Student Progress
- **GET /student/{id}/progress**
- Auth: Bearer token (parent or student)
- Response: `{ progress: [...] }`

---

## Student Dashboard

### Get Student's Lessons
- **GET /student/{id}/lessons**
- Auth: Bearer token (student)
- Response: `{ lessons: [...] }`

### Get Student's Learning Style
- **GET /student/{id}/learning-style**
- Auth: Bearer token (student)
- Response: `{ learningStyle }`

---

## Usage Notes
- All endpoints require JSON bodies and responses.
- Authenticated endpoints require `Authorization: Bearer <token>` header.
- Use the token from `/login` for all protected routes.
- For file uploads, extend `/lesson/upload` to accept multipart/form-data if needed.
- Error responses are in `{ error: "message" }` format.

---

## Example Usage (Frontend)

```js
// Example: Login and fetch lessons
const token = await loginUser(email, password);
const lessons = await fetch('/lesson/list', {
  headers: { Authorization: `Bearer ${token}` }
});
```

---

For more details, see the main README.md and source code.
