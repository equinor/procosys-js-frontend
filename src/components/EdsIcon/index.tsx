import React from 'react';
import { Icon } from '@equinor/eds-core-react';
// eslint-disable-next-line @typescript-eslint/camelcase
import { error_filled } from '@equinor/eds-icons';

// eslint-disable-next-line @typescript-eslint/camelcase
const icons = { error_filled };

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
