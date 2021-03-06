import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MapComponent } from './map/map.component';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatButtonModule} from '@angular/material/button';
import { NgxMapboxGLModule } from 'ngx-mapbox-gl';
import { ChartComponent } from './chart/chart.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { CustomPopupComponent } from './popup/popup.component';
import { DynamicComponentService } from './dynamic-component.service';


@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    ChartComponent,
    CustomPopupComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatAutocompleteModule,
    NgxChartsModule,
    MatButtonModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    MatInputModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    NgxMapboxGLModule.withConfig({
      accessToken: 'pk.eyJ1IjoiYW5rdXIyNCIsImEiOiJja2Nhb2psb2sxbGM0MnlsampzZXkxaHB2In0.VexYJAgwFU6BKws5-zasNQ'
    })
  ],
  providers: [DynamicComponentService],
  bootstrap: [AppComponent]
})
export class AppModule { }
