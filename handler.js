'use strict';

const fetch = require('node-fetch')
const read = require('node-readability')


/*

Endpoint to return readable content for given reddit article id.

To test this locally, run:
`sls invoke local --function getArticle --path event.json`

*/

function getReadablePage(url) {
  return new Promise((resolve, reject) => {
    read(url, (err, data) => {
      if(err) reject(err);
      resolve(data)
    })
  })
}

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
      return getReadablePage(url)
    })
    .then(article => {
      const response = {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*', // Required for CORS support to work
        },
        body: JSON.stringify({
          title: article.title,
          content: article.content,
          url: url,
          redditId: event.pathParameters.id,
        }),
      }
      callback(null, response)
    })
    .catch(err => {
      console.log(err)
    })


}
