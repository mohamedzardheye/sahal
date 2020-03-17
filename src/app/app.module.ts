import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PostCreateComponent } from './posts/post-create/post-create.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import {HeaderComponent} from "./header/header.component";
import { PostListComponent } from './posts/post-list/post-list.component';
import {MatInputModule, 
        MatCardModule,
        MatButtonModule,
        MatToolbarModule,
        MatSidenavModule,
        MatExpansionModule,
        MatProgressSpinnerModule,
        MatProgressBarModule,
        MatPaginatorModule,  
        MatDialogModule,
        MatGridListModule,
        MatSnackBarModule,
        MatIconModule,
        MatTableModule,
      
        
        
      } from '@angular/material';
import { PostsService } from './posts/posts.service';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { AuthInterceptor } from './auth/auth-interceptor';
import { ErrorInterceptor } from './error-interceptor';
import { ErrorComponent } from './error/error.component';
import { CardsFreeModule, ButtonsModule, WavesModule } from 'angular-bootstrap-md';
import { HotelCityAdd } from './hotel/hotel-city-add.component';

@NgModule({
  declarations: [
    AppComponent,
    PostCreateComponent,
    HeaderComponent,
    PostListComponent,
    LoginComponent,
    SignupComponent,
    ErrorComponent,
    HotelCityAdd
    

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatToolbarModule,
    MatSidenavModule,
    MatExpansionModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatPaginatorModule  ,
    MatDialogModule,
    BrowserAnimationsModule,
    MatGridListModule,
    MatSnackBarModule,
    MatIconModule,
    MatTableModule,


    // Here Starts MDB 
    CardsFreeModule,
    ButtonsModule,
     WavesModule,
    
    

HttpClientModule
    
  ],
  providers: [
    {provide:HTTP_INTERCEPTORS,useClass:AuthInterceptor, multi:true },
    {provide:HTTP_INTERCEPTORS,useClass:ErrorInterceptor, multi:true }

  ]
  ,
  bootstrap: [AppComponent],
  entryComponents: [ErrorComponent]
})
export class AppModule { }
