import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CountryDetails } from './models/country-details-model';

@Injectable({
  providedIn: 'root'
})
export class MapboxService {

  constructor(private http: HttpClient) { }

  getWorldData(): Observable<any> {
    return this.http.get('https://covid-service.netlify.app/.netlify/functions/api/worldData');
  }

  getHistoricalData(country: string): Observable<any> {
    return this.http.get(`https://covid-service.netlify.app/.netlify/functions/api/historicalData/${country}`);
  }

  getCountryDetails(country: string): Observable<any> {
    return this.http.get(`https://covid-service.netlify.app/.netlify/functions/api/countryData/${country}`);
  }
}