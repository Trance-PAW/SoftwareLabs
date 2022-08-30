import { Component, OnInit } from '@angular/core';
import { User } from '@models/user';
import { AuthService } from '@app/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  user: User;

  constructor(private auth: AuthService) { }

  ngOnInit() {
    this.onLoad();
  }

  onLoad() {
    this.user = this.auth.getUser();
  }

}
