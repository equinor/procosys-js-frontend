import AreaIcon from '../assets/icons/Area';
import BatteryChargingFullOutlinedIcon from '@material-ui/icons/BatteryChargingFullOutlined';
import BearingIcon from '../assets/icons/Bearing';
import BuildOutlinedIcon from '@material-ui/icons/BuildOutlined';
import FlashOnOutlinedIcon from '@material-ui/icons/FlashOnOutlined';
import N2Icon from '../assets/icons/N2';
import OtherIcon from '@material-ui/icons/AddToPhotosOutlined';
import PowerOutlinedIcon from '@material-ui/icons/PowerOutlined';
import PressureIcon from '../assets/icons/Pressure';
import React from 'react';
import RotateRightIcon from '@material-ui/icons/RotateRightOutlined';
import ThermostatIcon from '../assets/icons/Thermostat';

interface IconProps {
    variant: string;
}

const PreservationIcon = ({
    variant
}: IconProps): JSX.Element | null => {
    switch (variant.toLowerCase()) {

        case 'area':
            return <AreaIcon />;
        case 'charging':
            return <BatteryChargingFullOutlinedIcon />;
        case 'grease':
            return <BearingIcon />;
        case 'heating':
            return <ThermostatIcon />;
        case 'ir test':
            return <FlashOnOutlinedIcon />;
        case 'nitrogen':
            return <N2Icon />;
        case 'oil level':
            return <PressureIcon />;
        case 'powered':
            return <PowerOutlinedIcon />;
        case 'rotation':
            return <RotateRightIcon />;
        case 'vci':
            return <BuildOutlinedIcon />;
        default:
            return <OtherIcon />;
    }
};

export default PreservationIcon;
