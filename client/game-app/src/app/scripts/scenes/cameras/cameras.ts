export function getCameras() {
  this.camera = this.cameras.main;
  if (this.playerName === 'player1') {
    this.camera.startFollow(this.player);
  } else {
    this.camera.scrollX = 800;
    this.camera.scrollY = 800;
  }
  this.camera.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
}
