Ext.Loader.setConfig({
  paths: {
    'Ext.ux': 'ux'
  }
});

Ext.application({
  name: 'MyApp',

  extend: 'MyApp.Application',

  requires: ['MyApp.view.main.MainView'],

  autoCreateViewport: 'MyApp.view.main.MainView'
});
