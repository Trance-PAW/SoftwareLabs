export class DatabaseQueries {
    public static professor = `
        SELECT * FROM professors
        WHERE professor_id = ?`;

    public static professorGroups = `
        SELECT g.group_id, s.subject_id, s.name
        FROM c_groups g
        JOIN subjects s
        ON g.subject_id = s.subject_id
        WHERE professor_id = ?;`;

    public static professorSchedule = `
        SELECT g.group_id, g.professor_id, c.day, c.start_hour, c.end_hour, c.classroom
        FROM c_groups g
        JOIN classes c
        ON c.group_id = g.group_id
        AND c.subject_id = g.subject_id
        WHERE professor_id = ?
        ORDER BY c.day, c.start_hour;`;

    public static student = `
        SELECT * FROM students
        WHERE student_id = ?`;

    public static studentGroups = `
        SELECT e.group_id, s.name
        FROM enrollments e
        JOIN subjects s
        ON e.subject_id = s.subject_id
        WHERE e.student_id = ?;`;

    public static studentSchedule = `
        SELECT e.group_id, s.name, c.day, c.start_hour, c.end_hour, c.classroom
        FROM enrollments e
        JOIN subjects s
        ON e.subject_id = s.subject_id
        JOIN classes c
        ON c.subject_id = e.subject_id
        AND c.group_id = e.group_id
        WHERE e.student_id = ?
        ORDER BY c.day, c.start_hour;`;

    public static getGroupList = `
        SELECT e.student_id, s.name
        FROM enrollments e
        JOIN students s
        ON e.student_id = s.student_id
        WHERE e.group_id = ?
        AND e.subject_id = ?;`;

    public static getClassroomSchedule = `
        SELECT c.group_id, c.subject_id, s.name, c.day, c.start_hour, c.end_hour, g.professor_id, p.name as professor
        FROM classes c
        JOIN c_groups g
        ON c.group_id = g.group_id
        AND c.subject_id = g.subject_id
        JOIN subjects s
        ON c.subject_id = s.subject_id
        JOIN professors p
        ON p.professor_id = g.professor_id
        WHERE classroom = ?
        ORDER BY c.day, c.start_hour;`;
}
