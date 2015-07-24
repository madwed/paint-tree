/**
 * @Isaac Madwed
 */

/*
 * Pieces hold and run managers.
 * You may only add managers to a Piece's
 * manager array.
 * They are a convenience object to help manage
 * different kinds of managers (and their agents)
 * from the top level.
 * You can also access the imgData directly
 * to apply it to multiple canvases.
 */

define(["js/lib/Brush",
  "js/lib/Paint",
  "js/lib/mathLib"],
  function (Brush, Paint, mathLib) {
    "use strict";
    function Piece (canvas) {
      this.dimensions = {width: canvas.width, height: canvas.height};
      this.canvas = canvas;
      this.ctx = canvas.getContext("2d");
      this.iData = this.ctx.getImageData(0, 0, canvas.width, canvas.height);
      this.strokes = [];
      this.running = false;
    }

    Piece.prototype.draw = function (mark) {
      var stroke = {brush: new Brush(mark.positions, mark.mark.size), paint: new Paint(mark.mark)};
      this.strokes.push(stroke);
      if(!this.running) {
        this.running = true;
        this.run();
      }
    };

    Piece.prototype.run = function () {
      this.strokes = this.strokes.filter(function (stroke) {
        var brushPositions = stroke.brush.update();
        if(brushPositions === undefined) {
          return false;
        }else {
          var iData = this.iData.data;
          var paint = stroke.paint;
          var dimensions = this.dimensions;
          brushPositions.forEach(function (pos) {
            var pixel = mathLib.getPixel(pos, dimensions);
            if(pixel !== undefined) {
              var colors = paint.variety(iData, pixel);
              this.applyColor(colors, pixel);
            }
          }, this);
          return true;
        }
      }, this);
      if(this.strokes.length === 0) {
        console.log("no");
        this.running = false;
      }else {
        this.ctx.putImageData(this.iData, 0, 0);
        this.run();
      }
    };

    Piece.prototype.applyColor = function (colors, pixel) {
      var iData = this.iData.data;
      iData[pixel] = colors.r;
      iData[pixel + 1] = colors.g;
      iData[pixel + 2] = colors.b;
      iData[pixel + 3] = colors.a;
    };

    return Piece;
});



