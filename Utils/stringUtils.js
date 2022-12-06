async function capitalizeString(string) {
  const arr = string.toLowerCase().split(' ')

  for (let i = 0; i < arr.length; i++) {
    arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1)
  }

  const result = arr.join(' ')

  return result
}

async function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

async function pToS(i) {
  i.then((va) => {
    return va
  })
}

async function getLines(ctx, text, maxWidth) {
  const words = text.split(' ')
  const lines = []
  let currentLine = words[0]

  for (let i = 1; i < words.length; i++) {
    const word = words[i]
    const width = ctx.measureText(currentLine + ' ' + word).width
    if (width < maxWidth) {
      currentLine += ' ' + word
    } else {
      lines.push(currentLine)
      currentLine = word
    }
  }
  lines.push(currentLine)
  return lines
}

async function replaceAll(str, find, replace) {
  return str.replace(new RegExp(find, 'g'), replace)
}

async function getNumbersFromURL (url) {
    const parsed = stringUtils.urlParse(url)
    const result = []

    parsed.splitted.forEach(function (item) {
      const value = parseInt(item)

      if (isNaN(value) === false) {
        result.push(value)
      }
    })

    return result
  }

async function urlParse (url) {
    const urlConstruct = new URL(url)

    return {
      urlData: urlConstruct,
      searchParams: urlConstruct.searchParams,
      splitted: url.split('/')
    }
  }


module.exports = {
  capitalizeString,
  getLines,
  numberWithCommas,
  replaceAll,
  urlParse,
  getNumbersFromURL,
}