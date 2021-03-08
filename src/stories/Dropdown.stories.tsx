import React from 'react';
import Dropdown, {DropdownProps} from '../components/Dropdown/index';
import { Story, Meta } from '@storybook/react';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';


export default {
    title: 'Procosys/DropDown',
    component: Dropdown,
    argTypes: {
      text: { control: 'text' },
    },
  } as Meta;

  const Template: Story<DropdownProps> = (args) => <Dropdown {...args} />;

  export const Primary = Template.bind({});

  Primary.args = {
    label: 'Button'
  };