async function atomTimeToDisplayTime(atomTime) {
    const date = new Date(atomTime)

    let day = date.getDate()
    if (day < 10) {
      day = day.toString()
      day = '0' + day
    };

    let month = date.getMonth() + 1
    if (month < 10) {
      month = month.toString()
      month = '0' + month
    }

    const year = date.getFullYear()

    const formatted = `${day}/${month}/${year}`

    return formatted
}

async function monthDifference(date1, date2) {
    let months
    months = (date2.getFullYear() - date1.getFullYear()) * 12
    months -= date1.getMonth()
    months += date2.getMonth()

    return months <= 0 ? 0 : months
}

module.exports = {
  atomTimeToDisplayTime: atomTimeToDisplayTime,
  monthDifference: monthDifference,
}