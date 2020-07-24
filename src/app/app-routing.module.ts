import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChartComponent } from './chart/chart.component';
import { MapComponent } from './map/map.component';
import { AppComponent } from './app.component';
import { StatsComponent } from './stats/stats.component';


const routes: Routes = [{path:"",component:MapComponent},{path:"home", component:MapComponent},{path:"details",component:ChartComponent},{path:"stats",component:StatsComponent}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
