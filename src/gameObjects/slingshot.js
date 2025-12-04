import Block from "./block.js";
export default class Slingshot extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'slingshot');
        scene.add.existing(this);
        this.scene = scene;
        this.setScale(0.11);
        scene.objects["slingshot"].add(this);

        this.shotVector = new Phaser.Math.Vector2(0, 0);
        this.maxLength = 50;
        this.graphics = scene.add.graphics();
        this.offsetY = -9;

        this.scene.input.on('pointerup', (pointer) => {
            if (pointer.button === 0 && this.shotVector.length() > 10) {
                this.shoot();
            }
        });

        this.projectile = null;
        this.shootForce = 10;

        

    }

    setProjectile(projectile){
        this.projectile = projectile;
        this.projectile.body.allowGravity = false;
        this.projectile.body.setVelocity(0,0);
        this.projectile.setPosition(this.x, this.y + this.offsetY);

    }

    shoot(){
        if(this.projectile == null) return;
        this.projectile.body.setVelocity(this.shotVector.x * this.shootForce, this.shotVector.y * this.shootForce);
        this.projectile.body.allowGravity = true;
        this.projectile = null;
        console.log("Shooting with vector: ", this.shotVector);
    }

    aimSlingshot(){

        this.shotVector.x = this.x - this.scene.input.activePointer.x;
        this.shotVector.y = this.y+this.offsetY  - this.scene.input.activePointer.y + this.offsetY;
        if(this.shotVector.length() > this.maxLength){
            this.shotVector = this.shotVector.normalize().scale(this.maxLength);
        }
    }
    drawBand(){
        this.graphics.lineStyle(4, 0x381506, 1);
        let lineGeometry = new Phaser.Geom.Line(this.x, this.y+ this.offsetY, this.x - this.shotVector.x, this.y+ this.offsetY - this.shotVector.y);
        this.graphics.strokeLineShape(lineGeometry);
    }


    preUpdate(time, delta) {
        super.preUpdate(time, delta);
        
        this.graphics.clear();
        if(this.scene.input.activePointer.leftButtonDown()){
            this.aimSlingshot();
            this.drawBand();
        }

    }
}