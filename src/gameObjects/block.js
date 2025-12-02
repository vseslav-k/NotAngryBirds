
export default class Block extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, type, degrees) {
        super(scene, x, y, type, 0);
        scene.add.existing(this);
        scene.physics.add.existing(this, false);

        //this.setAngle(degrees);
        

        
        scene.physics.add.collider(this, scene.ground);

        for(let obj of scene.objects["blocks"]) scene.physics.add.collider(this, obj);
        

    }
}