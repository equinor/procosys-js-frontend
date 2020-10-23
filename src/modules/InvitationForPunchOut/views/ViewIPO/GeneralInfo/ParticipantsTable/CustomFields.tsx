import { Switch, TextField, Tooltip, withStyles } from '@material-ui/core';

export const CustomSwitch = withStyles({
    switchBase: {
        color: '#6f6f6f',
        '&$checked': {
            color: '#007079',
        },
        '&$checked + $track': {
            backgroundColor: '#e6faec',
        },
    },
    checked: {},
    track: {
        backgroundColor: '#dcdcdc',
    },
})(Switch);

export const CustomTextField = withStyles({
    root: {
        background: '#f7f7f7',
        width: '100%'
    }
})(TextField);

export const CustomTooltip = withStyles({
    tooltip: {
        backgroundColor: '#000',
        width: '191px',
        textAlign: 'center'
    }
})(Tooltip);

