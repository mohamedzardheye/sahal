import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AuthData} from './auth-data.model'
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import {environment} from '../../environments/environment';
import { map } from 'rxjs/operators';

const BACKEND_URL = environment.apiUrl +'/user/';

@Injectable ({providedIn:'root'})

export class AuthService{
    constructor(private http:HttpClient, private router:Router){}
    private token: string;
    private authStatusListener = new Subject<boolean>();
    private tokenTimer : any;
    private isAuthenticated = false;

   private email :string;

    getToken(){
        return this.token;
    }

    // this adds when we want ho hide edit and delete button from post list
    getIsAuth(){
        return this.isAuthenticated;
    }

    getUserEmail(){
        return this.email;
    }

  
   
    getAuthStatusListener() {
        return this.authStatusListener.asObservable();
      }

    

      
  

    createUser(email:string, password:string){
        const authData : AuthData = {email:email,password:password};
        this.http.post (
            BACKEND_URL + 'signup', authData
        ).subscribe(() =>{
            this.router.navigate(['/login']);
        }, error =>{
            this.authStatusListener.next(false);
        }); 

    }



    login(email:string, password:string){
        const authData : AuthData = {email:email, password:password};
        this.http.post<{token:string, expiresIn:number,email:string}>
        (BACKEND_URL+ 'login', authData)
       
        .subscribe(response =>{
 
          const token = response.token;
          const email = response.email;
          this.token = token;
          this.email = email;
           if(token) {
               const expiresInDuration = response.expiresIn;
            this.setAuthTimer(expiresInDuration);
            const now = new Date();
            const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
            this.saveAuthData(token,expirationDate,email);
            console.log(expirationDate , this.email);
            this.isAuthenticated= true;
            this.authStatusListener.next(true);
            this.router.navigate(['/']);
           }
          
          
        }, error =>{
            this.authStatusListener.next(false); 
        });
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
        this.email = authInformation.email;
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

private saveAuthData (token: string, expirationDate: Date, email:string){
    localStorage.setItem("token", token);
    localStorage.setItem("email", email);
    localStorage.setItem("expiration", expirationDate.toISOString());
}

private clearAuthData(){
    localStorage.removeItem("token");
    localStorage.removeItem("expiration");
    localStorage.removeItem("email");
}

private getAuthData(){
    const token = localStorage.getItem("token");
    const expirationDate = localStorage.getItem("expiration");
    const email = localStorage.getItem("email");
    if(!token || !expirationDate){
        return;
    }
    return {
        token :token,
        expirationDate : new Date (expirationDate),
        email:email
    }
}

}// end all 
