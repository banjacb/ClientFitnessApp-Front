import { HttpClient, HttpContext } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-addprogram',
  templateUrl: './addprogram.component.html',
  styleUrl: './addprogram.component.css'
})
export class AddprogramComponent implements OnInit {

  
  programForm: FormGroup;
  showYouTubeLink= false;
  categories: any[] = [];
  private urlCategories= "http://localhost:9000/categories";
 
  private urlProgram= "http://localhost:9000/fitnessprograms"
  noviProgram: any;
  programs: any;
  myprograms: any;
  uploadInProgress = false;
  file : any;
  private uploadImgUrl = "http://localhost:9000/images/upload";
  idUser : any;
  user: any;
  urlUser: any;
  message : any;
  constructor(private formBuilder: FormBuilder, private http: HttpClient,private service : AuthService)
  {
    if (this.service.isLoggin()) {
      this.idUser = this.service.getUser().id;
      this.urlUser = `http://localhost:9000/users/${this.idUser}`;
      
    }

    this.programForm = this.formBuilder.group({
      name: ['', Validators.required],
      price: ['', Validators.required],
      duration: ['', Validators.required],
      location: ['', Validators.required],
      difficulty: ['', Validators.required],
      category_id: ['', Validators.required],
      image: ['', Validators.required],
      description: ['', Validators.required],
      youtubeLink: ['']
    });

 
    

  }

  ngOnInit(): void {
   

    this.loadCategories();
    this.loadPrograms();
    
    
    
  }
 
  loadPrograms()
  {
    this.http.get(this.urlProgram).subscribe(
      (data: any) => {
        this.programs = data;
      },
      (error) => {
        console.error('Greška prilikom dohvata kategorija:', error);
      }
    );
    
  }

  loadCategories()
  {

    this.http.get(this.urlCategories).subscribe(
      (data: any) => {
        this.categories = data;
      },
      (error) => {
        console.error('Greška prilikom dohvata kategorija:', error);
      }
    );
    
  }
 
 

  submitForm(): void {
    if (this.programForm.invalid) {
      console.log('Forma nije validna');
      return;
    }

    this.uploadInProgress = true;

    if (this.file) {
      this.uploadImage(this.file).subscribe((data) => {
        console.log(this.programForm.get('category_id')?.value);
        const program = {
          name: this.programForm.get('name')?.value,
          price: this.programForm.get('price')?.value,
          description: this.programForm.get('description')?.value,
          duration: this.programForm.get('duration')?.value,
          difficulty: this.programForm.get('difficulty')?.value,
          location: this.programForm.get('location')?.value,
          category_id: this.programForm.get('category_id')?.value,
          link_you_tube: this.programForm.get('youtubeLink')?.value,
          image: data.file, 
          user_id: this.idUser,
          image_id: data.id, 
          status : true
        };

        

        this.http.post(this.urlProgram, program).subscribe((response) => {
          console.log('Program je uspešno dodat.', response);
          this.uploadInProgress = false;
          this.message="Program je uspjesno dodan."
        }, (error) => {
          console.error('Došlo je do greške prilikom dodavanja programa.', error);
          this.uploadInProgress = false;
          this.message="Greska, program nije dodan."
        });
      }, (error) => {
        console.error('Došlo je do greške prilikom otpreme slike:', error);
        this.uploadInProgress = false;
      });
    }



    if(this.message)
      {

        const urlStatistic='http://localhost:9000/statistics';
    console.log(this.message);
        
        const formData = {
          description: this.message,
          date: new Date()
        };

        this.http.post(urlStatistic, formData).subscribe((response) => {
          console.log('Program- statistika je uspešno dodan.', response);
          
        }, (error) => {
          console.error('Došlo je do greške prilikom dodavanja statistike.', error);
          
        });
      
    
      }


    
  }
  
 
  public uploadImage(url: any): Observable<any> {
    const formData = new FormData();
    formData.append("image", url);
    return this.http.post(this.uploadImgUrl, formData);
  }



  
  toggleYouTubeLink(event: Event) {
    const selectedLocation = (event.target as HTMLSelectElement).value;
    this.showYouTubeLink = (selectedLocation === 'online');
  }

  onFileUpload(event: any) {
    if(event.target.files.length > 0){
      this.file = event.target.files[0];
    }
    console.log(this.file);
  }
 
  
  

}
