import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { FormBuilder, FormControl } from '@angular/forms';

@Component({
  selector: 'app-programs',
  templateUrl: './programs.component.html',
  styleUrls: ['./programs.component.css']
})


export class ProgramsComponent {

  errorMessage: any;
  private urlPrograms="http://localhost:9000/fitnessprograms";
  private urlCategories="http://localhost:9000/categories";
  private urlAttributes="http://localhost:9000/attributecategories";
  private urlSearchPrograms: string='';
  private urlFilterCat: any;
  private urlFilterAtt: any;
  programs: any;
  idUser: any = null;
  searchText: any;
  myForm: any;
  categories: any;
  attributes: any;
  idCat: any;

  constructor (private http: HttpClient, private service: AuthService, private formBuilder: FormBuilder)
  {
    if(service.isLoggin())
      {
        this.idUser= service.getUser().id;
      }
    this.readPrograms();
  }

  ngOnInit() {
    this.myForm = this.formBuilder.group({
      unos: ['']
    
    });

    this.http.get(this.urlCategories).subscribe(
      
       (data)=>
          {
            this.categories=data;
          },
         (error)=>{
            console.log('Lokacija je online.');

          
      })

      this.http.get(this.urlAttributes).subscribe(
        
           (data)=>
            {
              this.attributes=data;
            },
           (error)=>{
              console.log('Lokacija je online.');
            }
        

      )
    
    
  }

  readPrograms()
  {
    this.http.get(this.urlPrograms).subscribe(
      {
        next: (data)=>
          {
            this.programs= data;
          },
          error: (error) =>
            {
              this.errorMessage='pogresno citanje';
            }

      }

    )

  }

  searchProgram() {
    const searchText = this.myForm.value.unos;
    if (searchText) {
      this.urlSearchPrograms = `http://localhost:9000/fitnessprograms/search/${searchText}`;
    } else {
      this.urlSearchPrograms = 'http://localhost:9000/fitnessprograms'; 
    }
  
    this.http.get(this.urlSearchPrograms).subscribe({
      next: (data) => {
        this.programs = data;
      },
      error: (error) => {
        
      }
    });
  }
  
  
  onCategoryChange(event: Event) {
    const selectedCategoryId = (event.target as HTMLSelectElement).value;
    console.log(selectedCategoryId);
  
    if (selectedCategoryId === "default") {
      this.urlPrograms = 'http://localhost:9000/fitnessprograms'; 
      this.http.get(this.urlPrograms).subscribe(
        (data) => {
          this.programs = data;
        },
        (error) => {
          console.error("Error fetching programs: ", error);
        }
      );
    } else {
      this.urlFilterCat = `http://localhost:9000/fitnessprograms/filterCategory/${selectedCategoryId}`;
      this.http.get(this.urlFilterCat).subscribe(
        (data) => {
          this.programs = data;
        },
        (error) => {
          console.error("Error fetching programs: ", error);
        }
      );
    }
  }

  onAttributeChange(event: Event) {
    const selectedAttributeId = (event.target as HTMLSelectElement).value;
    console.log(selectedAttributeId);
  
    if (selectedAttributeId === "default") {
      this.urlPrograms = 'http://localhost:9000/fitnessprograms'; 
      this.http.get(this.urlPrograms).subscribe(
        (data) => {
          this.programs = data;
        },
        (error) => {
          console.error("Error fetching programs: ", error);
        }
      );
    } else {
      this.urlFilterAtt = `http://localhost:9000/attributecategories/filterAttribute/${selectedAttributeId}`;
      this.http.get(this.urlFilterAtt).subscribe(
        (data) => {
          this.programs = data;
        },
        (error) => {
          console.error("Error fetching programs: ", error);
        }
      );
    }
  }
  
 
  public getImage(id : any) : any{


    let image = this.downloadImage(id);
    return image;
  }

  public downloadImage(id: any): string{

    return `http://localhost:9000/images/download/${id}`
    
  }


  

}
