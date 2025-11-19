# Nevo Backend API Documentation

This document describes how to use the Nevo backend. All endpoints are RESTful and accept/return JSON. Copy-paste ready payloads and endpoint examples are provided.

---

## Authentication

### Signup

```http
POST /signup
Content-Type: application/json
```

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "yourpassword",
  "role": "student" // or "teacher" or "parent"
}
```

Response:

```json
{
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "student"
  }
}
```

### Login

```http
POST /login
Content-Type: application/json
```

```json
{
  "email": "john@example.com",
  "password": "yourpassword"
}
```

Response:

```json
{
  "token": "<JWT_TOKEN>"
}
```

---

## User Linking

### Link Student to Teacher

```http
POST /link/student-to-teacher
Authorization: Bearer <token>
Content-Type: application/json
```

```json
{
  "studentEmail": "student@example.com",
  "teacherEmail": "teacher@example.com"
}
```

Response:

```json
{
  "message": "Linked successfully"
}
```

### Link Student to Parent

```http
POST /link/student-to-parent
Authorization: Bearer <token>
Content-Type: application/json
```

```json
{
  "studentEmail": "student@example.com",
  "parentEmail": "parent@example.com"
}
```

Response:

```json
{
  "message": "Linked successfully"
}
```

### Link Teacher to Student

```http
POST /link/teacher-to-student
Authorization: Bearer <token>
Content-Type: application/json
```

```json
{
  "teacherEmail": "teacher@example.com",
  "studentEmail": "student@example.com"
}
```

Response:

```json
{
  "message": "Linked successfully"
}
```

### Get Linked Users

```http
GET /linked-users
Authorization: Bearer <token>
```

Response:

```json
{
  "relationships": [
    {
      "student": { },
      "teacher": { },
      "parent": { }
    }
  ]
}
```

---

## Assessment & Diagnosis

### Submit Assessment

```http
POST /assessment/submit
Authorization: Bearer <token>
Content-Type: application/json
```

```json
{
  "answers": [
    { "type": "attention", "value": 5 },
    { "type": "social", "value": 3 },
    { "type": "reading", "value": 2 }
  ]
}
```

Response:

```json
{
  "primary": "ADHD",
  "secondary": "ASD",
  "recommendedLearningMethod": "visual",
  "lessonInstructions": "Build lessons for visual learners",
  "aiModel": "gemini-2.5-pro"
}
```

### Get Assessment Result

```http
GET /assessment/result
Authorization: Bearer <token>
```

Response:

```json
{
  "diagnosis": "ADHD",
  "learningStyle": "visual",
  "assessmentScoreSummary": "{\"ADHD\":5,\"ASD\":3,\"Dyslexia\":2}"
}
```

---

## Lessons

### Upload Lesson

```http
POST /lesson/upload
Authorization: Bearer <token>
Content-Type: application/json
```

```json
{
  "title": "Sample Lesson",
  "content": "Lesson content here."
}
```

Response:

```json
{
  "lesson": {
    "id": 1,
    "title": "Sample Lesson",
    "content": "Lesson content here."
  }
}
```

### List Lessons

```http
GET /lesson/list
Authorization: Bearer <token>
```

Response:

```json
{
  "lessons": [ { "id": 1, "title": "Sample Lesson" } ]
}
```

### Get Lesson by ID

```http
GET /lesson/{id}
Authorization: Bearer <token>
```

Response:

```json
{
  "lesson": { "id": 1, "title": "Sample Lesson" }
}
```

---

## Lesson Personalization

### Personalize Lesson for Student

```http
POST /lesson/{id}/personalize-for-student
Authorization: Bearer <token>
```

Response:

```json
{
  "personalizedLesson": {
    "id": 1,
    "lessonId": 1,
    "studentId": 2,
    "personalizedContent": "...",
    "learningStyleUsed": "visual"
  }
}
```

### Get Student's Personalized Lessons

```http
GET /student/{id}/personalized-lessons
Authorization: Bearer <token>
```

Response:

```json
{
  "lessons": [ { "id": 1, "lessonId": 1 } ]
}
```

---

## Parent Tracking

### Get Parent's Students

```http
GET /parent/{id}/students
Authorization: Bearer <token>
```

Response:

```json
{
  "students": [ { "id": 2, "name": "Student Name" } ]
}
```

### Get Student Progress

```http
GET /student/{id}/progress
Authorization: Bearer <token>
```

Response:

```json
{
  "progress": [ { "lessonId": 1, "completionPercentage": 80 } ]
}
```

---

## Student Dashboard

### Get Student's Lessons

```http
GET /student/{id}/lessons
Authorization: Bearer <token>
```

Response:

```json
{
  "lessons": [ { "id": 1, "title": "Sample Lesson" } ]
}
```

### Get Student's Learning Style

```http
GET /student/{id}/learning-style
Authorization: Bearer <token>
```

Response:

```json
{
  "learningStyle": "visual"
}
```

---

## Usage Notes

- All endpoints require JSON bodies and responses unless otherwise noted.
- Authenticated endpoints require `Authorization: Bearer <token>` header.
- Use the token from `/login` for all protected routes.
- Error responses are in `{ "error": "message" }` format.
- For file uploads, extend `/lesson/upload` to accept multipart/form-data if needed.

All AI-powered endpoints (diagnosis, lesson personalization) use Gemini 2.5 Pro. Output may include additional fields such as `aiModel`.

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
