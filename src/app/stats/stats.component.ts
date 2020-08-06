import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MapboxService } from '../mapbox.service';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.css']
})
export class StatsComponent implements OnInit {

  monthMap = { "01": "January", "02": "February", "03": "March", "04": "April", "05": "May", "06": "June", "07": "July", "08": "August", "09": "September", "10": "October", "11": "November", "12": "December" };
  showYAxisLabel: boolean = true;
  showXAxisLabel: boolean = true;
  xAxis: boolean = true;
  yAxis: boolean = true;
  legend: boolean = true;
  xAxisLabel: string = 'Months';
  timeline: boolean = true;
  yAxisLabel: string = 'Count';
  topCountriesCases = [];
  topCountriesRecovered = [];
  topCountriesDeaths = [];
  casesCollection = [];
  recoveredCollection = [];
  deathsCollection = [];
  calculatedCases = {};
  calculatedRecovered = {};
  calculatedDeaths = {};
  previousDate: string;
  currentDate: string;
  colorScheme = {
    domain: [
      '#93003a',
      '#ffa600',
      '#ff7c43',
      '#f95d6a',
      '#f95d6a',
      '#d45087',
      '#a05195',
      '#665191',
      '#2f4b7c',
      '#003f5c'
    ]
  };
  constructor(private http: HttpClient, private service: MapboxService) { }


  ngOnInit(): void {
    this.http.get('https://corona.azure-api.net/summary').subscribe((data: any) => {
      this.getTopCountries(data);
    })
  }

  getTopCountries(payload: any) {
    let currentDateObj = new Date();
    let previousDateObj = new Date(currentDateObj.getTime() - 180 * 24 * 60 * 60 * 1000);
    let previousMonth = (previousDateObj.getMonth() + 1).toString();
    let currentMonth = (currentDateObj.getMonth() + 1).toString();
    let previousDate = previousDateObj.getDate().toString();
    let currentDate = currentDateObj.getDate().toString();
    if (previousMonth.length == 1)
      previousMonth = '0' + previousMonth;
    if (currentMonth.length == 1)
      currentMonth = '0' + currentMonth;
    if (previousDate.length == 1) {
      previousDate = '0' + previousDate;
    }
    if (currentDate.length == 1) {
      currentDate = '0' + currentDate;
    }
    this.previousDate = previousDateObj.getFullYear().toString() + '-' + previousMonth + '-' + previousDate;
    this.currentDate = currentDateObj.getFullYear().toString() + '-' + currentMonth + '-' + currentDate;
    payload.countries.sort((a, b) => a.Confirmed < b.Confirmed ? 1 : -1);
    this.topCountriesCases = payload.countries.slice(0, 5);
    this.confirmedPerMonth();
    payload.countries.sort((a, b) => a.Recovered < b.Recovered ? 1 : -1);
    this.topCountriesRecovered = payload.countries.slice(0, 5);
    this.recoveredPerMonth();
    payload.countries.sort((a, b) => a.Deaths < b.Deaths ? 1 : -1);
    this.topCountriesDeaths = payload.countries.slice(0, 5);
    this.deathsPerMonth();
  }
  onSelect(data): void {
    console.log('Item clicked', JSON.parse(JSON.stringify(data)));
  }
  onActivate(data): void {
    console.log('Activate', JSON.parse(JSON.stringify(data)));
  }

  onDeactivate(data): void {
    console.log('Deactivate', JSON.parse(JSON.stringify(data)));
  }
  formCasesCollection() {
    this.topCountriesCases.forEach((country) => {
      let obj = { "name": country.Country_Region, "series": [] }
      //console.log(this.calculatedData[country.Country_Region]);
      for (let el of this.calculatedCases[country.Code]) {
        for (let d in el) {
          let obj1 = {};
          obj1["name"] = d;
          obj1["value"] = el[d];
          obj.series.push(obj1);
        }
      }
      this.casesCollection.push(obj);
    })
    this.casesCollection.sort((a, b) => a.series.length < b.series.length ? 1 : -1);
    console.log(this.casesCollection);
    this.casesCollection = [...this.casesCollection];
  }

  formRecoveredCollection() {
    this.topCountriesRecovered.forEach((country) => {
      let obj = { "name": country.Country_Region, "series": [] }
      //console.log(this.calculatedData[country.Country_Region]);
      for (let el of this.calculatedRecovered[country.Code]) {
        for (let d in el) {
          let obj1 = {};
          obj1["name"] = d;
          obj1["value"] = el[d];
          obj.series.push(obj1);
        }
      }
      this.recoveredCollection.push(obj);
    })
    this.recoveredCollection.sort((a, b) => a.series.length < b.series.length ? 1 : -1);
    console.log(this.recoveredCollection);
    this.recoveredCollection = [...this.recoveredCollection];
  }

  formDeathsCollection() {
    this.topCountriesDeaths.forEach((country) => {
      let obj = { "name": country.Country_Region, "series": [] }
      //console.log(this.calculatedData[country.Country_Region]);
      for (let el of this.calculatedDeaths[country.Code]) {
        for (let d in el) {
          let obj1 = {};
          obj1["name"] = d;
          obj1["value"] = el[d];
          obj.series.push(obj1);
        }
      }
      this.deathsCollection.push(obj);
    })
    this.deathsCollection.sort((a, b) => a.series.length < b.series.length ? 1 : -1);
    console.log(this.deathsCollection);
    this.deathsCollection = [...this.deathsCollection];
  }

  async confirmedPerMonth() {
    for (let countryObj of this.topCountriesCases) {
      // this.http.get(`http://api.coronatracker.com/v3/analytics/trend/country?countryCode=${countryObj.Code}&startDate=${this.previousDate}&endDate=${this.currentDate}`).subscribe((countryTimeline: Array<any>) => {
      let countryTimeline = await this.service.getTimeline(countryObj.Code, this.previousDate, this.currentDate);
      let prevMonth = countryTimeline[0].last_updated.split('-')[1];
      let totalForPrevMonth = 0;
      let countryCode = countryTimeline[0].country_code;
      this.calculatedCases[countryCode] = [];
      for (let i = 1; i < countryTimeline.length; i++) {
        let currentMonth = countryTimeline[i].last_updated.split('-')[1];
        if (currentMonth != prevMonth) {
          let valLast = countryTimeline[i - 1].total_confirmed;
          let obj = { [this.monthMap[prevMonth]]: valLast - totalForPrevMonth };
          totalForPrevMonth = valLast;
          prevMonth = currentMonth;
          this.calculatedCases[countryCode].push(obj);
        }
      }
    }
    this.formCasesCollection();
  }

  async recoveredPerMonth() {
    for (let countryObj of this.topCountriesRecovered) {
      // this.http.get(`http://api.coronatracker.com/v3/analytics/trend/country?countryCode=${countryObj.Code}&startDate=${this.previousDate}&endDate=${this.currentDate}`).subscribe((countryTimeline: Array<any>) => {
      let countryTimeline = await this.service.getTimeline(countryObj.Code, this.previousDate, this.currentDate);
      let prevMonth = countryTimeline[0].last_updated.split('-')[1];
      let totalForPrevMonth = 0;
      let countryCode = countryTimeline[0].country_code;
      this.calculatedRecovered[countryCode] = [];
      for (let i = 1; i < countryTimeline.length; i++) {
        let currentMonth = countryTimeline[i].last_updated.split('-')[1];
        if (currentMonth != prevMonth) {
          let valLast = countryTimeline[i - 1].total_recovered;
          let obj = { [this.monthMap[prevMonth]]: valLast - totalForPrevMonth };
          totalForPrevMonth = valLast;
          prevMonth = currentMonth;
          this.calculatedRecovered[countryCode].push(obj);
        }
      }
    }
    this.formRecoveredCollection();
  }
  async deathsPerMonth() {
    for (let countryObj of this.topCountriesDeaths) {
      // this.http.get(`http://api.coronatracker.com/v3/analytics/trend/country?countryCode=${countryObj.Code}&startDate=${this.previousDate}&endDate=${this.currentDate}`).subscribe((countryTimeline: Array<any>) => {
      let countryTimeline = await this.service.getTimeline(countryObj.Code, this.previousDate, this.currentDate);
      let prevMonth = countryTimeline[0].last_updated.split('-')[1];
      let totalForPrevMonth = 0;
      let countryCode = countryTimeline[0].country_code;
      this.calculatedDeaths[countryCode] = [];
      for (let i = 1; i < countryTimeline.length; i++) {
        let currentMonth = countryTimeline[i].last_updated.split('-')[1];
        if (currentMonth != prevMonth) {
          let valLast = countryTimeline[i - 1].total_deaths;
          let obj = { [this.monthMap[prevMonth]]: valLast - totalForPrevMonth };
          totalForPrevMonth = valLast;
          prevMonth = currentMonth;
          this.calculatedDeaths[countryCode].push(obj);
        }
      }
    }
    this.formDeathsCollection();
  }
}
