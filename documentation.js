const documentation = require('documentation');
const fs = require('fs');

documentation.build(['src/Alpha.js'], {})
  .then(documentation.formats.md)
  .then((output) => {
    fs.writeFileSync('./docs/components/alpha.md', output);
  });
