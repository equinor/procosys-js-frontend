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
    calendar_date_range,
    calendar_today,
    category,
    checkbox,
    checkbox_outline,
    chevron_down,
    chevron_right,
    chevron_up,
    close,
    cloud_download,
    comment,
    comment_chat,
    copy,
    delete_forever,
    delete_to_trash,
    done,
    done_all,
    edit,
    edit_text,
    error_filled,
    fast_forward,
    file,
    file_description,
    filter_list,
    image,
    info_circle,
    iphone,
    link,
    lock,
    menu,
    microsoft_excel,
    microsoft_outlook,
    microsoft_powerpoint,
    microsoft_word,
    more_horizontal,
    more_vertical,
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
    vertical_split,
    warning_filled,
    warning_outlined,
    world
} from '@equinor/eds-icons';

import { Icon } from '@equinor/eds-core-react';
import React from 'react';

const icons = {
    error_filled, close, cloud_download, checkbox, checkbox_outline, done_all, add_circle_filled, attach_file, comment, comment_chat,
    notifications, chevron_down, chevron_up, edit, delete_to_trash, calendar_today, person, alarm_on, world, link,
    place, pressure, vertical_split, category, search, bookmark_collection, add, arrow_down, arrow_up, file, file_description, image, filter_list, more_vertical,
    warning_filled, delete_forever, restore_from_trash, edit_text, account_circle, lock, info_circle, iphone, print, fast_forward, play,
    copy, star_filled, star_outlined, microsoft_excel, done, chevron_right, arrow_back, warning_outlined, more_horizontal, microsoft_outlook, microsoft_powerpoint, microsoft_word, calendar_date_range, menu
};

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
