const axios = require("axios")

async function getToolbox(query, page = 1) {
  const response = await axios.get('https://api.polytoria.com/v1/models/toolbox?page=' + page + '&q=' + query, { validateStatus: () => true, headers: { 'Accept-Encoding': 'application/json' } })
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
  getToolbox
}