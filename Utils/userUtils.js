const axios = require("axios")
const dateUtils = require("./dateUtils.js");

async function getDisplayCreatorName(id, type) {
  let result = ""
  if (type == "User") {
    const response = await axios.get('https://api.polytoria.com/v1/users/user?id=' + id, { validateStatus: () => true, headers: { 'Accept-Encoding': 'application/json' } })
    const data = response.data
    if (data.Success === false) {
      result = "Deleted User " + id
    } else {
      result = data.Username
    }
  } else if (type == "Guild") {
    const response = await axios.get('https://api.polytoria.com/v1/guild/info?id=' + id, { validateStatus: () => true, headers: { 'Accept-Encoding': 'application/json' } })
    const data = response.data
    if (data.Success === false) {
      result = "Invalid Group."
    } else {
      result = data.Name
    }
  }

  return result
}

async function getUserData(id) {
  const response = await axios.get('https://api.polytoria.com/v1/users/user?id=' + id, { validateStatus: () => true, headers: { 'Accept-Encoding': 'application/json' } })
  const data = response.data
  return data
}

async function getUserDataByUsername(name) {
  const response = await axios.get('https://api.polytoria.com/v1/users/getbyusername?username=' + name, { validateStatus: () => true, headers: { 'Accept-Encoding': 'application/json' } })
  const data = response.data
  return data
}

async function getAvatar(id) {
  const response = await axios.get('https://api.polytoria.com/v1/users/getappearance?id=' + id, { validateStatus: () => true, headers: { 'Accept-Encoding': 'application/json' } })
  const data = response.data
  return data
}

async function getLeaderboard(type) {
  const response = await axios.get('https://polytoria.com/api/fetch/leaderboard?c=' + type, { validateStatus: () => true, headers: { 'Accept-Encoding': 'application/json' } })
  const data = response.data
  return data
}

async function getFriends(id, page) {
  const response = await axios.get('https://api.polytoria.com/v1/users/friends?id=' + id + '&page=' + page, { validateStatus: () => true, headers: { 'Accept-Encoding': 'application/json' } })
  const data = response.data
  return data
}

async function userExists(id) {
  const response = await axios.get('https://api.polytoria.com/v1/users/user?id=' + id, { validateStatus: () => true, headers: { 'Accept-Encoding': 'application/json' } })
  const data = response.data
  if (data.Success === false) {
    return false
  }
  return true
}

async function getLevel(id) {
  const result = {
    final: 0,
    levels: {
      forum: 0,
      economy: 0,
      fame: 0
    },
    rank: 'Noob',
    external: {
      friendCountRounded: 0,
      accountAgeMonth: 0
    }
  }

  const userData = await getUserData(id)

  const joinDateDate = new Date(userData.JoinedAt)
  const currentDate = new Date()

  const accountAgeMonth = await dateUtils.monthDifference(joinDateDate, currentDate)

  result.external.accountAgeMonth = accountAgeMonth

  const userFriends = await axios.get('https://api.polytoria.com/v1/users/friends?id=' + userData.ID, { headers: { 'Accept-Encoding': 'application/json' } })

  const friendCountRounded = 10 * userFriends.data.Pages

  result.external.friendCountRounded = friendCountRounded

  const result2 = 12 * ((-1 / ((1 * accountAgeMonth) + 0.4) + 1))
  const result3 = 12 * ((-1 / ((friendCountRounded / 100) + 1) + 1))
  const result4 = 8 * ((-1 / ((userData.ForumPosts / 25) + 1) + 1))
  const result5 = 15 * ((-1 / ((userData.ProfileViews / 1500) + 1) + 1))
  const result6 = 10 * ((-1 / ((userData.TradeValue / 30000) + 1) + 1))
  const result7 = 10 * ((-1 / ((userData.ItemSales / 3) + 1) + 1))

  const final = Math.round(parseFloat(result2) + parseFloat(result3) + parseFloat(result4) + parseFloat(result5) + parseFloat(result6) + parseFloat(result7))

  result.final = final

  if (final > 15) {
    result.rank = 'Above Average'
    if (final > 50) {
      result.rank = 'Insane'
      if (final === 69) {
        result.rank = 'Nice'
      } else if (final > 75) {
        result.rank = 'God'
      }
    }
  } else {
    result.rank = 'Noob'
  }

  result.levels.economy = Math.round(result6 + result7)
  result.levels.fame = Math.round(result3 + result5 + result6)
  result.levels.forum = Math.round(result4)

  return result
}

async function getAppearance(id) {
  const response = await axios.get('https://api.polytoria.com/v1/users/getappearance?id=' + id, { validateStatus: () => true, headers: { 'Accept-Encoding': 'application/json' } })
  const data = response.data
  return data
}

async function getInventory(id, page) {
  // const response = await axios.get('https://polytoria.com/api/fetch/inventory?id='+id+'&type='+type+'&limit=10&p='+page, { validateStatus: () => true, headers: { 'Accept-Encoding': 'application/json'} })
  const response = await axios.get('https://api.polytoria.com/v1/users/inventory?id=' + id + '&page=' + page, { validateStatus: () => true, headers: { 'Accept-Encoding': 'application/json' } })
  const data = response.data
  return data
}

module.exports = {
  getDisplayCreatorName,
  getUserData,
  userExists,
  getAppearance,
  getUserDataByUsername,
  getLevel,
  getInventory,
  getAvatar,
  getFriends,
  getLeaderboard,
}