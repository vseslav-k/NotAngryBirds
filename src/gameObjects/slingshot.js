import Block from "./block.js";
export default class Slingshot extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'slingshot');

        scene.add.existing(this);
        scene.objects["slingshot"].add(this);
        this.scene = scene;
        this.setScale(0.11);



        this.shotVector = new Phaser.Math.Vector2(0, 0);
        this.maxLength = 50;
        this.graphics = scene.add.graphics();
        this.offsetY = -9;
        this.projectile = null;
        this.shootForce = 20;
        this.cursorPos = {x:0, y:0};

        this.scene.input.on('pointerup', (pointer) => {
            if (pointer.button === 0 && this.shotVector.length() > 10) {
                this.shoot();
            }
        });

        

        this.birds = [];
        this.currBirdIdx = 0;

        

    }

    screenToWorld(pointerX, pointerY) {
        return this.scene.cameras.main.getWorldPoint(pointerX, pointerY);
    }

    addBird(bird){
        if(this.projectile == null && bird.index == 0){
            this.setProjectile(bird);
        }
        this.birds[bird.index] = bird;
    }

    setProjectile(projectile){
        
        this.projectile = projectile;
        if(projectile == null || projectile == undefined) return;
        this.projectile.body.allowGravity = false;
        this.projectile.body.setVelocity(0,0);this.projectile
        this.projectile.setPosition(this.x, this.y + this.offsetY);

    }

    shoot(){
        if(this.projectile == null) return;
        
        this.projectile.body.checkCollision.none = true;
        let arg =  this.projectile;
        this.scene.time.delayedCall(100, () => arg.body.checkCollision.none = false);

        this.projectile.body.setVelocity(this.shotVector.x * this.shootForce, this.shotVector.y * this.shootForce);
        this.projectile.body.allowGravity = true;
        this.currBirdIdx++;
        this.setProjectile(this.birds[this.currBirdIdx]);
        console.log("Shooting with vector: ", this.shotVector);
    }

    aimSlingshot(){


        if(!(this.scene.input.activePointer.leftButtonDown() &&  
        this.sqrDist(this.cursorPos.x, this.x, this.cursorPos.y, this.y) < this.maxLength * this.maxLength*4)){


             if(this.projectile && this.sqrDist(this.projectile.x, this.x, this.projectile.y, this.y) > 100)this.projectile.setPosition(this.x, this.y + this.offsetY);
             return;
        }
    
        

        this.shotVector.x = this.x - this.cursorPos.x;
        this.shotVector.y = this.y+this.offsetY  - this.cursorPos.y + this.offsetY;
        if(this.shotVector.length() > this.maxLength){
            this.shotVector = this.shotVector.normalize().scale(this.maxLength);
        }

        if(this.projectile)this.projectile.setPosition(this.x - this.shotVector.x, this.y + this.offsetY - this.shotVector.y);

        this.drawBand();
    }
    drawBand(){
        this.graphics.lineStyle(4, 0x381506, 1);
        let lineGeometry = new Phaser.Geom.Line(this.x, this.y+ this.offsetY, this.x - this.shotVector.x, this.y+ this.offsetY - this.shotVector.y);
        this.graphics.strokeLineShape(lineGeometry);
    }

    sqrDist(x1, x2, y1, y2){
        return (x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1);
    }


    preUpdate(time, delta) {
        super.preUpdate(time, delta);
        this.cursorPos = this.screenToWorld(this.scene.input.activePointer.x, this.scene.input.activePointer.y);
        this.graphics.clear();
        this.aimSlingshot();
        

    }
}