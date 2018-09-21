import { Component, OnInit } from '@angular/core';
import Phaser from 'phaser';
const data_json = require('../../assets/map.json');
import { loadGame } from '../scripts/game';
import { GameService } from '../game.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-in-game',
  templateUrl: './in-game.component.html',
  styleUrls: ['./in-game.component.css']
})
export class InGameComponent implements OnInit {

  constructor(private gameSvc: GameService, private router: Router) {
    this.gameSvc.observable.subscribe(data => {
      if (!data) {
        this.router.navigate(['/select']);
      }
    });

  }

  ngOnInit() {
    this.game = loadGame();
  }
}
