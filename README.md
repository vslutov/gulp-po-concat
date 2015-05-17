# [gulp](http://gulpjs.com)-po-concat

> Concatenate PO files

## Install

Install with [npm](https://npmjs.org/package/gulp-po-concat)

```sh
npm install --save-dev gulp-po-concat
```

## Example

```js
var gulp = require('gulp');
var poConcat = require('gulp-po-concat');
var xgettextHbs = require('gulp-xgettext-handlebars');
var xgettextJs = require('gulp-xgettext-js-more-better');
var merge = require('event-stream').merge;

gulp.task('pot', function () {
    return merge(
            gulp.src(['**/*.hbs'])
                .pipe(xgettextHbs()),
            gulp.src(['**/*.js'])
                .pipe(xgettextJs()))
        .pipe(poConcat())
        .pipe(gulp.dest('po/'));
});
```
