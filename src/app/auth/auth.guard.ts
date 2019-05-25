import { CanActivate } from '@angular/router/src/utils/preactivation';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { Injectable } from '@angular/core';

@Injectable()
export class AuthGuard implements CanActivate{
    path: ActivatedRouteSnapshot[];
    route: ActivatedRouteSnapshot;
    constructor (private authService: AuthService, private router:Router){}

    // path:ActivatedRouteSnapshot,
    canActivate (
        route:ActivatedRouteSnapshot,
        state: RouterStateSnapshot

    ):boolean | Observable<boolean> | Promise<boolean> {
        const isAuth = this.authService.getIsAuth();
        if(!isAuth){
            this.router.navigate(['/login'])
        }
        return isAuth;
    }

}