import { Component, OnInit } from '@angular/core';
import{ FormGroup, FormControl, Validators, MinLengthValidator} from '@angular/forms';
import {Post} from '../post.model'

import {PostsService} from "../posts.service"
import { ActivatedRoute, ParamMap } from '@angular/router';
import { mimeType } from './mime-type.validator';
@Component({
    selector:'app-post-create',
    templateUrl: './post-create.component.html',
    styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {
    // enteredValue = 'Hello World ';
    // enteredContent = '';
    // enteredTitle ='';
    // newPost = '';
    form: FormGroup;
   imagePreview: string;
    private mode ='create';
    private postId: string;
     post : Post;
     isLoading = false;
 

  constructor(public PostsService: PostsService, public route: ActivatedRoute){}

  ngOnInit(){
    this.form = new FormGroup({

      'title': new FormControl(null,{validators:[
        Validators.required,
        Validators.minLength(3)
      ]}),
      'content': new FormControl('',{validators:[
        Validators.required
       
      ]}),

      image: new FormControl(null,{
        validators:[Validators.required],
        asyncValidators:[mimeType]
       })
    });

    this.route.paramMap.subscribe((paramMap: ParamMap) =>{
      if(paramMap.has('postId')){
        this.mode = 'edit';
        this.postId = paramMap.get('postId');
        this.isLoading = true;
         this.PostsService.getPost(this.postId).subscribe(postData => {
          this.isLoading = false;


          this.post = {id:postData._id,
             title:postData.title,
              content:postData.content ,
              imagePath:postData.imagePath,
              // createdDate:null
            };

            this.form.setValue({
              title: this.post.title,
              content: this.post.content,
              image: this.post.imagePath
            });


         });

    
       // this.post = this.PostsService.getPost(this.postId);

      }
      else {
        this.mode = 'create';
        this.postId = null;
      }
    });
  }

  onImagePicked(event: Event){
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({image:file});
    this.form.get('image').updateValueAndValidity();

    const reader = new FileReader();
    reader.onload = () => {
     this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
 
  }


  
onSavePost(){
  if(this.form.invalid){
    return;
  }
  if (this.mode === "create"){
    this.isLoading = true;
    this.PostsService.addPost(this.form.value.title,this.form.value.content,this.form.value.image);
    
  }
  else {
    this.PostsService.updatePost(
      this.postId,
      this.form.value.title,
      this.form.value.content,
      this.form.value.image
    
    );
  }
 this.form.reset();
//    this.newPost =this.enteredValue;
  // const post = {
  //     title: this.form.value.title,
  //    content: this.form.value.content

  // };
 
}

}