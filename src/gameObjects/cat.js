import Item from "./item.js";


//properties defined in same file because there are only 2 types
const catProperties = {
    "catKing": {
        "hp": 10,
        "mass": 2,
        "score": 500,
        "scale": 1.5
    },
    "cat": {
        "hp": 1110,
        "mass": 1,
        "score": 250,
        "scale": 1
    }
}

export default class Cat extends Item {
    constructor(scene, obj, type) {
        super(scene, obj, type);
        this.setScale(obj.width / 20, obj.height /20);
        scene.objects["cats"].add(this);
        this.tint = 0xffffff;
    }

    readItemData(type){
        if(!(type in catProperties)){
            console.warn(`Cat type '${type}' not found in cat data.`);
            return ;
        }

        this.hp = catProperties[type]['hp'];
        this.body.mass = catProperties[type]['mass'] * Math.sqrt(this.scaleX*this.scaleY);
        this.score = catProperties[type]['score'];
    }

    makeCollider(scene, obj, type){
        this.body.setCircle(60);
        this.body.setOffset((this.width + 120)/2, (this.height - 120)/2);
    }
    onHit(other){
        this.isColliding = true;

        const force = this.getForce();

        if(force < 1) {this.isColliding = false; return ;}

        this.takeDamage(force);

        this.isColliding = false;
    }

}