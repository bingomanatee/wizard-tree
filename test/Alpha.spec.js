/* eslint-disable camelcase */
const tap = require('tap');
const p = require('../package.json');

// note - we test the built artifact
const { Alpha } = require('../lib/index');

tap.test(p.name, (suite) => {
  suite.test('Alpha', (testAlpha) => {
    testAlpha.end();
  });

  suite.end();
});
