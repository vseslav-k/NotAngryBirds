import Item from "./item.js";


//properties defined in same file because there are only 2 types
const catProperties = {
    "catKing": {
        "hp": 7,
        "mass": 2,
        "score": 500,
        "scale": 1.5
    },
    "cat": {
        "hp": 5,
        "mass": 0.2,
        "score": 250,
        "scale": 1
    }
}

export default class Cat extends Item {
        constructor(scene, obj, type, index) {
                super(scene, obj, type);
                this.setScale(catProperties[type]['scale']/7);
                scene.objects["cats"].add(this);

                /*console.log("CAT BODY START:", {
                    w: this.body.width,
                    h: this.body.height,
                    offsetX: this.body.offset.x,
                    offsetY: this.body.offset.y,
                    spriteW: this.width,
                    spriteH: this.height,
                    scaleX: this.scaleX,
                    scaleY: this.scaleY,
                    dragX: this.body.drag.x,
                    dragY: this.body.drag.y,
                    bounce: this.body.bounce

                });*/
                
            }
        
            makeCollider(scene, obj, type){
                this.body.setCircle(70);
                this.body.setOffset((this.width - 140)/2, (this.height - 140)/2+5);

            }
        
            readItemData(type){
                this.hp = catProperties[type]['hp'];
                this.body.mass = catProperties[type]['mass'];
                this.score = catProperties[type]['score'];
                this.setDrag(0.01);
                this.bounce = 0.2;
                this.setBounce(0.2);

            }
        
            onHit(other){


                let force = this.getForce();


                if(force < 1){ return};

                this.takeDamage(force* (other.damage?other.damage:1));


            

                
            }


            takeDamage(damage){
                super.takeDamage(damage);
                if(this.hp <= 0) this.destroy();
            }

}