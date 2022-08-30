import { Injectable } from '@angular/core';
import { Router, CanActivate, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class GuardService {

  constructor(
    private auth: AuthService,
    private router: Router,
  ) { }

  async canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    const user = this.auth.getUser();
    if (!user) {
      console.log('[GuardService] no user');
      this.router.navigate(['/login']);
      return false;
    }
    // tslint:disable-next-line: triple-equals
    if (user.role == 0 && next.data.adminNotAllowed) {
      this.router.navigate(['/dashboard']);
      return false;
    }
    if (user.role > next.data.role) {
      this.router.navigate(['/home']);
      return false;
    }
    return true;
  }
}
