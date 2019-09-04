import * as cherrio from 'cheerio'

const releaseEntry = 'div.release-entry'
const releaseHead = `${releaseEntry} .release-header`

export function parse(html) {
  const $ = cherrio.load(html)
  const EntryList = $(releaseEntry)
  const recentEntry = EntryList[0]

  return parseRelease(recentEntry)
}

function parseRelease(dom) {
  const $ = cherrio.load(dom)
  const version = $(releaseHead).find('.flex-items-start .text-normal a').text()
  const date = $('relative-time').text()
  const changelog = $('.markdown-body').html()

  return {
    version,
    changelog,
    date,
  }
}