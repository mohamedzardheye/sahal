import {Post} from './post.model'
import {HttpClient} from '@angular/common/http'
import {Subject} from 'rxjs';
import { Injectable } from '@angular/core';
import {map} from 'rxjs/operators';

import { Router } from '@angular/router';

//import { HttpClient } from 'selenium-webdriver/http';
@Injectable ({providedIn: "root"})
export class PostsService {

    private posts: Post[] = [];
    private PostsUpdated = new Subject<{posts: Post[], postCount:number}>();

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
         .get<{message:string, posts: any, maxPosts:number}>(
             'http://localhost:3000/api/posts'+queryParams
             )
             .pipe(map((postData) =>{
                 return {
                     posts: postData.posts.map(post =>{
                     return {
                         title: post.title,
                         content: post.content,
                         id:post._id,
                         imagePath:post.imagePath,
                         createdDate:post.createdDate,
                         creator:post.creator
                       
                     };
                 }),
                 maxPosts:postData.maxPosts
                };
             }))
         .subscribe(transformedPosts => {
             this.posts = transformedPosts.posts;
             this.PostsUpdated.next({
                 posts: [...this.posts],
                postCount: transformedPosts.maxPosts
            });
         });
    
        }

    getPostUpdateListener(){
        return this.PostsUpdated.asObservable();
    }
     

    getPost(id:string){
        return this.http.get<{_id:string, title:string, content:string, imagePath:string}>(
            'http://localhost:3000/api/posts/'+id );
     //return { ...this.posts.find(p => p.id === id) };

    }

    addPost(title:string, content:string, image: File){
      //  const post: Post={ id:null,title:title, content:content};
       const postData = new FormData();
       postData.append("title" , title);
       postData.append("content", content);
       postData.append("image", image, title);
      

        this.http.post<{message:string, post:Post}> (
            'http://localhost:3000/api/posts/'
            , postData)
        .subscribe(responseData =>{
        //    const id = responseData.postId;
        //    post.id= id;
        
            this.router.navigate(['/']);
        });
      
    } // eng add post

    updatePost(id:string, title:string, content:string, image:File | string){
       // const post: Post = {id:id, title:title, content:content,imagePath:null};
       //inta sare wa marki hore bil imageka 
        let postData: Post | FormData;
       if(typeof image === 'object'){
            postData = new FormData();
            postData.append('id', id);
           postData.append('title', title);
           postData.append('content', content);
           postData.append('image',image, title);


       }
       else {
          postData  = {
               id:id,
               title:title,
               content:content,
               imagePath:image
           };
       }
       
       this.http
            .put('http://localhost:3000/api/posts/'+id , postData)
            .subscribe(Response => {
              
                this.router.navigate(['/']);
            });
    }

  

    deletePost(postId: string) {
        return this.http
          .delete("http://localhost:3000/api/posts/" + postId);
      }

} //end of all

