
    
  function init() {
        this.player = player;
        this.maxHealth = maxHealth;
        this.currentHealth = this.maxHealth;
        this.maxStamina = maxStamina;
        this.currentStamina = this.maxStamina;

        // Add this container to the scene
        scene.add.existing(this);
        this.barConfig = {
            x: 0,
            y: 0,
            width: this.player.width * this.player.scaleX,
            height: 4 * this.player.scaleX
        };
        // Create the health and stamina bars
        this.createBars();
    }

    function createBars() {
        console.log()
       
        if (this.player.parentContainer.type ===  'player'|| this.player.parentContainer.type ===  'buddy') {
       
            this.tag = this.scene.add.circle(0, 0, 10, 0x0000ff);
        } else {
        
            this.tag = this.scene.add.circle(0, 0, 10, 0xff0000);
        }
        this.add(this.tag)

        // tag.setStrokeStyle(4, 0xefc53f);
        // Health Bar
        this.healthBar = new Phaser.GameObjects.Graphics(this.scene);
        this.add(this.healthBar); // Add to this container

        // Stamina Bar
        this.staminaBar = new Phaser.GameObjects.Graphics(this.scene);
        this.add(this.staminaBar); // Add to this container

        this.updateBars(this.currentHealth, this.currentStamina);
        this.alpha = 0.5;
        // Ensure the bars move with the player
        this.scene.events.on('update', () => {
            this.tag.x = this.player.x  - 60 -this.tag.width;
            this.tag.y = this.player.y - 60 - this.tag.height;
            // this.x = this.player.getBounds().x;
            // this.y = this.player.getBounds().y;
            this.healthBar.x = this.player.x - this.barConfig.width / 2;
            this.healthBar.y = this.player.y - this.barConfig.height * 2 * 5;

            this.staminaBar.x = this.player.x - this.barConfig.width / 2;
            this.staminaBar.y = this.healthBar.y + this.barConfig.height;  // Positioned 10 pixels below the health bar
        });
    }

    function updateBars(newHealth, newStamina) {


        this.currentHealth = newHealth;
        this.currentStamina = newStamina;

        // Clear previous drawings
        this.healthBar.clear();
        this.staminaBar.clear();

        // Draw health
        this.healthBar.fillStyle(0x000000);  // Black background
        this.healthBar.fillRect(this.barConfig.x, this.barConfig.y, this.barConfig.width, this.barConfig.height);

        this.healthBar.fillStyle(0x00FF00);  // Green health
        const healthWidth = (this.currentHealth / this.maxHealth) * this.barConfig.width;
        this.healthBar.fillRect(this.barConfig.x, this.barConfig.y, healthWidth, this.barConfig.height);

        // Draw stamina
        this.staminaBar.fillStyle(0x000000);  // Black background
        this.staminaBar.fillRect(this.barConfig.x, this.barConfig.y, this.barConfig.width, this.barConfig.height);

        this.staminaBar.fillStyle(0x0000FF);  // Blue stamina
        const staminaWidth = (this.currentStamina / this.maxStamina) * this.barConfig.width;
        this.staminaBar.fillRect(this.barConfig.x, this.barConfig.y, staminaWidth, this.barConfig.height);
    }

