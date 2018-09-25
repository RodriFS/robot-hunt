export function getGraphics() {
  this.marker = this.add.graphics();
  this.marker.lineStyle(3, 0xffffff, 1);
  this.marker.strokeRect(0, 0, this.map.tileWidth, this.map.tileHeight);
  this.marker.setDepth(30);
}
