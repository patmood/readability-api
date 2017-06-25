'use strict';

/*

Endpoint to return readable content for given reddit article id.

To test this locally, run:
`sls invoke local --function getArticle --path event.json`

*/

const fetch = require('node-fetch')
const extract = require('unfluff')
const summary = require('node-summary')

function summarizeText(title, content) {
  return new Promise((resolve, reject) => {
    summary.summarize(title, content, (err, summary) => {
      if (err) reject(err)
      resolve(summary)
    })
  })
}

module.exports.getArticle = (event, context, callback) => {
  if (!event.pathParameters.id) {
    return callback(null, { statusCode: 400 });
  }

  let responseBody = {}

  fetch(`https://www.reddit.com/${event.pathParameters.id}.json`)
    .then(res => res.json())
    .then(json => {
      const post = json[0].data.children
      const url = post[0].data.url
      return fetch(url)
    })
    .then(res => res.text())
    .then(text => extract(text))
    .then(data => {
      responseBody = Object.assign({}, data)
      return summarizeText(data.title, data.text)
    })
    .then(summary => {
      responseBody.summary = summary
      const response = {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*', // Required for CORS support to work
        },
        body: JSON.stringify(responseBody),
      }
      callback(null, response)
    })
    .catch(err => {
      console.log(err)
    })
}
