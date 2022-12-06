const axios = require("axios")

async function randomDeletedItem() {
    let result = 0
    let tried = 0
  
    while (true) {
      const randomizedID = await randomInt(1, 20000)
      tried++
      const response = await axios.get('https://polytoria.com/assets/thumbnails/catalog/' + randomizedID + '.png', { validateStatus: () => true, headers: { 'Accept-Encoding': 'application/json'}})
  
      if (response.status !== 404) {
        const response2 = await axios.get('https://api.polytoria.com/v1/asset/info?id=' + randomizedID, { validateStatus: () => true, headers: { 'Accept-Encoding': 'application/json'} })
        if (response2.status === 400) {
          result = randomizedID
          break
        }
      }
  
      if (tried >= 20) {
        break
      }
    }
    return result
}

async function randomGameBanner() {
    let result = 0
    let tried = 0
  
    while (true) {
      const randomizedID = await randomInt(1, 900)
      tried++
      const response = await axios.get('http://polytoria.com/assets/thumbnails/games/banners/' + randomizedID + '.png', { validateStatus: () => true })
  
      if (response.status != 404) {
        result = randomizedID
        break
      }
  
      if (tried >= 20) {
        break
      }
    }
    return result
}

async function randomCatalogItem() {
    let result = []
    let tried = 0
  
    while (true) {
      const randomizedID = await randomInt(1, 20000)
      tried++
      const response = await axios.get('https://api.polytoria.com/v1/asset/info?id=' +randomizedID, { validateStatus: () => true, headers: { 'Accept-Encoding': 'application/json'} })
  
      if (response.status != 400) {
        result = response.data
        break
      }
  
      if (tried >= 20) {
        break
      }
    }
    return result
}

async function randomUser() {
  let result = []
  let tried = 0

  while (true) {
    const randomizedID = await randomInt(1, 20000)
    tried++
    const response = await axios.get('https://api.polytoria.com/v1/users/user?id=' +randomizedID, { validateStatus: () => true, headers: { 'Accept-Encoding': 'application/json'} })

    if (response.status != 400) {
      result = response.data
      break
    }

    if (tried >= 20) {
      break
    }
  }
  return result
}

async function randomGuild() {
  let result = []
  let tried = 0

  while (true) {
    const randomizedID = await randomInt(1, 2000)
    tried++
    const response = await axios.get('https://api.polytoria.com/v1/guild/info?id=' +randomizedID, { validateStatus: () => true, headers: { 'Accept-Encoding': 'application/json'} })

    if (response.status != 400) {
      result = response.data
      break
    }

    if (tried >= 20) {
      break
    }
  }
  return result
}

async function randomGame() {
  let result = []
  let tried = 0

  while (true) {
    const randomizedID = await randomInt(1, 3500)
    tried++
    const response = await axios.get('https://api.polytoria.com/v1/games/info?id=' +randomizedID, { validateStatus: () => true, headers: { 'Accept-Encoding': 'application/json'} })

    if (response.status != 400) {
      result = response.data
      break
    }

    if (tried >= 20) {
      break
    }
  }
  return result
}


async function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min
}

module.exports = {
    randomDeletedItem: randomDeletedItem,
    randomGameBanner: randomGameBanner,
    randomCatalogItem: randomCatalogItem,
    randomUser: randomUser,
    randomGuild: randomGuild,
    randomGame: randomGame,
}