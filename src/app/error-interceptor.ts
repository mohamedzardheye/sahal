import { HttpInterceptor, HttpRequest, HttpHandler, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { MatDialog, MatSnackBar } from '@angular/material';

import { ErrorComponent } from './error/error.component';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor{

//constructor(private dialog:MatDialog){}
constructor(private snackbar:MatSnackBar){}

    intercept(req: HttpRequest<any>, next: HttpHandler) {
        
       
        return next.handle(req).pipe(
            catchError((error: HttpErrorResponse) =>{
               let errorMessage = 'UnKnown Cillad Ayaa Dhacday !' ;
               if(error.error.message){
                   errorMessage = error.error.message;
               }
               // this.snackbar.open('',ErrorComponent, {data:{message:errorMessage}});

            //    this.snackbar.open(errorMessage,'UNDO',{
              
            //        data:{message:errorMessage},
            //        horizontalPosition:'right',
            //        verticalPosition:'top',
            //         direction:'ltr',
            //         duration:3000,
            //         panelClass :  ['background-red']
            //    })

               this.snackbar.openFromComponent(ErrorComponent,{
                data:{message:errorMessage},
                       horizontalPosition:'end',
                       verticalPosition:'top',
                        direction:'ltr',
                        duration:3000,
                        panelClass: ['snackbar-error'],

               });
                //alert(error.error.message);
                return throwError(error);
            })
        );
    }
}