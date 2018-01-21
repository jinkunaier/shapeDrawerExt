The shapeDrawerExt is an app which provide a user with ability to draw different kinds of preset shapes using ExtJS components.

The app consists of the main module, custom FloodFill.js which was extended from Ext.draw.sprite.Sprite primitive and ExtJS package components.

In order to save a shape on the canvas you can click Save button. Until Save button is clicked the last shape will be changed depending on the form values.
In order to clear the canvas and reset form defaults you can click Reset button.

With performance in mind the keyboard buffer has been added to the app, if the user inputs commands fast, only the last value will be processed.

A user can not input other values than positive (and 0) numbers. A user can draw only the shapes which are fully visible within the canvas.

The app is fully working locally so no need for a webserver to be setup and run, just open drawing.html file using your favourite browser.