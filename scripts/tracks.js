const { promisify } = require('util')
const {JSDOM} = require('jsdom')
const glob = promisify(require("glob"))
const readFile = promisify(require('fs').readFile)
const puppeteer = require('puppeteer');

;(async () => {
  console.log('wat?')
  const files = await glob("logbook/*.html")
  const things = (await Promise.all(files.map(async file => {
    const logbook = JSDOM.fragment(await readFile(file, 'UTF-8'))

    const links = logbook.querySelectorAll('td a')
    return [].map.call(links, link => link.href)
      .filter(href => href.match(/tracklink/))
      .map(href => href.replace(/.*(http)/, '$1'))
      .map(href => href.replace(/(.*?)\'.*/, '$1'))
  }))).reduce((a, b) => a.concat(b), [])

  console.log('things', things)
})()
