const StyleDictionaryPackage = require('style-dictionary')
const { camelify, kebabify } = require('../helpers/string.js')
const { createArray } = require('../helpers/formats.js')

StyleDictionaryPackage.registerTransform({
  name: 'sizes/px',
  type: 'value',
  matcher: prop => {
    return [
      'fontSizes',
      'spacing',
      'borderRadius',
      'borderWidth',
      'sizing'
    ].includes(prop.original.type || prop.type)
  },
  transformer: prop => {
    console.log(prop)
    return `${parseFloat(prop.original.value)}px`
  }
})

StyleDictionaryPackage.registerFormat({
  name: 'css/classes',
  formatter: ({ dictionary, platform, options, file }) => {
    return dictionary.allTokens
      .map(
        token => `.${camelify(token.path.join(''))} {
  ${Object.entries(token.value)
    .filter(([key, value]) => value !== '')
    .map(
      ([key, value]) =>
        `${kebabify(key)}: ${typeof value === 'string' ? `"${value}"` : value};`
    )
    .join('\n  ')}
}`
      )
      .join('\n')
  }
})

function getStyleDictionaryConfig() {
  return {
    source: ['./themes/global.json'],
    format: {
      createArray
    },
    platforms: {
      theme: {
        transforms: ['attribute/cti', 'name/cti/kebab', 'sizes/px'],
        buildPath: 'themes/',
        files: [
          {
            destination: 'global-formatted.json',
            format: 'createArray',
            filter: token => typeof token.value !== 'object'
          }
        ]
      },
      css: {
        buildPath: 'output/',
        transforms: ['sizes/px'],
        files: [
          {
            destination: 'berlioz.css',
            format: 'css/classes',
            filter: token => typeof token.value === 'object',
            options: {
              outputReferences: true
            }
          }
        ]
      }
    }
  }
}

StyleDictionaryPackage.extend(getStyleDictionaryConfig()).buildPlatform('theme')
StyleDictionaryPackage.extend(getStyleDictionaryConfig()).buildPlatform('css')
