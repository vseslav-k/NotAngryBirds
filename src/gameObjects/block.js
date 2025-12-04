
import { blockData } from '../rules/gameInfo.js';
export default class Block extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, obj, type) {
        super(scene, obj.x, obj.y, type, 0);
        scene.add.existing(this);
        this.setScale(obj.width / 4, obj.height /4);
        scene.physics.add.existing(this, false);
        
        this.makeCollider(scene, type, obj.rotation);
        this.readBlockData(type);
        
        

    }


    readBlockData(type){
        if(!(type in blockData)){
            console.warn(`Block type '${type}' not found in block data.`);
            return {};
        }

        this.hp = blockData[type]['hp'];
        this.body.mass = blockData[type]['mass'];
        this.setBounce(blockData[type]['bounce']);
        this.setDrag(blockData[type]['dragX'], blockData[type]['dragY']);
    
    }


    makeCollider(scene, type, degrees){

        //we are making a circular type block so we need to set the body to be a circle
        if(type[0] == "c") this.body.setCircle(8);
        else{
            degrees %= 180;
            if(degrees != 0 && degrees != 90) console.warn("Block angles other than 0 and 90 WILL cause unexpected behavior.");

            this.setAngle(degrees);
            if(degrees == 90) {
                [this.body.height, this.body.width] = [this.body.width, this.body.height];
                this.body.offset.x = (-1 * this.body.width + this.width) / 2;
                this.body.offset.y = (-1 * this.body.height + this.height) / 2;
            }
        }

    
        scene.physics.add.collider(this, scene.ground);
        for(let obj of scene.objects["blocks"]) scene.physics.add.collider(this, obj);

    }

    stopBlockJitter(){
        if(Math.abs(this.body.velocity.y) < 1){
          this.body.setBounce(0);
        }else{
            this.body.setBounce(blockData[this.texture.key]['bounce']);
        }
    }

    preUpdate(time, delta){
       super.preUpdate(time, delta);

       this.stopBlockJitter();

    }
}