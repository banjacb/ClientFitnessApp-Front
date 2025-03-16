import { Component, OnInit } from '@angular/core';
import {  FormBuilder, FormGroup,Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { HttpClient } from '@angular/common/http';
import { image } from 'html2canvas/dist/types/css/types/image';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-update-profile',
  templateUrl: './update-profile.component.html',
  styleUrl: './update-profile.component.css'
})
export class UpdateProfileComponent {

  profileForm : any;
  errorMessage: string = '';
  idUser : any;
  user: any;
  imageOld : any;
  file : any;
  private uploadImgUrl = "http://localhost:9000/images/upload";
  private urlRegister = 'http://localhost:9000/users';


  constructor(private formBuilder: FormBuilder, private service : AuthService, private http : HttpClient) { 
    this.profileForm = this.formBuilder.group({
      username: [{value: '', disabled: true}],
      password: ['', Validators.required],
      email: [{value: '', disabled: true}],
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      city: ['', Validators.required],
      role: ['', Validators.required],
      status: ['', Validators.required],
      image: ['', Validators.required]
    });


    if(service.isLoggin())
      {
        this.idUser= service.getUser().id;
        this.readUser();
      }
    
  }

  readUser() {
    const urlUser = `http://localhost:9000/users/${this.idUser}`;

    this.http.get(urlUser).subscribe(
      (data) => {
        this.user = data;
     
        
        this.profileForm = this.formBuilder.group({
          username: this.user.username,
          password: this.user.password,
          email: this.user.email,
          first_name: this.user.first_name,
          last_name: this.user.last_name,
          city: this.user.city,
          role: this.user.role,
          status: this.user.status,
      
        
        });

      
      },
      error => {
        console.error('User not found:', error);
      }
    );
  }


  populateForm(): void {
    
    if (this.user) {
      this.profileForm.patchValue({
        username: this.user.username,
        password:this.user.password,
        email: this.user.email,
        first_name: this.user.first_name,
        last_name: this.user.last_name,
        city: this.user.city,
        role: this.user.role,
        image : this.user.image

      });
  
    }
  }
  onSubmit() {
    if (this.profileForm.valid) {
  
      const formValues = this.profileForm.value;
      if (this.file) {
  
        this.uploadImage(this.file).subscribe(
          (dataSlika) => {
            if (dataSlika !== null) {
              const request = { 
                username: formValues.username, 
                password: formValues.password,
                first_name: formValues.first_name,
                last_name: formValues.last_name,
                city: formValues.city,
                email: this.user.email,
                role: formValues.role,
                status: true,
                image_id: dataSlika.id,
                image: dataSlika.file
              };
  
              if (this.idUser) {
                const urlUser = `http://localhost:9000/users/${this.idUser}`;
                this.http.put(urlUser, request).subscribe(
                  (response) => {
                    console.log('Profile updated successfully:', response);
                    this.errorMessage = 'Izmjene uspjesno sacuvane.';
                  },
                  (error) => {
                    console.error('Error updating profile:', error);
                    this.errorMessage = 'Greska prilikom ažuriranja.';
                  }
                );
              } else {
                this.errorMessage = 'Greška prilikom ažuriranja.';
              }
            } else {
              this.errorMessage = 'Greška prilikom upload-a slike.';
            }
          }
        );
      } else {
       
        const formData = {
          ...this.profileForm.getRawValue(),
          image: this.user.image,
          image_id: this.user.image_id
        };
        
        if (this.idUser) {
          const urlUser = `http://localhost:9000/users/${this.idUser}`;
          this.http.put(urlUser, formData).subscribe(
            (response) => {
              console.log('Profile updated successfully:', response);
              this.errorMessage = 'Izmjene uspjesno sacuvane.';
            },
            (error) => {
              console.error('Error updating profile:', error);
              this.errorMessage = 'Greska prilikom ažuriranja.';
            }
          );
        } else {
          this.errorMessage = 'Nije moguće izvršiti ažuriranje bez ID-a korisnika.';
        }
      }
    } else {
      this.errorMessage = 'Forma nije validna.';
    }
  }
  
  

  
  public getImage(id : any) : any{


    let image = this.downloadImage(id);
    return image;
  }

  public downloadImage(id: any): string{

    return `http://localhost:9000/images/download/${id}`
    
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
