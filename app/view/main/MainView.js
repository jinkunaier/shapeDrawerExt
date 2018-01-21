Ext.define('MyApp.view.main.MainView', {
  extend: 'Ext.container.Container',
  xtype: 'app-main',

  requires: [
    'MyApp.view.main.MainViewController',
    'MyApp.view.custom.FloodFill',
    'Ext.ux.colorpick.Field',
    'Ext.form.Panel',
    'Ext.form.field.ComboBox',
    'Ext.form.field.Number',
    'Ext.toolbar.Toolbar',
    'Ext.button.Button',
    'Ext.draw.Container'
  ],

  controller: 'main',

  layout: {
    type: 'vbox',
    align: 'stretch'
  },

  items: [
    {
      xtype: 'form',
      title: 'Form',
      bodyPadding: 10,
      autoScroll: true,
      reference: 'form',
      layout: {
        type: 'vbox',
        align: 'stretch'
      },
      items: [
        {
          xtype: 'combobox',
          fieldLabel: 'Shape',
          anyMatch: true,
          forceSelection: true,
          allowBlank: false,
          name: 'shape',
          store: ['line', 'rectangle', 'circle', 'floodfill'],
          reference: 'shape',
          listeners: {
            select: 'onShapeSelect'
          }
        },
        {
          xtype: 'colorfield',
          fieldLabel: 'Colour',
          allowBlank: false,
          name: 'colour',
          listeners: {
            change: 'onValueChange'
          }
        },
        {
          xtype: 'numberfield',
          fieldLabel: 'Coordinate X',
          minValue: 0,
          value: 0,
          allowBlank: false,
          name: 'coordinateX',
          reference: 'coordinateX',
          listeners: {
            change: {
              fn: 'onValueChange',
              buffer: 500
            }
          }
        },
        {
          xtype: 'numberfield',
          fieldLabel: 'Coordinate Y',
          minValue: 0,
          value: 0,
          allowBlank: false,
          name: 'coordinateY',
          reference: 'coordinateY',
          listeners: {
            change: {
              fn: 'onValueChange',
              buffer: 500
            }
          }
        },
        {
          xtype: 'numberfield',
          fieldLabel: 'Width',
          minValue: 0,
          value: 0,
          allowBlank: false,
          name: 'width',
          reference: 'width',
          listeners: {
            change: {
              fn: 'onValueChange',
              buffer: 500
            }
          }
        },
        {
          xtype: 'numberfield',
          fieldLabel: 'Height',
          minValue: 0,
          value: 0,
          allowBlank: false,
          reference: 'height',
          name: 'height',
          listeners: {
            change: {
              fn: 'onValueChange',
              buffer: 500
            }
          }
        },
        {
          xtype: 'numberfield',
          fieldLabel: 'Radius',
          minValue: 0,
          value: 0,
          allowBlank: false,
          reference: 'radius',
          name: 'radius',
          listeners: {
            change: {
              fn: 'onValueChange',
              buffer: 500
            }
          }
        },
        {
          xtype: 'toolbar',
          layout: {
            type: 'hbox',
            pack: 'center'
          },
          items: [
            {
              xtype: 'button',
              text: 'Save',
              formBind: true,
              handler: 'onSaveClick'
            },
            {
              xtype: 'button',
              text: 'Reset',
              handler: 'onResetClick'
            }
          ]
        }
      ]
    },
    {
      xtype: 'draw',
      title: 'Canvas',
      reference: 'draw',
      flex: 1,
      listeners: {
        resize: 'onCanvasResize'
      }
    }
  ]
});
