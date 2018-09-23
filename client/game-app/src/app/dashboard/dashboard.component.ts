import { Component, OnInit } from '@angular/core';
import { GameService } from '../game.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  playerList: string[] = [];

  constructor(private gameSvc: GameService) {
    // gameSvc.announcePlayers$.subscribe(
    //   player => {
    //     this.playerList.push(`${player} is waiting`);
    //   });
  }

  ngOnInit() {
  }


}