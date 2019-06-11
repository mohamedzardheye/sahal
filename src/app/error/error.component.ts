import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA,MAT_SNACK_BAR_DATA } from '@angular/material';

@Component({
    templateUrl:'./error.component.html'
})

export class ErrorComponent{
    constructor (@Inject(MAT_SNACK_BAR_DATA) public data:{message:string} ) {}

   // message= 'An Unknown Occorued'
}
