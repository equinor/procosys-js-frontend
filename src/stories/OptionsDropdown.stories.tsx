import React from 'react';
import OptionsDropdown, { DropdownProps } from '@procosys/components/OptionsDropdown';
import { Story, Meta } from '@storybook/react';
import styled from 'styled-components';
import EdsIcon from '@procosys/components/EdsIcon';
import { tokens } from '@equinor/eds-tokens';



const Wrapper = styled.div`
  margin: 32px;
  display: grid;
  grid-gap: 32px;
  grid-template-columns: repeat(4', 'fit-content(100%));
`;

const DropdownItem = styled.div<DropdownProps>`
    padding: calc(var(--grid-unit) * 2) calc(var(--grid-unit) * 3);
`;


const icons = [
    'error_filled', 'close', 'cloud_download', 'checkbox', 'checkbox_outline', 'done_all', 'add_circle_filled', 'attach_file', 'comment', 'comment_chat',
    'notifications', 'chevron_down', 'chevron_up', 'edit', 'delete_to_trash', 'calendar_today', 'person', 'alarm_on', 'world', 'link',
    'place', 'pressure', 'vertical_split', 'category', 'search', 'bookmark_collection', 'add', 'arrow_down', 'arrow_up', 'file', 'file_description', 'image', 'filter_list', 'more_vertical',
    'warning_filled', 'delete_forever', 'restore_from_trash', 'edit_text', 'account_circle', 'lock', 'info_circle', 'iphone', 'print', 'fast_forward', 'play',
    'copy', 'star_filled', 'star_outlined', 'microsoft_excel', 'done', 'chevron_right', 'arrow_back', 'warning_outlined', 'more_horizontal', 'microsoft_outlook', 'microsoft_powerpoint', 'microsoft_word', 'calendar_date_range', 'menu', 'calendar_reject'
];


export default {
    title: 'Procosys/OptionsDropdown',
    component: OptionsDropdown,
    argTypes: {
        icon: {
            control: {
                type: 'select',
                options: icons.sort(),
            },
        },
    },
    parameters: {
        docs: {
            description: {
                component: `Options dropdown component used in Procosys.
        `,
            },
        },
        info: {},
    },
} as Meta;

export const Default: Story<DropdownProps> = (args: JSX.IntrinsicAttributes & DropdownProps & { children?: React.ReactNode; }) => {
    return (
        <Wrapper>
            <OptionsDropdown text="More options" variant='ghost' {...args} >
                <DropdownItem disabled={false} >
                    <EdsIcon name='edit_text' color={tokens.colors.text.static_icons__tertiary.rgba} />
                    Edit
                </DropdownItem>
                <DropdownItem disabled={true} >
                    <EdsIcon name='calendar_date_range' color={tokens.colors.interactive.disabled__border.rgba} />
                    Reschedule
                </DropdownItem>
                <DropdownItem disabled={false}>
                    <EdsIcon name='delete_to_trash' color={tokens.colors.text.static_icons__tertiary.rgba} />
                    Remove
                </DropdownItem>
                <DropdownItem disabled={false}>
                    <EdsIcon name='delete_forever' color={tokens.colors.text.static_icons__tertiary.rgba} />
                    Void
                </DropdownItem>
                <DropdownItem disabled={false} >
                    <EdsIcon name='restore_from_trash' color={tokens.colors.interactive.disabled__border.rgba} />
                    Unvoid
                </DropdownItem>
            </OptionsDropdown>
        </Wrapper>
    );
};