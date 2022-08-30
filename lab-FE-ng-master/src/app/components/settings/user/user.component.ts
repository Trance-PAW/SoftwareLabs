import { Component, OnInit } from '@angular/core';
import { DataService } from '@services/data.service';
import { MessageService } from 'primeng/api';
import { AuthService } from '@app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

  classrooms: any[];
  user: any = {};
  roles: any = [
    { label: 'Seleccionar rol' },
    { label: 'Jefe de Laboratorio', value: 1 },
    { label: 'Auxiliar', value: 2 }
  ];

  constructor(
    private data: DataService,
    private toast: MessageService,
    private auth: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    this.onLoad();
  }

  onLoad() {
    this.data.getClassrooms().subscribe((data: any[]) => {
      this.classrooms = data.map((item) => {
        return { label: item.classroom, value: item.classroom };
      });
      this.classrooms.unshift({ label: 'Selecciona laboratorio' });
    });
  }

  onCreateAccount() {
    if (this.user.password !== this.user.ppassword) {
      this.displayErrorMessage('La contraseña no coincide con la confirmación');
      return;
    }
    this.auth.signUp(this.user.email, this.user.password, this.user.name, this.user.role).then(data => {
      const id = data;
      this.auth.assignClassroom(id, this.user.classroom).then(() => {
        this.router.navigate(['/settings']);
      });
    });
  }

  displayErrorMessage(msg: string) {
    this.toast.add({
      severity: 'warn',
      summary: msg,
    });
  }
}
