const fs = require("fs");
const path = require("path");
const mkdirp = require("mkdirp");
var sizeOf = require("image-size");
const sharp = require("sharp");
var watermark = require('image-watermark');

const DIRS = [
  {
    src: "../img/portfolio/all",
    narrowThumb: "../img/portfolio/thumbnails/narrow/all",
    wideThumb: "../img/portfolio/thumbnails//wide/all",
    optimized: "../img/portfolio/optimized/all"
  }
];
const ASPECT_RATIO = 16 / 10;
const GENERATE_WATERMARKS = true;

DIRS.forEach(dir => {
  mkdirp.sync(dir.wideThumb);
  mkdirp.sync(dir.narrowThumb);

  fs.readdir(dir.src, (err, files) => {
    files.forEach(file => {
      let srcPath = path.join(dir.src, file);
      let dimensions = sizeOf(srcPath);
      let aspectSize = dimensions.width / dimensions.height;

      let resizeParam =
        aspectSize > ASPECT_RATIO
          ? { width: 466, height: null }
          : { width: null, height: 240 };

      let destPath =
        aspectSize > ASPECT_RATIO ? dir.wideThumb : dir.narrowThumb;
      let destFullPath = path.join(destPath, file);

      console.log(`Generating thumbnail in ${destFullPath}`);
      sharp(srcPath)
        .resize(resizeParam.width, resizeParam.height)
        .max()
        .toFile(destFullPath, () => embedWatermark(destFullPath));
    });
  });
});

DIRS.forEach(dir => {
  mkdirp.sync(dir.optimized);

  fs.readdir(dir.src, (err, files) => {
    files.forEach(file => {
      let destFullPath = path.join(dir.optimized, file);
      console.log(`Generating optimized image in ${destFullPath}`);
      sharp(path.join(dir.src, file))
        .resize(1900, 1080)
        .max()
        .toFile(destFullPath, () => embedWatermark(destFullPath));
    });
  });
});

function embedWatermark(path) {
  if (GENERATE_WATERMARKS) {
    watermark.embedWatermark(path, {
      'text': 'www.uroczaja.pl',
      'override-image': true,
    });
  }
}