export class Group {
  public groupId: string;
  public subjectId: string;
  public professorId: string;

  constructor(groupId: string, subjectId: string, professorId: string) {
    this.groupId = groupId;
    this.subjectId = subjectId;
    this.professorId = professorId;
  }
}
