import { Component, OnInit, ElementRef, NgZone } from '@angular/core';
import { environment } from '../../environments/environment';
import * as mapboxgl from 'mapbox-gl';
import { HttpClient } from '@angular/common/http';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { DataService } from '../data.service';
import { Router } from '@angular/router';
import { DynamicComponentService } from '../dynamic-component.service';
import { DomSanitizer } from '@angular/platform-browser';
@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
  map: mapboxgl.Map;
  myControl = new FormControl();
  filteredOptions: Observable<string[]>;
  // style = 'mapbox://styles/ankur24/ckcc5bsxo5tja1ipho608ymow';
  // style='mapbox://styles/ankur24/ckcc8f9t96v091iqmdtqvp31q';
  style = 'mapbox://styles/ankur24/ckcc8hk306v581iqhj84z5n8h';
  lat = 13.0569951;
  lng = 80.20929129999999;
  center = [this.lng, this.lat];
  geoJson = {};
  constructor(private http: HttpClient, private dataService: DataService, private router: Router, private dynamicComponentService: DynamicComponentService,public elementRef : ElementRef, public ngZone: NgZone, private _sanitizer: DomSanitizer) { }
  options = [];
  worldData = {};
  ngOnInit(): void {
    Object.getOwnPropertyDescriptor(mapboxgl, "accessToken").set('pk.eyJ1IjoiYW5rdXIyNCIsImEiOiJja2Nhb2psb2sxbGM0MnlsampzZXkxaHB2In0.VexYJAgwFU6BKws5-zasNQ');
    //mapboxgl.accessToken = environment.mapbox.accessToken;
    this.map = new mapboxgl.Map({
      container: 'map',
      style: this.style,
      zoom: 3.5,
      center: [this.lng, this.lat]
    });
    this.map.addControl(new mapboxgl.NavigationControl({ showCompass: false, showZoom: true }));
    // this.map.on('click', (event) => {
    //   let vals = event.lngLat;
    //   console.log(vals);
    //   this.http.get('https://api.mapbox.com/geocoding/v5/mapbox.places/' + vals.lng + ',' + vals.lat + '.json?access_token=' + environment.mapbox.accessToken).subscribe((data) => {
    //     let len = data['features'].length;
    //     let selectedCountry = data['features'][len - 1].place_name;
    //     this.dataService.changeCountry(selectedCountry);
    //     this.dataService.changeMessage(false);
    //   })
    // })
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );

    this.http.get('http://35.224.154.91:5630/worldData').subscribe((totalData) => {
      let res = totalData['results'];
      res.forEach(element => {
        this.options.push(element.country_region);
        let entry = { 'confirmed': element.confirmed, 'deaths': element.deaths, 'recovered': element.recovered };
        this.worldData[element.country_region] = entry;
      });
      // console.log(this.worldData);
      this.http.get('assets/country.json').subscribe(data => {
        this.geoJson = data;
        // console.log(this.geoJson);
        this.geoJson['features'].forEach(marker => {
          var el = document.createElement('div');
          el.className = 'marker';
          let c_data = {}
          if (this.worldData[marker.properties.country])
            c_data = this.worldData[marker.properties.country];
          else
            c_data = { 'confirmed': 'Not Available', 'deaths': 'Not Available', 'recovered': 'Not Available' }
          // console.log(marker.properties.country, c_data);
          //let popupContent = this.dynamicComponentService.injectComponent(CustomPopupComponent,x=>x.message = "Hi There");
          new mapboxgl.Marker(el)
            .setLngLat(marker.geometry.coordinates)
            .setPopup(new mapboxgl.Popup({ offset: 25 })
            .setHTML('<h4><b>' + marker.properties.country + '(capital:' + marker.properties.city + ')</b></h4><h4> Confirmed Cases:' + c_data["confirmed"] + '</h4><h4> Recovered Cases:' + c_data["recovered"] + '</h4><h4> Death Cases: ' + c_data["deaths"])
            )
            .addTo(this.map)
        });
      })
    })
  }
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
  }

  getDetails(selectedCountry: string) {
    this.dataService.changeCountry(selectedCountry);
    this.dataService.changeMessage(false);
  }

}
