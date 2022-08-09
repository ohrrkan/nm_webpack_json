# nm_webpack_json

Webpack loader to load image from Json. Work also with webmanifest file as it is JSON format.

- Compatible with webpack >5 only
- No dependency.

## Getting Started

```console
npm install -D nm_webpack_json
```

Then add your image under "src" key in your json. The src keys can be deep as you want in the json tree as the parser is recursive. 

#### test.json
```json
{
  "name": "my_json",
  "src" : "/img/42.png",
  "icons": [
    {
        "name": "helloworld",
        "src": "/img/helloworld.png",
    }
  ]
}
```

OR 

#### manifest.webmanifest
```json
{
  "name": "my_webmanifest",
  "icons": [
    {
      "src": "/images/touch/homescreen48.png",
      "sizes": "48x48",
      "type": "image/png"
    }
  ]
}
```
Then add the loader to your webpack config. For example:

#### webpack.config.js
```js
module.exports = {
  module: {
    rules: [
        {
            test: /\.(png|svg|webp|jpg|jpeg)$/i,
            type: 'asset/resource',
        },
        {
            test: /\.webmanifest$/i,
            use: 'nm_webpack_json',
            type: 'asset/resource',
        },
        {
            test: /\.json$/i,
            use: 'nm_webpack_json',
            type: 'asset/resource',
        }
    ],
  },
};
```

With the default options, the example above will create a `[name].[hash][ext][query]` file in the output directory for the build.

#### Credits
This package was inspired by the webpack-webmanifest-loader