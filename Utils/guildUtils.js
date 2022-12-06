const axios = require("axios")

async function getGuild(id) {
  const response = await axios.get('https://api.polytoria.com/v1/guild/info?id='+id, { validateStatus: () => true, headers: { 'Accept-Encoding': 'application/json'} })
  const data = response.data
  if (data.Success == false) {
    return []
  }
  if (response.status == 200) {
    return data
  }
  return []
}

module.exports = {
  getGuild
}