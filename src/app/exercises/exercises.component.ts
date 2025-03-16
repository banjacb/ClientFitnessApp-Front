import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';

@Component({
  selector: 'app-exercises',
  templateUrl: './exercises.component.html',
  styleUrl: './exercises.component.css'
})

export class ExercisesComponent {

  exercises: any;
  errorMessage: any;
  private urlExercises="http://localhost:9000/news/exercises";

  constructor (private http: HttpClient)
  {
    this.readExercises();
  }

  readExercises()
  {
    this.http.get(this.urlExercises).subscribe(
      {
        next: (data)=>
          {
            this.exercises= data;
          },
          error: (error) =>
            {
              this.errorMessage='pogresno citanje';
            }

      }

    )

  }
  

}
