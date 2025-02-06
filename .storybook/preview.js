import '../src/assets/sass/procosys-styles.scss';

import { addDecorator, addParameters } from '@storybook/react'

import { withInfo } from '@storybook/addon-info'

const { jsxDecorator } = require('storybook-addon-jsx');

addDecorator(jsxDecorator);

// const newTheme = {
//   themeName: 'Grey Theme',
//   palette: {
//       primary1Color: '#00bcd4',
//       alternateTextColor: '#4a4a4a',
//       canvasColor: '#616161',
//       textColor: '#bdbdbd',
//       secondaryTextColor: 'rgba(255, 255, 255, 0.54)',
//       disabledColor: '#757575',
//       accent1Color: '#607d8b',
//   },
// };


addDecorator(withInfo);
addDecorator(jsxDecorator);
// addDecorator(muiTheme([newTheme]))
