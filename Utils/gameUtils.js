const axios = require("axios")

async function getGame(id) {
  const response = await axios.get('https://api.polytoria.com/v1/games/info?id='+id, { validateStatus: () => true, headers: { 'Accept-Encoding': 'application/json'} })
  const data = response.data
  if (response.status == 200) {
    return data
  }
  return []
}

module.exports = {
  getGame
}