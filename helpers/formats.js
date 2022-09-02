const { camelify } = require('./string.js')
const { MATCHES } = require('../constants')

function deepen(obj) {
  const result = {}

  for (const objectPath in obj) {
    const parts = objectPath.split('.')

    let target = result

    while (parts.length > 1) {
      const part = parts.shift()
      target = target[part] = target[part] || {}
    }

    target[parts[0]] = obj[objectPath]
  }

  return result
}

function createArray({ dictionary }) {
  const arr = dictionary.allTokens

  return JSON.stringify(arr)
}

function filterTokensByType(type, tokens) {
  const obj = tokens.reduce((acc, cur) => {
    if (cur.type === type) {
      acc[camelify(cur.path.join('.'))] = cur.value
    }
    return acc
  }, {})

  return deepen(obj)
}

module.exports = { createArray, filterTokensByType }
