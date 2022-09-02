const fs = require('fs')
const path = require('path')

const tokens = require('../output/global.json')
const { filterTokensByType } = require('../helpers/formats.js')
const { camelify } = require('../helpers/string.js')

const TAILWIND_PATH = path.resolve(__dirname, '../tailwind.config.js')

const registerTypes = function (tokens) {
  return Object.values(tokens).reduce((arr, token) => {
    if (!arr.includes(token.type)) {
      arr.push(token.type)
    }

    return arr
  }, [])
}

function createTailwindConfig(sections) {
  const config = {
    purge: [],
    darkMode: false,
    theme: sections.reduce(
      (obj, section) => ({
        ...obj,
        [section]: filterTokensByType(section, tokens)
      }),
      {}
    ),
    variants: {},
    plugins: []
  }

  return `module.exports = ${JSON.stringify(config, null, 2)}`
}

try {
  if (fs.existsSync(TAILWIND_PATH)) {
    // Clean tailwind.config.js
    fs.unlinkSync(TAILWIND_PATH)
  }

  fs.writeFile(
    TAILWIND_PATH,
    createTailwindConfig(registerTypes(tokens)),
    err => {
      if (err) {
        throw new Error(err)
      }
    }
  )
} catch (err) {
  throw new Error(err)
}
