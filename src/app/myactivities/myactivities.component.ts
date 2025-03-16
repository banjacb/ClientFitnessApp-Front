import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Chart } from 'angular-highcharts';
import { BarController, CategoryScale, LineController, LineElement, LinearScale, PointElement, Title } from 'chart.js';
import * as jspdf from 'jspdf';
import html2canvas from 'html2canvas';


interface Activity {
  id: number;
  name: string;
  weight: number;
  repetition: number;
  series: number;
  kilo: number;
  date: string;
}

@Component({
  selector: 'app-myactivities',
  templateUrl: './myactivities.component.html',
  styleUrls: ['./myactivities.component.css'],
 
})
export class MyactivitiesComponent implements OnInit  {
  activities: Activity[] = [];
 
  statistics: any[] = [];
  idUser: any;
  activityForm: FormGroup;
  chart: Chart | undefined;
  lineChart= new Chart({});
  kilo: any;
  date: any;
  chartOptions: any;
  urlActivities: any;
  activity: any;


  constructor(private http: HttpClient, private service: AuthService, private formBuilder: FormBuilder) {
    this.activityForm = this.formBuilder.group({
      name: ['', Validators.required],
      weight: ['', Validators.required],
      repetition: ['', Validators.required],
      series: ['', Validators.required],
      kilo: ['', Validators.required]
    });
   

    


    
  }
  ngOnInit(): void {

    if (this.service.isLoggin()) {
      this.idUser = this.service.getUser().id;
      this.readActivities();

      this.urlActivities = `http://localhost:9000/activities/kilo/${this.idUser}`;
  
      this.http.get<any>(this.urlActivities).subscribe({
        next: (data) => {
      
          if (data) {
    
            this.statistics.push(data);
            var kilos: any[] = data.x;
            var dates: any[] = data.y;
    
            console.log('Ovo su podaci za kilograme:', kilos);
            console.log('Ovo su podaci za datume:', dates);
            this.createChart();
            
             
          } else {
            console.error('Podaci nisu definisani ili su null.');
          }
        },
        error: (error) => {
          console.error('Došlo je do greške prilikom čitanja grafikona:', error);
        }
      });
    
    }
   

  }



  


  
  createChart() {
  const xValues: any[] = [];
  const yValues: any[] = [];

  for (const statistic of this.statistics) {
    if (statistic && statistic.x && statistic.y) {
      xValues.push(statistic.x);
      yValues.push(statistic.y);
    }
  }

  console.log(xValues);
  console.log(yValues)
  this.chartOptions = {
    chart: {
      type: 'line',
      backgroundColor: 'lightblue'
    },
    title: {
      text: 'Dijagram aktivnosti'
    },
    xAxis: {
      title: {
        text: 'Datum'
      },
      categories: xValues[0],
      labels: {
        style: {
          color: 'black'
        }
      },
      lineColor: 'white' // Postavite bijelu boju linije X-ose
    },
    yAxis: {
      title: {
        text: 'Kilogrami'
      },
      labels: {
        style: {
          color: 'black' 
        }
      },
      lineColor: 'white'
    },
    series: [
      {
        name: 'First Dataset',
        data: yValues[0],
        color: 'white'
      }
    ]
  };

  this.chart = new Chart(this.chartOptions);
}







  readActivities() {
    const urlActivities = `http://localhost:9000/activities/${this.idUser}`;

    this.http.get<Activity[]>(urlActivities).subscribe({
      next: (data: Activity[]) => {
        this.activities = data;
      },
      error: (error) => {
        console.error('Došlo je do greške prilikom čitanja aktivnosti:', error);
      }
    });
  }

  addActivity() {
    const urlActivities = 'http://localhost:9000/activities';
    const date = new Date();
    const user_id = this.idUser;

    const formData = { ...this.activityForm.value, date, user_id };
    this.http.post(urlActivities, formData).subscribe(
      (response: any) => {
        this.activities.push(response);
        this.activityForm.reset();
        console.log("Program je uspešno dodan.");
      },
      (error) => {
        console.error("Došlo je do greške prilikom dodavanja programa:", error);
      }
    );
  }

  deleteActivity(id: number) {
    const urlActivities = `http://localhost:9000/activities/${id}`;
  
    this.http.delete(urlActivities).subscribe(
      () => {
        console.log('Aktivnost uspešno obrisana.');
        // Uklonite aktivnost iz lokalnog niza
        this.activities = this.activities.filter(activity => activity.id !== id);
        this.createChart();
      },
      (error) => {
        console.error('Došlo je do greške prilikom brisanja aktivnosti:', error);
      }
    );
  }
  

  @ViewChild('content', { static: false })
  content!: ElementRef;
  @ViewChild('contentChart', { static: false })
  contentChart!: ElementRef;
  
  public savePDF(): void {
    const doc = new jspdf.jsPDF();
    const content = this.content.nativeElement;
    const contentChart = this.contentChart.nativeElement;
  
    html2canvas(content).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const imgWidth = 210; // A4
      const pageHeight = 297; 
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;
  
      doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
  
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        doc.addPage();
        doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
  
 
      html2canvas(contentChart).then((chartCanvas) => {
        const chartImgData = chartCanvas.toDataURL('image/png');
        const chartImgHeight = (chartCanvas.height * imgWidth) / chartCanvas.width;
        const chartHeightLeft = chartImgHeight;
        const chartPosition = 0;
  
        doc.addPage();
        doc.addImage(chartImgData, 'PNG', 0, chartPosition, imgWidth, chartImgHeight);
  
        this.saveChart();
        doc.save('podaci.pdf');
        console.log('sačuvano');
      });
    });
  }
  




  saveChart(): void {
    const doc = new jspdf.jsPDF();
    const contentChart = this.contentChart.nativeElement;

    html2canvas(contentChart).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        doc.addPage();
        doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      doc.save('grafikon.pdf');
      console.log('sacuvan graf');
    });
  }






}
