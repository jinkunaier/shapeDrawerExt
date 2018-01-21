Ext.define('MyApp.view.custom.FloodFill', {
  extend: 'Ext.draw.sprite.Sprite',
  alias: 'sprite.floodfill',
  type: 'floodfill',

  inheritableStatics: {
    def: {
      processors: {
        X: 'number',
        Y: 'number'
      },

      defaults: {
        X: 0,
        Y: 0,
        strokeStyle: 'black'
      }
    }
  },

  floodfill: function(
    data,
    startX,
    startY,
    fillColor,
    canvasWidth,
    canvasHeight
  ) {
    var pixelStack = [[startX, startY]];
    var newPos, x, y, pixelPos, reachLeft, reachRight;

    while (pixelStack.length) {
      newPos = pixelStack.pop();
      x = newPos[0];
      y = newPos[1];

      // get current pixel position
      pixelPos = (y * canvasWidth + x) * 4;

      var startColor = [
        data[pixelPos],
        data[pixelPos + 1],
        data[pixelPos + 2],
        data[pixelPos + 3]
      ];

      while (
        y >= 0 &&
        this.isStartColorMatch(data, pixelPos, startColor, fillColor)
      ) {
        y--;
        pixelPos -= canvasWidth * 4;
      }

      pixelPos += canvasWidth * 4;
      y++;
      reachLeft = false;
      reachRight = false;

      while (
        y <= canvasHeight - 1 &&
        this.isStartColorMatch(data, pixelPos, startColor, fillColor)
      ) {
        y += 1;

        this.changePixelColor(data, pixelPos, fillColor);

        pixelPos += canvasWidth * 4;

        if (x > 0) {
          if (
            this.isStartColorMatch(data, pixelPos - 4, startColor, fillColor)
          ) {
            if (!reachLeft) {
              // Add pixel to stack
              pixelStack.push([x - 1, y]);
              reachLeft = true;
            }
          } else if (reachLeft) {
            reachLeft = false;
          }
        }

        if (x < canvasWidth - 1) {
          if (
            this.isStartColorMatch(data, pixelPos + 4, startColor, fillColor)
          ) {
            if (!reachRight) {
              // Add pixel to stack
              pixelStack.push([x + 1, y]);
              reachRight = true;
            }
          } else if (reachRight) {
            reachRight = false;
          }
        }
      }
    }
  },

  isStartColorMatch: function(data, pixelPos, startColor, fillColor) {
    // colors match
    if (
      fillColor.r === startColor[0] &&
      fillColor.g === startColor[1] &&
      fillColor.b === startColor[2] &&
      fillColor.a === startColor[3]
    )
      return false;

    // target color to change
    if (
      data[pixelPos] === startColor[0] &&
      data[pixelPos + 1] === startColor[1] &&
      data[pixelPos + 2] === startColor[2] &&
      data[pixelPos + 3] === startColor[3]
    )
      return true;

    return false;
  },

  changePixelColor: function(data, pixelPos, fillColor) {
    data[pixelPos] = fillColor.r;
    data[pixelPos + 1] = fillColor.g;
    data[pixelPos + 2] = fillColor.b;
    data[pixelPos + 3] = fillColor.a;
  },

  validateInput: function(data, x, y, color, width, height) {
    if (isNaN(width) || width < 1) {
      console.error('width must be a positive number');
      return false;
    }

    if (isNaN(height) || height < 1) {
      console.error('height must be a positive number');
      return false;
    }

    if (isNaN(x) || x < 0) {
      console.error('x must be a positive number');
      return false;
    }

    if (isNaN(y) || y < 0) {
      console.error('y must be a positive number');
      return false;
    }

    return true;
  },

  // process any css color to rgba object
  getRgbaColorObject: function(c) {
    var temp = document.createElement('div');
    var color = { r: 0, g: 0, b: 0, a: 0 };
    temp.style.color = c;
    temp.style.display = 'none';
    document.body.appendChild(temp);
    var style = window.getComputedStyle(temp, null).color;
    document.body.removeChild(temp);

    var recol = /([\.\d]+)/g;
    var vals = style.match(recol);
    if (vals && vals.length > 2) {
      color.r = parseInt(vals[0]) || 0;
      color.g = parseInt(vals[1]) || 0;
      color.b = parseInt(vals[2]) || 0;
      color.a = Math.round((parseFloat(vals[3]) || 1.0) * 255);
    }
    return color;
  },

  fillContext: function(x, y, ctx, fillColor) {
    var color = this.getRgbaColorObject(fillColor);

    var image = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);

    var data = image.data;
    var width = image.width;
    var height = image.height;
    x = parseInt(x);
    y = parseInt(y);

    if (width > 0 && height > 0 && x >= 0 && y >= 0) {
      var isInputValid = this.validateInput(data, x, y, color, width, height);
      if (isInputValid) {
        this.floodfill(data, x, y, color, width, height);
        ctx.putImageData(image, 0, 0);
      }
    }
  },

  render: function(surface, ctx) {
    var attr = this.attr;

    this.fillContext(attr.X, attr.Y, ctx, attr.strokeStyle);
  }
});
