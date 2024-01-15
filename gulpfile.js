// gulpfile.js
const gulp = require("gulp");
const inlineSource = require("gulp-inline-source");
const replace = require("gulp-replace");
const cheerio = require("gulp-cheerio");

gulp.task("default", () => {
  return gulp
    .src("./build/*.html")
    .pipe(
      cheerio(($) => {
        const scriptTag = $("script[defer]");
        $("body").append(scriptTag);
      })
    )
    .pipe(replace('.js"></script>', '.js" inline></script>'))
    .pipe(replace('rel="stylesheet">', 'rel="stylesheet" inline>'))
    .pipe(
      inlineSource({
        compress: false,
        ignore: ["png"],
      })
    )
    .pipe(gulp.dest("./build"));
});