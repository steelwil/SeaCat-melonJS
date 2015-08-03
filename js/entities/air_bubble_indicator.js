game.HUD.air_bubble_indicator = me.Renderable.extend({
    init : function() {
        this._super(me.Renderable, 'init', [me.game.viewport.getWidth() - 96, 0, 96, 16]);
        this.animationSheet = new me.AnimationSheet(0, 0, {
            image : "tile1",
            framewidth : 16,
            frameheight : 16
        });
        this.animationSheet.addAnimation("0", [53]);
        this.animationSheet.addAnimation("1", [54]);
        this.animationSheet.addAnimation("2", [55]);
        this.animationSheet.addAnimation("3", [56]);
        this.animationSheet.addAnimation("4", [57]);
    },

    draw : function(renderer) {
        renderer.save();
        var b = 6; // number of bubbles
        var d = 4.1666666;  // 100/4/b

        renderer.save();
        for (var i = 0; i < b; i++) {
            this.animationSheet.pos.x = this.pos.x + 16 * i;
            var animpos = 4;
            if (game.data.percentageAir > 100 - i*4*d - d) {
                animpos = 0;
            }
            else if (game.data.percentageAir > 100 - i*4*d - d*2) {
                animpos = 1;
            }
            else if (game.data.percentageAir > 100 - i*4*d - d*3) {
                animpos = 2;
            }
            else if (game.data.percentageAirr > 100 - i*4*d - d*4) {
                animpos = 4;
            }
            this.animationSheet.setCurrentAnimation(animpos);
            this.animationSheet.draw(renderer);
        }
        renderer.restore();
    }
});

