/************************************************************************************/
/*                                                                                  */
/*        a player entity                                                           */
/*                                                                                  */
/************************************************************************************/
game.PlayerEntity = me.Entity.extend({
    init: function(x, y, settings) {
        // call the constructor
        this._super(me.Entity, "init", [x, y , settings]);

        this.percentageAir = settings.percentageAir;

        // set the default horizontal & vertical speed (accel vector)
        this.body.setVelocity(3, 3); // horizontal, vertical
        this.body.setFriction(0.4,0);

        // set the display to follow our position on both axis
        me.game.viewport.follow(this, me.game.viewport.AXIS.BOTH);

        me.input.bindKey(me.input.KEY.UP,  "up");
        me.input.bindKey(me.input.KEY.DOWN,  "down");
        me.input.bindKey(me.input.KEY.W,  "up");
        me.input.bindKey(me.input.KEY.S,  "down");
        me.input.bindKey(me.input.KEY.LEFT,  "left");
        me.input.bindKey(me.input.KEY.A,  "left");
        me.input.bindKey(me.input.KEY.RIGHT, "right");
        me.input.bindKey(me.input.KEY.D, "right");
        me.input.bindKey(me.input.KEY.X, "jump");
        me.input.bindKey(me.input.KEY.SPACE, "jump");
        me.input.bindKey(me.input.KEY.W, "jump");
        me.input.bindKey(me.input.KEY.Z, "inhale");
        me.input.bindKey(me.input.KEY.ENTER, "shoot", true);

        // ensure the player is updated even when outside of the viewport
        this.alwaysUpdate = true;

        // define a basic walking animation (using frames 1 and 2)
        this.renderable.addAnimation("walk", [1, 2]);
        // define jumping
        this.renderable.addAnimation("jumping", [3]);
        // define falling
        this.renderable.addAnimation("falling", [4]);
        // define a standing animation (using the first frame)
        this.renderable.addAnimation("stand", [0]);
        // define sucking
        this.renderable.addAnimation("suck", [5]);
        this.renderable.addAnimation("suck-up", [6]);
        this.renderable.addAnimation("suck-down", [7]);
        // define blowing 
        this.renderable.addAnimation("blow", [8]);
        // set the standing animation as default
        this.renderable.setCurrentAnimation("stand");
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

/* --------------------------
an enemy Entity
------------------------ */
game.EnemyEntity = me.Entity.extend({
    init: function(x, y, settings) {
        // define this here instead of tiled
        settings.image = "red_rock";

        // save the area size defined in Tiled
        var width = settings.width;
        var height = settings.height;

        // adjust the size setting information to match the sprite size
        // so that the entity object is created with the right size
        settings.framewidth = settings.width = 16;
        settings.frameheight = settings.height = 16;

        // redefine the default shape (used to define path) with a shape matching the renderable
        settings.shapes[0] = new me.Rect(0, 0, settings.framewidth, settings.frameheight);

        // call the parent constructor
        this._super(me.Entity, 'init', [x, y , settings]);

        // set start/end position based on the initial area size
        x = this.pos.x;
        this.startX = x;
        this.endX   = x + width - settings.framewidth
        this.pos.x  = x + width - settings.framewidth;

        // to remember which side we were walking
        this.walkLeft = false;

        // walking & jumping speed
        this.body.setVelocity(1, 6);
    },

    // manage the enemy movement
    update: function(dt) {
        if (this.alive) {
          if (this.walkLeft && this.pos.x <= this.startX) {
            this.walkLeft = false;
            }
            else if (!this.walkLeft && this.pos.x >= this.endX) {
                this.walkLeft = true;
            }
            // make it walk
            this.renderable.flipX(this.walkLeft);
            this.body.vel.x += (this.walkLeft) ? -this.body.accel.x * me.timer.tick : this.body.accel.x * me.timer.tick;
        }
        else {
          this.body.vel.x = 0;
        }

        // update the body movement
        this.body.update(dt);

        // handle collisions against other shapes
        me.collision.check(this);

        // return true if we moved or if the renderable was updated
        return (this._super(me.Entity, 'update', [dt]) || this.body.vel.x !== 0 || this.body.vel.y !== 0);
    },

    /**
    * colision handler
    * (called when colliding with other objects)
    */
    onCollision : function (response, other) {
        if (response.b.body.collisionType !== me.collision.types.WORLD_SHAPE) {
            // res.y >0 means touched by something on the bottom
            // which mean at top position for this one
            if (this.alive && (response.overlapV.y > 0) && response.a.body.falling) {
                this.renderable.flicker(750);
            }
                return false;
        }
        // Make all other objects solid
        return true;
    }
});
