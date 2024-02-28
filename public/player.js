function spawnFighter(name) {
    if (players[name]) {
        powerUpPlayer(players[name]); // Call powerUpPlayer if the player already exists
    } else {
        let player = {}; // Create a new player object

        let randX = Phaser.Math.Between(0, currentScene.gameWidth);
        let randY = Phaser.Math.Between(0, currentScene.gameHeight);
        player.spriteKey = pickRandomSprite();
        player.name = name;
        // Create a container to hold the player sprite and name tag
        player.container = currentScene.add.container(randX, randY);

        // Create the player sprite
        player.sprite = currentScene.physics.add.sprite(0, 0, player.spriteKey, 1);
        currentScene.physics.add.existing(player.sprite);

        let spriteScale = 0.8;
        player.sprite.setScale(spriteScale);
        player.container.add(player.sprite);
        player.width = player.sprite.width * player.sprite.scaleX;
        player.height = player.sprite.height * player.sprite.scaleY;
        player.velocity = { x: 0, y: 0 };
        player.speed = 1;

        // Create the name tag
        player.nameTag = currentScene.add.text(0, -player.sprite.height / 2, name, {
            fontSize: '12px',
            fill: '#ffffff', // white 
            stroke: '#000000',
            strokeThickness: 4,
            align: 'center'
        });
        player.nameTag.setOrigin(0.5, 1); // Set origin to the bottom center
        player.container.add(player.nameTag);

        player.sprite.setFrame(1);
        player.walkFrames = [1, 2, 1, 3]
        createAnimations(player);
        idle(player);
        currentScene.events.on('update', () => update(player), this);
        players[name] = player;
    }
    return player;
}
function powerUpPlayer(player) {
    console.log("POWER UP! ", player.name)
    player.sprite.setScale(player.sprite.scaleX * 1.05, player.sprite.scaleY * 1.05);

}
function pickRandomSprite() {
    let randomNum = Phaser.Math.Between(1, 109);
    return `buddy_${randomNum}`;
}
function createAnimations(player) {
    const directions = ['left', 'right', 'up', 'down'];

    for (let direction of directions) {
        const animKey = `walking-${direction}_${player.sprite.texture.key}`;
        if (!currentScene.anims.get(animKey)) {
            currentScene.anims.create({
                key: animKey,
                frames: currentScene.anims.generateFrameNames(player.sprite.texture.key, {
                    frames: player.walkFrames
                }),
                yoyo: true,
                frameRate: 12,
                repeat: -1
            });
        }
    }
    const punchAnimKey = `punch_${player.sprite.texture.key}`;
    if (!currentScene.anims.get(punchAnimKey)) {
        currentScene.anims.create({
            key: punchAnimKey,
            frames: currentScene.anims.generateFrameNames(player.sprite.texture.key, {
                frames: [5, 5, 4, 4, 6, 6, 3, 3]
            }),
            frameRate: 24,
            repeat: 0
        });
    }
    const frontDamageAnim = `fDamage_${player.sprite.texture.key}`;
    if (!currentScene.anims.get(frontDamageAnim)) {
        currentScene.anims.create({
            key: frontDamageAnim,
            frames: currentScene.anims.generateFrameNames(player.sprite.texture.key, {
                frames: [33, 34, 35]
            }),
            frameRate: 24,
            repeat: 0
        });
    }
    const backDamageAnim = `bDamage_${player.sprite.texture.key}`;
    if (!currentScene.anims.get(backDamageAnim)) {
        currentScene.anims.create({
            key: backDamageAnim,
            frames: currentScene.anims.generateFrameNames(player.sprite.texture.key, {
                frames: [30, 30, 31, 31, 32, 32]
            }),
            frameRate: 24,
            repeat: 0
        });
    }
}

function idle(player) {
    currentScene.time.addEvent({
        delay: Phaser.Math.Between(500, 3000),
        callback: () => {
            const directions = ['left', 'right', 'up', 'down'];
            const randomDirection = Phaser.Utils.Array.GetRandom(directions);
            const varDistance = Phaser.Math.Between(30, 30);
            // Based on direction, adjust the player's position and play the animation
            switch (randomDirection) {
                case 'left':
                    moveTo(player, -varDistance, 0);
                    break;
                case 'right':
                    moveTo(player, varDistance, 0);
                    break;
                case 'up':
                    moveTo(player, 0, -varDistance);
                    break;
                case 'down':
                    moveTo(player, 0, varDistance);
                    break;
            }
        },
        loop: true
    });
}

function moveTo(player, x, y) {
    let animDirection = '';
    if (x < 0) { // Moving left
        animDirection = 'left';
        player.sprite.setFlipX(true);
    } else if (x > 0) { // Moving right
        animDirection = 'right';
        player.sprite.setFlipX(false);
    } else if (y < 0) { // Moving up
        animDirection = 'up';
    } else if (y > 0) { // Moving down
        animDirection = 'down';
    }
    player.velocity.x = x * player.speed;
    player.velocity.y = y * player.speed;

    const animKey = `walking-${animDirection}_${player.sprite.texture.key}`;

    player.isMoving = true;

    if (player.sprite && animDirection && currentScene.anims.exists(animKey)) {
        player.sprite.anims.play(animKey, true);
    }

    const distanceToCover = Math.sqrt(x * x + y * y);
    const moveTime = distanceToCover / player.speed;
    currentScene.time.delayedCall(moveTime, () => {
        player.isMoving = false;
    }, [], this);
}

function update(player) {
    const deltaSeconds = currentScene.time.delta / 1000; // Convert delta to seconds
    player.sprite.setVelocityX(player.velocity.x);
    player.sprite.setVelocityY(player.velocity.y);

    player.x += player.velocity.x * deltaSeconds;
    player.y += player.velocity.y * deltaSeconds;
    // console.log("player.x", player.sprite.x);
    // console.log("nameTag.x", player.nameTag.x);
    player.nameTag.x = player.sprite.x;
    player.nameTag.y = player.sprite.y - player.sprite.height / 2;
}
