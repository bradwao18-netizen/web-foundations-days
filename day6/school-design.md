# School Database Design

## Tables

### students
Stores each student. Columns: id (primary key), name, email (unique, so no two students share an email).

### courses
Stores each course. Columns: id (primary key), title, credits.

### enrolments
Records that a student is taking a course, and their grade. Columns: id (primary key), student_id and course_id (foreign keys), grade.

## Relationships

- **One-to-many:** one student can have many enrolments, and one course can have many enrolments. Each enrolment belongs to exactly one student and one course.
- **Many-to-many:** students and courses. A student takes many courses, and a course has many students.

## Why a join table is needed

A many-to-many relationship cannot be stored directly in two tables without repeating data or cramming several values into one cell. The enrolments table sits in the middle and holds one row per student-course pair. It is also the natural place for the grade, since the grade belongs to the pair. A UNIQUE rule on (student_id, course_id) stops a student enrolling twice.

## Index

I would add an index on `students(name)`:

    CREATE INDEX idx_students_name ON students(name);

Reason: we often look students up by name (for example in query 1). Without an index the database checks every row; with one it jumps straight to the match, which matters as the school grows.

## SQL or NoSQL?

I would choose SQL for this system. The data is highly structured and relational: students, courses and enrolments are linked to each other, and we need rules such as unique emails and no duplicate enrolments. SQL enforces these with keys and constraints, and handles questions like "how many students per course?" easily with JOIN and GROUP BY. NoSQL suits flexible, changing, or document-shaped data, which is not the case here.