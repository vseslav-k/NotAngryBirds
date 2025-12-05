import Block from "../gameObjects/block.js";
import Bird from "../gameObjects/bird.js";
import Slingshot from "../gameObjects/slingshot.js";
import Cat from "../gameObjects/cat.js";
import { screenHeight, screenWidth } from "../rules/gameInfo.js";

export default class Level extends Phaser.Scene {
    constructor(levelName, mapName, tilesetName) {
        super(levelName);
        this.mapName = mapName;
        this.tilesetName = tilesetName;
        this.cameraCenter = {x:0, y:0};

        this.won = false;
    
    }

    create() {
        this.won = false;
        this.keys = this.input.keyboard.addKeys({
            up: 'W',
            down: 'S',
            left: 'A',
            right: 'D',
            space: 'SPACE'
        });


        this.map = this.make.tilemap({ key: this.mapName });
        this.tileset = this.map.addTilesetImage(this.tilesetName, this.tilesetName);
        
        this.ground = this.map.createLayer('ground', this.tileset, 0, 0);
        this.ground.setCollisionByExclusion([-1]);

        this.objects = {};
        this.objects["birds"] = this.physics.add.group();
        this.objects["cats"] = this.physics.add.group();
        this.objects["blocks"] = this.physics.add.group();
        this.objects["slingshot"] = this.add.group();
        this.cameras.main.setBackgroundColor('#87CEEB');

        this.instantiateGameObjectsFromLayer(this.map);




        this.slingshot = this.objects["slingshot"].getChildren()[0];

        this.cameraCenter.x = this.slingshot.x+100;
        this.cameraCenter.y = this.slingshot.y;
        this.animateCamera();
        this.cameras.main.setZoom(1.25);

        

    }


    animateCamera(delta){

        if(this.won) return;

        if (this.keys.up.isDown && this.cameraCenter.y) this.cameraCenter.y -= delta/3;
        if (this.keys.down.isDown) this.cameraCenter.y += delta/3;
        if (this.keys.left.isDown) this.cameraCenter.x -= delta/3;
        if (this.keys.right.isDown) this.cameraCenter.x += delta/3;



        const worldW = this.physics.world.bounds.width;
        const worldH = this.physics.world.bounds.height;


        const cam = this.cameras.main;
        const halfW = cam.width  * 0.5 / cam.zoom;
        const halfH = cam.height * 0.5 / cam.zoom;


        this.cameraCenter.x = Phaser.Math.Clamp(this.cameraCenter.x, halfW, worldW - halfW);
        this.cameraCenter.y = Phaser.Math.Clamp(this.cameraCenter.y, halfH, worldH - halfH);




        this.cameras.main.centerOn(this.cameraCenter.x, this.cameraCenter.y );

    }

    update(time, delta){
        this.animateCamera(delta);
        if(this.objects["cats"].getChildren().length == 0 || this.slingshot.birds.length == this.slingshot.currBirdIdx) this.time.delayedCall(1400, () => {this.endGame();});
    }
    endGame() {
        this.won = true;
        const cam = this.cameras.main;

        // Create centered text
        const msg = this.add.text(
            cam.worldView.centerX, 
            cam.worldView.centerY,
            this.objects["cats"].getChildren().length == 0?"You Win!": "You Lose :(",
            {
                fontSize: '48px',
                color: '#ffffff',
                fontStyle: 'bold',
                stroke: '#000000',
                strokeThickness: 6
            }
        ).setOrigin(0.5);


        msg.setAlpha(0);
        this.tweens.add({
            targets: msg,
            alpha: 1,
            duration: 400
        });

        this.time.delayedCall(3500, () => {
            this.scene.start("Start");
        });
    }


    serializeObjectProperties(propertiesArray){
      if(!propertiesArray) return {};
      const properties = {};
      for(let prop of propertiesArray){
        properties[prop.name] = prop.value; 
      }
      return properties;
    }


    instantiateGameObjectsFromLayer(map){
       const objects = map.getObjectLayer("gameObjects").objects;

       for(let obj of objects){
        //Tiled object properties are stored in an array for some stupid reason so we need to convert them to an object first
        let properties = this.serializeObjectProperties(obj.properties);
     
            switch(properties['type']){
                case "cat":
                    new Cat(this, obj, properties['subtype']);
                    break;
                case "bird":
                    new Bird(this, obj, properties['subtype'], properties['index']);
                    break;
                case "slingshot":
                    new Slingshot(this, obj.x, obj.y);
                    break;
                case undefined:
                    console.warn(`Game object at (${obj.x}, ${obj.y}) is missing a 'type' property.`);
                    break;
                case "block":
                    new Block(this, obj, properties['subtype']);
                    break;

            }
        }

        this.objects["slingshot"].getChildren()[0].birds = new Array(this.objects["birds"].getChildren().length);

        for(let bird of this.objects["birds"].getChildren()){this.objects["slingshot"].getChildren()[0].addBird(bird);}
        this.setColliders();

   }


   setColliders(){

    this.physics.add.collider(this.objects["blocks"], this.ground, (block, ground) => {
        block.onHit(ground);
    });
    this.physics.add.collider(this.objects["birds"], this.ground, (bird, ground) => {
        bird.onHit(ground);
    });

    



    this.physics.add.collider(this.objects["blocks"], this.objects["blocks"], (self, other) => {
        self.onHit(other);
    });
    this.physics.add.overlap(this.objects["blocks"], this.objects["blocks"], (self, other) => {
        self.onHit(other);
    });
    



    this.physics.add.collider(this.objects["birds"], this.objects["blocks"], (bird, block) => {
        bird.onHit(block);
    });
    this.physics.add.overlap(this.objects["birds"], this.objects["blocks"], (bird, block) => {
        bird.onHit(block);
    });

    this.physics.add.collider(this.objects["cats"], this.objects["birds"], (cat, bird) => {
        bird.onHit(cat);
    });
    this.physics.add.collider(this.objects["cats"], this.objects["blocks"], (cat, block) => {
        cat.onHit(block);
    });
    this.physics.add.collider(this.objects["cats"], this.ground, (cat, ground) => {
        cat.onHit(ground);
    });
    
    

   }
}