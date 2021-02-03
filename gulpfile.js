const gulp = require("gulp");
const htmlInclude = require("gulp-html-tag-include");
const sass = require("gulp-sass");
const autoprefixer = require("gulp-autoprefixer");
const concat = require("gulp-concat");
const terser = require("gulp-terser");
const browserSync = require("browser-sync");

gulp.task("bs-reload", (done) => {
  browserSync.reload();
  done();
});

gulp.task("html", () =>
  gulp
    .src("src/html/**.html")
    .pipe(htmlInclude())
    .pipe(gulp.dest("public"))
    .pipe(browserSync.reload({ stream: true }))
);

gulp.task("images", () =>
  gulp.src("src/images/**/*").pipe(gulp.dest("public/images"))
);

gulp.task("css", () =>
  gulp
    .src("src/styles/**/*.scss")
    .pipe(sass({ outputStyle: "nested" }))
    .pipe(autoprefixer({ cascade: false }))
    .pipe(gulp.dest("public/styles"))
    .pipe(browserSync.stream())
);

gulp.task("js", () =>
  gulp
    .src("src/js/**/*.js")
    .pipe(concat("main.js"))
    .pipe(
      terser({
        format: {
          beautify: true,
        },
      })
    )
    .pipe(gulp.dest("public/js"))
    .pipe(browserSync.stream())
);

gulp.task("html-dist", () =>
  gulp.src("src/html/**.html").pipe(htmlInclude()).pipe(gulp.dest("docs"))
);

gulp.task("images-dist", () =>
  gulp.src("src/images/**/*").pipe(gulp.dest("docs/images"))
);

gulp.task("css-dist", () =>
  gulp
    .src("src/styles/**/*.scss")
    .pipe(sass({ outputStyle: "compressed" }))
    .pipe(autoprefixer({ cascade: false }))
    .pipe(gulp.dest("docs/styles"))
);

gulp.task("js-dist", () =>
  gulp
    .src("src/js/**/*.js")
    .pipe(concat("main.js"))
    .pipe(terser())
    .pipe(gulp.dest("docs/js"))
);

gulp.task(
  "docs",
  gulp.parallel("html-dist", "images-dist", "css-dist", "js-dist")
);

gulp.task("default", () => {
  browserSync.init({
    server: {
      baseDir: "./public/",
    },
  });

  gulp.watch("src/html/**/*.html", gulp.series("html", "bs-reload"));
  gulp.watch("src/styles/**/*.scss", gulp.series("css", "bs-reload"));
  gulp.watch("src/js/**/*.js", gulp.series("js", "bs-reload"));
});
