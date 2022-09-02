const StyleDictionaryPackage = require('style-dictionary')
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
    ].includes(prop.original.type)
  },
  transformer: prop => {
    return `${parseFloat(prop.original.value)}px`
  }
})

function getStyleDictionaryConfig() {
  return {
    source: ['./themes/global.json'],
    format: {
      createArray
    },
    platforms: {
      web: {
        transforms: ['attribute/cti', 'name/cti/kebab', 'sizes/px'],
        buildPath: `themes/`,
        files: [
          {
            destination: 'global-formatted.json',
            format: 'createArray'
          }
        ]
      }
    }
  }
}

StyleDictionaryPackage.extend(getStyleDictionaryConfig()).buildPlatform('web')
