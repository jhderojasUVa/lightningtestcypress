import { Lightning } from 'wpe-lightning-sdk';

Cypress.Commands.add('createApp', () => {
  class App extends Lightning.Application {
    static _template() {
      return {};
    }
  }

  window.app = new App({ stage: { w: 1920, h: 1080 } });

  return cy
    .visit('http://localhost/static/index.html')
    .get('body')
    .then((body) => {
      body.append(app.stage.getCanvas());
    });
});

Cypress.Commands.add('destroyApp', () => {
  window.app = null;
});

Cypress.Commands.add('addComponent', (component) => {
  app.childList.a(component);
  app.stage.drawFrame();
});