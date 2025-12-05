
import Item from "./item.js";
import { birdData } from '../rules/gameInfo.js';
import Block from "./block.js";
import Cat from "./cat.js";



function drop(bird){
    let velX = bird.body.velocity.x;
    let velY = bird.body.velocity.y;

    bird.body.setVelocity(velX/4, velY + 0.75*velX);
}

function speed(bird){
    let velX = bird.body.velocity.x;
    let velY = bird.body.velocity.y;

    bird.body.setVelocity(velX*2, velY/2);
}

function clip(bird){
    bird.body.checkCollision.none = true;
    bird.scene.time.delayedCall(100, () => bird.body.checkCollision.none = false);
}

function boomerang(bird){
    let velX = bird.body.velocity.x;
    let velY = bird.body.velocity.y;

    bird.body.setVelocity(-velX*1.1, velY/2);
}

function triple(bird){
    let clone1 = new Bird(bird.scene, bird.obj, bird.type, -1);
    let clone2 = new Bird(bird.scene, bird.obj, bird.type, -1);

    clone1.setPosition(bird.x, bird.y);
    clone2.setPosition(bird.x, bird.y);

    clone1.body.setVelocity(bird.body.velocity.x, bird.body.velocity.y+200);
    clone2.body.setVelocity(bird.body.velocity.x, bird.body.velocity.y-200);

    bird.scene.time.delayedCall(2000, () => {clone1.destroy()})
    bird.scene.time.delayedCall(2000, () => {clone2.destroy()});
}


const abilities = {
    "drop": drop,
    "speed": speed,
    "clip": clip,
    "boomerang": boomerang,
    "triple": triple
}


export default class Bird extends Item {
    
    constructor(scene, obj, type, index) {
        super(scene, obj, type+"Bird");
        this.obj = obj;
        this.type = type;
        scene.objects["birds"].add(this);
        this.index = index;

        this.slingshot = null;
        this.scene.time.delayedCall(1, () => {this.slingshot = scene.slingshot; });
        this.abilityUsed = false;
        scene.input.keyboard.on('keydown-SPACE', () => {
            if(this.ability && this.slingshot.lastLaunched == this && !this.abilityUsed){
                abilities[this.ability](this);
                this.abilityUsed = true;
                this.scene.sound.play('birdAbility');
            }
        }); 
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
        this.ability = birdData[type]['ability'];
    }

    onHit(other){

        
        const thisForce = this.getForce();

        if(thisForce < 1){return ;}


        if(other instanceof  Block) other.takeDamage(thisForce * this.damage);
        if(other instanceof  Cat) other.takeDamage(thisForce * this.damage);

    
    }
   
}