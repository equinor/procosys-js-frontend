import React from 'react';

import AreaIcon from '../assets/icons/Area';
import BatteryChargingFullOutlinedIcon from '@material-ui/icons/BatteryChargingFullOutlined';
import BearingIcon from '../assets/icons/Bearing';
import BuildOutlinedIcon from '@material-ui/icons/BuildOutlined';
import FlashOnOutlinedIcon from '@material-ui/icons/FlashOnOutlined';
import N2Icon from '../assets/icons/N2';
import OtherIcon from '@material-ui/icons/AddToPhotosOutlined';
import PowerOutlinedIcon from '@material-ui/icons/PowerOutlined';
import PressureIcon from '../assets/icons/Pressure';
import RotateRightIcon from '@material-ui/icons/RotateRightOutlined';
import ThermostatIcon from '../assets/icons/Thermostat';

interface IconProps {
    variant: string;
}

export interface PreservationTypeIcon {
    code: string;
    title: string;
}

export const preservationIconList: Array<PreservationTypeIcon> = [
    { code: 'Area', title: 'Area' },
    { code: 'Battery', title: 'Electrical Battery' },
    { code: 'Bearings', title: 'Bearings, moving parts' },
    { code: 'Electrical', title: 'Electrical' },
    { code: 'Heating', title: 'Heating thermostat' },
    { code: 'Installation', title: 'Installation, mechanical' },
    { code: 'Power', title: 'Power' },
    { code: 'Nitrogen', title: 'Nitrogen' },
    { code: 'Pressure', title: 'Pressure' },
    { code: 'Rotate', title: 'Rotate' },
    { code: 'Other', title: 'Other' }
];

const PreservationIcon = ({
    variant
}: IconProps): JSX.Element | null => {
    switch (variant) {
        case 'Area':
            return <AreaIcon />;
        case 'Battery':
            return <BatteryChargingFullOutlinedIcon />;
        case 'Bearings':
            return <BearingIcon />;
        case 'Electrical':
            return <FlashOnOutlinedIcon />;
        case 'Heating':
            return <ThermostatIcon />;
        case 'Installation':
            return <BuildOutlinedIcon />;
        case 'Power':
            return <PowerOutlinedIcon />;
        case 'Nitrogen':
            return <N2Icon />;
        case 'Pressure':
            return <PressureIcon />;
        case 'Rotate':
            return <RotateRightIcon />;
        default:
            return <OtherIcon />;
    }
};

export default PreservationIcon;
