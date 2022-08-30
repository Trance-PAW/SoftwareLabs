import { Injectable } from '@angular/core';
import { AuthService } from '@services/auth.service';
import { DataService } from '@services/data.service';
import { async } from 'q';

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {

  private currentLab: string;
  private schedule: any;

  constructor(
    private auth: AuthService,
    private data: DataService,
  ) { }

  async onLoad() {
    this.currentLab = this.auth.getUser().classroom;
    this.schedule = await this.data.getClassroomSchedule(this.currentLab);
  }

  async getCurrentClass() {
    const lab = this.auth.getUser().classroom;
    if (!this.schedule || (lab !== this.currentLab)) {
      await this.onLoad();
    }
    const date = new Date();
    const day = date.getDay() - 1;
    const hour = date.getHours();
    const c = this.schedule.filter((item: any) => {
      if (item.day === day && hour >= item.start_hour && hour < item.end_hour) {
        return item;
      }
    });
    if (c.length > 0) {
      return c[0];
    }
    return null;
  }

  async getClassList() {
    const classes = new Map();
    const lab = this.auth.getUser().classroom;
    if (!this.schedule || (lab !== this.currentLab)) {
      await this.onLoad();
    }
    for (const cls of this.schedule) {
      const { group_id, subject_id, name } = cls;
      classes.set(`${group_id}${subject_id}`, { group_id, name, subject_id });
    }
    const result = [];
    for (const value of classes) {
      result.push(value[1]);
    }
    return result;
  }

  async getGroups(classroom: string) {
    const groups = new Map();
    const schedule: any = await this.data.getClassroomSchedule(classroom);
    for (const cls of schedule) {
      const { group_id, subject_id, name, professor } = cls;
      groups.set(`${group_id}${subject_id}`, { group_id, name, subject_id, professor });
    }
    const result = [];
    for (const value of groups) {
      result.push(value[1]);
    }
    return result;
  }
}
