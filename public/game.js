//game.js

let currentScene; // Global reference to the current scene
let players = {};

const config = {
    type: Phaser.AUTO,
    parent: 'gameCanvas',
    scale: {
        mode: Phaser.Scale.PORTRAIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 900,
        height: 1200
    },
    scene: {
        preload: preload,
        create: create,
        init: init
    },
    pixelArt: true,
    physics: {
        default: 'arcade',
        arcade: {
          gravity: { y: 0 },
          debug: false
        }
      }
};

const game = new Phaser.Game(config);

function init() {
    this.gameWidth = this.sys.game.config.width;
    this.gameHeight = this.sys.game.config.height;
}

function preload() {
    //bg
    this.load.image('background', './assets/image/bg.png');
    this.load.image('fighter', './assets/image/fighter.png');
    //Fighters
    for (let i = 1; i <= 110; i++) {
        this.load.spritesheet(`buddy_${i}`, `./assets/bf/file_${i}.png`, {
            frameWidth: 64,
            frameHeight: 64,
            startFrame: 0,
            endFrame: 60
        });
    }
}

function create() {
    const type = 'baddy';
    // this.dude = new Player(this, Phaser.Math.Between(0, this.gameWidth), Phaser.Math.Between(0, this.gameHeight), type);
    console.log("CREATE THE GAME!")
    currentScene = this; // Set the global reference to the current scene
    console.log(currentScene); // Check what `this` refers to


    currentScene.background = currentScene.add.sprite(0, 0, "background").setOrigin(0, 0);
    currentScene.background.setDisplaySize(currentScene.gameWidth, currentScene.gameHeight);
    currentScene.background.setDepth(-1);

    // let randX = Phaser.Math.Between(0, currentScene.gameWidth);
    // let randY = Phaser.Math.Between(0, currentScene.gameHeight);
    // currentScene.fighter = currentScene.add.sprite(randX, randY, "fighter").setOrigin(0, 0);
}



function test(playerName) {
    console.log(`TEST!!!!!!!!!!!!`);
    const player = spawnFighter(playerName);
    players[playerName] = player;
    console.log(players)
}
