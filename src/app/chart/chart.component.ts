import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { HttpClient } from '@angular/common/http';
import { CountryDetails } from '../models/country-details-model';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})
export class ChartComponent implements OnInit {

  country_data: CountryDetails;
  last_updated: string;
  // title = 'line-charts';
  multi: any[];
  view: any[] = [1400, 500];

  // options
  legend: boolean = true;
  showLabels: boolean = true;
  animations: boolean = true;
  xAxis: boolean = true;
  yAxis: boolean = true;
  showYAxisLabel: boolean = true;
  showXAxisLabel: boolean = true;
  xAxisLabel: string = 'Dates';
  yAxisLabel: string = 'Count';
  timeline: boolean = true;
  selectedCountry: string;
  colorSchemeDeath = {
    //'#5AA454', '#A10A28', '#C7B42C', '#AAAAAA'
    domain: ['#A10A28']
  };
  colorSchemeCombined = {
    //'#5AA454', '#A10A28', '#C7B42C', '#AAAAAA'
    domain: ['#005AFF', '#5AA454']
  };
  historicalData: any[] = [{ "name": "Deaths", "series": [] }];
  historicalDataCombined: any[] = [{ "name": "Cases", "series": [] }, { "name": "Recovered", "series": [] }];
  constructor(private http: HttpClient, private dataService: DataService) {
    this.dataService.currentCountry.subscribe(selectedCountry=>{
      this.selectedCountry = selectedCountry;
    })
    this.http.get(`http://35.224.154.91:5630/historicalData/${this.selectedCountry}`).subscribe((data) => {
      let cases = data['timeline'].cases;
      let deaths = data['timeline'].deaths;
      let recovered = data['timeline'].recovered;
      let dates = Array.from(Object.keys(cases));
      //let seriesArr = [];
      for (let i = 1; i < dates.length; i++) {
        let differenceCase = Math.abs(cases[dates[i]] - cases[dates[i - 1]]);
        let differenceDeath = Math.abs(deaths[dates[i]] - deaths[dates[i - 1]]);
        let differenceRecovered = Math.abs(recovered[dates[i]] - recovered[dates[i - 1]]);
        let obj1 = {};
        let obj2 = {};
        let obj3 = {};
        obj1["name"] = dates[i];
        obj1["value"] = differenceCase;
        obj2["name"] = dates[i];
        obj2["value"] = differenceDeath;
        obj3["name"] = dates[i];
        obj3["value"] = differenceRecovered;
        this.historicalData[0].series.push(obj2);
        this.historicalDataCombined[0].series.push(obj1);
        this.historicalDataCombined[1].series.push(obj3);
        //seriesArr.push(obj);
      }
      //console.log(seriesArr);

      //this.historicalData[0].series = seriesArr;
      //console.log(this.historicalData);
      this.historicalDataCombined = [...this.historicalDataCombined]
      this.historicalData = [...this.historicalData]
    })
    this.http.get(`http://35.224.154.91:5630/countryData/${this.selectedCountry}`).subscribe((countryData: CountryDetails)=>{
      this.country_data = countryData;
      let lu = this.country_data.updated;
      let date = new Date(0);
      date.setUTCMilliseconds(lu);
      this.last_updated = date.toDateString()+","+date.toLocaleTimeString();
    })

  }
  ngOnInit() {
  }
  showMap() {
    this.dataService.changeMessage(true);
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
  home(){
    this.dataService.changeMessage(true);
  }
}
