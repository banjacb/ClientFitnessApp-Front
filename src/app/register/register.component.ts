import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { url } from 'node:inspector';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit{

  registrationForm: FormGroup;
  file : any;
  public errorMessage: string;
  token: any;
  private uploadImgUrl = "http://localhost:9000/images/upload";
  private urlRegister = 'http://localhost:9000/users/register';


  constructor(private fb: FormBuilder,private router: Router, private authService: AuthService,private route: ActivatedRoute, private http : HttpClient )
  {
    this.errorMessage='';
    this.registrationForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      first_name: ['', Validators.required],
      last_name:['', Validators.required],
      city: ['', Validators.required],
      email: ['', Validators.required],
      role: [2, Validators.required],
      image: ['', Validators.required] 
  });
  }

  public onSubmit() {
    if (this.registrationForm.valid) {
      const formValues = this.registrationForm.value;

      if (this.file) {
        this.uploadImage(this.file).subscribe(
          (dataSlika) => {
            if (dataSlika) {
              console.log(dataSlika.id + ' slika sa id');
              const request = {
                username: formValues.username,
                password: formValues.password,
                first_name: formValues.first_name,
                last_name: formValues.last_name,
                city: formValues.city,
                email: formValues.email,
                role: formValues.role,
                status: true,
                image_id: dataSlika.id,
                image: dataSlika.file
              };


              this.http.post(this.urlRegister, request).subscribe(
                (response: any) => {
                  if (response) {

 
                    console.log('Uspešna registracija:', response);
                    this.errorMessage = 'Verifikaciju uradite na vašem email nalogu.';
                    

                    
                  } else {
                    this.errorMessage = 'Greška prilikom registracije.';
                  }
                },
                (error) => {
                  this.errorMessage = 'Greška prilikom registracije.';
                }
              );
            } else {
              this.errorMessage = 'Greška prilikom upload-a slike.';
            }
          },
          (error) => {
            this.errorMessage = 'Greška prilikom upload-a slike.';
          }
        );
      } else {
        this.errorMessage = 'Forma nije validna.';
      }
    }
  }


ngOnInit() {

  console.log('da li ulazi ovdje');
  this.route.queryParams.subscribe(params => {
    this.token = params['token'];
    if (this.token) {
      this.confirmEmail();
    }
  });
  
}

confirmEmail()
{
  this.authService.verifyToken(this.token).subscribe( response => {
    if(response)   
      {
      this.router.navigate(['/app-login']); 
      }
      else
      {

        console.log('Error confirming email: ovo je greska respone=false');
      }
    }, 
    error => {
      console.log('Error confirming email:', error);
    }
  );
}

onFileUpload(event: any) {
  if(event.target.files.length > 0){
    this.file = event.target.files[0];
  }
  console.log(this.file+' dodanooo');
}

public uploadImage(url: any): Observable<any> {
  const formData = new FormData();
  formData.append("image", url);
  console.log('slika je dodata');
  return this.http.post(this.uploadImgUrl, formData);
}



}


