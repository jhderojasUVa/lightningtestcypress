# BoxTextureComponent

I like kittens, you like kittens. Who doesn't like kittens!

## Usage

```js
class App extends Lightning.Application {
  static _template() {
    return {
      BoxWithKittens: {
          x: 0, // X position
          y: 0, // Y position
          w: 550, // Width
          h: 450, // Height,
          isSelected: true, // Element is selected,
          setBackgroundAlpha: 0.2,
          backgroundPadding: 20,
          type: BoxTextureComponent
      }
    }
  }
}
```