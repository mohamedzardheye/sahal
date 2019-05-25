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
        MatPaginatorModule  
      } from '@angular/material';
import { PostsService } from './posts/posts.service';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { AuthInterceptor } from './auth/auth-interceptor';

@NgModule({
  declarations: [
    AppComponent,
    PostCreateComponent,
    HeaderComponent,
    PostListComponent,
    LoginComponent,
    SignupComponent
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
    BrowserAnimationsModule,
    

HttpClientModule
    
  ],
  providers: [
    {provide:HTTP_INTERCEPTORS,useClass:AuthInterceptor, multi:true }
  ]
  ,
  bootstrap: [AppComponent]
})
export class AppModule { }
