import Player from './player.js';
import Obstacle from './obstacle.js';

/***************************VARIABLES***************************/

const canvas = document.querySelector('#canvas');
const ctx = canvas.getContext('2d');
const card = document.querySelector('#card');
const cardScore = document.querySelector('#card-score');
const retry = document.querySelector('#retry');

//SFX
let jumpSFX = new Audio("https://ia903405.us.archive.org/21/items/jump_20210424/jump.mp3");
let gameOverSFX = new Audio("audio\\Game Over Sound Effect.mp3");
let BGM = new Audio("audio\\prod test.mp3");
jumpSFX.volume = 0.3;
gameOverSFX.volume = 0.1;
BGM.volume = 0.1;

//Variables pour le jeu
let player = null;          
let arrayObstacles = [];    //Tableau qui va contenir les obstacles
let obstacleSpeed = 5;      //Vitesse d'apparition des obstacles
let presetTime = 2000;      //Va servir pour la fonction setInterval
let score = 0;              //Le score du joueur plus il va loin plus son score il augmente
let scoreIncrement = 0;     //Palier de score qui va faire augmenter la difficulté du jeu

/***************************FONCTIONS***************************/

//Initialise la partie
function startGame(){
    BGM.load();
    BGM.play();
    player = new Player(25,canvas.height-50,50,'red');  //Initialisation de la position du joueur
    arrayObstacles = [];
    obstacleSpeed = 5;
    presetTime = 2000; 
    score = 0;
    scoreIncrement = 0;
}

//Prend un nombre entier au hasard entre le min et max inclus
function randomNumber(min,max){
    return Math.floor(Math.random() * (max - min)) + min;
}

//Va permettre de générer des obstacles de façon plus aléatoire en jouant sur le presettime défini
function randomInterval(timeInterval) {
    let returnTime = timeInterval;
    if(Math.random() < 0.5){
        returnTime += randomNumber(presetTime / 4, presetTime / 2);
    }else{
        returnTime -= randomNumber(presetTime / 7, presetTime / 5);
    }
    return returnTime;
}

//Fonction qui va augmenter la difficulté du jeu en augmentant la vitesse et en réduisant l'intervalle entre les obstacles au fur et à mesure que le joueur va loin
function shouldIncrease(){
    if (scoreIncrement + 500 === score){
        scoreIncrement = score;
        obstacleSpeed++;

        if (presetTime >=2000 || presetTime > 800){
            presetTime -= 100;
        }
        
        arrayObstacles.forEach(obstacle =>{
            obstacle.slideSpeed = obstacleSpeed;
        })
    }
}

//Fonction qui va faire apparaître un obstacle dans un délai aléatoire
function generateObstacles(){
    let timeDelay = randomInterval(presetTime);
    arrayObstacles.push(new Obstacle(225,70,obstacleSpeed));
    
    setTimeout(generateObstacles, timeDelay);
}

//Fonction qui gère les collisions
function collision(player,block){
    let s1 = Object.assign(Object.create(Object.getPrototypeOf(player)), player);
    let s2 = Object.assign(Object.create(Object.getPrototypeOf(block)), block);

    s2.x = s2.x+5;

    if(
        s1.x + s1.size >= s2.x &&
        s1.x <= s2.x + s2.width &&
        s1.y + s1.size >= s2.y &&
        s1.y <= s2.y + s2.height
    )
    return true;
}

//Variable qui va animer le canvas
let animationId = null;

//Fonction qui anime tout le canvas
function animate(){
    animationId = requestAnimationFrame(animate);
    ctx.clearRect(0,0,canvas.width, canvas.height);
    
    player.draw();
    shouldIncrease();
    //Fais augmenter le score du joueur tant qu'il reste là
    setTimeout(score++, 1000);
    arrayObstacles.forEach((obstacle, index) =>{
        obstacle.slide();

        //Si le joueur touche un obstacle
        if(collision(player, obstacle)){
            BGM.pause();
            gameOverSFX.play();
            cardScore.textContent = score;
            card.style.display = "block";
            cancelAnimationFrame(animationId);
        }
        //Si l'obstacle quitte l'écran il est supprimé de arrayObstacle
        if((obstacle.x + obstacle.width) <= 0){
            setTimeout(() => {
                arrayObstacles.splice(index, 1);
            })
        }
    })
}

startGame();
animate();
setTimeout(() => {
    generateObstacles();
}, randomInterval(presetTime));

/*********************** ECOUTEURS D'EVENEMENTS ***********************/

//A chaque fois que le joueur appuie sur la touche espace le joueur saute soit vers le haut soit vers le bas
addEventListener("keydown", e => {
    if (e.code === "Space"){
        jumpSFX.play();
        player.dy *= -1;
    }
})

//Bouton qui permet de recommencer une partie sans rafraichir la page
retry.addEventListener("click", function(){
    card.style.display = "none";
    retry.blur();
    startGame();
    requestAnimationFrame(animate);
})