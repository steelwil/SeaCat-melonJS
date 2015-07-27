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
    },

  draw : function(renderer) {
    renderer.save();
    var b = 6; // number of bubbles
    var d = 100 / b; // amount of air per bubble
    for (var i = 0; i < b; i++) {
        var v = d + i * d - 0.000001; // subtract a tiny amount to solve rounding issues
        this.animationSheet.pos.x = this.pos.x + 16 * i;
        if (game.data.percentageAir >= v) {
            this.animationSheet.setCurrentAnimation("0");
            this.animationSheet.draw(renderer);
        }
        else if (game.data.percentageAir > 0 && game.data.percentageAir + d > v) {
            var l = Math.floor((v - game.data.percentageAir) / d * 3 + 1);
            this.animationSheet.setCurrentAnimation(l);
            this.animationSheet.draw(renderer);
        }
    }
    renderer.restore();
  }
});
