import {Component, OnInit, OnDestroy} from "@angular/core";
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { NgModule } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { mimeType } from '../posts/post-create/mime-type.validator';
import { Hotel } from './hotel.model';
import { HotelsService } from './hotels.service';


export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
  {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
  {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li'},
  {position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be'},
  {position: 5, name: 'Boron', weight: 10.811, symbol: 'B'},
  {position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C'},
  {position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N'},
  {position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O'},
  {position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F'},
  {position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne'},
];


@Component({
    selector:'hotel-city-add',
    templateUrl:'./hotel-city-add.component.html',
    styleUrls:['./hotel-city-add.component.css']
})



export class HotelCityAdd implements OnInit {
    // enteredValue = 'Hello World ';
    // enteredContent = '';
    // enteredTitle ='';
    // newPost = '';
    form: FormGroup;
   imagePreview: string;
    private mode ='create';
    private postId: string;
    hotel : Hotel;
     isLoading = false;
 
     displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
     dataSource = ELEMENT_DATA;

  constructor(public HotelsService: HotelsService, public route: ActivatedRoute){}

  ngOnInit(){
    this.form = new FormGroup({

      'title': new FormControl(null,{validators:[
        Validators.required,
        Validators.minLength(3)
      ]}),
      'desc': new FormControl(null,{validators:[
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
         this.HotelsService.getPost(this.postId).subscribe(hotelData => {
          this.isLoading = false;


          this.hotel = {
              id:hotelData._id,
             title:hotelData.title,
              desc:hotelData.desc ,
              imagePath:hotelData.imagePath,
              // createdDate:null
            };

            this.form.setValue({
              title: this.hotel.title,
              content: this.hotel.desc,
              image: this.hotel.imagePath
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


  
onSaveCity(){
  if(this.form.invalid){
    return;
  }
  if (this.mode === "create"){
    this.isLoading = true;
    this.HotelsService.addHotel(this.form.value.title,this.form.value.desc,this.form.value.image);
    
  }
  else {
    this.HotelsService.updatePost(
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