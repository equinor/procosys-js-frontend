import React from 'react';

import BatteryChargingFullOutlinedIcon from '@material-ui/icons/BatteryChargingFullOutlined';
import BearingIcon from '../../../assets/icons/Bearing';
import BuildOutlinedIcon from '@material-ui/icons/BuildOutlined';
import FlashOnOutlinedIcon from '@material-ui/icons/FlashOnOutlined';
import N2Icon from '../../../assets/icons/N2';
import PowerOutlinedIcon from '@material-ui/icons/PowerOutlined';
import PressureIcon from '../../../assets/icons/Pressure';
import RotateRightIcon from '@material-ui/icons/RotateRightOutlined';
import ThermostatIcon from '../../../assets/icons/Thermostat';

interface IconProps {
    variant: string;
}

const PreservationIcon = ({
    variant
}: IconProps): JSX.Element | null => {
    switch (variant.toLowerCase()) {
        case 'rotation':
            return <RotateRightIcon />;
        case 'ir test':
            return <FlashOnOutlinedIcon />;
        case 'oil level':
            return <PressureIcon />;
        case 'heating':
            return <ThermostatIcon />;
        case 'powered':
            return <PowerOutlinedIcon />;
        case 'vci':
            return <BuildOutlinedIcon />;
        case 'nitrogen':
            return <N2Icon />;
        case 'grease':
            return <BearingIcon />;
        case 'charging':
            return <BatteryChargingFullOutlinedIcon />;
        default:
            return null;
    }
};

export default PreservationIcon; 