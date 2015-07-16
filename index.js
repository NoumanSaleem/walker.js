'use strict';

var defaults = {
  concurrency: 2,
  delay: 1000,
  start: '/'
};

var _ = require('lodash');
var argv = require('yargs').argv;
var config = _.defaults(argv, defaults);
var fs = require('fs');
var async = require('async');
var chalk = require('chalk');
var request = require('request');
var url = require('url');
var debug = require('debug');

var matched = [];
var errors = [];
var walkCount = 0;

var excludePatterns = _.isString(config.exclude) ? config.exclude.split(',').map(function (re) { return new RegExp(re); }) : [];

var log = debug('walker:success');
var logError = debug('walker:error');

var q = async.queue(function (obj, cb) {
  request(url.resolve(config.host, obj.to), _.partial(_.delay, _.partial(cb, obj), config.delay));
}, config.concurrency);

function writeErrors() {
  if (config.output) fs.writeFileSync(config.output, JSON.stringify(errors));
}

function processResponse(obj, err, res, body) {
  var re = /href=[\'"](\/(?!\/)[^\'" >]+)/g;
  var logger = res.statusCode === 200 ? log : logError;
  var matches = [];
  var match;

  walkCount++;

  while (match = re.exec(body)) {
    matches.push(match[1]);
  }

  matches = _.chain(matches)
    .unique()
    .filter(_.negate(_.partial(_.contains, matched)))
    .value();

  if (excludePatterns.length) {
    matches = matches.filter(function (path) {
      return !excludePatterns.some(function (re) { return re.test(path); });
    });
  }

  matched = matched.concat(matches);

  q.push(matches.map(function (to) {
    return {
      from: obj.to,
      to: to
    };
  }), processResponse);

  logger('Walked %s from %s, statusCode: %s, discovered %d new links', obj.to, obj.from, chalk[res.statusCode === 200 ? 'green' : 'red'](res.statusCode), matches.length);

  if (res.statusCode !== 200) errors.push(_.extend({}, obj, { statusCode: res.statusCode }));
}

process.on('exit', function () {
  console.log('Process exited. Walked %d and captured %d errors.', walkCount, errors.length);
  writeErrors();
});

process.on('SIGINT', function () {
  process.exit();
});

q.drain = function() {
  console.log('Queue Empty');
};

q.push({ to: config.start }, processResponse);
