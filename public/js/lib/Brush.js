/**
 *
 */


define(["js/lib/Vector",
  "js/lib/mathLib"],
  function (Vector, mathLib) {
    "use strict";
    //x1_, y1_, x2_, y2_, vel, life, smearDuration <---- Old params
    var LinearBrush = function (positions, size) {
      var startPoint = this.startPoint = positions.start;
      var endPoint = this.endPoint = positions.end;

      //Define the Pixel LinearBrush as a line positioned
      //at (x1,y1), stretching to (x2,y2)
      var startX = startPoint.x;
      var startY = startPoint.y;

      this.width = size;

      this.vel = new Vector(endPoint.x - startX, endPoint.y - startY);

      var angle = Math.atan2(this.vel.y, this.vel.x) + Math.PI / 2;
      var x0 = Math.cos(angle) * size / 2;
      var y0 = Math.sin(angle) * size / 2;
      if(x0 * x0 / 2 < mathLib.EPSILON) {
        x0 = 0;
      }
      if(y0 * y0 / 2 < mathLib.EPSILON) {
        y0 = 0;
      }
      this.x0 = x0;
      this.y0 = y0;

      this.setMaxSpeedAndForce(0.9, 0.05);

      this.pos = new Vector(startX, startY);
      this.acc = new Vector(0, 0);

      this.kill = false;
    };

    LinearBrush.prototype.setMaxSpeed = function (num) {
      this.maxSpeed = num;
    };

    LinearBrush.prototype.setMaxForce = function (num) {
      this.maxForce = num;
    };

    LinearBrush.prototype.setMaxSpeedAndForce = function (mxSpd, mxFrc) {
      this.maxSpeed = mxSpd;
      this.maxForce = mxFrc;
      this.vel.limit(mxSpd);
    };

    LinearBrush.prototype.setDist = function (num) {
      this.width = num;
    };

    LinearBrush.prototype.reynoldsWalk = function () {
      //set a fixed linear vel
      var futurePos = this.vel.clone();
      futurePos.selfNormalize();
      futurePos.selfMul(1);

      //use the fixedLinearVel to calculate a futurePos
      futurePos.selfAdd(this.pos);

      //add a random vector from a circle
      var rotatingPoint = new Vector(0, 0);
      var radius = 5;
      var theta = Math.random() * Math.PI * 2;
      rotatingPoint.x = radius * Math.cos(theta);
      rotatingPoint.y = radius * Math.sin(theta);

      futurePos.selfAdd(rotatingPoint);

      //turn the futurePos vector into a desiredPos vector
      futurePos.selfSub(this.pos);
      futurePos.selfNormalize();
      futurePos.selfMul(this.maxSpeed);

      //turn the futurePos vector into a steering vector
      futurePos.selfSub(this.vel);
      var maxForceLimit = this.maxForce;
      futurePos.limit(maxForceLimit);
      return futurePos;
    };


    LinearBrush.prototype.checkLineEnd = function () {
      if(this.endPoint.x < this.startPoint.x) {
        if(this.pos.x < this.endPoint.x) {
          this.kill = true;
        }
      }else if(this.endPoint.x > this.startPoint.x) {
        if(this.pos.x > this.endPoint.x) {
          this.kill = true;
        }
      }else if(this.endPoint.y < this.startPoint.y) {
        if(this.pos.y < this.endPoint.y) {
          this.kill = true;
        }
      }else if(this.endPoint.y > this.startPoint.y) {
        if(this.pos.y > this.endPoint.y) {
          this.kill = true;
        }
      }else {
        this.kill = true;
      }
    };

    LinearBrush.prototype.applyForce = function (force_, factor) {
      if (typeof force_ !== "undefined") {
        var force = force_.clone();
        if (typeof factor === "undefined") {
          factor = 1;
        }
        force.selfMul(factor);
        this.acc.selfAdd(force);
      }
    };

    LinearBrush.prototype.randomDistModulator = function (high, low) {
      if(typeof low === "undefined") {
        low = 0;
      }
      var range = high - low;
      this.width = Math.random() * range + low;
    };

    LinearBrush.prototype.speedDistModulator = function () {
      var mod = Math.abs(this.vel.x);
      if(mod > 1 / 20) {
        this.width = 20 * mod;
      }else {
        this.width = 1;
      }
    };

    LinearBrush.prototype.update = function () {
      this.pos.selfAdd(this.vel);
      this.checkLineEnd();

      var x0 = this.x0;
      var y0 = this.y0;
      var posX = this.pos.x;
      var posY = this.pos.y;

      return this.kill ? undefined : this.getPixelPositions(posX + x0, posY + y0, posX - x0, posY - y0);
    };

    LinearBrush.prototype.getPixelPositions = function (vert1X, vert1Y, vert2X, vert2Y) {
      var dx = (vert2X - vert1X) / this.width;
      var dy = (vert2Y - vert1Y) / this.width;
      var pixelPositions = [];

      for (var gPi = 0; gPi < Math.floor(this.width); gPi++) {
        pixelPositions[gPi] = [vert1X + dx * gPi, vert1Y + dy * gPi];
      }
      return pixelPositions;
    };

    LinearBrush.prototype.getPixelPositionsDepth = function (vert1X, vert1Y, vert2X, vert2Y, num_) {
      var brushWidth = Math.floor(this.width);
      var dx = (vert2X - vert1X) / brushWidth;
      var dy = (vert2Y - vert1Y) / brushWidth;
      var bx = -Math.cos(this.dAngle);
      var by = -Math.sin(this.dAngle);
      var pixelPositions = [];

      for (var depth = 0; depth < num_ * brushWidth; depth += brushWidth) {
        for (var gPi = 0; gPi < brushWidth; gPi++) {
          pixelPositions[gPi + depth] = [vert1X + dx * gPi + bx * depth / brushWidth,
                                            vert1Y + dy * gPi + by * depth / brushWidth];
        }
      }
      return pixelPositions;
    };

    return LinearBrush;
  }
);

