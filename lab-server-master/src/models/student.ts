export class Student {
  public programId: string;
  public studentId: number;
  public status: number;
  public name: string;

  constructor(studentId: number, programId: string, status: number, name: string) {
    this.programId = programId;
    this.studentId = studentId;
    this.status = status;
    this.name = name;
  }
}
