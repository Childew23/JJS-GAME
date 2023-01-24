const canvas = document.querySelector('#canvas');
const ctx = canvas.getContext('2d');


//Classe qui gère le joueur
export default class Player{
    constructor(x, y, size, color){
        this.x=x;
        this.y=y;
        this.size=size;
        this.color=color;
        this.dy=15;
    }

    //Méthode qui sert à faire sauter le joueur et ne pas laisser le joueur dépassé les bords du canvas
    jump(){
        if(this.y >= 0 && this.y <= canvas.height - this.size - this.dy){
            this.y += this.dy;
            if (this.y < 0){
                this.y = 0;
            }
            else if(this.y + this.size + this.dy > canvas.height){
                this.y = canvas.height - this.size;
            }
    }
}

    //Méthode qui va dessiner le joueur et qui appelle la méthode jump()
    draw() {
        this.jump();
        ctx.fillStyle = this.color;
        ctx.strokeStyle = 'black';
        ctx.strokeRect(this.x, this.y, this.size, this.size);
        ctx.fillRect(this.x, this.y, this.size, this.size);
    }
}