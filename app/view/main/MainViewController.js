Ext.define('MyApp.view.main.MainViewController', {
  extend: 'Ext.app.ViewController',

  alias: 'controller.main',

  config: {
    // we need to keep track on whether user already saved canvas drawing or not
    isSaved: false
  },

  onCanvasResize: function(container) {
    this.reset();
    this.resetMaxValues(container);
  },

  onShapeSelect: function(combo, record) {
    var widthField = this.lookup('width');
    var heightField = this.lookup('height');
    var radiusField = this.lookup('radius');
    switch (record.data.field1) {
      case 'rectangle':
      case 'line':
        widthField.setDisabled(false);
        heightField.setDisabled(false);
        radiusField.setDisabled(true);
        break;

      case 'circle':
        widthField.setDisabled(true);
        heightField.setDisabled(true);
        radiusField.setDisabled(false);
        break;

      default:
        widthField.setDisabled(true);
        heightField.setDisabled(true);
        radiusField.setDisabled(true);
    }

    this.drawShape();
    this.setIsSaved(false);
  },

  onValueChange: function() {
    this.drawShape();
    this.setIsSaved(false);
  },

  onSaveClick: function() {
    this.drawShape();
    this.setIsSaved(true);
  },

  onResetClick: function() {
    this.reset();
  },

  reset: function() {
    var draw = this.lookup('draw');
    var form = this.lookup('form').getForm();
    form.reset();
    this.presetShape();
    draw.removeAll();
  },

  presetShape: function() {
    var combo = this.lookup('shape');
    var defaultShape = 'rectangle';
    combo.select(defaultShape);
    combo.fireEvent('select', combo, { data: { field1: defaultShape } });
  },

  drawShape: function() {
    var panel = this.lookup('form');
    if (panel) {
      var form = panel.getForm();
      var radiusField = this.lookup('radius');
      var widthField = this.lookup('width');
      var heightField = this.lookup('height');
      var draw = this.lookup('draw');
      var containerHeight = draw.getHeight();
      var containerWidth = draw.getWidth();
      this.resetMaxValues(draw);
      if (form.isValid()) {
        var surface = draw.getSurface();
        if (!this.getIsSaved()) surface.getItems().pop();
        var v = this.getProcessedValues(form.getValues());

        switch (v.shape) {
          case 'rectangle':
            if (v.coordinateX + v.width > containerWidth) {
              widthField.setMaxValue(containerWidth - v.coordinateX);
              form.isValid();
              return;
            }
            if (v.coordinateY + v.height > containerHeight) {
              heightField.setMaxValue(containerHeight - v.coordinateY);
              form.isValid();
              return;
            }
            surface.add({
              type: 'rect',
              x: v.coordinateX,
              y: v.coordinateY,
              width: v.width,
              height: v.height,
              strokeStyle: v.colour
            });
            break;

          case 'circle':
            var isRadiusValidObject = this.isRadiusValid(v);
            if (!isRadiusValidObject.isValid) {
              radiusField.setMaxValue(isRadiusValidObject.maxRadius);
              form.isValid();
              return;
            }
            surface.add({
              type: 'circle',
              x: v.coordinateX,
              y: v.coordinateY,
              r: v.radius,
              strokeStyle: v.colour
            });
            break;

          case 'line':
            if (v.coordinateX + v.width > containerWidth) {
              widthField.setMaxValue(containerWidth - v.coordinateX);
              form.isValid();
              return;
            }
            if (v.coordinateY + v.height > containerHeight) {
              heightField.setMaxValue(containerHeight - v.coordinateY);
              form.isValid();
              return;
            }
            surface.add({
              type: 'line',
              fromX: v.coordinateX,
              fromY: v.coordinateY,
              toX: v.width,
              toY: v.height,
              strokeStyle: v.colour
            });
            break;

          default:
            surface.add({
              type: 'floodfill',
              X: v.coordinateX,
              Y: v.coordinateY,
              strokeStyle: v.colour
            });
        }
        draw.renderFrame();
      }
    }
  },

  isRadiusValid: function(v) {
    var draw = this.lookup('draw');
    var containerHeight = draw.getHeight();
    var containerWidth = draw.getWidth();
    var isRadiusValid = true;
    var diff = 0;
    var maxRadius = 0;
    if (v.coordinateX + v.radius > containerWidth) {
      diff = v.coordinateX + v.radius - containerWidth;
      if (diff > maxRadius) maxRadius = diff;
      isRadiusValid = false;
    }
    if (v.coordinateX - v.radius < 0) {
      diff = v.coordinateX;
      if (diff > maxRadius) maxRadius = diff;
      isRadiusValid = false;
    }
    if (v.coordinateY + v.radius > containerHeight) {
      diff = v.coordinateY + v.radius - containerHeight;
      if (diff > maxRadius) maxRadius = diff;
      isRadiusValid = false;
    }
    if (v.coordinateY - v.radius < 0) {
      diff = v.coordinateY;
      if (diff > maxRadius) maxRadius = diff;
      isRadiusValid = false;
    }
    return {
      isValid: isRadiusValid,
      maxRadius: maxRadius
    };
  },

  resetMaxValues: function(container) {
    var containerHeight = container.getHeight();
    var containerWidth = container.getWidth();

    // setup max values to not exceed canvas size
    this.lookup('width').setMaxValue(containerWidth);
    this.lookup('height').setMaxValue(containerHeight);
    this.lookup('coordinateX').setMaxValue(containerWidth);
    this.lookup('coordinateY').setMaxValue(containerHeight);
    this.lookup('radius').setMaxValue(Math.sqrt(Math.pow(containerWidth, 2) + Math.pow(containerHeight, 2)));
  },

  getProcessedValues: function(values) {
    return Object.keys(values).reduce(function(ob, key) {
      switch (key) {
        case 'colour':
          ob[key] = '#' + values[key];
          break;
        case 'shape':
          ob[key] = values[key];
          break;
        default:
          ob[key] = Number(values[key]);
      }
      return ob;
    }, {});
  }
});
