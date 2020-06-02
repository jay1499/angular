import { Component, OnInit, ViewChild,Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Dish } from '../shared/dish';
import { DishService } from '../services/dish.service';
import { Feedback, ContactType } from '../shared/feedback';

import { Params, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { switchMap } from 'rxjs/operators';
import { Comment } from '../shared/comment';


import { baseURL } from '../shared/baseurl';
const DISH = {
  id: '0',
  name: 'Uthappizza',
  image: '/assets/images/uthappizza.png',
  category: 'mains',
  featured: true,
  label: 'Hot',
  price: '4.99',
  // tslint:disable-next-line:max-line-length
  description: 'A unique combination of Indian Uthappam (pancake) and Italian pizza, topped with Cerignola olives, ripe vine cherry tomatoes, Vidalia onion, Guntur chillies and Buffalo Paneer.',
  comments: [
       {
           rating: 5,
           comment: 'Imagine all the eatables, living in conFusion!',
           author: 'John Lemon',
           date: '2012-10-16T17:57:28.556094Z'
       },
       {
           rating: 4,
           comment: 'Sends anyone to heaven, I wish I could get my mother-in-law to eat it!',
           author: 'Paul McVites',
           date: '2014-09-05T17:57:28.556094Z'
       },
       {
           rating: 3,
           comment: 'Eat it, just eat it!',
           author: 'Michael Jaikishan',
           date: '2015-02-13T17:57:28.556094Z'
       },
       {
           rating: 4,
           comment: 'Ultimate, Reaching for the stars!',
           author: 'Ringo Starry',
           date: '2013-12-02T17:57:28.556094Z'
       },
       {
           rating: 2,
           comment: 'It\'s your birthday, we\'re gonna party!',
           author: '25 Cent',
           date: '2011-12-02T17:57:28.556094Z'
       }
   ]
};

@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss']
})

export class DishdetailComponent implements OnInit {
  @ViewChild('fform') feedbackFormDirective;

  formErrors = {
    'author': '',
    'comment': '',
    'rating': ''
  };

  feedbackForm: FormGroup;
  feedback: Feedback;

  validationMessages = {
    'author': {
      'required':      'Name is required.',
      'minlength':     'Name must be at least 2 characters long.',
      
    },
    'comment': {
      'required':      'Comment is required.',
    },
  };

    dish: Dish;
    comment: Comment;
    dishIds: string[];
  prev: string;
  next: string;
  errMess: string;
  
    constructor(private dishservice: DishService,
      private route: ActivatedRoute,
      private location: Location,private fb: FormBuilder, @Inject('BaseURL') private BaseURL) {   }
  
    ngOnInit() {
      this.createForm();
      this.dishservice.getDishIds().subscribe(dishIds => this.dishIds = dishIds);
      
    this.route.params.pipe(switchMap((params: Params) => this.dishservice.getDish(params['id'])))
    .subscribe(dish => { this.dish = dish; this.setPrevNext(dish.id); },
     errmess => this.errMess = <any>errmess);
  }


  setPrevNext(dishId: string) {
    const index = this.dishIds.indexOf(dishId);
    this.prev = this.dishIds[(this.dishIds.length + index - 1) % this.dishIds.length];
    this.next = this.dishIds[(this.dishIds.length + index + 1) % this.dishIds.length];
    }  
    goBack(): void {
      this.location.back();
    }

  

    createForm():void {
      this.feedbackForm = this.fb.group({
        author: ['', [Validators.required, Validators.minLength(2) ]],
        comment: ['', [Validators.required] ],
        rating:'5',
        date:''
      
      });
      this.feedbackForm.valueChanges
      .subscribe(data => this.onValueChanged(data));
  
    this.onValueChanged()
    }

    onSubmit() {
      
      this.comment=this.feedbackForm.value;

var d = new Date();

this.comment.date=d.toISOString();

this.dish.comments.push(this.comment);

     this.feedback = this.feedbackForm.value;
      console.log(this.feedback);
      
      this.feedbackForm.reset({
        author: '',
        comment: '',
        date:''    
      });
      this.feedbackFormDirective.resetForm({rating: 5});
    }
   
  onValueChanged(data?: any) {
    if (!this.feedbackForm) { return; }
    const form = this.feedbackForm;
    for (const field in this.formErrors) {
      if (this.formErrors.hasOwnProperty(field)) {
        // clear previous error message (if any)
        this.formErrors[field] = '';
        const control = form.get(field);
        if (control && control.dirty && !control.valid) {
          const messages = this.validationMessages[field];
          for (const key in control.errors) {
            if (control.errors.hasOwnProperty(key)) {
              this.formErrors[field] += messages[key] + ' ';
            }
          }
        }
      }
    }
  }
 
  }

 