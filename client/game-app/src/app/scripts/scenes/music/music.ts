export function getMusic () {
  this.music_intro = this.sound.add('music_intro');
  this.music_loop = this.sound.add('music_loop', {loop: true});
  this.music_intro.play();
}
