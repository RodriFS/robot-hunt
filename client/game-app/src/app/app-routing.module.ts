import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { InGameComponent } from './in-game/in-game.component';
import { PlayerSelectComponent } from './player-select/player-select.component';

const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'select', component: PlayerSelectComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'game', component: InGameComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
