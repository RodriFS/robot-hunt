export function getMaps() {
  this.map = this.make.tilemap({ key: 'map' });
  const castleTileset = this.map.addTilesetImage(
    'factory_tileset',
    'castleTiles'
  );

  this.belowLayer = this.map.createStaticLayer(
    'Below Layer',
    castleTileset,
    0,
    0
  );
  this.worldLayer = this.map.createStaticLayer('World', castleTileset, 0, 0);
  this.aboveLayer = this.map.createStaticLayer(
    'Above Layer',
    castleTileset,
    0,
    0
  );
  this.aboveLayer.setDepth(10);

  this.worldLayer.setCollisionByProperty({ collides: true });
}
