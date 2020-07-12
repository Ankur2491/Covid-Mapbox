import { Component, OnInit } from '@angular/core';
import { DataService } from './data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'mapboxAngular';
  showWorldMap: boolean;
  constructor(private data: DataService){}
  ngOnInit(){
    this.data.currentMessage.subscribe(msg => {this.showWorldMap = msg});
  }
}
