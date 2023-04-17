const stylus = require('stylus');

const css = stylus(`html
  color red`).render();

console.log(css);
