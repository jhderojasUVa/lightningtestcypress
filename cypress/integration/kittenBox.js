/// <reference types="cypress" />

import { BoxTextureComponent } from '../../packages/BoxTextureComponent/src';

beforeEach((done) => cy.createApp().then(() => done()));
afterEach((done) => cy.destroyApp().then(() => done()));

describe('Box full of cats', () => {
  it('The component mount', (done) => {
    const component = {
      ref: 'BoxComponent',
      x: 100,
      y: 100,
      w: 1720,
      h: 880,
      type: BoxTextureComponent,
    };

    cy.addComponent(component)
      .then(() => {
        const foo = app.tag('Box');
        assert(foo!== undefined, 'component is there');
      })
      .screenshot()
      .then(() => done());
  });
  it('Have everything inside', (done) => {
    const component = {
      ref: 'BoxComponent',
      x: 100,
      y: 100,
      w: 1720,
      h: 880,
      setBackgroundAlpha: 0.2,
      backgroundPadding: 30,
      isSelected: true,
      type: BoxTextureComponent
    };

    cy.addComponent(component)
      .then(() => {
        const box = app.tag('BoxComponent').tag('Box');
        assert(box !== undefined, 'Has box');
        
        const interior = app.tag('BoxComponent').tag('Box').tag('Interior');
        assert(interior !== undefined, 'Has interior');

        const corners = app.tag('BoxComponent').tag('Box').tag('Corners');
        assert(corners !== undefined, 'Has corners');
        assert(corners.childList.length === 4, 'Has 4 courners');

        const borders = app.tag('BoxComponent').tag('Box').tag('Borders');
        assert(borders !== undefined, 'Has borders');
        assert(borders.childList.length === 4, 'Has 4 borders');

        const glint = app.tag('BoxComponent').tag('Box').tag('Glint');
        assert(glint !== undefined, 'Has glint');
        assert(glint.childList.length === 2, 'Has 2 glint elements');
      })
      .screenshot()
      .then(() => done());
  });
  it('Glint is visible property is on', (done) => {
    const component = {
      ref: 'BoxComponent',
      x: 100,
      y: 100,
      w: 1720,
      h: 880,
      setBackgroundAlpha: 0.2,
      backgroundPadding: 30,
      isSelected: true,
      type: BoxTextureComponent
    };

    cy.addComponent(component)
      .then(() => {
        const glint = app.tag('BoxComponent').tag('Box').tag('Glint');
        const topglint = glint.tag('TopGlint');
        const bottomglint = glint.tag('BottomGlint');

        assert(topglint.visible === true, 'Top glint is visible');
        assert(bottomglint.visible === true, 'Bottom glint is visible');
      })
      .screenshot()
      .then(() => done());
  });
  it('If alpha is equal to 0, interior is not visible', (done) => {
    const component = {
      ref: 'BoxComponent',
      x: 100,
      y: 100,
      w: 1720,
      h: 880,
      setBackgroundAlpha: 0,
      backgroundPadding: 30,
      isSelected: true,
      type: BoxTextureComponent
    };

    cy.addComponent(component)
      .then(() => {
        const interior = app.tag('BoxComponent').tag('Box').tag('Interior');

        assert(interior.visible === false, 'Interior is not visible');
      })
      .screenshot()
      .then(() => done());
  });
  it('If alpha is set to some value, it will be that value and will show', (done) => {
    const component = {
      ref: 'BoxComponent',
      x: 100,
      y: 100,
      w: 1720,
      h: 880,
      setBackgroundAlpha: 0.2,
      backgroundPadding: 30,
      isSelected: true,
      type: BoxTextureComponent
    };

    cy.addComponent(component)
      .then(() => {
        const interior = app.tag('BoxComponent').tag('Box').tag('Interior');

        assert(interior.visible === true, 'Interior is visible');
        assert(interior.alpha = component.setBackgroundAlpha, 'Alpha of the background is ok');
      })
      //.screenshot()
      .then(() => done());
  });
  it('If background padding is set, is set', (done) => {
    const component = {
      ref: 'BoxComponent',
      x: 100,
      y: 100,
      w: 1720,
      h: 880,
      setBackgroundAlpha: 0.2,
      backgroundPadding: 30,
      isSelected: true,
      type: BoxTextureComponent
    };

    cy.addComponent(component)
      .then(() => {
        const interior = app.tag('BoxComponent').tag('Box').tag('Interior');

        assert(interior.x === component.backgroundPadding, 'Background padding X');
        assert(interior.y === component.backgroundPadding, 'Background padding Y');
      })
      //.screenshot()
      .then(() => done());
  });
});
