import { Lightning, Utils } from 'wpe-lightning-sdk';

/** constants for general use */
// This constants depends on the image file used!
const BORDER_WIDTH = 10; // Respect the image file
const BORDER_SIZE = 50; // Respect the image file

const BORDER_SEPARATION = 10;

const GLINT_WITH = 120;

const ALPHA_BACKGROUND = 0.8;

// Can I use something to load the size automaticaly?
// Remember glass-frame.png 100x100px

// How to use this component
// Create a component like
/*
    BoxElement: {
        x: 300, // X POS
        y: 250, // Y POS
        w: 550, // Width
        h: 250, // Height
        type: GlassGlintComponent // Type of the component
    }
*/

// You can trigger the glint in two various ways
// BoxElement.isSelected = true | false
// or
// setting the focus on the element

export class BoxTextureComponent extends Lightning.Component {
  /**
   * OdinGlint will show box with a glint (if you need it)
   * 
   * It works by taking an image several times (don't worry it only read it once
   * and the cache do the rest) and slicing in 9 parts. Depending on the size it can
   * not show the borders in order for not to show show nasty effects on it
   * 
   * @class OdinClock
   * @example
   * import { OdinGlint } from from '@odin/glint'

      class App extends Lightning.Application {
        static _template() {
          return {
            BoxGlintElement: {
                x: 0, // X position
                y: 0, // Y position
                w: 550, // Width
                h: 450, // Height,
                isSelected: true, // Element is selected,
                setBackgroundAlpha: 0.2,
                backgroundPadding: 20,
                type: OdinGlint
            }
          }
        }
      }
   */

  /**
   * Setter isSelected
   * @param {boolean} value - if it's selected or not
   */
  set isSelected(value) {
    // Is selected or not
    this.selected = !!value;
    this._isSelected();
  }

  /**
   * Setter setBackgroundAlpha
   * @param {number} value - value of alpha for the background
   *
   * If value is set to 0 the background will not be visible
   */
  set setBackgroundAlpha(value) {
    // Set the alpha of the background
    this.backgroundAlpha = typeof value === 'number' ? value : ALPHA_BACKGROUND;
    this.tag('Interior').alpha = this.backgroundAlpha;

    // And set if we show the background if alpha = 0
    this.tag('Interior').visible = this.backgroundAlpha == 0 ? false : true;
  }

  /**
   * Setter backgroundPadding
   * @param {number} value - padding in pixels of the background
   *
   * Separation of the background to the borders
   */
  set backgroundPadding(value) {
    // Set the padding of the background (distance to the border)

    if (typeof value == 'number') {
      this.backgroundPaddingvalue = value;
      this._interior.patch({
        x: value,
        y: value,
        w: this.w - 2 * this.backgroundPaddingvalue,
        h: this.h - 2 * this.backgroundPaddingvalue,
      });
    }
  }

  /**
   * _states (static method)
   *
   * States of the component
   * Responsibles to change the behaviour of the component
   * when has focus (or not) or if you change the property
   * of selection
   */
  static _states() {
    return [
      class toYesSelected extends this {
        $enter(event) {
          this.tag('Glint').visible = true;
          this._animateSelection(true);
        }
        $exit(event) {
          this._animateSelection(false);
        }
      },
      class toNoSelected extends this {
        $enter(event) {
          this._animateSelection(false);
        }
      },
    ];
  }

  /**
   * _build (Lightning behaviour)
   * Responsible of setting some private methods at build time
   */
  _build() {
    // Addiding this to the build part so it's available from the beginning
    // Lazy me
    this._interior = this.tag('Interior');
    this._borders = this.tag('Borders');
    this._corners = this.tag('Corners');
    this._glint = this.tag('Glint');
  }

  /**
   * _init (Lightning behaviour)
   * Responsible of preparing the component at initialization time
   * - Changes the URL of the images (on test mode)
   * - Populate corners and borders
   * - Show/Hide certain borders
   */
  _init() {
    console.log('GlassGlintComponent initialized!');

    // Get size by the parent!
    const w = this.w;
    const h = this.h;

    // Get position by the parent
    const x = this.x;
    const y = this.y;

    // Test part
    this._imagePrepareForTest('Glint');
    this._imagePrepareForTest('Corners');
    this._imagePrepareForTest('Borders');

    // Populate and paint the component
    this._populateCorners();
    this._populateBorders();

    this._showBorders();
  }

  /**
   * _imagePrepareForTest (Private method)
   * @param {sting} element - name of the element
   *
   * If you are in test mode (cypress) the source of the image will have
   * undefined because Utils is not properly initialiced.
   * This will change to the webpack directory where all your images
   * are copied.
   */
  _imagePrepareForTest(element) {
    // This will change the images from develop to test
    // TODO: Binary tree follow paths!
    this.tag(element).childList.forEach((item) => {
      if (item.texture.src.includes('undefined')) {
        const splitPath = item.texture.src.split('/');
        item.texture.src =
          window.location.protocol +
          '//' +
          window.location.hostname +
          '/static/' +
          splitPath[splitPath.length - 1];
      }
    });
  }

  /**
   * _populateCorners (Private method)
   * @param {number} w - width
   * @param {number} h - height
   *
   * Clip the texture of the corners to the correct size.
   * By default is 50px.
   */
  _populateCorners(w = 50, h = 50) {
    // Image Clip for the corners
    // w, h clip size

    this.tag('CornerUpRight').texture.enableClipping(50 + (50 - w), 0, w, h);
    this.tag('CornerUpLeft').texture.enableClipping(0, 0, w, h);
    this.tag('CornerBottomRight').texture.enableClipping(50 + (50 - w), 50 + (50 - h), w, h);
    this.tag('CornerBottomLeft').texture.enableClipping(0, 50 + (50 - h), w, h);
  }

  /**
   * _populateBorders (Private method)
   *
   * Clip the texture of the borders.
   * By default it uses the constant.
   */
  _populateBorders() {
    // Image Clip for the borders
    this.tag('BorderUp').texture.enableClipping(50, 0, BORDER_WIDTH, BORDER_WIDTH);
    this.tag('BorderBottom').texture.enableClipping(50, 90, BORDER_WIDTH, BORDER_WIDTH);
    this.tag('BorderLeft').texture.enableClipping(0, 50, BORDER_WIDTH, BORDER_WIDTH);
    this.tag('BorderRight').texture.enableClipping(90, 50, BORDER_WIDTH, BORDER_WIDTH);
  }

  /**
   * _showBorders (Private method)
   *
   * Show or hide certain borders if the element is so small that the corners
   * can overlap and will appear some nasty effects
   */
  _showBorders() {
    // This method will hide left and right borders and change the clip of the corners
    let w = 50,
      h = 50;

    // Remove left/right border because height it's to small and we use the part of
    // the clipped image as border
    if (this.h < 2 * BORDER_SIZE) {
      this.tag('BorderLeft').visible = false;
      this.tag('BorderRight').visible = false;

      // Clipping change if needed on the future
      h = this.h / 2 + 1;
    }

    // Remove up/down border because width it's to small and we use the part of
    // the clipped image as border
    if (this.w < 2 * BORDER_SIZE) {
      this.tag('BorderUp').visible = false;
      this.tag('BorderBottom').visible = false;

      // Clipping change if needed on the future
      w = this.w / 2;
    }

    // Border clipping change (not needed now)
    // this._populateCorners(w, h);
  }

  /**
   * _isSelected (Private method)
   *
   * Responsible to change the state to selected or not if
   * you change the property of the element.
   */
  _isSelected() {
    // This method will change the state of the component
    // depending if isSelected property is true or false
    switch (this.selected) {
      case true:
        this._setState('toYesSelected');
        break;
      case false:
        this._setState('toNoSelected');
        break;
    }
  }

  /**
   * _animateSelection (Private method)
   * @param {boolean} isOnOff
   *
   * Responsible of showing the animation when selected or not selected
   */
  _animateSelection(isOnOff) {
    // Method that creates the animation
    // isOnOff: true | false (boolean)

    // On animation
    const action_on = [
      {
        p: 'alpha',
        v: {
          0: 0,
          0.3: 1,
          0.5: 0.8,
          1: 0.8,
        },
      },
    ];

    // Off animation
    const action_off = [
      {
        p: 'alpha',
        v: {
          0: 0.8,
          0.3: 1,
          0.6: 0,
          1: 0,
        },
      },
    ];

    let actionToDo = !!isOnOff ? action_on : action_off;

    this.tag('Glint')
      .animation({
        duration: 1.5,
        repeat: 0,
        actions: actionToDo,
      })
      .play();
  }

  /**
   * _focus (Lightning behaviour)
   *
   * Responsible when the component has focus
   */
  _focus() {
    // If the component get focus
    this._setState('toYesSelected');
  }

  /**
   * _unfocus (Lightning behaviour)
   *
   * Responsible when the component loose focus
   */
  _unfocus() {
    // If the component loose focus
    this._setState('toNoSelected');
  }

  /**
   * _template (static method)
   * Template of the element
   */
  static _template() {
    return {
      Box: {
        x: 0,
        y: 0,
        w: (w) => w - (BORDER_SIZE - BORDER_WIDTH), // Recalculate the size because of borders
        h: (h) => h - BORDER_SIZE, // Recalculate the size because of borders
        Interior: {
          x: BORDER_SEPARATION, //BORDER_WIDTH,
          y: BORDER_SEPARATION, //BORDER_WIDTH,
          w: (w) => w + BORDER_SIZE - BORDER_WIDTH / 2 - 2 * BORDER_SEPARATION,
          h: (h) => h + BORDER_SIZE - BORDER_WIDTH / 2 - 2 * BORDER_SEPARATION,
          zIndex: 0, // set on top
          alpha: ALPHA_BACKGROUND,
          visible: true,
          rect: true,
          color: 0xff000000,
        },
        Corners: {
          x: 0,
          y: 0,
          w: (w) => w,
          h: (h) => h,
          CornerUpRight: {
            x: (w) => w,
            y: 0,
            texture: {
              type: Lightning.textures.ImageTexture,
              src: Utils.asset('glint/300.jpg'),
            },
          },
          CornerUpLeft: {
            x: 0,
            y: 0,
            texture: {
              type: Lightning.textures.ImageTexture,
              src: Utils.asset('glint/300.jpg'),
            },
          },
          CornerBottomRight: {
            x: (w) => w,
            y: (h) => h,
            texture: {
              type: Lightning.textures.ImageTexture,
              src: Utils.asset('glint/300.jpg'),
            },
          },
          CornerBottomLeft: {
            x: 0,
            y: (h) => h,
            texture: {
              type: Lightning.textures.ImageTexture,
              src: Utils.asset('glint/300.jpg'),
            },
          },
        },
        Borders: {
          x: 0,
          y: 0,
          w: (w) => w,
          h: (h) => h,
          BorderUp: {
            x: 0 + BORDER_SIZE,
            y: 0,
            w: (w) => w - BORDER_SIZE,
            h: BORDER_WIDTH,
            texture: {
              type: Lightning.textures.ImageTexture,
              src: Utils.asset('glint/300.jpg'),
            },
          },
          BorderBottom: {
            x: 0 + BORDER_SIZE,
            y: (h) => h + BORDER_SIZE - BORDER_WIDTH,
            w: (w) => w - BORDER_SIZE,
            h: BORDER_WIDTH,
            texture: {
              type: Lightning.textures.ImageTexture,
              src: Utils.asset('glint/300.jpg'),
            },
          },
          BorderLeft: {
            x: 0,
            y: 0 + BORDER_SIZE,
            w: BORDER_WIDTH,
            h: (h) => h - BORDER_SIZE,
            texture: {
              type: Lightning.textures.ImageTexture,
              src: Utils.asset('glint/300.jpg'),
            },
          },
          BorderRight: {
            x: (w) => w + BORDER_SIZE - BORDER_WIDTH,
            y: BORDER_SIZE,
            w: BORDER_WIDTH,
            h: (h) => h - BORDER_SIZE,
            texture: {
              type: Lightning.textures.ImageTexture,
              src: Utils.asset('glint/300.jpg'),
            },
          },
        },
        Glint: {
          x: 0,
          y: 0,
          w: (w) => w,
          h: (h) => h,
          visible: false,
          TopGlint: {
            x: (w) => w / 2 - GLINT_WITH,
            y: 0 - 25, // Glint is not on the center of the img
            texture: {
              type: Lightning.textures.ImageTexture,
              src: Utils.asset('glint/400.jpg'),
            },
          },
          BottomGlint: {
            x: (w) => w / 2 - GLINT_WITH,
            y: (h) => h + 20, // Glint is not on the center of the img
            texture: {
              type: Lightning.textures.ImageTexture,
              src: Utils.asset('glint/400.jpg'),
            },
          },
        },
      },
    };
  }
}
