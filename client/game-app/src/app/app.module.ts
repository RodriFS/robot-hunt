import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { InGameComponent } from './in-game/in-game.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AppRoutingModule } from './app-routing.module';
import { PlayerSelectComponent } from './player-select/player-select.component';

@NgModule({
  declarations: [
    AppComponent,
    InGameComponent,
    DashboardComponent,
    PlayerSelectComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
