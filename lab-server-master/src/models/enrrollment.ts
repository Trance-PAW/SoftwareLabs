export class Enrollment {
  public studentId: number;
  public groupId: string;
  public subjectId: string;

  constructor(studentId: number, groupId: string, subjectId: string) {
    this.studentId = studentId;
    this.groupId = groupId;
    this.subjectId = subjectId;
  }
}
