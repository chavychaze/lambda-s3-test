'use strict';

require('dotenv').config();

const manageFile = require('./manageFile');

module.exports.readFile = (event, context, callback) => {
  const text = event.queryStringParameters.text;

  manageFile.readFile(text).then(result => {
    const response = {
      statusCode: 200,
      body: JSON.stringify(
        {
          result,
        },
        null,
        2,
      ),
    };

    callback(null, response);
  });
};
