function stateMain() {
    return {

        preload: function () {
            this.load.spritesheet('robot', 'images/main/robot.png', 80, 111, 28);
            //adding map/level

            // null is for if you have json already loaded
            // game.load.tilemap('map', 'maps/map1.json', null, Phaser.Tilemap.TILED_JSON)
            // console.dir(mapObj)
            game.load.tilemap('map', 'maps/mapTest.json', mapObj, Phaser.Tilemap.TILED_JSON)
            game.load.image('tiles', 'images/tiles.png')
            game.load.image('phaser', 'images/git-runner-logo.png')
        },

        create: function () {
            console.log('Ready!')
            game.physics.startSystem(Phaser.Physics.ARCADE)

            // /*load map*/
            this.map = game.add.tilemap('map')    // currently causes game not to load

            this.map.addTilesetImage('tiles')
            this.layer = this.map.createLayer('Tile Layer 1')
            /*resize world to the size of the map that has been imported*/
            this.layer.resizeWorld()
            // console.log(Math.ceil(this.map.height / 2) * 64)
            // this.robot = game.add.sprite(0, 0 * 62, 'robot')
            const tileSize = 64
            this.robot = game.add.sprite(0, Math.ceil(this.map.height / 2) * tileSize + (tileSize * -0.75), 'robot')
            //sets collision for the map to be tiles 0 thru 24. this only excludes the bomb at this time.
            this.titleImage = game.add.image(6 * 64, (Math.ceil(this.map.height / 2) - 3) * 64 - 20, 'phaser');

            this.map.setCollisionBetween(0, 24)

            /*   ###### NOTES #####
            this.robot.animations.add('idle', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], 12, true)
            (name, frames, fps,loop=bool)
                ##### NOTES #####*/
            this.robotSize = 0.5 // size relative to sprite
            this.robot.animations.add('idle', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], 12, true);
            this.robot.animations.add('walk', [10, 11, 12, 13, 14, 15, 16, 17], 12, true);
            this.robot.animations.add('jump', [18, 19, 20, 21, 22, 23, 24, 25], 12, false);
            this.robot.animations.play('idle')
            game.physics.arcade.enable(this.robot)

            this.robot.scale.x = this.robotSize;
            this.robot.scale.y = this.robotSize;
            this.robot.body.gravity.y = 150
            this.robot.anchor.set(0.5, 0.5)
            game.physics.arcade.enable(this.robot)
            this.robot.body.bounce.set(0.001)
            //keeps from walking off map
            this.robot.body.collideWorldBounds = true
            cursors = game.input.keyboard.createCursorKeys()
            // focus/follow robot with camera
            game.camera.follow(this.robot)

            /* set this callback to first at the index bombs (25) are located.
            call the this.gotBomb and pass it this.layer
            */
            this.map.setTileIndexCallback(25, this.gotBomb, this.layer)


        },
        gotBomb: function (sprite, tile) {
            /*this context is set to the layer*/
            this.map.removeTile(tile.x, tile.y, this)
        },
        titleExists: true,

        update: function () {  // this is the event loop.

            //continuously check for collisions between layer/world and robot
            game.physics.arcade.collide(this.robot, this.layer)

            //walk animation
            if (Math.abs(this.robot.body.velocity.x) > 100 && this.robot.body.onFloor()) {
                this.robot.animations.play('walk')
            } else if (this.robot.body.onFloor()) {
                this.robot.animations.play('idle')
            }
            /*
            This determines the direction the player is facing.
            I wanted them to continue facing the direction they last moved
            so it does not update if the velocity is zero.
            */
            if (this.robot.body.velocity.x > 0) {
                /* this.robotSize defines the scale of the size of the robot
                since i am shrinking him for easier level design, I needed
                to use the scale of the robot. The -this.robotSize flips the sprite
                to make it face the direction you are running
                */
                this.robot.scale.x = this.robotSize
            } else if (this.robot.body.velocity.x < 0) {
                this.robot.scale.x = -this.robotSize
            }
            // if (cursors.left.isDown) {
            //     this.robot.body.velocity.x = -250

            // } else {
            //     this.robot.body.velocity.x = this.robot.body.velocity.x > 0 ?
            //         this.robot.body.velocity.x -= 25 : 0
            // }

            if (this.robot.body.onFloor()) {
                // HORIZONTAL MOVEMENT
                if (cursors.right.isDown) {
                    if (this.titleExists) {
                        this.titleExists = false
                        this.titleImage.destroy()
                        // console.log('destroy')
                    }
                    this.robot.body.velocity.x = this.robot.body.velocity.x < 500 ?
                        this.robot.body.velocity.x += 70 : 500
                } else if (cursors.left.isDown) {
                    if (this.titleExists) {
                        this.titleExists = false
                        this.titleImage.destroy()
                        console.log('destroy')
                    }
                    // HORIZONTAL MOVEMENT
                    this.robot.body.velocity.x = this.robot.body.velocity.x > -500 ?
                        this.robot.body.velocity.x -= 70 : -500
                }
                else if (this.robot.body.velocity.x != 0) {
                    // I Wanted a sense of momentum so have a fractional fall off of x movement
                    this.robot.body.velocity.x = Math.floor(this.robot.body.velocity.x / 1.2)

                }
                if (cursors.up.isDown) {
                    if (this.titleExists) {
                        this.titleExists = false
                        this.titleImage.destroy()
                        console.log('destroy')
                    }
                    // JUMP
                    this.robot.body.velocity.y = -350
                    this.robot.animations.play('jump')
                }
            } else if (!this.robot.body.onFloor()) {
                // HORIZONTAL MOVEMENT IN AIR
                if (cursors.right.isDown) {
                    this.robot.body.velocity.x = this.robot.body.velocity.x < 250 ?
                        this.robot.body.velocity.x += 70 : 250

                } else if (cursors.left.isDown) {
                    this.robot.body.velocity.x = this.robot.body.velocity.x > -250 ?
                        this.robot.body.velocity.x -= 60 : -250
                } else if (this.robot.body.velocity.x != 0) {
                    // HORIZONTAL SLOW WHILE FALLING
                    this.robot.body.velocity.x = Math.floor(this.robot.body.velocity.x / 1.2)
                }

                if (cursors.up.isDown) {
                    this.robot.body.velocity.y -= 4

                }

                if (cursors.down.isDown) {

                    this.robot.body.velocity.y += 10
                }
            }


        }

    }
}

