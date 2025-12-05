import Item from "./item.js";


//properties defined in same file because there are only 2 types
const catProperties = {
    "catKing": {
        "hp": 3,
        "mass": 2,
        "score": 500,
        "scale": 1.5
    },
    "cat": {
        "hp": 2,
        "mass": 1,
        "score": 250,
        "scale": 1
    }
}

export default class Cat extends Item {
        constructor(scene, obj, type, index) {
                super(scene, obj, type);
                scene.objects["cats"].add(this);
                this.setScale(catProperties[type]['scale']/7);
            }
        
            makeCollider(scene, obj, type){

            }
        
            readItemData(type){


            }
        
            onHit(other){

                this.isColliding = true;



                this.isColliding = false;
            
            }

}