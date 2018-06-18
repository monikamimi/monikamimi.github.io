const fs = require("fs");
const path = require("path");
const mkdirp = require("mkdirp");
const sharp = require("sharp");

const dirs = [{src: "../img/portfolio/all", thumb: "../img/portfolio/thumbnails/all", optimized: "../img/portfolio/optimized/all"}];

dirs.forEach(dir => {
  fs.readdir(dir.src, (err, files) => {
    mkdirp.sync(dir.thumb);
    files.forEach(file => {
      sharp(path.join(dir.src, file))
      .resize(462, 250)
      .max()
      .toFile(path.join(dir.thumb, file))
    });
  })
});


dirs.forEach(dir => {
  fs.readdir(dir.src, (err, files) => {
    mkdirp.sync(dir.optimized);
    files.forEach(file => {
      sharp(path.join(dir.src, file))
      .resize(1900, 1080)
      .max()
      .toFile(path.join(dir.optimized, file))
    });
  })
});