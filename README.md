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

## Options

### `domain`

PoConcat's default behavior is to assign messages to a domain that matches the
file's name. You can optionally request poConcat to force all messages to use a
specified domain by setting the `domain` attribute in the options object.

```js
gulp.src('**/*.js')
    .pipe(xgettextJs())
    .pipe(poConcat({ domain: "messages" }))
    .pipe(gulp.dest('po/'));
```

The above example concat all found strings into a single domain/file of "messages"

You may also pass a function which receives a file object to name the domain:

```js
var path = require('path');
gulp.src('**/*.js')
    .pipe(xgettextJs())
    .pipe(poConcat({
      domain: function(file) {
        return path.basename(file.path, '.pot');
      }
    }))
    .pipe(gulp.dest('po/'));
```

The above is the current default behavior.
