import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {BatteryComponent} from './battery/battery.component'
import {MyAccountComponent} from './my-account/my-account.component'


const routes: Routes = [
  { path: 'battery', component: BatteryComponent },
  { path: 'myaccount', component: MyAccountComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
