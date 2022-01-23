#  dawsin.dev

To see the actual site itself go to [dawsin.dev](https://dawsin.dev/), or [docs.dawsin.dev](https://docs.dawsin.dev/) for API documentation.

## Overview

This site is built using [React](https://reactjs.org/) and [Typescript](https://www.typescriptlang.org/) as the framework. A few libraries are used, most importantly [React Three Fiber](https://github.com/pmndrs/react-three-fiber) for creation of 3D scenes, [Zustand](https://github.com/pmndrs/zustand) for state management, [Styled Components](https://styled-components.com/) for CSS-in-JS, [Euphony](https://github.com/dawsinb/euphony) for audio management, and [React Spring](https://github.com/pmndrs/react-spring) is used for the handling of some animations. 

Testing is done via [Jest](https://jestjs.io/) and [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/) for unit testing, and [ESLint](https://eslint.org/) for static analysis.

As for the build process [Babel](https://babeljs.io/) and [Webpack](https://webpack.js.org/) are used for transpiling and bundling respectively, and [Express](https://expressjs.com/) is used for the backend.

The codebase is well commented and API documentation is automatically generated using [Typedoc](https://typedoc.org/), but this site uses a few advanced techniques that are worth covering.

## Loading

Loading is handled differently than a regular website and even other Three.js sites. A couple different techniques are used to optimize load times and even display accurate loading progress. But, as a tradeoff for the additional speed and functionality there is added complexity and overhead to be aware of.

### Load Screen

To handle load screen progress a script seperate from the webpack bundle is loaded immediately. This script loads an asset map that is generated on build from all files in the `/public/assets` directory, which contains a mapping from all asset urls to their size. The asset map is used to calculate the total amount of bytes needed to be loaded, and check how many bytes to progress whenever an asset gets loaded.

In order to know when assets are loaded an event listener is set up to listen to a custom `assetLoad` event which must be implemented by all loaders (*see the loaders section below for more information*). This event is fired once an asset is loaded and contains the url of the asset as the event detail. The url is checked using the asset map to get the file size and increment the progress.

*There are a few caveats to this approach, however...*

Most importantly, ***do not*** have unused assets in the assets folder as this will cause the the load handler to expect more assets to be loaded than actually are and never clear the load screen. This can also happen if you have an asset that is loaded without firing an `assetLoad` event, as the load handler will never know the asset was loaded.

Furthermore, if you are reusing an asset it is important to keep in mind that the asset loader expects an *exact* amount of bytes. Firing multiple `assetLoad` events for a single url will cause the progress to overflow and the load screen will never clear. This is to ensure files are being correctly cached by loaders.

As such, all loading should be handled by a properly implemented loader. If you need to have a bit more freedom in loading for testing or prototyping purposes you can temporarily place assets in a different folder, but all loading should be properly handled for production.

### Loaders

A proprietary load handler neccessitates proprietary loaders. In this case a loader must do three things:

1. Fire an `assetLoad` event with the url of the asset as the detail once an asset has finished loading
2. Cache assets to prevent an asset from being processed multiple times
3. In addition to caching maintain a list of pending assets to prevent multiple fetchs being started

Because fetching is an asynchronous option loaders should be implemented as async functions that return a promise which resolves to the requested asset.

Most assets you would need already have loader implementations, but if you have to implement your own make sure it fulfills the above criteria. Here is a list of implemented loaders and their respective file formats:

| <div style="width:120px">Loader</div> | <div style="width:110px">File Format(s)</div> | <div style="width:150px">Used For</div>              | Notes |
| ------------------------------------- | :-------------------------------------------: | :--------------------------------------------------: | ----- |
| `loadTexture`                         | KTX 2.0<br> [`.ktx2`]                         | Textures                                             | KTX 2.0 (Khronos Texture 2.0) is a compression algorithm and file format for GPU textures. Use this for importing textures instead of `.jpg` or `.png` files.<br><br> *See: [github.com/KhronosGroup/KTX-Software](https://github.com/KhronosGroup/KTX-Software) for more information* |
| `loadGeometry`                        | Draco<br> [`.drc`]                            | Geometries                                           | Draco is a compression algorithm and file format for 3D geometries. Use this for importing 3D models instead of `.obj` or `.ply` files.<br><br> *See: [github.com/google/draco](https://github.com/google/draco) for more information* |
| `loadFont`                            | 3D Font<br> [`.json`]                         | 3D Text Geometries                                   | Font JSONs are generated from `.ttf` or `.otf` files through [Facetype.js](https://gero3.github.io/facetype.js/). Make sure to restrict the character set to only those you need in order to save space. |
| `loadSvg`                             | SVG<br> [`.svg`]                              | SVG Geometries                                       | Generates a geometry from an SVG file

## Mixing WebGL and HTML

The 3D content rendered in a canvas element is seperate from the regular HTML dom which poses a few problems to getting regular HTML content onto the canvas.

### Projecting HTML Content

Since HTML elements can't be rendered in a canvas we have to portal the elements to a new render tree outside of the WebGL render tree. This is done by creating a root with the id `three-html-root` om the HTML body and creating a new sub root under that for each HTML component. In order to line up with the WebGL canvas the world coordinates of the parent are read and the HTML is then projected to the correct position using CSS transforms.

### Scrolling

Because there isn't really a dom scrolling must be handled manually. This allows for interactivity with the WebGL canvas while maintaining the ability to scroll. Custom event handlers are registered via the `ScrollHandler` component which handles both mouse and touch scrolling. The scroll position is kept as a number in the global store with each whole number representing a full page scroll.

The scroll store can be accessed via `useScroll`, or a transient subscription can be set up with the `useTransientScroll` hook. A transient subscription is useful as it allows the scroll position to be tracked without causing a rerender.

## Acknowledgements

A huge shoutout to the team at [Poimandres](https://github.com/pmndrs) for their suite of libraries that were used in the making of this app. And a particular shoutout to this [demo](https://codesandbox.io/s/moksha-f1ixt) which served as the inspiration for the theme.