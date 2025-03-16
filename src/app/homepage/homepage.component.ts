import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';


@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.css'
})
export class HomepageComponent {
news: any;
errorMessage: any;


private urlNews='http://localhost:9000/news/news';

constructor(private http: HttpClient)
{
 
  this.readNews();
}

readNews() {
  this.http.get(this.urlNews).subscribe({
    next: (data) => {
      this.news = data;
    },
    error: (error) => {
      this.errorMessage = 'Greška prilikom prijavljivanja: ' + error.message; 
    }
  });
}
}
