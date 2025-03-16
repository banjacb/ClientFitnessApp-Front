import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { response } from 'express';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-program',
  templateUrl: './program.component.html',
  styleUrls: ['./program.component.css']
})
export class ProgramComponent implements OnInit {

  programId: any;
  program: any;
  private urlProgram: any;
  private urlComment: any;
  errorMessage: any;
  comments:any;
  idUser:any;
  newCommentText: string = "";
  paymentMethod: any;
  showPaymentForm: boolean=false;
  participant: boolean=false;
  youtubeLink: any;
  cardNumber: string='';
  videoLink : any;
  online: boolean=false;
  urlUser : any;
  user : any;
  userPay: boolean=false;

  constructor(private route: ActivatedRoute, private http: HttpClient, private service: AuthService, private sanitizer: DomSanitizer) {

    if(service.isLoggin())
      {
        this.idUser= service.getUser().id;
      }
   }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.programId = params['id'];
      console.log('ID programa:', this.programId);

      
      this.urlProgram = "http://localhost:9000/fitnessprograms/"+ this.programId;

      this.http.get(this.urlProgram).subscribe(
        (data) => {
          this.program = data;
        },
        (error) => {
          this.errorMessage = 'pogresno citanje';
        }
      );

      this.urlComment = "http://localhost:9000/commentusers/programComment/"+this.programId;
      this.http.get(this.urlComment).subscribe(
        (data)=>{
          this.comments=data;
        },
        (error)=>
          {
            this.errorMessage='';
          }
      );

      this.urlUser = "http://localhost:9000/fitnessprograms/users/"+this.idUser;
      this.http.get(this.urlUser).subscribe(
        (data)=>{
          this.user=data;
        },
        (error)=>
          {
            this.errorMessage='';
          }
      );


    });

  
  
  }

  submitComment()
  {
    
    const commentData = {
      text: this.newCommentText,
      fitness_program_id: this.programId,
      user_id: this.idUser,
      date: new Date() 
    };

    const urlComm = 'http://localhost:9000/commentusers';

    
    this.http.post(urlComm, commentData).subscribe(
      (response) => {

        this.comments.push(response);
        this.newCommentText = '';
        console.log('Komentar uspješno dodan:', response);
        
      },
      (error) => {
        console.error('Greška prilikom dodavanja komentara:', error);
    
      }
    );

  }

  showPayment()
  {
    this.showPaymentForm=true;
  }

  submitPayment() {
    this.participant = true;
   
    if (this.program.location === 'online') {
        
        this.videoLink = this.sanitizer.bypassSecurityTrustResourceUrl(this.program.link_you_tube);
        console.log(this.videoLink);
        this.online = true;
        
    } else {
        console.log('Korisnik je pretplacen.');
    }
}

pay()
{

 
  this.userPay=true;
}

subscribeCategory()
{
  
  const urlPart = 'http://localhost:9000/participaties/parForUser';
  
  const request = {
    user_id: this.idUser,
    fitness_program_id: this.program.id,
    category_id: this.program.category_id,
    pay: this.program.price
  };
  
  this.http.post(urlPart, request).subscribe(
    (response) => {
      this.errorMessage='Uspešno ste se pretplatili na kategoriju.'
      console.log('Uspešno ste se pretplatili na kategoriju.');
 
    },
    (error) => {
      this.errorMessage='Greška prilikom pretplate na kategoriju.';
      console.error('Greška prilikom pretplate na kategoriju:', error);
  
    }
  );

  if(this.errorMessage)
    {

      const urlStatistic='http://localhost:9000/statistics';
  console.log(this.errorMessage);
      
      const formData = {
        description: this.errorMessage,
        date: new Date()
      };

      this.http.post(urlStatistic, formData).subscribe((response) => {
        console.log('Program- statistika je uspešno dodat.', response);
        
      }, (error) => {
        console.error('Došlo je do greške prilikom dodavanja statistike.', error);
        
      });
    
  
    }
}


}
