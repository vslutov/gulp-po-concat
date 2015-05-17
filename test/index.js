'use strict';

var concat = require('..');
var File = require('gulp-util').File;
var fs = require('fs');
var path = require('path');
require('should');

var hiPOT = fs.readFileSync(__dirname + '/fixtures/hi.pot', {encoding: 'utf8'});
var byePOT = fs.readFileSync(__dirname + '/fixtures/bye.pot', {encoding: 'utf8'});
var byehiPOT = fs.readFileSync(__dirname + '/fixtures/bye_hi.pot', {encoding: 'utf8'});

describe('gulp-po-concat', function () {
  it('should work on one file', function (done) {
    var stream = concat();
    stream.on('error', done);
    stream.on('data', function (file) {
      file.contents.toString().should.equal(hiPOT);
      done();
    });

    stream.write(new File({
      cwd: __dirname,
      base: __dirname,
      path: path.join(__dirname, 'messages.pot'),
      contents: new Buffer(hiPOT)
    }));
    stream.end();
  });

  it('should work on two files', function (done) {
    var stream = concat();
    stream.on('error', done);
    stream.on('data', function (file) {
      file.contents.toString().should.equal(byehiPOT);
      done();
    });

    stream.write(new File({
      cwd: __dirname,
      base: __dirname,
      path: path.join(__dirname, 'messages.pot'),
      contents: new Buffer(hiPOT)
    }));
    stream.write(new File({
      cwd: __dirname,
      base: __dirname,
      path: path.join(__dirname, 'messages.pot'),
      contents: new Buffer(byePOT)
    }));
    stream.end();
  });

  it("shouldn't combine messages from different domains", function (done) {
    var stream = concat();
    stream.on('error', done);
    stream.once('data', function (file) {
      file.contents.toString().should.equal(hiPOT);

      stream.on('data', function (file) {
        file.contents.toString().should.equal(byePOT);
        done();
      });
    });

    stream.write(new File({
      cwd: __dirname,
      base: __dirname,
      path: path.join(__dirname, 'messages1.pot'),
      contents: new Buffer(hiPOT)
    }));
    stream.write(new File({
      cwd: __dirname,
      base: __dirname,
      path: path.join(__dirname, 'messages2.pot'),
      contents: new Buffer(byePOT)
    }));
    stream.end();
  });
});
