export default class Level1 extends Phaser.Scene {
    constructor() {super('Level1');}

    create() {
        const map = this.make.tilemap({ key: 'level1' });
        const tileset = map.addTilesetImage('world_tileset', 'world_tileset');
    }
}