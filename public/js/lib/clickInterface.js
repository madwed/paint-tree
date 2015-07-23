define([], function () {
  "use strict";

  var clickInterface = function (canvas) {
    var rect = canvas.getBoundingClientRect();
    var ctx = canvas.getContext("2d");
    var width = canvas.width, height = canvas.height;
    var startPoint, movePoint, endPoint;

    var eventXY = function (event) {
      var eventDoc, doc, body;

      event = event || window.event; // IE-ism

      // If pageX/Y aren't available and clientX/Y are,
      // calculate pageX/Y - logic taken from jQuery.
      // (This is to support old IE)
      if (event.pageX === null && event.clientX !== null) {
          eventDoc = (event.target && event.target.ownerDocument) || document;
          doc = eventDoc.documentElement;
          body = eventDoc.body;

          event.pageX = event.clientX +
            (doc && doc.scrollLeft || body && body.scrollLeft || 0) -
            (doc && doc.clientLeft || body && body.clientLeft || 0);
          event.pageY = event.clientY +
            (doc && doc.scrollTop || body && body.scrollTop || 0) -
            (doc && doc.clientTop || body && body.clientTop || 0 );
      }
      var x = Math.round((event.pageX - rect.left) / (rect.right - rect.left) * width);
      var y = Math.round((event.pageY - rect.top) / (rect.bottom - rect.top) * height);

      return {x: x, y: y};
    };

    var drawLine = function (event) {
      movePoint = eventXY(event);

      ctx.clearRect(0, 0, width, height);
      ctx.beginPath();
      ctx.strokeStyle = "gray";
      ctx.lineWidth = 1;
      ctx.moveTo(startPoint.x, startPoint.y);
      ctx.lineTo(movePoint.x, movePoint.y);
      ctx.stroke();
    };

    var startClick = function (event) {
      startPoint = eventXY(event);
      document.addEventListener("mousemove", drawLine);
    };

    var endClick = function (event) {
      endPoint = eventXY(event);
      ctx.clearRect(0, 0, width, height);
      document.removeEventListener("mousemove", drawLine);
      ///Emit
      var lineEvent = new CustomEvent("lineEvent", {"detail": {start: startPoint, end: endPoint}});
      document.dispatchEvent(lineEvent);
    };


    canvas.addEventListener("mousedown", startClick);
    canvas.addEventListener("mouseup", endClick);

  };


  return clickInterface;
});
