import 'phaser';
import { GameScene } from './scenes/gameScene';
import { MenuScene } from './scenes/menuScene';


const config: GameConfig = {
  version: '1.0',
  width: window.innerWidth,
  height: window.innerHeight,
  zoom: 1,
  type: Phaser.AUTO,
  parent: 'game',
  physics: {
    default: 'arcade',
    arcade: {
        gravity: { y: 0 }
    }
  },
  scene: [GameScene, MenuScene],
  input: {
    keyboard: true,
    mouse: true,
    touch: false,
    gamepad: false
  },
  backgroundColor: '#000000',
  pixelArt: true,
  antialias: false
};

export class Game extends Phaser.Game {
  constructor(config: GameConfig) {
    super(config);
  }
}

// window.onload = () => {
//   const game = new Game(config);
// };

export const loadGame = () => {
  return new Game(config);
};
