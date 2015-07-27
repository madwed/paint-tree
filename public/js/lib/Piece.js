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
      var run = this.run.bind(this);
      this.runBox = {running: false, run: run};
    }

    Piece.prototype.draw = function (stroke) {
      stroke = {brush: new Brush(stroke.brush), paint: new Paint(stroke.mark)};
      this.strokes.push(stroke);
      if(!this.runBox.running) {
        this.runBox.running = true;
        this.animate();
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
          brushPositions = mathLib.getPixels(brushPositions, dimensions, stroke.brush.interpolationStyle);
          brushPositions.forEach(function (pixel) {
            if(pixel !== undefined) {
              var colors = paint.variety(iData, pixel);
              this.applyColor(colors, pixel);
            }
          }, this);
          return true;
        }
      }, this);
      if(this.strokes.length === 0) {
        return false;
      }else {
        this.ctx.putImageData(this.iData, 0, 0);
        return true;
      }
    };

    Piece.prototype.applyColor = function (colors, pixel) {
      var iData = this.iData.data;
      iData[pixel] = colors.r;
      iData[pixel + 1] = colors.g;
      iData[pixel + 2] = colors.b;
      iData[pixel + 3] = colors.a;
    };

    Piece.prototype.animate = function () {
      var again, cancel,
        runBox = this.runBox,
        anim = function () {
          again = runBox.run();
          if(again) {
            cancel = requestAnimationFrame(anim);
          }else {
            cancelAnimationFrame(cancel);
            runBox.running = false;
          }
        };
      cancel = requestAnimationFrame(anim);
    };

    return Piece;
});



