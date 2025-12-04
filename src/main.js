

//import Phaser from '../phaser.js'; // DONT UNCOMMENT THIS IS WHY IT WAS BLACK SCREEN FOR SO LONG
import Start from './scenes/start.js';
import { screenWidth, screenHeight, gravityY } from './rules/gameInfo.js';
import Level1 from './scenes/level1.js';
const config = {
    type: Phaser.AUTO,
    roundPixels: false,
    width: screenWidth,
    height: screenHeight,
    backgroundColor: '#8bb7d9ff', 
    physics: {
        default: 'arcade',
        arcade: {
            fps: 150,
            gravity: { y: gravityY },
            debug: true
        }
    },
    pixelArt: true,
    scene: [Start, Level1] 
};

new Phaser.Game(config);
