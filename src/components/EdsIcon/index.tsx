import {
    account_circle,
    add,
    add_circle_filled,
    alarm_on,
    arrow_back,
    arrow_down,
    arrow_up,
    attach_file,
    bookmark_collection,
    calendar_today,
    category,
    checkbox,
    checkbox_outline,
    chevron_down,
    chevron_right,
    chevron_up,
    close,
    copy,
    delete_forever,
    delete_to_trash,
    done,
    done_all,
    edit,
    edit_text,
    error_filled,
    fast_forward,
    filter_list,
    info_circle,
    lock,
    microsoft_excel,
    microsoft_outlook,
    more_horizontal,
    more_verticle,
    notifications,
    person,
    place,
    play,
    pressure,
    print,
    restore_from_trash,
    search,
    star_filled,
    star_outlined,
    verticle_split,
    warning_filled,
    warning_outlined,
    world
} from '@equinor/eds-icons';

import { Icon } from '@equinor/eds-core-react';
import React from 'react';

const icons = { error_filled, close, checkbox, checkbox_outline, done_all, add_circle_filled, attach_file, notifications, chevron_down, chevron_up, edit, delete_to_trash, calendar_today, person, alarm_on, world, place, pressure, verticle_split, category, search, bookmark_collection, add, arrow_down, arrow_up, filter_list, more_verticle, warning_filled, delete_forever, restore_from_trash, edit_text, account_circle, lock, info_circle, print, fast_forward, play, copy, star_filled, star_outlined, microsoft_excel, done, chevron_right, arrow_back, warning_outlined, more_horizontal, microsoft_outlook };

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