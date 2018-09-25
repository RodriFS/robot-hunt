export function preloader() {

  const progressBar = this.add.graphics();
  const progressBox = this.add.graphics();

  const width = this.cameras.main.width;
  const height = this.cameras.main.height;
  const loadingText = this.make.text({
    x: width / 2,
    y: 180,
    text: 'Loading...',
    style: {
        font: '20px monospace',
        fill: '#ffffff'
    }
  });

  loadingText.setOrigin(0.5, 0.5);

  progressBox.fillStyle(0x222222, 0.8);
  progressBox.fillRect(width / 2 - 200, 200, 400, 50);
  this.load.on('progress', function (value) {
    progressBar.clear();
    progressBar.fillStyle(0xffffff, 1);
    progressBar.fillRect(width / 2 - 190, 210, 380, 30);
  });

  this.load.on('complete', function () {
    progressBar.destroy();
    progressBox.destroy();
    loadingText.destroy();
  });
}
