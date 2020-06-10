import React from 'react';
import { Icon } from '@equinor/eds-core-react';
// eslint-disable-next-line @typescript-eslint/camelcase
import { error_filled, close, checkbox, checkbox_outline, done_all, add_circle_filled, attach_file, notifications, chevron_down, chevron_up, edit, delete_to_trash, calendar_today, person, alarm_on, world, place, pressure, verticle_split, category, search, bookmark_collection, add, arrow_down, arrow_up, filter_list, more_verticle } from '@equinor/eds-icons';

// eslint-disable-next-line @typescript-eslint/camelcase
const icons = { error_filled, close, checkbox, checkbox_outline, done_all, add_circle_filled, attach_file, notifications, chevron_down, chevron_up, edit, delete_to_trash, calendar_today, person, alarm_on, world, place, pressure, verticle_split, category, search, bookmark_collection, add, arrow_down, arrow_up, filter_list, more_verticle };

Icon.add(icons);

type IconProps = {
    name?: string;
    title?: string;
    color?: string;
    rotation?: number;
    size?: number;
}

const EdsIcon = ({
    name,
    title,
    color,
    rotation,
    size
}: IconProps): JSX.Element => {

    return (
        <Icon
            name={name}
            title={title}
            color={color}
            rotation={rotation}
            size={size}
        />
    );
};

export default EdsIcon;
