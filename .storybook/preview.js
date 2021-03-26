import { addDecorator } from '@storybook/react'
import { withInfo } from '@storybook/addon-info'
import '../src/assets/sass/procosys-styles.scss';

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


addDecorator(withInfo)
// addDecorator(muiTheme([newTheme]))