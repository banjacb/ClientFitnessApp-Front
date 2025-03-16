import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-myprograms',
  templateUrl: './myprograms.component.html',
  styleUrl: './myprograms.component.css'
})
export class MyprogramsComponent {
programs: any;
private urlfpuser:any;
private urlfpdelete:any;
idUser: any;
idfp:any;
imagebyte:any;
private apiUrl = 'http://localhost:9000/fitnessprograms';

constructor(private http: HttpClient,private service: AuthService)
{

if(service.isLoggin())
  {
    this.idUser= service.getUser().id;
    this.readPrograms();
  }
  
 
}


readPrograms()
  {
    console.log(this.idUser);

    if(this.idUser!= null)
      {
   this.urlfpuser= `http://localhost:9000/fitnessprograms/fpforuser/${this.idUser}`;
    this.http.get(this.urlfpuser).subscribe(
      {
        next: (data)=>
          {
            this.programs= data;
          },
          error: (error) =>
            {
              
            }

      }

    )

    

  }
  else{}
  }

   deleteProgram(programId: number)
  {

    this.urlfpdelete=`http://localhost:9000/fitnessprograms/${programId}`

    this.http.delete(this.urlfpdelete)
    .subscribe(
      () => {
        console.log('Program successfully deleted.');
        
      },
      error => {
        console.error('Error deleting program:', error);
      }
    );

  }

 
  


  public getImage(id : any) : any{


    let image = this.downloadImage(id);
    return image;
  }

  public downloadImage(id: any): string{

    return `http://localhost:9000/images/download/${id}`
    
  }
  zavrsi(project: any): void {
    const url = `${this.apiUrl}/${project.id}/status`;
    this.updateStatus(url, false).subscribe(
      response => {
        project.status = false; // Ažurirajte status projekta u Angular aplikaciji
        console.log('Status updated successfully', response);
      },
      error => {
        console.error('Error updating status', error);
      }
    );
  }

  updateStatus(url: string, status: boolean): Observable<any> {
    return this.http.put(url, null, { params: { status: status.toString() } });
  }
  

}
