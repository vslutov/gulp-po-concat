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

gulp-po-concat's default behavior is to assign all messages to a domain that matches the
file's name. For example, all messages in a file named `messages.pot` would be assigned
to domain `messages`. Use the `domain` option to customize this behavior.

You can force all messages, regardless of filename, to use a given domain by passing a string to the `domain` option:
```js
gulp.src('**/*.js')
    .pipe(xgettextJs())
    .pipe(poConcat({ domain: 'messages' }))
    .pipe(gulp.dest('po/'));
```
This is useful when you don't care about domains and just want to concatenate a
bunch of PO files.

You can also customize the domain *per file* by passing a function. This
function is passed a [vinyl file object](https://github.com/wearefractal/vinyl)
and should return a string representing the domain for said file. Here's how
you'd use this to implement the default behavior of calculating domains based
on a file's name:
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
