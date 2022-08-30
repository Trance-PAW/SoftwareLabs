import * as express from 'express';
import * as formidable from 'formidable';
import * as XLSX from 'xlsx';
import { DatabaseUtils } from '../utils/database_utils';
import { XLSXUtils } from '../utils/xlsx_utils';

enum ResponseCodes {
  DATABASE_UPDATED = 0,
  NO_INPUT_FILE = 1,
  WRONG_FILE_FORMAT = 2,
  DATABASE_ERROR = 3,
  UNKNOWN_ERROR = 4,
}

class FilesController {
  public update = "/updateDatabase";
  public router = express.Router();

  constructor() {
    this.intializeRoutes();
  }

  public intializeRoutes() {
    this.router.post(this.update, this.updateDatabase);
  }

  public async updateDatabase(request: express.Request, response: express.Response) {
    console.log('FilesController : updateDatabase');
    const form = new formidable.IncomingForm();
    form.parse(request, (error: any, fields: formidable.Fields, files: formidable.Files) => {
      if (error) {
        console.error('error: ${error}');
        response.json({
          code: ResponseCodes.UNKNOWN_ERROR,
          message: 'Unknown error',
        });
        return;
      }
      // files is a map structure, so we need to get the key of the first element
      const key = Object.keys(files)[0];
      const file = files[key];

      // Open the file and read its content
      if (file) {
        const workbook = XLSX.readFile(file.path);
        const isValid = XLSXUtils.checkXLSXFileFormat(workbook);
        if (isValid) {
          FilesController.updateDatabase(workbook);
          response.json({
            code: ResponseCodes.DATABASE_UPDATED,
            message: 'Database updated',
          });
        } else {
          response.json({
            code: ResponseCodes.WRONG_FILE_FORMAT,
            message: 'The file format is invalid',
          });
        }
      } else {
        console.log('no file provided');
        response.json({
          code: ResponseCodes.NO_INPUT_FILE,
          message: 'No file was provided',
        });
      }
    });
  }

  private static updateDatabase(workbook: XLSX.WorkBook) {
    const db = DatabaseUtils.getInstance();
    db.clearDatabase();
    const professors = XLSXUtils.getProfessors(workbook);
    db.insertProfessorList(professors);

    const subjects = XLSXUtils.getSubjects(workbook);
    db.insertSubjectList(subjects);

    const groups = XLSXUtils.getGroups(workbook);
    db.insertGroupList(groups);

    const classes = XLSXUtils.getClasses(workbook);
    db.insertClassList(classes);

    const students = XLSXUtils.getStudents(workbook);
    db.insertStudentList(students);

    const programs = XLSXUtils.getPrograms(workbook);
    db.insertProgramList(programs);

    const enrollments = XLSXUtils.getEnrollments(workbook);
    db.insertEnrollmentList(enrollments);

    const classrooms = XLSXUtils.getClassrooms(workbook);
    db.insertClassroomList(classrooms);
  }

}

export default new FilesController();
