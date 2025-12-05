export const screenWidth = 1000;
export const screenHeight = 650;
export const gravityY = 1000;


export const blockData = {};
export function setBlockData(data){
    for(let key in data) blockData[key] = data[key];
}



export const birdData = {};
export function setBirdData(data){
    for(let key in data) birdData[key] = data[key];
}