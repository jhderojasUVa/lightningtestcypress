import { Lightning, Utils } from 'wpe-lightning-sdk';

const BORDER_WIDTH = 10; // Respect the image file
const BORDER_SIZE = 50; // Respect the image file

const BORDER_SEPARATION = 10;

const GLINT_WITH = 120;

const ALPHA_BACKGROUND = 0.8;

export class BoxTextureComponent extends Lightning.Component {

  set isSelected(value) {
    // Is selected or not
    this.selected = !!value;
    this._isSelected();
  }

  set setBackgroundAlpha(value) {
    // Set the alpha of the background
    this.backgroundAlpha = typeof value === 'number' ? value : ALPHA_BACKGROUND;
    this.tag('Interior').alpha = this.backgroundAlpha;

    // And set if we show the background if alpha = 0
    this.tag('Interior').visible = this.backgroundAlpha == 0 ? false : true;
  }

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

  _build() {
    // Addiding this to the build part so it's available from the beginning
    this._interior = this.tag('Interior');
    this._borders = this.tag('Borders');
    this._corners = this.tag('Corners');
    this._glint = this.tag('Glint');
  }

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

  _imagePrepareForTest(element) {
    // This will change the images from develop to test
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

  _populateCorners(w = 50, h = 50) {
    // Image Clip for the corners
    // w, h clip size

    this.tag('CornerUpRight').texture.enableClipping(50 + (50 - w), 0, w, h);
    this.tag('CornerUpLeft').texture.enableClipping(0, 0, w, h);
    this.tag('CornerBottomRight').texture.enableClipping(50 + (50 - w), 50 + (50 - h), w, h);
    this.tag('CornerBottomLeft').texture.enableClipping(0, 50 + (50 - h), w, h);
  }

  _populateBorders() {
    // Image Clip for the borders
    this.tag('BorderUp').texture.enableClipping(50, 0, BORDER_WIDTH, BORDER_WIDTH);
    this.tag('BorderBottom').texture.enableClipping(50, 90, BORDER_WIDTH, BORDER_WIDTH);
    this.tag('BorderLeft').texture.enableClipping(0, 50, BORDER_WIDTH, BORDER_WIDTH);
    this.tag('BorderRight').texture.enableClipping(90, 50, BORDER_WIDTH, BORDER_WIDTH);
  }

  _showBorders() {
    // This method will hide left and right borders and change the clip of the corners
    let w = 50,
      h = 50;

    // Remove left/right border because height it's to small and we use the part of
    if (this.h < 2 * BORDER_SIZE) {
      this.tag('BorderLeft').visible = false;
      this.tag('BorderRight').visible = false;

      // Clipping change if needed on the future
      h = this.h / 2 + 1;
    }

    // Remove up/down border because width it's to small and we use the part of
    if (this.w < 2 * BORDER_SIZE) {
      this.tag('BorderUp').visible = false;
      this.tag('BorderBottom').visible = false;

      // Clipping change if needed on the future
      w = this.w / 2;
    }
  }

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
  }

  _focus() {
    // If the component get focus
    this._setState('toYesSelected');
  }

  _unfocus() {
    // If the component loose focus
    this._setState('toNoSelected');
  }

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
              src: Utils.asset('kitty/300.jpg'),
            },
          },
          CornerUpLeft: {
            x: 0,
            y: 0,
            texture: {
              type: Lightning.textures.ImageTexture,
              src: Utils.asset('kitty/300.jpg'),
            },
          },
          CornerBottomRight: {
            x: (w) => w,
            y: (h) => h,
            texture: {
              type: Lightning.textures.ImageTexture,
              src: Utils.asset('kitty/300.jpg'),
            },
          },
          CornerBottomLeft: {
            x: 0,
            y: (h) => h,
            texture: {
              type: Lightning.textures.ImageTexture,
              src: Utils.asset('kitty/300.jpg'),
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
              src: Utils.asset('kitty/300.jpg'),
            },
          },
          BorderBottom: {
            x: 0 + BORDER_SIZE,
            y: (h) => h + BORDER_SIZE - BORDER_WIDTH,
            w: (w) => w - BORDER_SIZE,
            h: BORDER_WIDTH,
            texture: {
              type: Lightning.textures.ImageTexture,
              src: Utils.asset('kitty/300.jpg'),
            },
          },
          BorderLeft: {
            x: 0,
            y: 0 + BORDER_SIZE,
            w: BORDER_WIDTH,
            h: (h) => h - BORDER_SIZE,
            texture: {
              type: Lightning.textures.ImageTexture,
              src: Utils.asset('kitty/300.jpg'),
            },
          },
          BorderRight: {
            x: (w) => w + BORDER_SIZE - BORDER_WIDTH,
            y: BORDER_SIZE,
            w: BORDER_WIDTH,
            h: (h) => h - BORDER_SIZE,
            texture: {
              type: Lightning.textures.ImageTexture,
              src: Utils.asset('kitty/300.jpg'),
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
            y: 0 - 25, // kitty is not on the center of the img
            texture: {
              type: Lightning.textures.ImageTexture,
              src: Utils.asset('kitty/400.jpg'),
            },
          },
          BottomGlint: {
            x: (w) => w / 2 - GLINT_WITH,
            y: (h) => h + 20, // kitty is not on the center of the img
            texture: {
              type: Lightning.textures.ImageTexture,
              src: Utils.asset('kitty/400.jpg'),
            },
          },
        },
      },
    };
  }
}
