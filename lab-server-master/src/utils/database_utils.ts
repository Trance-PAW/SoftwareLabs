import mysql from "mysql";
import { environment } from "../environments/environment";
import { Class } from '../models/class';
import { Enrollment } from '../models/enrrollment';
import { Group } from '../models/group';
import { Professor } from '../models/professor';
import { Student } from '../models/student';
import { Subject } from '../models/subject';
import { User } from '../models/user';
import { UserRole } from "../models/user-role.enum";
import { DatabaseQueries } from "./database_queries";

export class DatabaseUtils {
    private static instance: DatabaseUtils;
    private connection: mysql.Connection;

    private constructor() {
        this.connection = mysql.createConnection(environment.databaseConfig);
        this.connection.connect();
    }

    public static getInstance(): DatabaseUtils {
        if (!DatabaseUtils.instance) {
            DatabaseUtils.instance = new DatabaseUtils();
        }
        return DatabaseUtils.instance;
    }

    public async createUserWithEmailAndPassword(email: string, password: string, name: string, role: UserRole) {
        const sqlStatement = "INSERT INTO users(email, password, name, role) VALUES (?, ?, ?, ?)";
        return this.queryPromise(sqlStatement, [email, password, name, role]);
    }

    public async updateUser(id: number, email: string, password: string, name: string) {
        const sqlStatement = "UPDATE users SET email = ?, password = ?, name = ? WHERE user_id = ?";
        return this.queryPromise(sqlStatement, [email, password, name]);
    }

    public async assignClassroomAdmin(userId: number, classroom: string) {
        const sqlStatement = "INSERT INTO lab_admins(user_id, classroom) VALUES (?, ?)";
        return this.queryPromise(sqlStatement, [userId, classroom]);
    }

    public async getClassroomAdmins() {
        const sqlStatement = `SELECT u.user_id, u.email, u.name, l.classroom
            FROM users u JOIN lab_admins l ON u.user_id = l.user_id
            WHERE u.role = 1 OR u.role = 2`;
        return this.queryPromise(sqlStatement, []);
    }

    public async getClassroomAdmin(classroom: string) {
        const sqlStatement = `SELECT u.user_id, u.email, u.name, l.classroom
            FROM users u JOIN lab_admins l ON u.user_id = l.user_id
            WHERE l.classroom = ?`;
        return this.queryPromise(sqlStatement, [classroom]);
    }

    public getUserWithEmail(email: string) {
        const sqlStatement = "SELECT * FROM users WHERE email = ?";
        return this.queryPromise(sqlStatement, email);
    }

    public getAssignedClassroomOfUser(userId: number) {
        const sqlStatement = "SELECT * FROM lab_admins WHERE user_id = ?";
        return this.queryPromise(sqlStatement, userId);
    }

    public insertProfessor(professor: Professor) {
        const sqlStatement = "INSERT INTO professors(professor_id, name) VALUES (?, ?)";
        this.connection.query(
            sqlStatement, [professor.professorId, professor.name], (error, results, fields) => {
                if (error) { console.log(error); }
            });
    }

    public insertProfessorList(professors: Professor[]) {
        const sqlStatement = "INSERT INTO professors(professor_id, name) VALUES ?";
        const data = professors.map((item) => [item.professorId, item.name]);
        this.connection.query(
            sqlStatement, [data], (error, results, fields) => {
                if (error) { console.log(error); }
            });
    }

    public insertSubject(subject: Subject) {
        const sqlStatement = "INSERT INTO subjects(subject_id, name, modality) VALUES (?, ?, ?)";
        this.connection.query(
            sqlStatement, [subject.subjectId, subject.name, subject.modality], (error, results, fields) => {
                if (error) { console.log(error); }
            });
    }

    public insertSubjectList(subjects: Subject[]) {
        const sqlStatement = "INSERT INTO subjects(subject_id, name, modality) VALUES ?";
        const data = subjects.map((item) => [item.subjectId, item.name, item.modality]);
        this.connection.query(
            sqlStatement, [data], (error, results, fields) => {
                if (error) { console.log(error); }
            });
    }

    public insertGroup(group: Group) {
        const sqlStatement = "INSERT INTO c_groups(group_id, subject_id, professor_id) VALUES (?, ?, ?)";
        this.connection.query(
            sqlStatement, [group.groupId, group.subjectId, group.professorId], (error, results, fields) => {
                if (error) { console.log(error); }
            });
    }

    public insertGroupList(groups: Group[]) {
        const sqlStatement = "INSERT INTO c_groups(group_id, subject_id, professor_id) VALUES ?";
        const data = groups.map((item) => [item.groupId, item.subjectId, item.professorId]);
        this.connection.query(
            sqlStatement, [data], (error, results, fields) => {
                if (error) { console.log(error); }
            });
    }

    public insertClass(sClass: Class) {
        const sqlStatement = "INSERT INTO classes(group_id, day, start_hour, end_hour, classroom, subject_id) VALUES (?, ?, ?, ?, ?, ?)";
        this.connection.query(sqlStatement,
            [sClass.groupId, sClass.day, sClass.startHour, sClass.endHour,
            sClass.classroom, sClass.subjectId], (error, results, fields) => {
                if (error) { console.log(error); }
            });
    }

    public insertClassList(classes: Class[]) {
        const sqlStatement = "INSERT INTO classes(group_id, day, start_hour, end_hour, classroom, subject_id) VALUES ?";
        const data = classes.map((item) =>
            [item.groupId, item.day, item.startHour, item.endHour, item.classroom, item.subjectId]);
        this.connection.query(sqlStatement, [data], (error, results, fields) => {
            if (error) { console.log(error); }
        });
    }

    public insertStudent(student: Student) {
        const sqlStatement = "INSERT INTO students(student_id, program_id, status, name) VALUES (?, ?, ?, ?)";
        this.connection.query(sqlStatement,
            [student.studentId, student.programId, student.status, student.name], (error, results, fields) => {
                if (error) { console.log(error); }
            });
    }

    public insertStudentList(students: Student[]) {
        const sqlStatement = "INSERT INTO students(student_id, program_id, status, name) VALUES ?";
        const data = students.map((item) => [item.studentId, item.programId, item.status, item.name]);
        this.connection.query(sqlStatement, [data], (error, results, fields) => {
            if (error) { console.log(error); }
        });
    }

    public insertEnrollment(enrollment: Enrollment) {
        const sqlStatement = "INSERT INTO enrollments(student_id, group_id, subject_id) VALUES (?, ?, ?)";
        this.connection.query(
            sqlStatement,
            [enrollment.studentId, enrollment.groupId, enrollment.subjectId],
            (error, results, fields) => {
                if (error) { console.log(error); }
            });
    }

    public insertEnrollmentList(enrollments: Enrollment[]) {
        const sqlStatement = "INSERT INTO enrollments(student_id, group_id, subject_id) VALUES ?";
        const data = enrollments.map((item) => [item.studentId, item.groupId, item.subjectId]);
        this.connection.query(sqlStatement, [data], (error, results, fields) => {
            if (error) { console.log(error); }
        });
    }

    public insertClassroomList(classrooms: string[]) {
        const sqlStatement = "INSERT INTO classrooms(classroom) VALUES ?";
        const data = classrooms.map((item) => [item]);
        this.connection.query(sqlStatement, [data], (error) => {
            if (error) { console.log(error); }
        });
    }

    public insertProgramList(programs: string[]) {
        const sqlStatement = "INSERT INTO programs(program_id) VALUES ?";
        const data = programs.map((item) => [item]);
        this.connection.query(sqlStatement, [data], (error, results, fields) => {
            if (error) { console.log(error); }
        });
    }

    public getStudent(studentId: string) {
        const sqlStatement = DatabaseQueries.student;
        return this.queryPromise(sqlStatement, studentId);
    }

    public getProfessor(professorId: string) {
        const sqlStatement = DatabaseQueries.professor;
        return this.queryPromise(sqlStatement, professorId);
    }

    public getClassroomSchedule(classroom: string) {
        const sqlStatement = DatabaseQueries.getClassroomSchedule;
        return this.queryPromise(sqlStatement, classroom);
    }

    public getGroupList(groupId: string, subjectId: string) {
        const sqlStatement = DatabaseQueries.getGroupList;
        return this.queryPromise(sqlStatement, [groupId, subjectId]);
    }

    public getProfessorSchedule(progessorId: string) {
        const sqlStatement = DatabaseQueries.professorSchedule;
        return this.queryPromise(sqlStatement, progessorId);
    }

    public getProfessorGroups(progessorId: string) {
        const sqlStatement = DatabaseQueries.professorGroups;
        return this.queryPromise(sqlStatement, progessorId);
    }

    public getStudentSchedule(studentId: string) {
        const sqlStatement = DatabaseQueries.studentSchedule;
        return this.queryPromise(sqlStatement, studentId);
    }

    public getStudentGroups(studentId: string) {
        const sqlStatement = DatabaseQueries.studentGroups;
        return this.queryPromise(sqlStatement, studentId);
    }

    public getClassroomList() {
        const sqlStatement = "SELECT * FROM classrooms";
        return this.queryPromise(sqlStatement, []);
    }

    public getProgramsList() {
        const sqlStatement = "SELECT * FROM programs";
        return this.queryPromise(sqlStatement, []);
    }

    public clearDatabase() {
        this.execute('SET FOREIGN_KEY_CHECKS = 0');
        const tables = ['classes', 'c_groups', 'subjects', 'classrooms',
            'professors', 'students', 'enrollments', 'programs'];
        for (const table of tables) {
            const sql = `TRUNCATE TABLE ${table}`;
            this.execute(sql);
        }
        this.execute('SET FOREIGN_KEY_CHECKS = 1');
    }

    public async findUserById(id: string): Promise<User> {
        const sqlStatement = "SELECT * FROM users WHERE user_id = ?";
        const data: any = await this.queryPromise(sqlStatement, [id]);
        if (data.length > 0) {
            return new User(id, data[0].email, data[0].name, data[0].role);
        }
        return null;
    }

    public async deleteUserById(id: string) {
        const sqlStatement = "DELETE FROM users WHERE user_id = ?";
        return this.queryPromise(sqlStatement, [id]);
    }

    private execute(sql: string) {
        this.connection.query(sql, (error) => {
            if (error) { console.log(error); }
        });
    }

    public queryPromise(sql: string, values: any) {
        return new Promise((resolve, reject) => {
            this.connection.query(sql, values, (error, results) => {
                if (error) {
                    return reject(error);
                }
                resolve(results);
            });
        });
    }
}
