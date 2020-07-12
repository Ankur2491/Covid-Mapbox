import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ThrowStmt } from '@angular/compiler';
@Injectable({
  providedIn: 'root'
})
export class DataService {

  private messageSource = new BehaviorSubject(true);
  currentMessage = this.messageSource.asObservable();
  constructor() { }
  changeMessage(message: boolean){
    this.messageSource.next(message);
  }
  private countrySource = new BehaviorSubject('');
  currentCountry = this.countrySource.asObservable();
  changeCountry(country: string){
    this.countrySource.next(country);
  }
}
