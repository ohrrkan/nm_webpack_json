const path = require("path");


function process(key, value) {
  if (key === 'src') {
    return `require('${value}')\n`;
  }
}

function recObject(o, func) {

  var img_all = "";
  var tab = [];
  var ret;

  for (var i in o) {
    ret = func(i, o[i]);
    if (ret && !tab.includes(ret)) {
      tab.push(ret);
    }
    if (o[i] !== null && typeof (o[i]) == "object") {
      img_all += recObject(o[i], func);
    }
  }
  return img_all + tab.join("");
}

function getImageFromJson(json) {
  return recObject(json, process);
}

function parseJSON(content) {
  try {
    return JSON.parse(content);
  } catch (error) {
    console.error(error);
  }
}

module.exports = {
  getImageFromJson,
  parseJSON,
};