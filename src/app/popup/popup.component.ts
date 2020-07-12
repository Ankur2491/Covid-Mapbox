import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.css']
})
export class CustomPopupComponent implements OnInit {

  constructor() { }
  message: string;
  ngOnInit(): void {
  }

}
