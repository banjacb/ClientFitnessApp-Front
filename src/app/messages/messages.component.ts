import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { text } from 'stream/consumers';

export interface User {
  id: number;
  username: string;
  password: string;
  email: string;
  first_name: string;
  last_name: string;
  city: string;
  role: number;
  status: boolean;
}

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrl: './messages.component.css'
})
export class MessagesComponent  {

  messages: any;
  private urlMess: any;
  private urlUsers:any;
  private urlAddMess= "http://localhost:9000/messages";
  private urlAdvisorMess= "http://localhost:9000/advisormessages";
  idUser : any;
  myForm: FormGroup;
  users: any;
  public text_message = new FormControl(null, [Validators.required]) as FormControl & { value: string };
  public receiver_id = new FormControl(null, [Validators.required]) as FormControl & { value: number };
  role: any;
  selectedUser: any;

  constructor(private http: HttpClient, private service : AuthService, private formBuilder : FormBuilder)
  {
    this.myForm = this.formBuilder.group({
      text_message:this.text_message,
      receiver_id: this.receiver_id
  
    });
    if(service.isLoggin())
      {
        this.idUser= service.getUser().id;
      }

    this.readMessages();
    this.loadUsers();
  }

  
  

  readMessages() {

this.urlMess= `http://localhost:9000/messages/${this.idUser}`;

    this.http.get(this.urlMess).subscribe({
      next: (data) => {
        this.messages = data;
      },
      error: (error) => {
       
      }
    });
  }

 

 
  submitForm() {
    
  
  if (this.myForm.valid) {

    const receiver_id = this.receiver_id.value;
    const text_message=this.text_message.value;
  
  
    const formData = {
      ...this.myForm.value,
      date: new Date(),
      sender_id: this.idUser
    };
    
    

    this.http.post<any>(this.urlAddMess, formData).subscribe({
      next: response => {

        const text_message = this.myForm.get('text_message')?.value;
        this.messages.push(response);
        this.myForm.reset();
       
        if(this.selectedUser.role == 1)
          {
    
           
            
            console.log(text_message + 'ovo je za advisora' + this.selectedUser.id);

            const formData = {
              text: text_message,
              date: new Date(),
              seen : false,
              category_id : 1,
              advisor_id : this.selectedUser.id,
              user_id : this.idUser
            };

            this.http.post<any>(this.urlAdvisorMess,formData).subscribe({
              next: response => {
                console.log('Poruka za savjetnika je poslana.');
              }
            })
            
          }
      },
      error: error => {
        console.error('Došlo je do greške prilikom slanja podataka.', error);
      }
    });
  } else {
    console.error('Forma nije validna.');
  }
}


loadUsers() {
  this.urlUsers = 'http://localhost:9000/users';

  this.http.get<any[]>(this.urlUsers).subscribe(
    (data) => {
      if (Array.isArray(data)) {
        this.users = data.filter(user => user.role !== 0 && user.id !== this.idUser)
                         .map(user => {
                           if (user.role === 1 && !user.username.includes('(savjetnik)')) {
                             user.username += ' (savjetnik)';
                           }
                           return user;
                         });
      } else {
        console.error('Neispravan format podataka za korisnike.');
      }
    },
    (error) => {
      console.error('Greška prilikom dohvata korisnika:', error);
    }
  );
}


onUserChange(event: any) {
  const userId = event.target.value;
  this.selectedUser = this.users.find((user: User) => user.id === +userId);
  if (this.selectedUser) {
    this.myForm.patchValue({
      username: this.selectedUser.username,
      password: this.selectedUser.password,
      email: this.selectedUser.email,
      first_name: this.selectedUser.first_name,
      last_name: this.selectedUser.last_name,
      city: this.selectedUser.city,
      role: this.selectedUser.role,
      status: this.selectedUser.status
    });
  }
  console.log(this.selectedUser.id + ' ' +this.selectedUser.last_name);
}

  
  

}
