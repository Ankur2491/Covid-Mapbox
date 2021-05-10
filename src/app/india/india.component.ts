import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-india',
  templateUrl: './india.component.html',
  styleUrls: ['./india.component.css']
})
export class IndiaComponent implements OnInit {

  stateMap = {
    'AN': 'Andaman', 'AP': 'Andhra Pradesh', 'AR': 'Arunachal Pradesh', 'AS': 'Assam',
    'BR': 'Bihar', 'CH': 'Chandigarh', 'CG': 'Chhattisgarh', 'DL': 'Delhi', 'DN': 'Dadra & Nagar Haveli',
    'GA': 'Goa', 'GJ': 'Gujarat', 'HP': 'Himachal Pradesh', 'HR': 'Haryana', 'JH': 'Jharkhand',
    'JK': 'Jammu & Kashmir', 'KA': 'Karnataka', 'KL': 'Kerala', 'LA': 'Ladakh',
    'LD': 'Lakshadweep', 'MH': 'Maharashtra', 'ML': 'Meghalaya', 'MN': 'Manipur', 'MP': 'Madhya Pradesh',
    'MZ': 'Mizoram', 'NL': 'Nagaland', 'OR': 'Orissa', 'PB': 'Punjab', 'PY': 'Pondicherry',
    'RJ': 'Rajasthan', 'SK': 'Sikkim', 'TG': 'Telangana', 'TN': 'Tamil Nadu',
    'TR': 'Tripura', 'UP': 'Uttar Pradesh', 'UT': 'Uttarakhand', 'WB': 'West Bengal'
  }
  revMap = {
    'Andaman': 'AN',
    'Andhra Pradesh': 'AP',
    'Arunachal Pradesh': 'AR',
    'Assam': 'AS',
    'Bihar': 'BR',
    'Chandigarh': 'CH',
    'Chhattisgarh': 'CG',
    'Delhi': 'DL',
    'Dadra & Nagar Haveli': 'DN',
    'Goa': 'GA',
    'Gujarat': 'GJ',
    'Himachal Pradesh': 'HP',
    'Haryana': 'HR',
    'Jharkhand': 'JH',
    'Jammu & Kashmir': 'JK',
    'Karnataka': 'KA',
    'Kerala': 'KL',
    'Ladakh': 'LA',
    'Lakshadweep': 'LD',
    'Maharashtra': 'MH',
    'Meghalaya': 'ML',
    'Manipur': 'MN',
    'Madhya Pradesh': 'MP',
    'Mizoram': 'MZ',
    'Nagaland': 'NL',
    'Orissa': 'OR',
    'Punjab': 'PB',
    'Pondicherry': 'PY',
    'Rajasthan': 'RJ',
    'Sikkim': 'SK',
    'Telangana': 'TG',
    'Tamil Nadu': 'TN',
    'Tripura': 'TR',
    'Uttar Pradesh': 'UP',
    'Uttarakhand': 'UT',
    'West Bengal': 'WB',
  }

  states = Object.keys(this.revMap);
  selectedState = "Select State";
  selectedDistrict = "Select District";
  statesData: object;
  districts = [];
  delta = {};
  delta7 = {};
  meta = {};
  total = {};
  showCard = false;


  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    for (let key of Object.keys(this.stateMap)) {
      console.log(`'${this.stateMap[key]}':'${key}'`);
    }
    // this.http.get("https://api.covid19india.org/v4/min/timeseries.min.json").subscribe(data=>{
    //   console.log(data);
    // })
    this.http.get("https://api.covid19india.org/v4/min/data.min.json").subscribe(data => {
      this.statesData = data;
    })
  }

  showStateData(state){
    this.selectedState = state;
    this.selectedDistrict = 'Select District'
    this.districts = Object.keys(this.statesData[this.revMap[this.selectedState]]['districts']);
    this.delta7 = this.statesData[this.revMap[this.selectedState]]['delta7'];
    this.total = this.statesData[this.revMap[this.selectedState]]['total'];
    this.meta = this.statesData[this.revMap[this.selectedState]]['meta'];
    this.delta = this.statesData[this.revMap[this.selectedState]]['delta'];
    this.showCard = true;
  }
  showDistrictData(district){
    this.selectedDistrict = district;
    this.delta7 = this.statesData[this.revMap[this.selectedState]]['districts'][this.selectedDistrict]['delta7'];
    this.delta = this.statesData[this.revMap[this.selectedState]]['districts'][this.selectedDistrict]['delta'];
    this.total = this.statesData[this.revMap[this.selectedState]]['districts'][this.selectedDistrict]['total'];
    this.meta = this.statesData[this.revMap[this.selectedState]]['districts'][this.selectedDistrict]['meta'];
  }
}
