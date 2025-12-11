# School Website Backend API Documentation

**Version**: 1.0.0  
**Framework**: NestJS v11.0.1 with TypeORM v0.3.28  
**Database**: PostgreSQL  
**Authentication**: JWT Bearer Token  
**Base URL**: `http://localhost:3000/api`  
**API Docs**: `http://localhost:3000/api` (Swagger UI)

---

## Table of Contents

1. [Authentication Flow](#authentication-flow)
2. [Common Response Format](#common-response-format)
3. [Error Handling](#error-handling)
4. [File Upload Specifications](#file-upload-specifications)
5. [API Modules](#api-modules)
6. [Dummy Data](#dummy-data)
7. [cURL Examples](#curl-examples)

---

## Authentication Flow

### Overview

The API uses JWT (JSON Web Token) based authentication with Bearer tokens and refresh tokens for session management.

### Authentication Types

- **Public Endpoints**: Marked with `@Public()` decorator - no authentication required
- **Protected Endpoints**: Require `Authorization: Bearer <access_token>` header
- **Admin Endpoints**: Most protected endpoints are admin-only

### Getting Started with Authentication

#### 1. Signup (Create Admin User)

```http
POST /auth/signup
Content-Type: application/json

{
  "email": "admin@school.com",
  "password": "SecurePassword123"
}
```

**Response (201 Created)**:
```json
{
  "id": "uuid-string",
  "email": "admin@school.com",
  "role": "admin",
  "isActive": true,
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:30:00Z"
}
```

#### 2. Login

```http
POST /auth/login
Content-Type: application/json

{
  "email": "admin@school.com",
  "password": "SecurePassword123"
}
```

**Response (200 OK)**:
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid-string",
    "email": "admin@school.com",
    "role": "admin"
  }
}
```

#### 3. Refresh Access Token

```http
POST /auth/refresh
Authorization: Bearer <refresh_token>
```

**Response (200 OK)**:
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### 4. Logout

```http
POST /auth/logout
Authorization: Bearer <access_token>
```

**Response (200 OK)**:
```json
{
  "message": "Logged out successfully"
}
```

### Using Access Token

All protected requests must include:
```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Token Expiration

- **Access Token**: 15 minutes
- **Refresh Token**: 7 days

---

## Common Response Format

### Success Response

```json
{
  "id": "uuid",
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:30:00Z",
  "isActive": true,
  ...otherFields
}
```

### List Response (with Pagination)

```json
{
  "data": [
    { ...item1 },
    { ...item2 }
  ],
  "total": 50,
  "page": 1,
  "limit": 20,
  "totalPages": 3
}
```

### Error Response

```json
{
  "statusCode": 400,
  "message": "Error message",
  "error": "Bad Request"
}
```

---

## Error Handling

### HTTP Status Codes

| Code | Description |
|------|-------------|
| 200 | OK - Success |
| 201 | Created - Resource created successfully |
| 400 | Bad Request - Invalid input data |
| 401 | Unauthorized - Missing/invalid authentication |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource not found |
| 409 | Conflict - Resource already exists |
| 422 | Unprocessable Entity - Validation error |
| 500 | Internal Server Error |

### Common Error Responses

**Unauthorized (401)**:
```json
{
  "statusCode": 401,
  "message": "Unauthorized",
  "error": "Unauthorized"
}
```

**Not Found (404)**:
```json
{
  "statusCode": 404,
  "message": "Resource not found",
  "error": "Not Found"
}
```

**Validation Error (400)**:
```json
{
  "statusCode": 400,
  "message": [
    "email must be an email",
    "password must be longer than or equal to 6 characters"
  ],
  "error": "Bad Request"
}
```

---

## File Upload Specifications

### Upload Configuration

| Module | Field | File Types | Max Size | Path |
|--------|-------|-----------|----------|------|
| Home - Slider | image | JPG, PNG, JPEG, GIF | 5MB | `/uploads/sliders` |
| Home - About | image | JPG, PNG, JPEG, GIF | 5MB | `/uploads/about` |
| Home - Important Links | icon | SVG, PNG, JPG | 2MB | `/uploads/important-links` |
| Home - Our Story | image | JPG, PNG, JPEG, GIF | 5MB | `/uploads/our-story` |
| Home - Principal Message | photo | JPG, PNG, JPEG, GIF | 5MB | `/uploads/principal` |
| Home - Governing Board | photo | JPG, PNG, JPEG, GIF | 5MB | `/uploads/governing-board` |
| Academic - Class Routine | file | PDF, DOC, DOCX | 10MB | `/uploads/class-routines` |
| Academic - Exam Routine | file | PDF, DOC, DOCX | 10MB | `/uploads/exam-routines` |
| Academic - Syllabus | file | PDF, DOC, DOCX | 10MB | `/uploads/syllabuses` |
| Academic - Lesson Plan | file | PDF, DOC, DOCX | 10MB | `/uploads/lesson-plans` |
| Settings | logo, icon | PNG, JPG, SVG | 5MB each | `/uploads/settings` |
| Staff | photo | JPG, PNG, JPEG, GIF | 5MB | `/uploads/staff` |
| Events | featurePhoto, photos | JPG, PNG, JPEG, GIF | 5MB each | `/uploads/events` |
| Notice | files | PDF, DOC, DOCX, JPG | 5MB each | `/uploads/notices` |
| Admissions | attachments | PDF, DOC, DOCX | 5MB each | `/uploads/admissions` |
| Downloads | file | PDF, DOC, DOCX, ZIP | 10MB | `/uploads/downloads` |
| Results | file | PDF, JPG, PNG | 10MB | `/uploads/results` |

### Multipart Form-Data Upload Format

```http
POST /home/sliders
Authorization: Bearer <token>
Content-Type: multipart/form-data

------WebKitFormBoundary
Content-Disposition: form-data; name="title"

My Slider
------WebKitFormBoundary
Content-Disposition: form-data; name="description"

Slider description
------WebKitFormBoundary
Content-Disposition: form-data; name="order"

1
------WebKitFormBoundary
Content-Disposition: form-data; name="image"; filename="image.jpg"
Content-Type: image/jpeg

[binary file data]
------WebKitFormBoundary--
```

### File Response Format

```json
{
  "id": "uuid",
  "title": "My Slider",
  "description": "Slider description",
  "imageUrl": "/uploads/sliders/slider-1705313400000-123456789.jpg",
  "order": 1,
  "isActive": true,
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:30:00Z"
}
```

---

## API Modules

### 1. HOME MODULE

Manages all homepage sections and content.

#### 1.1 Sliders

**Create Slider**
```http
POST /home/sliders
Authorization: Bearer <token>
Content-Type: multipart/form-data

FormData:
  - title: string (required) - e.g. "স্বাগতম গ্রীনফিল্ড উচ্চ বিদ্যালয়"
  - subtitle: string (optional) - e.g. "এবং কলেজ এর পক্ষ থেকে!"
  - linkUrl: string (optional) - e.g. "/about"
  - order: number (optional, auto-increment if not provided)
  - isActive: boolean (optional, default: true)
  - image: file (required, JPG/PNG/GIF, max 5MB)
```

**Response (201 Created)**:
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "title": "স্বাগতম গ্রীনফিল্ড উচ্চ বিদ্যালয়",
  "subtitle": "এবং কলেজ এর পক্ষ থেকে!",
  "imageUrl": "/uploads/sliders/slider-1705313400000-123456789.jpg",
  "linkUrl": "/about",
  "order": 1,
  "isActive": true,
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:30:00Z"
}
```

**Get All Sliders (Public)**
```http
GET /home/sliders
```

**Response (200 OK)**:
```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "title": "স্বাগতম গ্রীনফিল্ড উচ্চ বিদ্যালয়",
    "subtitle": "এবং কলেজ এর পক্ষ থেকে!",
    "imageUrl": "/uploads/sliders/slider-1705313400000-123456789.jpg",
    "linkUrl": "/about",
    "order": 1,
    "isActive": true,
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
]
```

**Get All Sliders (Admin)**
```http
GET /home/sliders/admin
Authorization: Bearer <token>
```

**Get Single Slider**
```http
GET /home/sliders/{id}
```

**Update Slider**
```http
PATCH /home/sliders/{id}
Authorization: Bearer <token>
Content-Type: multipart/form-data

FormData:
  - title: string (optional)
  - subtitle: string (optional)
  - linkUrl: string (optional)
  - order: number (optional)
  - isActive: boolean (optional)
  - image: file (optional, JPG/PNG/GIF, max 5MB)
```

**Reorder Slider**
```http
PATCH /home/sliders/{id}/reorder
Authorization: Bearer <token>
Content-Type: application/json

{
  "order": 2
}
```

**Delete Slider**
```http
DELETE /home/sliders/{id}
Authorization: Bearer <token>
```

---

#### 1.2 About Section

**Create About Section**
```http
POST /home/about
Authorization: Bearer <token>
Content-Type: multipart/form-data

FormData:
  - title: string (required) - e.g. "প্রতিষ্ঠান সম্পর্কে"
  - description: string (required) - Main description text
  - buttonText: string (optional) - e.g. "বিস্তারিত পড়ুন"
  - buttonLink: string (optional) - e.g. "/about"
  - isActive: boolean (optional, default: true)
  - image: file (optional, JPG/PNG/GIF, max 5MB)
```

**Response (201 Created)**:
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "title": "প্রতিষ্ঠান সম্পর্কে",
  "description": "গ্রীনফিল্ড উচ্চ বিদ্যালয় এবং কলেজ...",
  "imageUrl": "/uploads/about/about-1705313400000-123456789.jpg",
  "buttonText": "বিস্তারিত পড়ুন",
  "buttonLink": "/about",
  "isActive": true,
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:30:00Z"
}
```

**Get All About Sections (Public)**
```http
GET /home/about
```

**Get All About Sections (Admin)**
```http
GET /home/about/admin
Authorization: Bearer <token>
```

**Get Single About Section**
```http
GET /home/about/{id}
```

**Update About Section**
```http
PATCH /home/about/{id}
Authorization: Bearer <token>
Content-Type: multipart/form-data

FormData:
  - title: string (optional)
  - description: string (optional)
  - buttonText: string (optional)
  - buttonLink: string (optional)
  - isActive: boolean (optional)
  - image: file (optional)
```

**Delete About Section**
```http
DELETE /home/about/{id}
Authorization: Bearer <token>
```

---

#### 1.3 Important Links

**Create Important Link**
```http
POST /home/important-links
Authorization: Bearer <token>
Content-Type: multipart/form-data

FormData:
  - title: string (required)
  - description: string (optional)
  - url: string (required, must be valid URL)
  - order: number (optional, auto-increment if not provided)
  - isActive: boolean (optional, default: true)
  - openInNewTab: boolean (optional, default: true)
  - icon: file (optional, SVG/PNG, max 2MB)
```

**Response (201 Created)**:
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "title": "Online Portal",
  "description": "Access student portal",
  "url": "https://portal.school.com",
  "iconUrl": "/uploads/important-links/important-link-1705313400000-123456789.svg",
  "order": 1,
  "isActive": true,
  "openInNewTab": true,
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:30:00Z"
}
```

**Get All Important Links (Public)**
```http
GET /home/important-links
```

**Get All Important Links (Admin)**
```http
GET /home/important-links/admin
Authorization: Bearer <token>
```

**Get Single Important Link**
```http
GET /home/important-links/{id}
```

**Update Important Link**
```http
PATCH /home/important-links/{id}
Authorization: Bearer <token>
Content-Type: multipart/form-data

FormData:
  - title: string (optional)
  - description: string (optional)
  - url: string (optional)
  - order: number (optional)
  - isActive: boolean (optional)
  - openInNewTab: boolean (optional)
  - icon: file (optional)
```

**Delete Important Link**
```http
DELETE /home/important-links/{id}
Authorization: Bearer <token>
```

---

#### 1.4 Our Story

**Create Our Story**
```http
POST /home/our-story
Authorization: Bearer <token>
Content-Type: multipart/form-data

FormData:
  - heading: string (required) - Main heading
  - subheading: string (required) - Subheading text
  - content: string (required) - Main content
  - highlightedText: string (optional) - Mission statement highlight
  - isActive: boolean (optional, default: true)
  - image: file (optional, JPG/PNG, max 5MB)
```

**Response (201 Created)**:
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "heading": "আমাদের গল্প",
  "subheading": "একটি শিক্ষার যাত্রা",
  "content": "আমরা বিশ্বাস করি...",
  "highlightedText": "গুণমান এবং উৎকর্ষতা",
  "imageUrl": "/uploads/our-story/our-story-1705313400000-123456789.jpg",
  "isActive": true,
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:30:00Z"
}
```

**Get All Our Stories (Public)**
```http
GET /home/our-story
```

**Get All Our Stories (Admin)**
```http
GET /home/our-story/admin
Authorization: Bearer <token>
```

**Get Single Our Story**
```http
GET /home/our-story/{id}
```

**Update Our Story**
```http
PATCH /home/our-story/{id}
Authorization: Bearer <token>
Content-Type: multipart/form-data

FormData:
  - heading: string (optional)
  - subheading: string (optional)
  - content: string (optional)
  - highlightedText: string (optional)
  - isActive: boolean (optional)
  - image: file (optional)
```

**Delete Our Story**
```http
DELETE /home/our-story/{id}
Authorization: Bearer <token>
```

---

#### 1.5 Principal's Message

**Create Principal Message**
```http
POST /home/principal-message
Authorization: Bearer <token>
Content-Type: multipart/form-data

FormData:
  - heading: string (required) - e.g. "প্রধান শিক্ষকের বার্তা"
  - subheading: string (required) - Subheading text
  - salutation: string (required) - e.g. "শুভেচ্ছা"
  - message: string (required) - Main message
  - additionalMessage: string (optional) - Additional message
  - principalName: string (required) - e.g. "Dr. Muhammad Ali"
  - designation: string (required) - e.g. "Principal"
  - isActive: boolean (optional, default: true)
  - photo: file (optional, JPG/PNG, max 5MB)
```

**Response (201 Created)**:
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "heading": "প্রধান শিক্ষকের বার্তা",
  "subheading": "আমাদের দৃষ্টিভঙ্গি",
  "salutation": "শুভেচ্ছা",
  "message": "আমাদের স্কুলে স্বাগতম। আমরা বিশ্বাস করি...",
  "additionalMessage": "আরও বিস্তারিত বার্তা...",
  "principalName": "Dr. Muhammad Ali",
  "designation": "Principal",
  "photoUrl": "/uploads/principal/principal-1705313400000-123456789.jpg",
  "isActive": true,
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:30:00Z"
}
```

**Get Principal Messages (Public)**
```http
GET /home/principal-message
```

**Get Principal Messages (Admin)**
```http
GET /home/principal-message/admin
Authorization: Bearer <token>
```

**Get Single Principal Message**
```http
GET /home/principal-message/{id}
```

**Update Principal Message**
```http
PATCH /home/principal-message/{id}
Authorization: Bearer <token>
Content-Type: multipart/form-data

FormData:
  - heading: string (optional)
  - subheading: string (optional)
  - salutation: string (optional)
  - message: string (optional)
  - additionalMessage: string (optional)
  - principalName: string (optional)
  - designation: string (optional)
  - isActive: boolean (optional)
  - photo: file (optional)
```

**Delete Principal Message**
```http
DELETE /home/principal-message/{id}
Authorization: Bearer <token>
```

---

#### 1.6 Governing Board Members

**Create Board Member**
```http
POST /home/governing-board
Authorization: Bearer <token>
Content-Type: multipart/form-data

FormData:
  - name: string (required)
  - designation: string (required) - e.g. "Board Member", "Trustee"
  - order: number (optional, auto-increment if not provided)
  - isActive: boolean (optional, default: true)
  - photo: file (optional, JPG/PNG, max 5MB)
```

**Response (201 Created)**:
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "Ms. Fatima Khan",
  "designation": "Board Member",
  "photoUrl": "/uploads/governing-board/governing-board-1705313400000-123456789.jpg",
  "order": 1,
  "isActive": true,
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:30:00Z"
}
```

**Get All Board Members (Public)**
```http
GET /home/governing-board
```

**Get All Board Members (Admin)**
```http
GET /home/governing-board/admin
Authorization: Bearer <token>
```

**Get Single Board Member**
```http
GET /home/governing-board/{id}
```

**Update Board Member**
```http
PATCH /home/governing-board/{id}
Authorization: Bearer <token>
Content-Type: multipart/form-data

FormData:
  - name: string (optional)
  - designation: string (optional)
  - order: number (optional)
  - isActive: boolean (optional)
  - photo: file (optional)
```

**Reorder Board Member**
```http
PATCH /home/governing-board/{id}/reorder
Authorization: Bearer <token>
Content-Type: application/json

{
  "order": 2
}
```

**Delete Board Member**
```http
DELETE /home/governing-board/{id}
Authorization: Bearer <token>
```

---

#### 1.7 School History

**Create School History**
```http
POST /home/school-history
Authorization: Bearer <token>
Content-Type: application/json

{
  "content": "School was founded in 2000...",
  "isActive": true
}
```

**Get School History (Public)**
```http
GET /home/school-history
```

**Get All History Records (Admin)**
```http
GET /home/school-history/all
Authorization: Bearer <token>
```

**Update School History**
```http
PATCH /home/school-history/{id}
Authorization: Bearer <token>
```

---

### 2. ACADEMIC MODULE

Manages academic content like class routines, exam schedules, syllabi, and lesson plans.

#### 2.1 Class Routines

**Create Class Routine**
```http
POST /academic/class-routines
Authorization: Bearer <token>
Content-Type: multipart/form-data

FormData:
  - title: string (required)
  - description: string (optional)
  - file: file (required, PDF/DOC/DOCX, max 10MB)
```

**Get All Class Routines (Public)**
```http
GET /academic/class-routines
```

**Get All Class Routines (Admin)**
```http
GET /academic/class-routines/admin
Authorization: Bearer <token>
```

**Get Single Class Routine**
```http
GET /academic/class-routines/{id}
```

**Update Class Routine**
```http
PATCH /academic/class-routines/{id}
Authorization: Bearer <token>
Content-Type: multipart/form-data

FormData:
  - title: string (optional)
  - description: string (optional)
  - file: file (optional)
```

**Delete Class Routine**
```http
DELETE /academic/class-routines/{id}
Authorization: Bearer <token>
```

---

#### 2.2 Exam Routines

**Create Exam Routine**
```http
POST /academic/exam-routines
Authorization: Bearer <token>
Content-Type: multipart/form-data

FormData:
  - title: string (required)
  - description: string (optional)
  - file: file (required, PDF/DOC/DOCX, max 10MB)
```

**Get All Exam Routines (Public)**
```http
GET /academic/exam-routines
```

**Get All Exam Routines (Admin)**
```http
GET /academic/exam-routines/admin
Authorization: Bearer <token>
```

**Get Single Exam Routine**
```http
GET /academic/exam-routines/{id}
```

**Update Exam Routine**
```http
PATCH /academic/exam-routines/{id}
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Delete Exam Routine**
```http
DELETE /academic/exam-routines/{id}
Authorization: Bearer <token>
```

---

#### 2.3 Syllabi

**Create Syllabus**
```http
POST /academic/syllabuses
Authorization: Bearer <token>
Content-Type: multipart/form-data

FormData:
  - title: string (required)
  - class: string (required)
  - subject: string (required)
  - file: file (required, PDF/DOC/DOCX, max 10MB)
```

**Get All Syllabi (Public)**
```http
GET /academic/syllabuses
```

**Get All Syllabi (Admin)**
```http
GET /academic/syllabuses/admin
Authorization: Bearer <token>
```

**Get Single Syllabus**
```http
GET /academic/syllabuses/{id}
```

**Update Syllabus**
```http
PATCH /academic/syllabuses/{id}
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Delete Syllabus**
```http
DELETE /academic/syllabuses/{id}
Authorization: Bearer <token>
```

---

#### 2.4 Lesson Plans

**Create Lesson Plan**
```http
POST /academic/lesson-plans
Authorization: Bearer <token>
Content-Type: multipart/form-data

FormData:
  - title: string (required)
  - class: string (required)
  - subject: string (required)
  - month: string (required)
  - file: file (required, PDF/DOC/DOCX, max 10MB)
```

**Get All Lesson Plans (Public)**
```http
GET /academic/lesson-plans
```

**Get All Lesson Plans (Admin)**
```http
GET /academic/lesson-plans/admin
Authorization: Bearer <token>
```

**Get Single Lesson Plan**
```http
GET /academic/lesson-plans/{id}
```

**Update Lesson Plan**
```http
PATCH /academic/lesson-plans/{id}
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Delete Lesson Plan**
```http
DELETE /academic/lesson-plans/{id}
Authorization: Bearer <token>
```

---

### 3. SETTINGS MODULE

Manages global school configuration and branding.

**Create/Update Settings**
```http
POST /settings
Authorization: Bearer <token>
Content-Type: multipart/form-data

FormData:
  - schoolName: string (required) - School name in English
  - schoolNameBangla: string (required) - School name in Bangla
  - tagline: string (optional) - Tagline in English
  - taglineBangla: string (optional) - Tagline in Bangla
  - address: string (optional) - School address in English
  - addressBangla: string (optional) - School address in Bangla
  - phone: string (optional) - Contact phone
  - email: string (optional) - Contact email
  - eiin: string (optional) - EIIN number
  - schoolCode: string (optional) - School code
  - registrationNumber: string (optional) - Registration number
  - establishedYear: string (optional) - Year school was established
  - footerDescription: string (optional) - Footer text in English
  - footerDescriptionBangla: string (optional) - Footer text in Bangla
  - facebookUrl: string (optional) - Facebook URL
  - youtubeUrl: string (optional) - YouTube URL
  - logo: file (optional, PNG/JPG/SVG, max 5MB)
  - icon: file (optional, PNG/JPG/SVG, max 5MB)
```

**Response (201 Created)**:
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "schoolName": "ABC School",
  "schoolNameBangla": "এবিসি স্কুল",
  "tagline": "Quality Education for All",
  "taglineBangla": "সকলের জন্য মানসম্পন্ন শিক্ষা",
  "address": "123 School Street, City",
  "addressBangla": "১২৩ স্কুল স্ট্রিট, শহর",
  "phone": "+880-1234567890",
  "email": "info@school.com",
  "eiin": "123456",
  "schoolCode": "ABC001",
  "registrationNumber": "REG-001-2000",
  "establishedYear": "2000",
  "logoUrl": "/uploads/settings/logo-1705313400000-123456789.png",
  "iconUrl": "/uploads/settings/icon-1705313400000-987654321.png",
  "footerDescription": "© 2024 ABC School. All rights reserved.",
  "facebookUrl": "https://facebook.com/abcschool",
  "youtubeUrl": "https://youtube.com/abcschool",
  "isActive": true,
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:30:00Z"
}
```

**Get Settings (Public)**
```http
GET /settings
```

**Get All Settings (Admin)**
```http
GET /settings/all
Authorization: Bearer <token>
```

**Get Settings by ID (Admin)**
```http
GET /settings/{id}
Authorization: Bearer <token>
```

**Update Settings**
```http
PATCH /settings/{id}
Authorization: Bearer <token>
Content-Type: multipart/form-data

FormData: (same as Create)
```

**Delete Settings**
```http
DELETE /settings/{id}
Authorization: Bearer <token>
```

---

### 4. ADMISSIONS MODULE

Manages admission-related content and circulars.

**Create Admission**
```http
POST /admissions
Authorization: Bearer <token>
Content-Type: multipart/form-data

FormData:
  - title: string (required) - e.g. "Admission Circular 2025"
  - bodyHtml: string (optional) - HTML formatted admission details
  - admissionYear: string (optional) - e.g. "2025"
  - attachments: files (optional, up to 10 files, PDF/DOC/DOCX, max 10MB each)
```

**Response (201 Created)**:
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "title": "Admission Circular 2025",
  "bodyHtml": "<p>New admission is open for classes 1-10</p>",
  "attachments": [
    {
      "name": "admission_form.pdf",
      "url": "/uploads/admissions/admission-form-1705313400000-123456789.pdf"
    }
  ],
  "admissionYear": "2025",
  "isActive": true,
  "publishedAt": "2024-01-15T10:30:00Z"
}
```

**Get All Admissions (Public)**
```http
GET /admissions
```

**Get All Admissions (Admin)**
```http
GET /admissions/admin
Authorization: Bearer <token>
```

**Get Single Admission**
```http
GET /admissions/{id}
```

**Update Admission**
```http
PATCH /admissions/{id}
Authorization: Bearer <token>
Content-Type: multipart/form-data

FormData:
  - title: string (optional)
  - bodyHtml: string (optional)
  - admissionYear: string (optional)
  - attachments: files (optional)
```

**Delete Admission**
```http
DELETE /admissions/{id}
Authorization: Bearer <token>
```

---

### 5. CONTACT MODULE

Manages contact form submissions.

**Submit Contact Form**
```http
POST /contact
Content-Type: application/json

{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "subject": "Inquiry about admission",
  "message": "I would like to know more about..."
}
```

**Response (201 Created)**:
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "Jane Doe",
  "email": "jane@example.com",
  "subject": "Inquiry about admission",
  "message": "I would like to know more about...",
  "createdAt": "2024-01-15T10:30:00Z"
}
```

**Get All Contacts (Admin)**
```http
GET /contact/messages
Authorization: Bearer <token>
```

**Query Parameters**:
```
page: number (optional, default: 1)
limit: number (optional, default: 20)
```

**Response (200 OK)**:
```json
{
  "data": [
    {
      "id": "uuid",
      "name": "Jane Doe",
      "email": "jane@example.com",
      "subject": "Inquiry about admission",
      "message": "I would like to know more about...",
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ],
  "total": 5,
  "page": 1,
  "limit": 20
}
```

**Delete Contact Message**
```http
DELETE /contact/{id}
Authorization: Bearer <token>
```

---

### 6. DOWNLOADS MODULE

Manages downloadable resources like forms, brochures, etc.

**Create Download**
```http
POST /downloads
Authorization: Bearer <token>
Content-Type: multipart/form-data

FormData:
  - title: string (required) - e.g. "Admission Form 2025"
  - description: string (optional) - Brief description of the download
  - category: string (optional) - e.g. "forms", "brochures"
  - file: file (required, PDF/DOC/DOCX/ZIP, max 10MB)
```

**Response (201 Created)**:
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "title": "Admission Form 2025",
  "description": "Official admission form for 2025 session",
  "category": "forms",
  "fileUrl": "/uploads/downloads/admission-form-1705313400000-123456789.pdf",
  "isActive": true,
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:30:00Z"
}
```

**Get All Downloads (Public)**
```http
GET /downloads
```

**Get Downloads with Pagination**
```http
GET /downloads?page=1&limit=20
```

**Get Single Download**
```http
GET /downloads/{id}
```

**Update Download**
```http
PATCH /downloads/{id}
Authorization: Bearer <token>
Content-Type: multipart/form-data

FormData:
  - title: string (optional)
  - description: string (optional)
  - category: string (optional)
  - file: file (optional)
```

**Delete Download**
```http
DELETE /downloads/{id}
Authorization: Bearer <token>
```

---

### 7. EVENTS MODULE

Manages school events and activities.

**Create Event**
```http
POST /events
Authorization: Bearer <token>
Content-Type: multipart/form-data

FormData:
  - title: string (required) - e.g. "Annual Sports Day"
  - date: string (required, ISO format: 2025-01-15)
  - startTime: string (optional) - e.g. "09:00 AM"
  - endTime: string (optional) - e.g. "04:00 PM"
  - location: string (optional)
  - bodyHtml: string (optional, HTML content)
  - featurePhoto: file (optional, JPG/PNG/GIF, max 5MB)
  - photos: files (optional, up to 10 files, max 5MB each)
```

**Response (201 Created)**:
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "title": "Annual Sports Day",
  "date": "2025-01-15",
  "startTime": "09:00 AM",
  "endTime": "04:00 PM",
  "location": "School Playground",
  "bodyHtml": "<h2>Annual Sports Day 2025</h2><p>Join us for an exciting day...</p>",
  "bannerUrl": "/uploads/events/featurePhoto-1705313400000-123456789.jpg",
  "photos": [
    "/uploads/events/photos-1705313400000-111111111.jpg",
    "/uploads/events/photos-1705313400000-222222222.jpg"
  ],
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:30:00Z"
}
```

**Get All Events (Public)**
```http
GET /events
```

**Get Events with Pagination**
```http
GET /events?page=1&limit=20
```

**Get Single Event**
```http
GET /events/{id}
```

**Update Event**
```http
PATCH /events/{id}
Authorization: Bearer <token>
Content-Type: multipart/form-data

FormData:
  - title: string (optional)
  - date: string (optional)
  - startTime: string (optional)
  - endTime: string (optional)
  - location: string (optional)
  - bodyHtml: string (optional)
  - featurePhoto: file (optional)
  - photos: files (optional)
```

**Delete Event**
```http
DELETE /events/{id}
Authorization: Bearer <token>
```

---

### 8. GALLERIES MODULE

Manages photo galleries with cover images and collections.

**Create Gallery**
```http
POST /galleries
Authorization: Bearer <token>
Content-Type: multipart/form-data

FormData:
  - title: string (required) - e.g. "Annual Cultural Function"
  - description: string (optional)
  - cover: file (optional, JPG/PNG/GIF/WEBP, max 5MB)
  - photos: files (optional, up to 20 files, max 5MB each)
```

**Response (201 Created)**:
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "title": "Annual Cultural Function",
  "description": "Photos from our annual cultural event",
  "coverUrl": "/uploads/galleries/cover-1705313400000-123456789.jpg",
  "photos": [
    {
      "id": "photo-uuid-1",
      "url": "/uploads/galleries/photos-1705313400000-111111111.jpg"
    },
    {
      "id": "photo-uuid-2",
      "url": "/uploads/galleries/photos-1705313400000-222222222.jpg"
    }
  ],
  "isActive": true,
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:30:00Z"
}
```

**Get All Galleries (Public)**
```http
GET /galleries
```

**Get Single Gallery**
```http
GET /galleries/{id}
```

**Update Gallery**
```http
PATCH /galleries/{id}
Authorization: Bearer <token>
Content-Type: multipart/form-data

FormData:
  - title: string (optional)
  - description: string (optional)
  - cover: file (optional)
  - photos: files (optional)
```

**Delete Gallery**
```http
DELETE /galleries/{id}
Authorization: Bearer <token>
```

---

### 9. NOTICES MODULE

Manages school notices and announcements with file attachments.

**Create Notice**
```http
POST /notices
Authorization: Bearer <token>
Content-Type: multipart/form-data

FormData:
  - title: string (required) - e.g. "Holiday Notice"
  - summary: string (required) - Brief summary
  - bodyHtml: string (required, HTML content) - Full notice details
  - categories: array (optional) - e.g. ["Holiday", "Administrative"]
  - files: files (optional, up to 10 files, max 5MB each)
```

**Response (201 Created)**:
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "title": "Holiday Notice",
  "summary": "School will be closed for National Holiday",
  "bodyHtml": "<p>The school will remain closed on January 26 for the National Holiday.</p>",
  "categories": ["Holiday", "Administrative"],
  "attachments": [
    {
      "name": "notice.pdf",
      "url": "/uploads/notices/files-1705313400000-123456789.pdf"
    }
  ],
  "isActive": true,
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:30:00Z"
}
```

**Get All Notices (Public)**
```http
GET /notices
```

**Get Notices with Pagination**
```http
GET /notices?page=1&limit=20
```

**Response (200 OK)**:
```json
{
  "data": [
    {
      "id": "uuid",
      "title": "Holiday Notice",
      "summary": "School will be closed...",
      "categories": ["Holiday"],
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ],
  "total": 15,
  "page": 1,
  "limit": 20,
  "totalPages": 1
}
```

**Get Single Notice**
```http
GET /notices/{id}
```

**Update Notice**
```http
PATCH /notices/{id}
Authorization: Bearer <token>
Content-Type: multipart/form-data

FormData:
  - title: string (optional)
  - summary: string (optional)
  - bodyHtml: string (optional)
  - categories: array (optional)
  - files: files (optional)
```

**Delete Notice**
```http
DELETE /notices/{id}
Authorization: Bearer <token>
```

---

### 10. PAGES MODULE

Manages custom static pages with slug-based routing.

**Create Page**
```http
POST /pages
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "About Our School",
  "slug": "about-school",
  "content": "<h1>Welcome to ABC School</h1><p>Founded in 2000...</p>",
  "metaDescription": "Learn about ABC School's history and mission"
}
```

**Response (201 Created)**:
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "title": "About Our School",
  "slug": "about-school",
  "content": "<h1>Welcome to ABC School</h1><p>Founded in 2000...</p>",
  "metaDescription": "Learn about ABC School's history and mission",
  "isActive": true,
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:30:00Z"
}
```

**Get All Pages (Public)**
```http
GET /pages
```

**Response (200 OK)**:
```json
[
  {
    "id": "uuid",
    "title": "About Our School",
    "slug": "about-school",
    "metaDescription": "Learn about ABC School...",
    "createdAt": "2024-01-15T10:30:00Z"
  }
]
```

**Get Page by Slug (Public)**
```http
GET /pages/slug/about-school
```

**Get Page by ID (Admin)**
```http
GET /pages/{id}
Authorization: Bearer <token>
```

**Update Page**
```http
PATCH /pages/{id}
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Updated Title",
  "content": "<h1>Updated content</h1>",
  "metaDescription": "Updated description"
}
```

**Delete Page**
```http
DELETE /pages/{id}
Authorization: Bearer <token>
```

---

### 11. RESULTS MODULE

Manages exam results publication and archival.

**Create Result**
```http
POST /results
Authorization: Bearer <token>
Content-Type: multipart/form-data

FormData:
  - title: string (required) - e.g. "SSC Result 2024"
  - examType: string (required) - e.g. "SSC", "JSC", "Mid-Term"
  - year: string (required) - e.g. "2024"
  - file: file (optional, PDF/Excel/JPG, max 10MB)
```

**Response (201 Created)**:
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "title": "SSC Result 2024",
  "examType": "SSC",
  "year": "2024",
  "fileUrl": "/uploads/results/ssc-result-1705313400000-123456789.pdf",
  "isActive": true,
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:30:00Z"
}
```

**Get All Results (Public)**
```http
GET /results
```

**Get Results with Pagination**
```http
GET /results?page=1&limit=20
```

**Get Single Result**
```http
GET /results/{id}
```

**Update Result**
```http
PATCH /results/{id}
Authorization: Bearer <token>
Content-Type: multipart/form-data

FormData:
  - title: string (optional)
  - examType: string (optional)
  - year: string (optional)
  - file: file (optional)
```

**Delete Result**
```http
DELETE /results/{id}
Authorization: Bearer <token>
```

---

### 12. STAFF MODULE

Manages staff/teacher information and profiles.

**Create Staff**
```http
POST /staff
Authorization: Bearer <token>
Content-Type: multipart/form-data

FormData:
  - name: string (required) - e.g. "Mr. Karim Ahmed"
  - designation: string (required) - e.g. "Mathematics Teacher"
  - email: string (optional) - Staff email
  - phone: string (optional) - Contact number
  - shortBio: string (optional) - Brief biography
  - photo: file (optional, JPG/PNG/GIF/WEBP, max 5MB)
```

**Response (201 Created)**:
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "Mr. Karim Ahmed",
  "designation": "Mathematics Teacher",
  "email": "karim@school.com",
  "phone": "+880-1111111111",
  "shortBio": "10 years of teaching experience",
  "photoUrl": "/uploads/staff/staff-1705313400000-123456789.jpg",
  "isActive": true,
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:30:00Z"
}
```

**Get All Staff (Public)**
```http
GET /staff
```

**Get Staff with Pagination**
```http
GET /staff?page=1&limit=20
```

**Get Single Staff**
```http
GET /staff/{id}
```

**Update Staff**
```http
PATCH /staff/{id}
Authorization: Bearer <token>
Content-Type: multipart/form-data

FormData:
  - name: string (optional)
  - designation: string (optional)
  - email: string (optional)
  - phone: string (optional)
  - shortBio: string (optional)
  - photo: file (optional)
```

**Delete Staff**
```http
DELETE /staff/{id}
Authorization: Bearer <token>
```

---

## Dummy Data

### Sample Users for Testing

**Admin User for Testing**

```json
{
  "email": "admin@school.edu.bd",
  "password": "AdminPassword123"
}
```

**Sample Slider**
```json
{
  "title": "স্বাগতম গ্রীনফিল্ড উচ্চ বিদ্যালয়",
  "subtitle": "এবং কলেজ এর পক্ষ থেকে!",
  "linkUrl": "/about",
  "order": 1
}
```

**Sample About Section**
```json
{
  "title": "প্রতিষ্ঠান সম্পর্কে",
  "description": "গ্রীনফিল্ড উচ্চ বিদ্যালয় এবং কলেজ এর অত্যন্ত গৌরবোজ্জ্বল বর্তমান।",
  "buttonText": "বিস্তারিত পড়ুন",
  "buttonLink": "/about"
}
```

**Sample Important Link**
```json
{
  "title": "Online Portal",
  "description": "Access student portal",
  "url": "https://portal.school.com",
  "openInNewTab": true,
  "order": 1
}
```

**Sample Our Story**
```json
{
  "heading": "আমাদের গল্প",
  "subheading": "একটি শিক্ষার যাত্রা",
  "content": "আমরা বিশ্বাস করি যে শিক্ষা হল সমাজের মেরুদণ্ড।",
  "highlightedText": "গুণমান এবং উৎকর্ষতা"
}
```

**Sample Principal Message**
```json
{
  "heading": "প্রধান শিক্ষকের বার্তা",
  "subheading": "আমাদের দৃষ্টিভঙ্গি",
  "salutation": "শুভেচ্ছা",
  "message": "আমাদের স্কুলে স্বাগতম। আমরা বিশ্বাস করি সম্পূর্ণ শিক্ষায়।",
  "principalName": "Dr. Muhammad Ali",
  "designation": "Principal"
}
```

**Sample Board Member**
```json
{
  "name": "Ms. Fatima Khan",
  "designation": "Board Member",
  "order": 1
}
```

**Sample Class Routine**
```json
{
  "title": "Class Routine - 2025",
  "description": "Time schedule for all classes"
}
```

**Sample Exam Routine**
```json
{
  "title": "Final Exam Routine - 2025",
  "description": "Schedule for final examinations"
}
```

**Sample Syllabus**
```json
{
  "title": "English Syllabus - Class 10",
  "class": "10",
  "subject": "English"
}
```

**Sample Lesson Plan**
```json
{
  "title": "Math Lesson Plan - January 2025",
  "class": "9",
  "subject": "Mathematics",
  "month": "January"
}
```

**Sample Settings**
```json
{
  "schoolName": "ABC School",
  "schoolNameBangla": "এবিসি স্কুল",
  "tagline": "Quality Education for All",
  "taglineBangla": "সকলের জন্য মানসম্পন্ন শিক্ষা",
  "address": "123 School Street, City",
  "addressBangla": "১২৩ স্কুল স্ট্রিট, শহর",
  "phone": "+880-1234567890",
  "email": "info@school.com",
  "eiin": "123456",
  "schoolCode": "ABC001",
  "registrationNumber": "REG-001-2000",
  "establishedYear": "2000"
}
```

**Sample Admission**
```json
{
  "title": "Admission Circular 2025",
  "bodyHtml": "<h2>New admission is open for classes 1-10</h2><p>Contact office for more details</p>",
  "admissionYear": "2025"
}
```

**Sample Contact**
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "subject": "Inquiry about admission",
  "message": "I would like to know more about the admission process for class 6"
}
```

**Sample Download**
```json
{
  "title": "Admission Form 2025",
  "description": "Download the official admission form",
  "category": "forms"
}
```

**Sample Event**
```json
{
  "title": "Annual Sports Day",
  "date": "2025-02-15",
  "startTime": "09:00 AM",
  "endTime": "04:00 PM",
  "location": "School Playground",
  "bodyHtml": "<p>Our annual inter-house sports competition</p>"
}
```

**Sample Gallery**
```json
{
  "title": "Annual Cultural Function",
  "description": "Photos from our annual cultural event"
}
```

**Sample Notice**
```json
{
  "title": "Holiday Notice",
  "summary": "School will remain closed on National Holiday",
  "bodyHtml": "<p>The school will remain closed on January 26 for the National Holiday.</p>",
  "categories": ["Holiday", "Administrative"]
}
```

**Sample Page**
```json
{
  "title": "About Our School",
  "slug": "about-school",
  "content": "<h1>Welcome to ABC School</h1><p>Founded in 2000, we have been providing quality education...</p>",
  "metaDescription": "Learn about ABC School's history and mission"
}
```

**Sample Result**
```json
{
  "title": "SSC Result 2024",
  "examType": "SSC",
  "year": "2024"
}
```

**Sample Staff**
```json
{
  "name": "Mr. Karim Ahmed",
  "designation": "Mathematics Teacher",
  "email": "karim@school.com",
  "phone": "+880-1111111111",
  "shortBio": "10 years of teaching experience"
}
```
  "startDate": "2024-02-15",
  "endDate": "2024-02-17",
  "location": "School Playground"
}
```

**Sample Notice**
```json
{
  "title": "Holiday Notice",
  "summary": "School will remain closed on National Holiday",
  "bodyHtml": "<p>The school will remain closed on January 26 for the National Holiday.</p>",
  "categories": ["Holiday", "Administrative"]
}
```

**Sample Page**
```json
{
  "title": "About Our School",
  "slug": "about-school",
  "content": "<h1>Welcome to ABC School</h1><p>Founded in 2000, we have been providing quality education...</p>",
  "metaDescription": "Learn about ABC School's history and mission"
}
```

**Sample Result**
```json
{
  "title": "SSC Result 2024",
  "examType": "SSC",
  "year": "2024"
}
```

**Sample Staff**
```json
{
  "name": "Mr. Karim Ahmed",
  "designation": "Mathematics Teacher",
  "email": "karim@school.com",
  "phone": "+880-1111111111",
  "shortBio": "10 years of teaching experience"
}
```

---

## cURL Examples

### Authentication

**Signup**
```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@school.com",
    "password": "SecurePassword123"
  }'
```

**Login**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@school.com",
    "password": "SecurePassword123"
  }'
```

**Refresh Token**
```bash
curl -X POST http://localhost:3000/api/auth/refresh \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### Home Module - Sliders

**Create Slider**
```bash
curl -X POST http://localhost:3000/api/home/sliders \
  -H "Authorization: Bearer <your_access_token>" \
  -F "title=Welcome Banner" \
  -F "description=Welcome to our school" \
  -F "order=1" \
  -F "image=@/path/to/image.jpg"
```

**Get All Sliders**
```bash
curl -X GET http://localhost:3000/api/home/sliders
```

**Get Single Slider**
```bash
curl -X GET http://localhost:3000/api/home/sliders/550e8400-e29b-41d4-a716-446655440000
```

**Update Slider**
```bash
curl -X PATCH http://localhost:3000/api/home/sliders/550e8400-e29b-41d4-a716-446655440000 \
  -H "Authorization: Bearer <your_access_token>" \
  -F "title=Updated Title" \
  -F "image=@/path/to/new-image.jpg"
```

**Delete Slider**
```bash
curl -X DELETE http://localhost:3000/api/home/sliders/550e8400-e29b-41d4-a716-446655440000 \
  -H "Authorization: Bearer <your_access_token>"
```

### Academic Module - Class Routines

**Create Class Routine**
```bash
curl -X POST http://localhost:3000/api/academic/class-routines \
  -H "Authorization: Bearer <your_access_token>" \
  -F "title=Class Routine 2024" \
  -F "description=Time schedule for all classes" \
  -F "file=@/path/to/routine.pdf"
```

**Get All Class Routines**
```bash
curl -X GET http://localhost:3000/api/academic/class-routines
```

**Get Single Class Routine**
```bash
curl -X GET http://localhost:3000/api/academic/class-routines/550e8400-e29b-41d4-a716-446655440000
```

### Settings Module

**Create Settings**
```bash
curl -X POST http://localhost:3000/api/settings \
  -H "Authorization: Bearer <your_access_token>" \
  -F "nameEn=ABC School" \
  -F "nameBn=এবিসি স্কুল" \
  -F "taglineEn=Quality Education" \
  -F "address=123 School St, City" \
  -F "phone=+880-1234567890" \
  -F "logo=@/path/to/logo.png" \
  -F "icon=@/path/to/icon.png"
```

**Get Settings**
```bash
curl -X GET http://localhost:3000/api/settings
```

### Contact Module

**Submit Contact Form**
```bash
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Doe",
    "email": "jane@example.com",
    "subject": "Admission Inquiry",
    "message": "I would like to know about admission for class 6"
  }'
```

**Get All Contacts (Admin)**
```bash
curl -X GET http://localhost:3000/api/contact/messages \
  -H "Authorization: Bearer <your_access_token>"
```

### Notices Module

**Create Notice**
```bash
curl -X POST http://localhost:3000/api/notices \
  -H "Authorization: Bearer <your_access_token>" \
  -F "title=Holiday Notice" \
  -F "summary=School will be closed" \
  -F "bodyHtml=<p>The school will be closed for National Holiday</p>" \
  -F "categories=Holiday,Administrative" \
  -F "files=@/path/to/file.pdf"
```

**Get All Notices**
```bash
curl -X GET http://localhost:3000/api/notices
```

**Get Paginated Notices**
```bash
curl -X GET "http://localhost:3000/api/notices?page=1&limit=10"
```

---

## API Summary Table

| Module | Endpoint | Method | Auth | Description |
|--------|----------|--------|------|-------------|
| Auth | `/auth/signup` | POST | No | Create new admin user |
| Auth | `/auth/login` | POST | No | Login with credentials |
| Auth | `/auth/logout` | POST | Yes | Logout current user |
| Auth | `/auth/refresh` | POST | No | Refresh access token |
| Home | `/home/sliders` | GET | No | Get all active sliders |
| Home | `/home/sliders` | POST | Yes | Create new slider |
| Home | `/home/sliders/:id` | GET | No | Get single slider |
| Home | `/home/sliders/:id` | PATCH | Yes | Update slider |
| Home | `/home/sliders/:id` | DELETE | Yes | Delete slider |
| Home | `/home/about` | GET | No | Get all about sections |
| Home | `/home/about` | POST | Yes | Create about section |
| Home | `/home/important-links` | GET | No | Get all important links |
| Home | `/home/important-links` | POST | Yes | Create important link |
| Home | `/home/our-story` | GET | No | Get all our story items |
| Home | `/home/our-story` | POST | Yes | Create our story |
| Home | `/home/principal-message` | GET | No | Get principal messages |
| Home | `/home/principal-message` | POST | Yes | Create principal message |
| Home | `/home/governing-board` | GET | No | Get board members |
| Home | `/home/governing-board` | POST | Yes | Create board member |
| Home | `/home/school-history` | GET | No | Get school history |
| Home | `/home/school-history` | POST | Yes | Create school history |
| Academic | `/academic/class-routines` | GET | No | Get class routines |
| Academic | `/academic/class-routines` | POST | Yes | Create class routine |
| Academic | `/academic/exam-routines` | GET | No | Get exam routines |
| Academic | `/academic/exam-routines` | POST | Yes | Create exam routine |
| Academic | `/academic/syllabuses` | GET | No | Get syllabi |
| Academic | `/academic/syllabuses` | POST | Yes | Create syllabus |
| Academic | `/academic/lesson-plans` | GET | No | Get lesson plans |
| Academic | `/academic/lesson-plans` | POST | Yes | Create lesson plan |
| Settings | `/settings` | GET | No | Get settings |
| Settings | `/settings` | POST | Yes | Create settings |
| Settings | `/settings/:id` | PATCH | Yes | Update settings |
| Admissions | `/admissions` | GET | No | Get admissions |
| Admissions | `/admissions` | POST | Yes | Create admission |
| Contact | `/contact` | POST | No | Submit contact form |
| Contact | `/contact/messages` | GET | Yes | Get all contact messages |
| Downloads | `/downloads` | GET | No | Get downloads |
| Downloads | `/downloads` | POST | Yes | Create download |
| Events | `/events` | GET | No | Get events |
| Events | `/events` | POST | Yes | Create event |
| Galleries | `/galleries` | GET | No | Get galleries |
| Galleries | `/galleries` | POST | Yes | Create gallery |
| Notices | `/notices` | GET | No | Get notices |
| Notices | `/notices` | POST | Yes | Create notice |
| Pages | `/pages` | GET | No | Get pages |
| Pages | `/pages` | POST | Yes | Create page |
| Results | `/results` | GET | No | Get results |
| Results | `/results` | POST | Yes | Create result |
| Staff | `/staff` | GET | No | Get staff |
| Staff | `/staff` | POST | Yes | Create staff |

---

## Development Environment Setup

### Prerequisites

- Node.js v18+
- PostgreSQL 12+
- pnpm (package manager)

### Installation

```bash
# Install dependencies
pnpm install

# Copy environment variables
cp .env.example .env

# Update .env with your database configuration
DATABASE_URL=postgresql://user:password@localhost:5432/school_db
JWT_SECRET=your_secret_key

# Run migrations (auto with synchronize: true)
pnpm run start:dev
```

### Running the Application

```bash
# Development mode (with auto-reload)
pnpm run dev

# Production build
pnpm run build
pnpm run start:prod

# Run tests
pnpm run test

# Run e2e tests
pnpm run test:e2e

# Lint check
pnpm run lint:check

# Code formatting
pnpm run format:check

# Run CI checks (lint + format + build)
pnpm run ci:check
```

### Docker Setup

```bash
# Start PostgreSQL in Docker
docker-compose up -d

# Run application
pnpm run start:dev

# View API documentation
# Navigate to http://localhost:3000/api
```

---

## Performance Tips

1. **Pagination**: Always use pagination for list endpoints: `?page=1&limit=20`
2. **Caching**: Frontend can cache public endpoints (GET requests)
3. **File Uploads**: Compress images before upload to improve performance
4. **Token Refresh**: Refresh access token before expiration using refresh token
5. **Batch Operations**: Group multiple updates when possible

---

## Support & Troubleshooting

### Common Issues

**401 Unauthorized**
- Ensure token is included in `Authorization: Bearer <token>` header
- Check if token has expired (15 minutes)
- Use refresh token to get a new access token

**400 Bad Request**
- Verify all required fields are provided
- Check data types and formats
- For file uploads, ensure file is within size limit

**404 Not Found**
- Verify the resource ID is correct
- Ensure resource exists in database

**413 Payload Too Large**
- Reduce file size (check File Upload Specifications above)

### API Response Times

- List endpoints: ~100-200ms
- Single item endpoints: ~50-100ms
- Create/Update endpoints: ~150-300ms
- File upload endpoints: ~500-2000ms (depends on file size)

---

**Last Updated**: December 2025  
**Documentation Version**: 2.0.0  
**API Status**: ✅ Production Ready
