import { Component, OnInit, ElementRef, NgZone } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import { HttpClient } from '@angular/common/http';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { DataService } from '../data.service';
import { Router } from '@angular/router';
import { DynamicComponentService } from '../dynamic-component.service';
import { DomSanitizer } from '@angular/platform-browser';
import { MapboxService } from '../mapbox.service';
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
  constructor(private http: HttpClient, private dataService: DataService, private router: Router, private dynamicComponentService: DynamicComponentService, public elementRef: ElementRef, public ngZone: NgZone, private _sanitizer: DomSanitizer, private ms: MapboxService) { }
  options = [];
  worldData = {};
  ngOnInit(): void {
    Object.getOwnPropertyDescriptor(mapboxgl, "accessToken").set('pk.eyJ1IjoiYW5rdXIyNCIsImEiOiJja2Nhb2psb2sxbGM0MnlsampzZXkxaHB2In0.VexYJAgwFU6BKws5-zasNQ');
    this.map = new mapboxgl.Map({
      container: 'map',
      style: this.style,
      zoom: 3.5,
      center: [this.lng, this.lat]
    });
    var comp = new mapboxgl.NavigationControl({ showCompass: false, showZoom: true});
    this.map.addControl(comp,'bottom-right');
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );

    this.ms.getWorldData().subscribe((totalData) => {
      let res = totalData['results'];
      res.forEach(element => {
        this.options.push(element.country_region);
        let entry = { 'confirmed': element.confirmed, 'deaths': element.deaths, 'recovered': element.recovered };
        this.worldData[element.country_region] = entry;
      });
      this.http.get('assets/country.json').subscribe(data => {
        this.geoJson = data;
        this.geoJson['features'].forEach(marker => {
          var el = document.createElement('div');
          el.className = 'marker';
          let c_data = {}
          if (this.worldData[marker.properties.country])
            c_data = this.worldData[marker.properties.country];
          else
            c_data = { 'confirmed': 'Not Available', 'deaths': 'Not Available', 'recovered': 'Not Available' }
          new mapboxgl.Marker(el)
            .setLngLat(marker.geometry.coordinates)
            .setPopup(new mapboxgl.Popup({ offset: 25 })
              .setHTML('<p><b>' + marker.properties.country + '(capital:' + marker.properties.city + ')</b></p><p> Confirmed Cases:' + c_data["confirmed"] + '</p><p> Recovered Cases:' + c_data["recovered"] + '</p><p> Death Cases: ' + c_data["deaths"]+'</p>')
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
