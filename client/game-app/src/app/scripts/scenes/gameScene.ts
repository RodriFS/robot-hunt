import Socket from "../../lib/socket";

import * as Phaser from "phaser";
import { assetsLoader } from "./loader/loader";
import { getMaps } from "./map/map";
import { getPlayer1, updatePlayer1 } from "./player1/player1";
import { getPlayer2, updatePlayer2 } from "./player2/player2";
import { getOrb } from "./orb/orb";
import { getAnims } from "./graphics/anims";
import { getPaths, updateFollowers } from "./followers/paths";
import { getPhysics } from "./physics/physics";
import { getCameras } from "./cameras/cameras";
import { getGraphics } from "./graphics/graphics";
import { getMusic } from "./music/music";
import { preloader } from "./preloader/preloader";

export default class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: "GameScene", active: true });
  }

  public socket = Socket.getInstance();

  public player;
  public playerName;
  public orb;
  public map;
  public lines;
  public protected = false;
  public camera;
  public path;
  public spawnPoint;
  public orbSpawnPoint;
  public minions = [];
  public minionCoords = [];
  public belowLayer;
  public worldLayer;
  public aboveLayer;
  public marker;
  public music_loop;
  public events;
  public time;
  public isDown: boolean;

  coordinatesKeyboardEmit(message) {
    this.socket.socket.emit("keyboardCoordinates", message);
  }

  coordinatesKeyboardReceive(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.socket.socket.on("keyboardCoordinates", (data) => {
        resolve(data);
      });
    });
  }

  coordinatesMouseEmit(message) {
    this.socket.socket.emit("mouseCoordinates", message);
  }

  coordinatesMouseReceive(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.socket.socket.on("mouseCoordinates", (data) => {
        resolve(data);
      });
    });
  }

  preload() {
    preloader.call(this);

    assetsLoader.call(this);
  }

  create() {
    this.playerName = this.socket.getPlayerDataFromSelectPlayer().player;

    getMaps.call(this);
    getPlayer1.call(this);
    getPlayer2.call(this);
    getOrb.call(this);
    getAnims.call(this);
    getPaths.call(this);
    getPhysics.call(this);
    getCameras.call(this);
    getGraphics.call(this);
    getMusic.call(this);
    const onEvent = () => this.music_loop.play();
    this.time.addEvent({
      delay: 2513.0839002267575,
      callback: onEvent,
      callbackScope: this,
    });
  }

  update() {
    updateFollowers.call(this);
    if (this.playerName === "player1") {
      updatePlayer1.call(this);
    } else {
      updatePlayer2.call(this);
    }
  }

  getTheGoldenOrb(_player, _orb) {
    _orb.disableBody(true, true);
    this.events.emit("addScorePlayer1");
  }

  killThePlayer(_player, _target) {
    const currentTile = this.map.getTileAt(
      this.map.worldToTileX(this.player.x),
      this.map.worldToTileX(this.player.y),
      true,
      this.aboveLayer
    );

    if (!currentTile.properties.protected) {
      this.coordinatesMouseReceive().then((coordinates) => {
        if (coordinates) {
          if (coordinates.isDown) {
            this.events.emit("addScorePlayer2");
          }
        }
      });
    }
  }
}
