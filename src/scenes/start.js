// start.js
import { screenWidth, screenHeight } from '../rules/gameInfo.js';
export default class Start extends Phaser.Scene {
    constructor() { super('Start'); }

    preload() {
        this.load.tilemapTiledJSON('level1', 'assets/levels/level1.tmj');
        this.load.image('world_tileset', '../assets/sprites/world_tileset.png');

        this.load.image('blackBird', '../assets/sprites/characters/black.png');
        this.load.image('redBird', '../assets/sprites/characters/red.png');
        this.load.image('yellowBird', '../assets/sprites/characters/yellow.png');
        this.load.image('brownBird', '../assets/sprites/characters/brown.png');
        this.load.image('cyanBird', '../assets/sprites/characters/cyan.png');
        this.load.image('blueBird', '../assets/sprites/characters/blue.png');
        this.load.image('purpleBird', '../assets/sprites/characters/purple.png');
        this.load.image('greenBird', '../assets/sprites/characters/green.png');
        this.load.image('orangeBird', '../assets/sprites/characters/orange.png');

        this.load.image('cat', '../assets/sprites/characters/cat.png');
        this.load.image('catking', '../assets/sprites/characters/catKing.png');

        this.load.image('circleGlass', '../assets/sprites/blocks/circleGlass.png');
        this.load.image('plankLongGlass', '../assets/sprites/blocks/plankLongGlass.png');
        this.load.image('plankShortGlass', '../assets/sprites/blocks/plankShortGlass.png');
        this.load.image('squareGlass', '../assets/sprites/blocks/squareGlass.png');

        this.load.image('circleWood', '../assets/sprites/blocks/circleWood.png');
        this.load.image('plankLongWood', '../assets/sprites/blocks/plankLongWood.png');
        this.load.image('plankShortWood', '../assets/sprites/blocks/plankShortWood.png');
        this.load.image('squareWood', '../assets/sprites/blocks/squareWood.png');
        
        this.load.image('circleRock', '../assets/sprites/blocks/circleRock.png');
        this.load.image('plankLongRock', '../assets/sprites/blocks/plankLongRock.png');
        this.load.image('plankShortRock', '../assets/sprites/blocks/plankShortRock.png');
        this.load.image('squareRock', '../assets/sprites/blocks/squareRock.png');
       
    }

    create() {
        this.add.rectangle(0, 0, this.scale.width, this.scale.height, 0x06767).setOrigin(0);
        this.add.text(screenWidth/2, screenHeight/2-220, 'Select level',
        { fontSize: 24, color: '#fff' }).setOrigin(0.5);

        this.add.text(screenWidth/2, screenHeight/2-140, '[1] Level 1 (Vee)\n[2] Level 2 (Abby)',
        { fontSize: 18, color: 'rgba(255, 255, 255, 1)', align: 'left' }).setOrigin(0.5);  

        this.add.text(screenWidth/2, screenHeight/2+100, '           Controls   \nHolda LMB and drag mouse to aim\nRelease LMB to shoot\nSpacebar to activate ability\n',
        { fontSize: 16, color: '#ffffffff', align: 'left' }).setOrigin(0.5);

    }
}