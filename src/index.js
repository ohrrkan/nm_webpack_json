const path = require("path");
const { parseJSON } = require("./utils");

function edit_json(o, data, context) {
  for (var i in o) {
    if (i === 'src')
      o[i] = data[path.basename(o[i])];
    if (o[i] !== null && typeof (o[i]) == "object") {
      edit_json(o[i], data, context);
    }
  }
}

module.exports = function (source) {
  source = parseJSON(source, this);

  if (this.data && this.data.assets)
    edit_json(source, this.data.assets, this.context)


  return JSON.stringify(source);
};

module.exports.pitch = function (request) {
  const { webpack } = this._compiler;
  const { EntryPlugin } = webpack;
  const callback = this.async();

  const webmanifestContext = {};
  webmanifestContext.options = {
    filename: "*",
  };

  webmanifestContext.compiler = this._compilation.createChildCompiler(
    `imagefromjson-loader ${request}`,
    webmanifestContext.options
  );

  new EntryPlugin(
    this.context,
    `${this.resourcePath}.webpack[javascript/auto]!=!${path.resolve(
      __dirname,
      "./getimage.js"
    )}!${request}`,
    path.parse(this.resourcePath).name
  ).apply(webmanifestContext.compiler);

  const hookOptions = {
    name: `imagefromjson-loader ${request}`,
    stage: Infinity,
  };

  webmanifestContext.compiler.hooks.thisCompilation.tap(
    hookOptions,
    (compilation) => {
      compilation.hooks.chunkAsset.tap(hookOptions, (chunk) => {
        chunk.files.forEach((file) => {
          compilation.deleteAsset(file);
        });
      });
    }
  );

  webmanifestContext.compiler.runAsChild((error, entries, compilation) => {
    if (error) {
      callback(new Error(error));
    }

    const { assets } = compilation.getStats().toJson();
    this.data.assets = {};

    for (const asset of assets) {
      if (asset.info && asset.info.sourceFilename) {
        this.data.assets[path.basename(asset.info.sourceFilename)] = asset.name;
      }
    }

    callback();
  });
};
