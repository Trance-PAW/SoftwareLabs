import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from 'environments/environment';
import { invalid } from '@angular/compiler/src/render3/view/util';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  // Default set to 10 minutes
  private COOLDOWN_TIME_IN_MILLIS = 10 * 60 * 1000;

  private cooldownAux: Map<string, Date>;
  private baseUrl: string;

  constructor(private http: HttpClient) {
    this.baseUrl = environment.apiUrl;
    this.cooldownAux = new Map<string, Date>();
  }

  getClassroomSchedule(id: string) {
    const requestUrl = `${this.baseUrl}/classroom?id=${id}`;
    return this.http.get(requestUrl).toPromise();
  }

  getGroupList(groupId: string, subjectId: string) {
    const requestUrl = `${this.baseUrl}/group?id=${groupId}&subject=${subjectId}`;
    return this.http.get(requestUrl);
  }

  getStudent(id: string) {
    const requestUrl = `${this.baseUrl}/student?id=${id}`;
    return this.http.get(requestUrl);
  }

  getStudentGroups(id: string) {
    const requestUrl = `${this.baseUrl}/student/groups?id=${id}`;
    return this.http.get(requestUrl);
  }

  getStudentSchedule(id: string) {
    const requestUrl = `${this.baseUrl}/student/schedule?id=${id}`;
    return this.http.get(requestUrl);
  }

  getProfessor(id: string) {
    const requestUrl = `${this.baseUrl}/professor?id=${id}`;
    return this.http.get(requestUrl).toPromise();
  }

  getProfessorSchedule(id: string) {
    const requestUrl = `${this.baseUrl}/professor/schedule?id=${id}`;
    return this.http.get(requestUrl);
  }

  public getProfessorGroups(id: string) {
    const requestUrl = `${this.baseUrl}/professor/groups?id=${id}`;
    return this.http.get(requestUrl);
  }

  uploadDatabaseFile(file: File) {
    const postUrl = `${this.baseUrl}/updateDatabase`;
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(postUrl, formData);
  }

  getUsers() {
    const requestUrl = `${this.baseUrl}/users`;
    return this.http.get(requestUrl);
  }

  getClassrooms() {
    const requestUrl = `${this.baseUrl}/classroom/list`;
    return this.http.get(requestUrl);
  }

  getPrograms() {
    const requestUrl = `${this.baseUrl}/programs`;
    return this.http.get(requestUrl).toPromise();
  }

  private validateRecord(studentId: string) {
    const currentDate = new Date();
    if (this.cooldownAux.has(studentId)) {
      const lastRecordDate = this.cooldownAux.get(studentId);
      const diffTime = currentDate.getTime() - lastRecordDate.getTime();
      return diffTime > this.COOLDOWN_TIME_IN_MILLIS;
    } else {
      this.cooldownAux.set(studentId, currentDate);
      return true;
    }
  }

  createRecord(studentId: string, classroom: string, groupId: string, subjectId: string) {
    if (!this.validateRecord(studentId)) {
      // To prevent multiple record creation from happening
      return;
    }
    const postUrl = `${this.baseUrl}/record/create`;
    return this.http.post<any>(postUrl, { studentId, classroom, groupId, subjectId }).subscribe();
  }

  createEmployeeRecord(employeeId: string, classroom: string, groupId: string, subjectId: string) {
    const postUrl = `${this.baseUrl}/record/create`;
    return this.http.post<any>(postUrl, { employeeId, classroom, groupId, subjectId }).subscribe();
  }

  getRecords(type: string, programId: string, classroom: string, start: string,
             end: string, subjectId: string, groupId: string) {
    const requestUrl = `${this.baseUrl}/record`;
    let params = new HttpParams()
      .set('classroom', classroom)
      .set('start', start)
      .set('end', end)
      .set('type', type);
    if (programId) {
      params = params.set('programId', programId);
    }
    if (subjectId && groupId) {
      params = params.set('groupId', groupId)
        .set('subjectId', subjectId);
    }

    return this.http.get(requestUrl, { params }).toPromise();
  }

  getAdminUser(classroom: string) {
    const requestUrl = `${this.baseUrl}/users/admin?classroom=${classroom}`;
    return this.http.get(requestUrl).toPromise();
  }

  setConfig(key: string, value: any) {
    const postUrl = `${this.baseUrl}/config`;
    return this.http.post<any>(postUrl, { key, value }).toPromise();
  }

  getConfig(key: string) {
    const requestUrl = `${this.baseUrl}/config`;
    const params = new HttpParams()
      .set('key', key);
    return this.http.get<any>(requestUrl, { params }).toPromise();
  }

}
