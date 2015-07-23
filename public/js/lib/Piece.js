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
  "js/lib/BrushManager",
  "js/lib/DryBrush",
  "js/lib/Vector"],
  function (Brush, BrushManager, DryBrush, Vector) {
    function Piece () {
      this.width = 150;
      this.height = 100;
    }

    Piece.prototype.init = function(canvas_){
      this.canvas = canvas_;
      var canvasStyle = window.getComputedStyle(canvas_);
      this.width = width = parseInt(canvasStyle.getPropertyValue("width"), 10);
      this.height = height = parseInt(canvasStyle.getPropertyValue("height"), 10);
      canvas_.setAttribute("width", this.width);
      canvas_.setAttribute("height", this.height);
      this.ctx = canvas_.getContext("2d");
      this.imgData = this.ctx.getImageData(0, 0, this.width, this.height);
      this.managers = [];
    };

    Piece.prototype.addManager = function(manager, width_, height_){
      var width_ = width_ || this.width;
      var height_ = height_ || this.height;

      this.managers.push(manager);
      this.managers[this.managers.length - 1].frameOnCanvas(this.imgData.data, width_, height_);
    };

    // Piece.prototype.uiAddBrush = function(action, how, brush, x, y, vel, random){
    //   var markType;
    //   var name = "";
    //   if(action === "smear"){
    //     switch (how){
    //       case "opaque":
    //         markType = function(marks){this.smearOpaque(marks); };
    //         break;
    //       case "antiTransparent":
    //         markType = function(marks){this.smearAntiTransparent(marks); };
    //         break;
    //       case "awayLight":
    //         markType = function(marks){this.smearAwayLight(marks); };
    //         break;
    //       case "awayDark":
    //         markType = function(marks){this.smearAwayDark(marks); };
    //         break;
    //       default:
    //         markType = function(marks){this.smearAll(marks); };
    //         how = "all";
    //     }
    //   }else if(action === "blend"){
    //     switch (how){
    //       case "b/w":
    //         markType = function(marks){this.blendBlackOrWhite(marks); };
    //         name = "blendBW";
    //         break;
    //       default:
    //         markType = function(marks){this.blend(marks); };
    //         name = "blendDefault";
    //     }
    //   }
    //   var brushType;
    //   if(brush === "Dry"){
    //     brushType = function(){return this.getMarks(); };
    //   }else if(brush === "Wet"){
    //     brushType = function(){return this.getMarksNoGaps(); };
    //   }
    //   name = action + " " + how + " " + brush;

    //   var exists;
    //   var managers = this.managers;

    //   for(var index = 0; index < managers.length; index++){
    //     if(managers[index].name === name){
    //       exists = index;
    //       break;
    //     }
    //   }
    //   var manager;
    //   if(typeof exists === "number"){
    //     manager = managers[exists];
    //   }else{
    //     this.addManager(new BrushManager(markType, brushType, name));
    //     manager = managers[this.managers.length - 1];
    //   }
    //   var size = $("#size").slider("value");
    //   if(brush === "Wet"){
    //     manager.addBrush(new Brush(x - size / 2, y, x + size / 2, y, vel, $("#life").slider("value"), $("#smear").slider("value")));
    //   }else if(brush === "Dry"){
    //     manager.addBrush(new DryBrush(x - size / 2, y, x + size / 2, y, vel, $("#life").slider("value"), $("#smear").slider("value"), 1000, 75));
    //   }
    //   var newBrush = manager.brushes[manager.brushes.length - 1];
    //   newBrush.setMaxSpeedAndForce(.5, .01);
    //   newBrush.rgbaValues = [$("#red").slider("value"), $("#green").slider("value"), $("#blue").slider("value"), $("#alpha").slider("value")];
    // };

    Piece.prototype.run = function(){
      this.managers.forEach(function(manager){
        manager.run();
      });
      this.ctx.putImageData(this.imgData, 0, 0);
    };

    function randomizeColorsDown(rgba){
      var r = Math.random() * rgba[0];
      var g = Math.random() * rgba[1];
      var b = Math.random() * rgba[2];
      var a = Math.random() * rgba[3];
      return [r, g, b, a];
    }

    function randomizeColorsUp(rgba){
      var r = Math.random() * (255 - rgba[0]) + rgba[0];
      var g = Math.random() * (255 - rgba[1]) + rgba[1];
      var b = Math.random() * (255 - rgba[2]) + rgba[2];
      var a = Math.random() * (255 - rgba[3]) + rgba[3];
      return [r, g, b, a];
    }


    return Piece;
});



