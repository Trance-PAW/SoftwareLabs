export class Class {
  public groupId: string;
  public day: number;
  public startHour: number;
  public endHour: number;
  public classroom: string;
  public subjectId: string;

  constructor(groupId: string, day: number, startHour: number,
              endHour: number, classroom: string, subjectId: string) {

    this.groupId = groupId;
    this.day = day;
    this.startHour = startHour;
    this.endHour = endHour;
    this.classroom = classroom;
    this.subjectId = subjectId;
  }
}
