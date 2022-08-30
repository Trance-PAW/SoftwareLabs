export class Subject {
  public subjectId: string;
  public modality: number;
  public name: string;

  constructor(subjectId: string, modality: number, name: string) {
    this.subjectId = subjectId;
    this.modality = modality;
    this.name = name;
  }
}
