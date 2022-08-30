import * as express from 'express';

import { DatabaseUtils } from "../utils/database_utils";

class RecordController {
    public recordRoute = '/record/create';
    public recordsQueryRoute = '/record';

    public router = express.Router();

    constructor() {
        this.initializeRoutes();
    }

    public initializeRoutes() {
        this.router.post(this.recordRoute, this.newRecord);
        this.router.get(this.recordsQueryRoute, this.getRecords);
    }

    public async newRecord(request: express.Request, response: express.Response) {
        const { employeeId, studentId, classroom, groupId, subjectId } = request.body;
        if (!(studentId && classroom && groupId && subjectId) && !(employeeId && classroom && groupId && subjectId)) {
            return response.status(400).send();
        }
        const date = new Date().getTime();
        const utils = DatabaseUtils.getInstance();
        if (studentId) {
            const sqlQuery = "INSERT INTO records" +
                "(student_id, classroom, subject_id, group_id, date) VALUES (?, ?, ?, ?, ?)";
            utils.queryPromise(sqlQuery, [studentId, classroom, subjectId, groupId, date]);
            return response.send();
        } else {
            const sqlQuery = "INSERT INTO employee_records" +
                "(employee_id, classroom, subject_id, group_id, date) VALUES (?, ?, ?, ?, ?)";
            utils.queryPromise(sqlQuery, [employeeId, classroom, subjectId, groupId, date]);
            return response.send();
        }
    }

    public async getRecords(request: express.Request, response: express.Response) {
        const { type, programId, classroom, subjectId, groupId, start, end } = request.query;
        if (!(type && classroom && start && end)) {
            response.status(400).send();
        }
        if ((subjectId && !groupId) || (!subjectId && groupId)) {
            response.status(400).send();
        }

        if (type === 'students') {
            let sqlQuery = `SELECT r.student_id, s.name, r.group_id, r.subject_id, r.date, p.program_id
                            FROM records r JOIN students s ON r.student_id = s.student_id
                            JOIN programs p ON p.program_id = s.program_id
                            WHERE r.classroom = ? AND r.date BETWEEN ? AND ?`;
            const values = [classroom, start, end];
            if (programId) {
                sqlQuery += "\nAND s.program_id = ?";
                values.push(programId);
            }
            if (subjectId && groupId) {
                sqlQuery += "\nAND r.group_id = ? AND subject_id = ?";
                values.push(groupId, subjectId);
            }
            const utils = DatabaseUtils.getInstance();
            const result = await utils.queryPromise(sqlQuery, values);
            return response.send(result);
        } else {
            const sqlQuery = `SELECT p.professor_id, p.name, r.group_id, r.subject_id, r.date
                                FROM employee_records r JOIN professors p
                                ON r.employee_id = p.professor_id
                                WHERE r.classroom = ? AND r.date BETWEEN ? AND ?`;
            const values = [classroom, start, end];
            const utils = DatabaseUtils.getInstance();
            const result = await utils.queryPromise(sqlQuery, values);
            return response.send(result);
        }
    }
}
export default new RecordController();
