import {
    BatteryChargingFullOutlined,
    FlashOnOutlined,
    BuildOutlined,
    PowerOutlined,
    RotateRight,
    AddToPhotosOutlined,
} from '@mui/icons-material';
import React from 'react';

import AreaIcon from '../assets/icons/Area';
import BearingIcon from '../assets/icons/Bearing';
import N2Icon from '../assets/icons/N2';
import PressureIcon from '../assets/icons/Pressure';
import ThermostatIcon from '../assets/icons/Thermostat';

export interface IconProps {
    variant: string;
}

export interface PreservationTypeIcon {
    code: string;
    title: string;
}

export const preservationIconList: Array<PreservationTypeIcon> = [
    { code: 'Area', title: 'Area' },
    { code: 'Battery', title: 'Electrical battery' },
    { code: 'Bearings', title: 'Bearings, moving parts' },
    { code: 'Electrical', title: 'Electrical' },
    { code: 'Heating', title: 'Heating thermostat' },
    { code: 'Installation', title: 'Installation, mechanical' },
    { code: 'Power', title: 'Power' },
    { code: 'Nitrogen', title: 'Nitrogen' },
    { code: 'Pressure', title: 'Pressure' },
    { code: 'Rotate', title: 'Rotate' },
    { code: 'Other', title: 'Other' },
];

const PreservationIcon = ({ variant }: IconProps): JSX.Element | null => {
    switch (variant) {
        case 'Area':
            return <AreaIcon />;
        case 'Battery':
            return <BatteryChargingFullOutlined />;
        case 'Bearings':
            return <BearingIcon />;
        case 'Electrical':
            return <FlashOnOutlined />;
        case 'Heating':
            return <ThermostatIcon />;
        case 'Installation':
            return <BuildOutlined />;
        case 'Power':
            return <PowerOutlined />;
        case 'Nitrogen':
            return <N2Icon />;
        case 'Pressure':
            return <PressureIcon />;
        case 'Rotate':
            return <RotateRight />;
        default:
            return <AddToPhotosOutlined />;
    }
};

export default PreservationIcon;
