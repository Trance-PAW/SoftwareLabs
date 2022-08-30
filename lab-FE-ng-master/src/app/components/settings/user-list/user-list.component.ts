import { Component, OnInit } from '@angular/core';
import { DataService } from '@services/data.service';
import { AuthService } from '@app/services/auth.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {

  users: any[];
  selectedUser: any;
  displayDialog: boolean;

  constructor(
    private data: DataService,
    private auth: AuthService,
    private toast: MessageService,
  ) { }

  ngOnInit() {
    this.onLoad();
  }

  onLoad() {
    this.data.getUsers().subscribe((data: any[]) => {
      this.users = data;
    });
  }

  showDeleteDialog(user: any) {
    this.selectedUser = user;
    this.displayDialog = true;
  }

  onDelete() {
    const id = this.selectedUser.user_id;
    this.auth.deleteUser(id).then(() => {
      this.displayDialog = false;
      this.displayMessage('Usuario eliminado');
      this.users = this.users.filter((item) => item !== this.selectedUser);
    }).catch(() => {
      this.displayDialog = false;
      this.displayMessage('Algo salió mal, intente de nuevo');
    });
  }

  displayMessage(msg: string) {
    this.toast.add({
      severity: 'warn', summary: msg
    });
  }
}
