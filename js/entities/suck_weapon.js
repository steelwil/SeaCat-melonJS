/************************************************************************************/
/*                                                                                  */
/*        suck_weapon                                                               */
/*                                                                                  */
/************************************************************************************/
game.suck_weapon = me.Entity.extend({
    init: function(x, y, settings) {
        // call the constructor
        this._super(me.Entity, "init", [x, y , settings]);

        this.percentageAir = settings.percentageAir;

        // set the default horizontal & vertical speed (accel vector)
        this.body.setVelocity(3, 3); // horizontal, vertical
        this.body.setFriction(0.4,0);

        // set the display to follow our position on both axis
        me.game.viewport.follow(this, me.game.viewport.AXIS.BOTH);


        // ensure the player is updated even when outside of the viewport
        this.alwaysUpdate = true;

        // define a basic walking animation (using frames 1 and 2)
        this.renderable.addAnimation("walk", [1, 2]);
    },

    /* -----

        update the player pos

    ------            */
    update : function (dt) {
        var update = false;
        if (me.input.isKeyPressed('left')) {
            // flip the sprite on horizontal axis
            this.renderable.flipX(true);
            // update the entity velocity
            this.body.vel.x -= this.body.accel.x * me.timer.tick;
            // change to the walking animation
            if (!this.renderable.isCurrentAnimation("walk")) {
                this.renderable.setCurrentAnimation("walk");
            }
            update = true;
        } else if (me.input.isKeyPressed('right')) {
            // unflip the sprite
            this.renderable.flipX(false);
            // update the entity velocity
            this.body.vel.x += this.body.accel.x * me.timer.tick;
            // change to the walking animation
            if (!this.renderable.isCurrentAnimation("walk")) {
                this.renderable.setCurrentAnimation("walk");
            }
            update = true;
        } else {
            this.body.vel.x = 0;
            // change to the standing animation
            this.renderable.setCurrentAnimation("stand");
            //return (this._super(me.Entity, 'update', [dt]) || true);
            update = true;
        }

        if (me.input.isKeyPressed('jump')) {
            if (this.percentageAir > 0) {
                this.percentageAir -= 2;
                // set current vel to the maximum defined value
                // gravity will then do the rest
                this.body.vel.y = -this.body.maxVel.y * me.timer.tick;
                // set the jumping flag
                this.body.jumping = true;
                this.renderable.setCurrentAnimation("jumping");
            }
            update = true;
        }

        if (me.input.isKeyPressed('inhale')) {
            if (!this.body.jumping) {
                if (this.percentageAir < 100) {
                    this.percentageAir += 1;
                    if (me.input.isKeyPressed('up')) {
                        this.renderable.setCurrentAnimation("suck-up")
                    }
                    else if (me.input.isKeyPressed('down')) {
                        this.renderable.setCurrentAnimation("suck-down")
                    }
                    else if (this.renderable.isCurrentAnimation("stand")) {
                        this.renderable.setCurrentAnimation("suck");
                    }
                    update = true;
                }
            }
        }

        if (this.body.jumping) {
            this.renderable.setCurrentAnimation("jumping");
        } else if (this.body.falling) {
            this.renderable.setCurrentAnimation("falling");
        }

        game.data.percentageAir = this.percentageAir;
        // apply physics to the body (this moves the entity)
        this.body.update(dt);

        // handle collisions against other shapes
        me.collision.check(this);

        // return true if we moved or if the renderable was updated
        return (this._super(me.Entity, 'update', [dt]) || update || this.body.vel.x !== 0 || this.body.vel.y !== 0);
    },

    /**
     * colision handler
     * (called when colliding with other objects)
     */
    onCollision : function (response, other) {
        // Make all other objects solid
        return true;
    }
});

