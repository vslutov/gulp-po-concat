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

  it('should be able to force a single domain via a string', function (done) {
    var stream = concat({
      domain: 'messages'
    });

    stream.on('error', done);
    stream.on('data', function (file) {
      path.basename(file.path).should.equal('messages.pot');
      file.contents.toString().should.equal(byehiPOT);
      done();
    });

    stream.write(new File({
      cwd: __dirname,
      base: __dirname,
      path: path.join(__dirname, 'hi.pot'),
      contents: new Buffer(hiPOT)
    }));
    stream.write(new File({
      cwd: __dirname,
      base: __dirname,
      path: path.join(__dirname, 'bye.pot'),
      contents: new Buffer(byePOT)
    }));
    stream.end();
  });

  it('should be able to force a domain via a function', function (done) {
    var stream = concat({
      domain: function (file) {
        return path.basename(file.path) + '-override';
      }
    });

    stream.on('error', done);
    stream.once('data', function (file) {
      path.basename(file.path).should.equal('messages1.pot-override.pot');
      file.contents.toString().should.equal(hiPOT);

      stream.on('data', function (file) {
        path.basename(file.path).should.equal('messages2.pot-override.pot');
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
