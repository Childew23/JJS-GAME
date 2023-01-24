const canvas = document.querySelector('#canvas');
const ctx = canvas.getContext('2d');

//Prend soit le min soit le max de façon aléatoire
function MinOrMax(min,max){
    let choice = Math.floor(Math.random() * (max - min)) + min;
    if (choice <= (min+max)/2){
        return min;
    }else{
        return max;
    }
}

//Classe qui gère les obstacles
export default class Obstacle{
    constructor(height, width, speed){
        this.x = canvas.width-width;                //Va faire apparaître les obstacles au bord droit du canvas
        this.y = MinOrMax(0, canvas.height-height); //Va faire apparaître les obstacles soit en haut soit en bas de façon aléatoire
        this.height = height;   
        this.width = width;
        this.color = "black";
        this.slideSpeed = speed;
    }

    draw(){
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    //Méthode qui va faire bouger l'obstacle de droite à gauche
    slide(){
        this.draw();
        this.x -= this.slideSpeed;
    }
}