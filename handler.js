'use strict';

/*

Endpoint to return readable content for given reddit article id.

To test this locally, run:
`sls invoke local --function getArticle --path event.json`

*/

module.exports.getArticle = (event, context, callback) => {
  if (!event.pathParameters.id) {
    return callback(null, { statusCode: 400 });
  }

  const response = {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*', // Required for CORS support to work
    },
    body: JSON.stringify({
      message: 'Go Serverless v1.0! Your function executed successfully!',
      input: event,
    }),
  };

  callback(null, response);
};
