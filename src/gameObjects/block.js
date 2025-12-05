
import { blockData } from '../rules/gameInfo.js';
import Item from "./item.js";
export default class Block extends Item {
    constructor(scene, obj, type) {
        super(scene, obj, type);
        this.setScale(obj.width / 4, obj.height /4);
        scene.objects["blocks"].add(this);
        this.tint = 0xffffff;
    }


    readItemData(type){
        if(!(type in blockData)){
            console.warn(`Block type '${type}' not found in block data.`);
            return ;
        }

        this.hp = blockData[type]['hp'];
        this.body.mass = blockData[type]['mass'] * Math.sqrt(this.scaleX*this.scaleY);
        this.bounce =blockData[type]['bounce'];
        this.setBounce(this.bounce);
        this.drag = {x: blockData[type]['dragX'], y: blockData[type]['dragY']};
        this.setDrag(this.drag.x,this.drag.y); 

        
    
    }


    makeCollider(scene, obj, type){

            //we are making a circular type block so we need to set the body to be a circle
            if(type[0] == "c") this.body.setCircle(8);
            //else make rectangular body
            else{
                obj.rotation %= 180;
                if(obj.rotation != 0 && obj.rotation != 90) console.warn("Block angles other than 0 and 90 WILL cause unexpected behavior.");

                this.setAngle(obj.rotation);
                if(obj.rotation == 90) {
                    [this.body.height, this.body.width] = [this.body.width, this.body.height];
                    this.body.offset.x =  (this.width - this.body.width/(this.scaleX)) / 2;
                    this.body.offset.y =  (this.height - this.body.height/(this.scaleY)) / 2;
                }
            }
    }
    

    onHit(other){
        //console.log(this.texture.key + " collided with " + (other instanceof  Block? other.texture.key :"ground"));

        this.isColliding = true;
        
        const thisForce = this.getForce();

        if(thisForce < 1){this.isColliding = false; return ;}

        this.takeDamage(thisForce * (other.damage ? other.damage : 1));

        if(other instanceof  Block) other.takeDamage(thisForce * this.damage);


        this.isColliding = false;
    
    }






    takeDamage(damage){
        super.takeDamage(damage);
        this.tint -= damage * 0x110000;
        //if(this.hp <= 0) this.destroy();

    }

    preUpdate(time, delta){
       super.preUpdate(time, delta);
       this.setTint(this.tint);

    }
}