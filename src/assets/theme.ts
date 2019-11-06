const edsColors = require('@equinor/eds-tokens/base/colors.json');
const customColors = require('sass-extract-loader?{"plugins": ["sass-extract-js"]}!./sass/colors.scss');
const themeColors = { ...edsColors, ...customColors }

const edsShadows = require('@equinor/eds-tokens/base/elevation.json');

export default {
    color: themeColors,
    shadow: edsShadows,
}
