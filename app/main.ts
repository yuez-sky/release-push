import { get } from 'https'
import { createServer } from 'http'

import urls from './website'
import Parser from './tools'

function getRelease(url: string, type: string, name: string) {
  return new Promise((resolve, reject) => {
    get(url, res => {
      if (res.statusCode >= 200 && res.statusCode < 300) {
        const body = []
        res.on('data', d => {
          body.push(d)
        }).on('end', () => {
          const res = Buffer.concat(body).toString()
          const { version, date, changelog } = Parser[type](res)

          resolve({
            name,
            version,
            date,
            changelog,
          })
        })
      } else {
        reject(res)
      }
    })
  })
}

createServer((req, res) => {
  Promise.all(urls.map(({ url, type, name }) => getRelease(url, type, name))).then(data => {
    res.writeHead(200, null, {
      'content-type': 'text/html'
    })

    res.write('<html>')
    data.forEach((item: any) => {
      res.write(`<h3>Version: ${item.name}/${item.version}</h3>`)
      res.write(`<h3>Date: ${item.date}</h3>`)
      res.write(`<h3>Changelog: </h3>`)
      res.write(`<div>${item.changelog}</div>`)
    })
    res.end('</html>')
  }, e => {})
}).listen(8000)


