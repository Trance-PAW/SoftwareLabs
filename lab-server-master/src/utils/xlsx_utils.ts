import { stringify } from 'querystring';
import * as XLSX from 'xlsx';
import { Class } from '../models/class';
import { Enrollment } from '../models/enrrollment';
import { Group } from '../models/group';
import { Professor } from '../models/professor';
import { Student } from '../models/student';
import { Subject } from '../models/subject';

export class XLSXUtils {

  private static expectedStudentHeaders = [
    'Programa', 'Matricula', 'NombreDelAlumno', 'Estatus',
    'Campus', 'Modalidad', 'Clave', 'Materia', 'Grupo',
  ];

  private static expectedGroupHeaders = [
    'Grupo', 'Clave', 'Materia', 'Modalidad', 'Cve_Empleado', 'Nombre', 'Cupo',
    'Inscritos', 'TipoGrupo', 'Porcentaje', 'HLunes', 'L_SalonGrupo', 'HMartes',
    'M_SalonGrupo', 'HMiercoles', 'MM_SalonGrupo', 'HJueves', 'J_SalonGrupo',
    'HViernes', 'V_SalonGrupo', 'HSabado', 'S_SalonGrupo', 'HDomingo', 'D_SalonGrupo',
  ];

  public static checkXLSXFileFormat(workbook: XLSX.WorkBook) {
    const firstSheetName = workbook.SheetNames[0];
    const secondSheetName = workbook.SheetNames[1];

    let worksheet = workbook.Sheets[firstSheetName];
    let headers = XLSXUtils.getWorksheetHeaders(worksheet);
    if (!XLSXUtils.arrayContainsAll(headers, this.expectedStudentHeaders)) {
      return false;
    }

    worksheet = workbook.Sheets[secondSheetName];
    headers = XLSXUtils.getWorksheetHeaders(worksheet);
    if (!XLSXUtils.arrayContainsAll(headers, this.expectedGroupHeaders)) {
      return false;
    }

    return true;
  }

  private static getWorksheetHeaders(worksheet: XLSX.WorkSheet) {
    const headers = [];
    for (let i = 0; ; i++) {
      const char = String.fromCharCode(i + 65);
      const cellKey = `${char}1`;
      const cell = worksheet[cellKey];
      const value = (cell ? cell.v : undefined);
      if (value === undefined) {
        break;
      }
      headers.push(value);
    }
    return headers;
  }

  private static arrayContainsAll(array: any[], items: any[]) {
    for (const item of items) {
      if (array!.indexOf(item) === -1) {
        return false;
      }
    }
    return true;
  }

  public static getStudents(workbook: XLSX.WorkBook): Student[] {
    const students = new Map<number, Student>();
    const jsonArray: any[] = XLSXUtils.getJsonFromWorksheet(workbook, 0);
    for (const json of jsonArray) {
      const status = json.Estatus;
      const statusCode = status === 'REINGRESO INSCRITO' ?
        1 : status === 'NUEVO INGRESO INSCRITO' ? 2 : 3;
      const student = new Student(json.Matricula, json.Programa, statusCode, json.NombreDelAlumno);
      students.set(student.studentId, student);
    }
    return XLSXUtils.mapToList(students);
  }

  public static getPrograms(workbook: XLSX.WorkBook): string[] {
    const programs = new Map<string, string>();
    const jsonArray: any[] = XLSXUtils.getJsonFromWorksheet(workbook, 0);
    for (const json of jsonArray) {
      programs.set(json.Programa, json.Programa);
    }
    return XLSXUtils.mapToList(programs);
  }

  public static getClassrooms(workbook: XLSX.WorkBook): string[] {
    const classrooms = new Map<string, string>();
    const jsonArray: any[] = XLSXUtils.getJsonFromWorksheet(workbook, 1);
    for (const json of jsonArray) {
      const cls = [json.L_SalonGrupo, json.M_SalonGrupo, json.MM_SalonGrupo,
      json.J_SalonGrupo, json.V_SalonGrupo, json.S_SalonGrupo, json.D_SalonGrupo];
      for (const c of cls) {
        if (c) {
          classrooms.set(c, c);
        }
      }
    }
    return XLSXUtils.mapToList(classrooms);
  }

  public static getEnrollments(workbook: XLSX.WorkBook): Enrollment[] {
    const enrollments: Enrollment[] = [];
    const jsonArray: any[] = XLSXUtils.getJsonFromWorksheet(workbook, 0);
    for (const json of jsonArray) {
      const enrollment = new Enrollment(json.Matricula, json.Grupo, json.Clave);
      enrollments.push(enrollment);
    }
    return enrollments;
  }

  public static getProfessors(workbook: XLSX.WorkBook): Professor[] {
    // A map store unique elements so we do not repeat professors
    // while iterating over the XLSX document
    const professors = new Map<number, Professor>();
    const jsonArray: any[] = XLSXUtils.getJsonFromWorksheet(workbook, 1);
    for (const json of jsonArray) {
      const prof = new Professor(json.Cve_Empleado, json.Nombre);
      professors.set(prof.professorId, prof);
    }

    return XLSXUtils.mapToList(professors);
  }

  public static getSubjects(workbook: XLSX.WorkBook): Subject[] {
    // Store subjects only once even if there are multiple ocurrences
    const subjects = new Map<string, Subject>();
    const jsonArray: any[] = XLSXUtils.getJsonFromWorksheet(workbook, 1);
    for (const json of jsonArray) {
      const modality = json.Modalidad === 'PRESENCIAL' ? 1 : 2;
      const subject = new Subject(json.Clave, modality, json.Materia);
      subjects.set(subject.subjectId, subject);
    }

    return XLSXUtils.mapToList(subjects);
  }

  public static getGroups(workbook: XLSX.WorkBook): Group[] {
    // Store groups only once even if there are multiple ocurrences
    const groups = new Map<string, Group>();
    const jsonArray: any[] = XLSXUtils.getJsonFromWorksheet(workbook, 1);
    for (const json of jsonArray) {
      const group = new Group(json.Grupo, json.Clave, json.Cve_Empleado);
      // There are several groups with same group id
      // So unique groups are a combination of group id and subject id
      const uniqueId = group.groupId + group.subjectId;
      groups.set(uniqueId, group);
    }

    return XLSXUtils.mapToList(groups);
  }

  public static getClasses(workbook: XLSX.WorkBook): Class[] {
    const classes: Class[] = [];
    const jsonArray: any[] = XLSXUtils.getJsonFromWorksheet(workbook, 1);
    for (const json of jsonArray) {
      const groupId = json.Grupo;
      const subjectId = json.Clave;
      if (!!json.HLunes) {
        const hour = XLSXUtils.parseHour(json.HLunes);
        const c = new Class(groupId, 0, hour.start, hour.end, json.L_SalonGrupo, subjectId);
        classes.push(c);
      }
      if (!!json.HMartes) {
        const hour = XLSXUtils.parseHour(json.HMartes);
        const c = new Class(groupId, 1, hour.start, hour.end, json.M_SalonGrupo, subjectId);
        classes.push(c);
      }
      if (!!json.HMiercoles) {
        const hour = XLSXUtils.parseHour(json.HMiercoles);
        const c = new Class(groupId, 2, hour.start, hour.end, json.MM_SalonGrupo, subjectId);
        classes.push(c);
      }
      if (!!json.HJueves) {
        const hour = XLSXUtils.parseHour(json.HJueves);
        const c = new Class(groupId, 3, hour.start, hour.end, json.J_SalonGrupo, subjectId);
        classes.push(c);
      }
      if (!!json.HViernes) {
        const hour = XLSXUtils.parseHour(json.HViernes);
        const c = new Class(groupId, 4, hour.start, hour.end, json.V_SalonGrupo, subjectId);
        classes.push(c);
      }
      if (!!json.HSabado) {
        const hour = XLSXUtils.parseHour(json.HSabado);
        const c = new Class(groupId, 5, hour.start, hour.end, json.S_SalonGrupo, subjectId);
        classes.push(c);
      }
      if (!!json.HDomingo) {
        const hour = XLSXUtils.parseHour(json.HDomingo);
        const c = new Class(groupId, 6, hour.start, hour.end, json.D_SalonGrupo, subjectId);
        classes.push(c);
      }
    }

    return classes;
  }

  private static parseHour(hour: string): any {
    const parts = hour.split('-');
    const result: any = {};
    result.start = parseInt(parts[0], 10);
    result.end = parseInt(parts[1], 10);
    return result;
  }

  private static getJsonFromWorksheet(workbook: XLSX.WorkBook, sheet: number) {
    const sheetName = workbook.SheetNames[sheet];
    const worksheet = workbook.Sheets[sheetName];
    return XLSX.utils.sheet_to_json(worksheet);
  }

  private static mapToList<T>(data: Map<any, T>): T[] {
    const list: T[] = [];
    data.forEach((value: T, key: any) => {
      list.push(value);
    });
    return list;
  }
}
