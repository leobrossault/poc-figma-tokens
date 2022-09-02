const fs = require('fs')
const path = require('path')

const tokens = require('../output/global.json')
const { filterTokensByType } = require('../helpers/formats.js')
const { BERLIOZ_THEME_FILE, MATCHES } = require('../constants/index.js')

const OUTPUT_PATH = path.resolve(__dirname, `../output/${BERLIOZ_THEME_FILE}`)

const registerTypes = function (tokens) {
  return Object.values(tokens).reduce((arr, token) => {
    if (!arr.includes(token.type)) {
      arr.push(token.type)
    }

    return arr
  }, [])
}

function createTailwindConfig(sections) {
  return JSON.stringify(
    sections.reduce(
      (obj, section) => ({
        ...obj,
        [MATCHES[section] || section]: filterTokensByType(section, tokens)
      }),
      {}
    ),
    null,
    2
  )
}

try {
  if (fs.existsSync(OUTPUT_PATH)) {
    fs.unlinkSync(OUTPUT_PATH)
  }

  fs.writeFile(
    OUTPUT_PATH,
    createTailwindConfig(registerTypes(tokens)),
    err => {
      if (err) {
        throw new Error(err)
      } else {
        console.log('Tailwind config created  🎉')
      }
    }
  )
} catch (err) {
  throw new Error(err)
}
