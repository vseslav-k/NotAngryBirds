
import Item from "./item.js";
import { birdData } from '../rules/gameInfo.js';
import Block from "./block.js";
export default class Bird extends Item {
    
    constructor(scene, obj, type, index) {
        super(scene, obj, type+"Bird");
        scene.objects["birds"].add(this);
        this.index = index;
    }

    makeCollider(scene, obj, type){
        this.body.setCircle(60);
        this.body.setOffset((this.width + 120)/2, (this.height - 120)/2);
    }

    readItemData(type){
        type = type.slice(0, -4);
        if(!(type in birdData)){
            console.warn(`Bird type '${type}' not found in bird data.`);
            return ;
        }

        this.drag = {x: birdData[type]['drag'], y: birdData[type]['drag']};

        this.damage = birdData[type]['damage'];
        this.body.mass = birdData[type]['mass'] * Math.sqrt(this.scaleX*this.scaleY);
        this.bounce = birdData[type]['bounce'];
        this.setBounce(this.bounce);
        this.setScale(-birdData[type]['scale']/9, birdData[type]['scale']/9);
    }

    onHit(other){

        this.isColliding = true;
        
        const thisForce = this.getForce();

        if(thisForce < 1){this.isColliding = false; return ;}

        this.takeDamage(thisForce * (other.damage ? other.damage : 1));

        if(other instanceof  Block) other.takeDamage(thisForce * this.damage);


        this.isColliding = false;
    
    }
   
}