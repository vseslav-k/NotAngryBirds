import Block from "../gameObjects/block.js";
import Slingshot from "../gameObjects/slingshot.js";
export default class Level extends Phaser.Scene {
    constructor(levelName, mapName, tilesetName) {
        super(levelName);
        this.mapName = mapName;
        this.tilesetName = tilesetName;
    }

    create() {
        this.map = this.make.tilemap({ key: this.mapName });
        this.tileset = this.map.addTilesetImage(this.tilesetName, this.tilesetName);
        
        this.ground = this.map.createLayer('ground', this.tileset, 0, 0);
        this.ground.setCollisionByExclusion([-1]);

        this.objects = {};
        this.objects["birds"] = [];
        this.objects["cats"] = [];
        this.objects["blocks"] = [];
        this.objects["slingshot"] = [];

        this.instantiateGameObjectsFromLayer(this.map);
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
                break;
            case "catKing":
                break;
            case "bird":
                break;
            case "slingshot":
                this.objects["slingshot"].push(new Slingshot(this, obj.x, obj.y));
                break;
            case undefined:
                console.warn(`Game object at (${obj.x}, ${obj.y}) is missing a 'type' property.`);
                break;
            case "block":
                this.objects["blocks"].push(new Block(this, obj, properties['subtype']));
                break;

         }
     }

     this.blockGroup = this.physics.add.group(this.objects["blocks"]);
     this.physics.add.collider(this.blockGroup, this.blockGroup, (self, other) => {
        self.onHit(other);
     });
     this.physics.add.collider(this.blockGroup, this.ground, (block, ground) => {
        block.onHit(ground);
    });

   }
}