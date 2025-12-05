export default class Item extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, obj, type) {
        super(scene, obj.x, obj.y, type, 0);
        scene.add.existing(this);
        scene.physics.add.existing(this, false);
        this.scene = scene;

        this.body.damping = true;
        this.drag = {x:0, y: 0};
        this.bounce = 0;
        this.damage = 1;
        
        this.readItemData(type);
        this.makeCollider(scene, obj, type);



        this.preCollideVelocity = {x: 0, y:0};

        this.setImmovable(false);
        this.setPushable(true);



        this.blockDelayTime = 70;
        this.blockedLeftDelayed = false;
        this.blockedRightDelayed = false;

        this.scene.time.delayedCall(1, () => {
            this.body.setCollideWorldBounds(true);
        });


    }


    readItemData(type){}
    makeCollider(scene, obj, type){}
    onHit(other){}



    stopJitter(){
        if(Math.abs(this.body.velocity.y) < 1){
          this.body.setBounce(0);
        }else{
            this.body.setBounce(this.bounce);
        }
    }

    stopFlying(){

        if(this.body.touching.left){
            this.blockedLeftDelayed = true;
            this.scene.time.delayedCall(this.blockDelayTime, () => {
                if(!this.body) return;
                if(this.body.touching.left) return;
                this.blockedLeftDelayed = false;
            });
        }

        if(this.body.touching.right){
            this.blockedRightDelayed = true;
            this.scene.time.delayedCall(this.blockDelayTime, () => {
                if(!this.body) return;
                if(this.body.touching.right) return;
                this.blockedRightDelayed = false;
            });
        }


        if((this.body.touching.right && this.body.touching.left) || (this.blockedLeftDelayed && this.blockedRightDelayed)){
            console.log(this.texture.key + " stopping horizontal movement.");
            this.body.setVelocityX(this.body.velocity.x * 0.35);
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

    }

    preUpdate(time, delta){
       super.preUpdate(time, delta);
       this.applyGroundDrag(delta);

       this.preCollideVelocity.x = this.body.velocity.x;
       this.preCollideVelocity.y = this.body.velocity.y;

       this.stopJitter();
       this.stopFlying();

    }
}