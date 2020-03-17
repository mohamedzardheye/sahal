import {Hotel} from './hotel.model'
import {HttpClient} from '@angular/common/http'
import {Subject} from 'rxjs';
import { Injectable } from '@angular/core';
import {map} from 'rxjs/operators';

import { Router } from '@angular/router';

import {environment} from '../../environments/environment';

const BACKEND_URL = environment.apiUrl +'/hotel/';


//import { HttpClient } from 'selenium-webdriver/http';
@Injectable ({providedIn: "root"})
export class HotelsService {

    private hotels: Hotel[] = [];
    private PostsUpdated = new Subject<{hotels: Hotel[], postCount:number}>();

    constructor(private http:HttpClient , private router: Router){}
//Fetching All Posts With Out Pagination
    // getPosts(){
       
    //  this.http
    //  .get<{message:string, posts: any}>(
    //      'http://localhost:3000/api/posts'
    //      )
    //      .pipe(map((postData) =>{
    //          return postData.posts.map(post =>{
    //              return {
    //                  title: post.title,
    //                  content: post.content,
    //                  id:post._id,
    //                  imagePath:post.imagePath,
    //                  createdDate:post.createdDate
                   
    //              };
    //          });
    //      }))
    //  .subscribe(transformedPosts => {
    //      this.posts = transformedPosts;
    //      this.PostsUpdated.next([...this.posts]);
    //  });

    // }

    /// fetching post with pagination 

    getPosts( postsPerPage:number, currentPage:number){
       const queryParams = `?pagesize=${postsPerPage} &page=${currentPage}`;

         this.http
         .get<{message:string, hotels: any, maxPosts:number}>(
            BACKEND_URL+queryParams
             )
             .pipe(map((hotelData) =>{

             
                 return {
                 hotels: hotelData.hotels.map(post =>{
                    return {
                         title: post.title,
                         desc: post.desc,
                         id:post._id,
                         imagePath:post.imagePath,
                         createdDate:post.createdDate,
                         creator:post.creator,
                         email:post.creator.email
                       
                     };
                 }),
                 maxPosts:hotelData.maxPosts
                };
             }))
         .subscribe(transformedPosts => {
            // this.hotels = transformedPosts.hotels;
            // this.PostsUpdated.next({
                // hotels: [...this.hotels],
               // postCount: transformedPosts.maxPosts
          //  });
         });
    
        }

    getPostUpdateListener(){
        return this.PostsUpdated.asObservable();
    }
     

    getPost(id:string){
        return this.http.get<{_id:string, title:string, desc:string, imagePath:string}>(
          BACKEND_URL+id );
     //return { ...this.posts.find(p => p.id === id) };

    }

    addHotel(title:string, desc:string, image: File){
      //  const post: Post={ id:null,title:title, content:content};
       const hotelData = new FormData();
       hotelData.append("title" , title);
       hotelData.append("desc", desc);
       hotelData.append("image", image, title);
      

        this.http.post<{message:string, hotel:Hotel}> (
            BACKEND_URL
            , hotelData)
        .subscribe(responseData =>{
        //    const id = responseData.postId;
        //    post.id= id;
        
            this.router.navigate(['/']);
        });
      
    } // eng add post

    updatePost(id:string, title:string, desc:string, image:File | string){
       // const post: Post = {id:id, title:title, content:content,imagePath:null};
       //inta sare wa marki hore bil imageka 
        let postData: Hotel | FormData;
       if(typeof image === 'object'){
        postData = new FormData();
           postData.append('id', id);
           postData.append('title', title);
           postData.append('desc', desc);
           postData.append('image',image, title);


       }
       else {
          postData  = {
               id:id,
               title:title,
               desc:desc,
               imagePath:image
           };
       }
       
       this.http
            .put(BACKEND_URL+id , postData)
            .subscribe(Response => {
              
                this.router.navigate(['/']);
            });
    }
  

    deletePost(postId: string) {
        return this.http
          .delete(BACKEND_URL + postId);
      }

} //end of all

