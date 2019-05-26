import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AuthData} from './auth-data.model'
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import {environment} from '../../environments/environment';

const BACKEND_URL = environment.apiUrl +'/user/';

@Injectable ({providedIn:'root'})

export class AuthService{
    constructor(private http:HttpClient, private router:Router){}
    private token: string;
    private authStatusListener = new Subject<boolean>();
    private tokenTimer : any;
    private isAuthenticated = false;

    getToken(){
        return this.token;
    }

    // this adds when we want ho hide edit and delete button from post list
    getIsAuth(){
        return this.isAuthenticated;
    }
   
    getAuthStatusListener() {
        return this.authStatusListener.asObservable();
      }

    

      
  

    createUser(email:string, password:string){
        const authData : AuthData = {email:email,password:password};
        this.http.post (
            BACKEND_URL + '/signup', authData
        ).subscribe(response =>{
            console.log(response);
        }); 

    }



    login(email:string, password:string){
        const authData : AuthData = {email:email, password:password};
        this.http.post<{token:string, expiresIn:number}>
        (BACKEND_URL+ '/login', authData)
        .subscribe(response =>{
          

          const token = response.token;
           this.token = token;
           if(token) {
               const expiresInDuration = response.expiresIn;
             this.setAuthTimer(expiresInDuration);
            const now = new Date();
            const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
            this.saveAuthData(token,expirationDate);
            console.log(expirationDate);
            this.isAuthenticated= true;
            this.authStatusListener.next(true);
            this.router.navigate(['/']);
           }
          
          
        })
    }


autoAuthUser(){
    const authInformation = this.getAuthData();
    if(!authInformation){
        return;
    }
    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();

    if(expiresIn > 0){
        this.token = authInformation.token;
        this.isAuthenticated = true;
        this.setAuthTimer(expiresIn / 1000);
        this.authStatusListener.next(true);
    }

}


logout(){
    this.token = null;
    this.isAuthenticated= false;
    this.authStatusListener.next(false);
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.router.navigate(['/']);
}

private setAuthTimer (duration: number){
    this.tokenTimer = setTimeout(() =>{
        this.logout();
    }, duration * 1000 );
}

private saveAuthData (token: string, expirationDate: Date){
    localStorage.setItem("token", token);
    localStorage.setItem("expiration", expirationDate.toISOString());
}

private clearAuthData(){
    localStorage.removeItem("token");
    localStorage.removeItem("expiration");
}

private getAuthData(){
    const token = localStorage.getItem("token");
    const expirationDate = localStorage.getItem("expiration");
    if(!token || !expirationDate){
        return;
    }
    return {
        token :token,
        expirationDate : new Date (expirationDate)
    }
}

}// end all 
