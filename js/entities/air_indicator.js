game.HUD.air_indicator = me.Renderable.extend({
  init : function() {
    this._super(me.Renderable, 'init', [me.game.viewport.getWidth() - 116, 16, 96, 16]);
    this.z = 2;
    this.percentageAir = 100;
    this.width = 92;
    //this.mySprite = new me.Sprite(48, 64, {image : "Tile1", framewidth : 16, frameheight : 16});
    //me.game.world.addChild(this.mySprite);
    },

  draw : function(renderer) {
    renderer.save();
    this.percentageAir = game.data.percentageAir;
    var fraction = this.percentageAir * this.width / 100.0;
    var colour = new me.Color(0, 0, 64, 1.0);

    var x = this.pos.x;
    var y = this.pos.y;

    renderer.setColor("#000");
    renderer.fillRect(x+3, y, this.width, 16);
    renderer.setColor(colour);
    renderer.setLineWidth(1);

    for(var i = 0; i < this.width; i += 3) {
        renderer.strokeLine(x+3+i,y, x+3+i,y+16);
    }

    for(var i = 0; i < fraction; i += 3) {
        colour = new me.Color(255 - i, i * 2, 0, 1.0);
        renderer.setColor(colour);
        renderer.strokeLine(x+3+i,y, x+3+i,y+16);
    }

    renderer.drawImage(me.loader.getImage("tile1"), 48, 64, 32, 16, x, 12, 32, 16);
    renderer.drawImage(me.loader.getImage("tile1"), 48, 80, 32, 16, x, 20, 32, 16);
    renderer.drawImage(me.loader.getImage("tile1"), 64, 64, 16, 16, x+32, 12, 16, 16);
    renderer.drawImage(me.loader.getImage("tile1"), 64, 80, 16, 16, x+32, 20, 16, 16);
    renderer.drawImage(me.loader.getImage("tile1"), 64, 64, 16, 16, x+48, 12, 16, 16);
    renderer.drawImage(me.loader.getImage("tile1"), 64, 80, 16, 16, x+48, 20, 16, 16);
    renderer.drawImage(me.loader.getImage("tile1"), 64, 64, 32, 16, x+64, 12, 32, 16);
    renderer.drawImage(me.loader.getImage("tile1"), 64, 80, 32, 16, x+64, 20, 32, 16);
    renderer.restore();
  }
});
