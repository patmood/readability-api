'use strict';

/*

Endpoint to return readable content for given reddit article id.

To test this locally, run:
`sls invoke local --function getArticle --path event.json`

*/

const fetch = require('node-fetch')
const extract = require('unfluff')

module.exports.getArticle = (event, context, callback) => {
  if (!event.pathParameters.id) {
    return callback(null, { statusCode: 400 });
  }

  let url = null

  fetch(`https://www.reddit.com/${event.pathParameters.id}.json`)
    .then(res => res.json())
    .then(json => {
      const post = json[0].data.children
      url = post[0].data.url
      return fetch(url)
    })
    .then(res => res.text())
    .then(text => extract(text))
    .then(data => {
      const response = {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*', // Required for CORS support to work
        },
        body: JSON.stringify(data),
      }
      callback(null, response)
    })
    .catch(err => {
      console.log(err)
    })
}
