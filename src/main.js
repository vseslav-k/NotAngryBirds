

//import Phaser from '../phaser.js'; // DONT UNCOMMENT THIS IS WHY IT WAS BLACK SCREEN FOR SO LONG
import Start from './scenes/start.js';
import { screenWidth, screenHeight, gravityY } from './rules/gameInfo.js';
const config = {
    type: Phaser.AUTO,
    roundPixels: false,
    width: screenWidth,
    height: screenHeight,
    backgroundColor: '#8bb7d9ff', 
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: gravityY },
            debug: false
        }
    },
    pixelArt: true,
    scene: [Start] 
};

new Phaser.Game(config);
