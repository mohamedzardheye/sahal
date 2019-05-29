import {Component, OnInit, OnDestroy} from "@angular/core";
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';
@Component({
    selector:'app-header',
    templateUrl:'./header.component.html',
    styleUrls:['./header.component.css']
})


export class HeaderComponent implements OnInit, OnDestroy{
    
  
    userIsAuthenticated = false;
    email:string;
    //useremail:string;
    authListenerSubs: Subscription;
   

    constructor (private authService: AuthService){}

    ngOnInit(){
      
      this.userIsAuthenticated = this.authService.getIsAuth();
      this.email = this.authService.getUserEmail();
            this.authListenerSubs = this.authService
     // this.authListenerSubs = this.au
            .getAuthStatusListener()
            .subscribe(isAuthenticated => {
                this.userIsAuthenticated = isAuthenticated;
              //  this.email =  localStorage.getItem("email");   
              this.email = this.authService.getUserEmail();         
            });
           
          
            
            //this.useremail = emailuser;
            

          //  console.log(email);
        
    }

    onLogout(){
      this.authService.logout();
    }

    ngOnDestroy() {
        this.authListenerSubs.unsubscribe();
      }
};