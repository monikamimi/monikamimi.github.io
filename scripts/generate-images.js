const fs = require("fs");
const path = require("path");
const mkdirp = require("mkdirp");
var sizeOf = require("image-size");
const sharp = require("sharp");
var watermark = require('image-watermark');

const DIRS = [
  {
    src: "../_raw_img/portfolio/all",
    dest: "../img/portfolio/all"
  }
];
const ASPECT_RATIO = 16 / 9;
const GENERATE_WATERMARKS = true;

DIRS.forEach(dir => {
  let { narrowThumbDir, wideThumbDir } = prepareThumbnailsDirs(dir.dest);
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
        aspectSize > ASPECT_RATIO ? wideThumbDir : narrowThumbDir;
      let destFullPath = path.join(destPath, file);

      console.log(`Generating thumbnails`);
      sharp(srcPath)
        .resize(resizeParam.width, resizeParam.height)
        .max()
        .toFile(destFullPath, () => embedWatermark(destFullPath));
    });
  });
});

DIRS.forEach(dir => {
  let { narrowOptimizedDir, wideOptimizedDir } = prepareOptimizedDirs(dir.dest);

  fs.readdir(dir.src, (err, files) => {
    files.forEach(file => {
      let srcPath = path.join(dir.src, file);
      let dimensions = sizeOf(srcPath);
      let aspectSize = dimensions.width / dimensions.height;

      let destPath =
        aspectSize > ASPECT_RATIO ? wideOptimizedDir : narrowOptimizedDir;
      let destFullPath = path.join(destPath, file);

      console.log(`Generating optimized image in`);
      sharp(path.join(dir.src, file))
        .resize(1900, 1080)
        .max()
        .toFile(destFullPath, () => embedWatermark(destFullPath));
    });
  });
});

function prepareThumbnailsDirs(destDir) {
  let narrowThumbDir = path.join(destDir, "narrow/thumbnails/");
  let wideThumbDir = path.join(destDir, "wide/thumbnails/");
  mkdirp.sync(narrowThumbDir);
  mkdirp.sync(wideThumbDir);
  return { narrowThumbDir, wideThumbDir };
}

function prepareOptimizedDirs(destDir) {
  let narrowOptimizedDir = path.join(destDir, "narrow/optimized/");
  let wideOptimizedDir = path.join(destDir, "wide/optimized/");
  mkdirp.sync(narrowOptimizedDir);
  mkdirp.sync(wideOptimizedDir);
  return { narrowOptimizedDir, wideOptimizedDir };
}

function embedWatermark(path) {
  if (GENERATE_WATERMARKS) {
    watermark.embedWatermark(path, {
      'text': 'www.uroczaja.pl',
      'override-image': true,
    });
  }
}