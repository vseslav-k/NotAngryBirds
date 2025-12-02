

export default class Block extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, type, degrees) {
        super(scene, x, y, type, 0);
        scene.add.existing(this);
        scene.physics.add.existing(this, false);

        setAngle(degrees);

        if(type.includes("circle")){
          this.body.setCircle(8);
        } else if(type.includes("square")){
          this.body.setSize(16, 16).setOffset(0, 0); 
        } else if(type.includes("plankLong")){
          this.body.setSize(48, 12).setOffset(0, 0); 
        } else if(type.includes("plankShort")){
          this.body.setSize(80, 12).setOffset(0, 0); 
        }else{
          console.warn(`Unknown block type: ${type}`);
        }
        scene.physics.add.collider(this, scene.ground);
        for(obj of scene.objects["tiles"]){scene.physics.add.collider(this, obj);}
        

    }
}