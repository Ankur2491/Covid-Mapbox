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
    return this.http.get('https://covid-19-service.herokuapp.com/worldData');
  }

  getHistoricalData(country: string): Observable<any> {
    return this.http.get(`https://covid-19-service.herokuapp.com/historicalData/${country}`);
  }

  getCountryDetails(country: string): Observable<any> {
    return this.http.get(`https://covid-19-service.herokuapp.com/countryData/${country}`);
  }

  getTimeline(countryCode: string, startDate: string, endDate: string): Promise<any[]> {
    return this.http.get<any[]>(`http://api.coronatracker.com/v3/analytics/trend/country?countryCode=${countryCode}&startDate=${startDate}&endDate=${endDate}`).toPromise();
  }
}