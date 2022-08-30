import * as express from "express";
import { DatabaseUtils } from "../utils/database_utils";

class DatabaseController {
  public student = "/student";
  public studentGroups = "/student/groups";
  public studentSchedule = "/student/schedule";
  public professor = "/professor";
  public professorGroups = "/professor/groups";
  public professorSchedule = "/professor/schedule";
  public groupList = "/group";
  public classroom = "/classroom";
  public classroomList = "/classroom/list";
  public programs = '/programs';

  public router = express.Router();

  constructor() {
    this.intializeRoutes();
  }

  public intializeRoutes() {
    this.router.get(this.student, this.getStudent);
    this.router.get(this.professor, this.getProfessor);
    this.router.get(this.classroom, this.getClassroom);
    this.router.get(this.groupList, this.getGroupList);
    this.router.get(this.professorSchedule, this.getProfessorSchedule);
    this.router.get(this.professorGroups, this.getProfessorGroups);
    this.router.get(this.studentSchedule, this.getStudentSchedule);
    this.router.get(this.studentGroups, this.getStudentGroups);
    this.router.get(this.classroomList, this.getClassroomList);
    this.router.get(this.programs, this.getPrograms);
  }

  public async getPrograms(request: express.Request, response: express.Response) {
    const connection = DatabaseUtils.getInstance();
    const data = await connection.getProgramsList();
    response.json(data);
  }

  public async getClassroomList(request: express.Request, response: express.Response) {
    const connection = DatabaseUtils.getInstance();
    const data = await connection.getClassroomList();
    response.json(data);
  }

  public async getStudent(request: express.Request, response: express.Response) {
    const connection = DatabaseUtils.getInstance();
    const studentId = request.query.id;
    const data = await connection.getStudent(studentId);
    response.json(data);
  }

  public async getProfessor(request: express.Request, response: express.Response) {
    const connection = DatabaseUtils.getInstance();
    const professorId = request.query.id;
    const data = await connection.getProfessor(professorId);
    response.json(data);
  }

  public async getClassroom(request: express.Request, response: express.Response) {
    const connection = DatabaseUtils.getInstance();
    const classroom = request.query.id;
    const data = await connection.getClassroomSchedule(classroom);
    response.json(data);
  }

  public async getGroupList(request: express.Request, response: express.Response) {
    const connection = DatabaseUtils.getInstance();
    const group = request.query.group;
    const subject = request.query.subject;
    const data = await connection.getGroupList(group, subject);
    response.json(data);
  }

  public async getProfessorSchedule(request: express.Request, response: express.Response) {
    const connection = DatabaseUtils.getInstance();
    const id = request.query.id;
    const data = await connection.getProfessorSchedule(id);
    response.json(data);
  }

  public async getProfessorGroups(request: express.Request, response: express.Response) {
    const connection = DatabaseUtils.getInstance();
    const id = request.query.id;
    const data = await connection.getProfessorGroups(id);
    response.json(data);
  }

  public async getStudentSchedule(request: express.Request, response: express.Response) {
    const connection = DatabaseUtils.getInstance();
    const id = request.query.id;
    const data = await connection.getStudentSchedule(id);
    response.json(data);
  }

  public async getStudentGroups(request: express.Request, response: express.Response) {
    const connection = DatabaseUtils.getInstance();
    const id = request.query.id;
    const data = await connection.getStudentGroups(id);
    response.json(data);
  }

}

export default new DatabaseController();
