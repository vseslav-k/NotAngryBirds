
import { blockData } from '../rules/gameInfo.js';
export default class Block extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, obj, type) {
        super(scene, obj.x, obj.y, type, 0);
        scene.add.existing(this);
        this.setScale(obj.width / 4, obj.height /4);
        scene.physics.add.existing(this, false);
        
        this.makeCollider(scene, type, obj.rotation);
        this.readBlockData(type);
        this.body.damping = true;
        this.damage = 1;
        this.tint = 0xffffff;

    }


    readBlockData(type){
        if(!(type in blockData)){
            console.warn(`Block type '${type}' not found in block data.`);
            return {};
        }

        this.hp = blockData[type]['hp'];
        this.body.mass = blockData[type]['mass'] * Math.sqrt(this.scaleX*this.scaleY);
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
                this.body.offset.x =  (this.width - this.body.width/(this.scaleX)) / 2;
                this.body.offset.y =  (this.height - this.body.height/(this.scaleY)) / 2;
            }
        }

    
        scene.physics.add.collider(this, scene.ground);
        for (let obj of scene.objects["blocks"]) {
            scene.physics.add.collider(this, obj, (self, other) => {
                self.onHit(other);
                other.onHit(self);
            });
}

    }

    onHit(other){
        
        const otherForce = other.getForce();
        console.log(otherForce);
        if(otherForce < 3) return;
        this.takeDamage(otherForce * this.damage);

        const thisForce = this.getForce();
        if(thisForce < 3) return;
        other.takeDamage(thisForce * this.damage);
    }



    stopBlockJitter(){
        if(Math.abs(this.body.velocity.y) < 1){
          this.body.setBounce(0);
        }else{
            this.body.setBounce(blockData[this.texture.key]['bounce']);
        }
    }

    applyGroundDrag(delta){
        if(this.body.blocked.down){
            this.body.setVelocityX(Math.max(this.body.velocity.x - delta * blockData[this.texture.key]["dragX"], 0));
        }
    }

    getForce(){
        if(this.body == null) return 0;
        return (this.body.mass * this.body.velocity.length()*this.body.velocity.length())/5000;
    }

    takeDamage(damage){
        this.hp -= damage;
        this.tint -= damage * 0xaaaaaa;
        if(this.hp <= 0) this.destroy();

    }

    preUpdate(time, delta){
       super.preUpdate(time, delta);
       this.applyGroundDrag(delta);

       console.log(this.getForce());

       //this.stopBlockJitter();

       this.setTint(this.tint);

    }
}