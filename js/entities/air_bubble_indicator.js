game.HUD.air_bubble_indicator = me.Renderable.extend({
  init : function() {
    this._super(me.Renderable, 'init', [me.game.viewport.getWidth() - 116, 40, 96, 16]);
    },

  draw : function(renderer) {
    renderer.save();
    var b = 6; // number of bubbles
    var d = 100 / b; // amount of air per bubble
    for (var i = 0; i < b; i++) {
        var v = d + i * d;
        var myBubble = new me.Sprite(this.pos.x + 16* i, this.pos.y, {image : "air_bubble"});
        if (game.data.percentageAir - v > -d) {
            if (game.data.percentageAir - v < 0) {
                myBubble.alpha = d / 4 / (v - game.data.percentageAir) / 4;
            }
            else {
                myBubble.alpha = 1.0;
            }
            myBubble.draw(renderer);
        }
    }
    renderer.restore();
  }
});

