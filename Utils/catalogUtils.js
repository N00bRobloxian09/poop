const axios = require("axios")
  
async function getCatalog(query, page = 0) {
  const response = await axios.get('https://api.polytoria.com/v1/asset/catalog?q='+query+'&page='+page, { validateStatus: () => true, headers: { 'Accept-Encoding': 'application/json'} })
  const data = response.data
  if (response.status == 200) {
    return data
  }
  return []
}

async function getItem(id) {
  const response = await axios.get('https://api.polytoria.com/v1/asset/info?id='+id, { validateStatus: () => true, headers: { 'Accept-Encoding': 'application/json'} })
  const data = response.data
  if (response.status == 200) {
    return data
  }
  return []
}

module.exports = {
  getCatalog, getItem
}