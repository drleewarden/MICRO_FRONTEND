import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { IframeContainerComponent } from './iframe-container/iframe-container.component';
import { GuestHostMediatorComponent } from './guest-host-mediator/guest-host-mediator.component';

@NgModule({
  declarations: [
    AppComponent,
    IframeContainerComponent,
    GuestHostMediatorComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
