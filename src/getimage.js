const { getImageFromJson, parseJSON } = require("./utils");

module.exports = function (json) {
  return getImageFromJson(parseJSON(json));
};
