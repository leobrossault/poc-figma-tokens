const StyleDictionaryPackage = require('style-dictionary')
const { createArray } = require('../helpers/formats.js')

StyleDictionaryPackage.registerTransform({
  name: 'sizes/px',
  type: 'value',
  matcher: function (prop) {
    return [
      'fontSizes',
      'spacing',
      'borderRadius',
      'borderWidth',
      'sizing'
    ].includes(prop.attributes.category)
  },
  transformer: function (prop) {
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
        buildPath: `output/`,
        files: [
          {
            destination: 'global.json',
            format: 'createArray'
          }
        ]
      }
    }
  }
}

StyleDictionaryPackage.extend(getStyleDictionaryConfig()).buildPlatform('web')
