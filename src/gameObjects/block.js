
import { blockData } from '../rules/gameInfo.js';
export default class Block extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, obj, type) {
        super(scene, obj.x, obj.y, type, 0);
        scene.add.existing(this);
        this.setScale(obj.width / 4, obj.height /4);
        scene.physics.add.existing(this, false);
        scene.objects["blocks"].add(this);
        
        this.scene = scene;
        this.makeCollider(scene, type, obj.rotation);
        this.readBlockData(type);
        this.body.damping = true;
        this.damage = 1;
        this.tint = 0xffffff;
        this.preCollideVelocity = {x: 0, y:0};
        this.isColliding = false;

        this.setImmovable(false);
        this.setPushable(true);









        this.blockDelayTime = 70;
        this.blockedLeftDelayed = false;
        this.blockedRightDelayed = false;

    }


    readBlockData(type){
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
    }
    

    onHit(other){
        //console.log(this.texture.key + " collided with " + (other instanceof  Block? other.texture.key :"ground"));

        this.isColliding = true;
        
        const thisForce = this.getForce();

        if(thisForce < 1) return;

        this.takeDamage(thisForce * (other.damage ? other.damage : 1));

        if(other instanceof  Block) other.takeDamage(thisForce * this.damage);


        this.isColliding = false;
    
    }



    stopBlockJitter(){
        if(Math.abs(this.body.velocity.y) < 1){
          this.body.setBounce(0);
        }else{
            this.body.setBounce(this.bounce);
        }
    }

    stopBlockShooting(){

        if(this.body.touching.left){
            this.blockedLeftDelayed = true;
            this.scene.time.delayedCall(this.blockDelayTime, () => {
                if(this.body.touching.left) return;
                this.blockedLeftDelayed = false;
            });
        }

        if(this.body.touching.right){
            this.blockedRightDelayed = true;
            this.scene.time.delayedCall(this.blockDelayTime, () => {
                if(this.body.touching.right) return;
                this.blockedRightDelayed = false;
            });
        }


        if((this.body.touching.right && this.body.touching.left) || (this.blockedLeftDelayed && this.blockedRightDelayed)){
            console.log(this.texture.key + " stopping horizontal movement.");
            this.body.setVelocityX(this.body.velocity.x * 0.65);
        }

        
    }

    applyGroundDrag(delta){
        if(this.body.blocked.down){
            this.body.setVelocityX(Math.max(this.body.velocity.x - delta * this.drag.x, 0));
        }
    }

    getForce(){
        if(this.body == null) return 0;

        let vel = Math.sqrt(this.preCollideVelocity.x**2 + this.preCollideVelocity.y**2);

        let force = (this.body.mass * vel*vel)/120000;

        if(force > 1)console.log(this.texture.key + " velocity length: " + vel + " mass: " + this.body.mass + "force: " + force);
        return force;
    }

    takeDamage(damage){
        console.log(this.texture.key + " took " + damage + " damage.");
        this.hp -= damage;
        this.tint -= damage * 0x110000;
        //if(this.hp <= 0) this.destroy();

    }

    preUpdate(time, delta){
       super.preUpdate(time, delta);
       this.applyGroundDrag(delta);

       if(!this.isColliding){
        this.preCollideVelocity.x = this.body.velocity.x;
        this.preCollideVelocity.y = this.body.velocity.y;
       }
    


       this.stopBlockJitter();
       this.stopBlockShooting();

       this.setTint(this.tint);

    }
}