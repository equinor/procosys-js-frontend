import { Tooltip, withStyles } from '@material-ui/core';

const CustomTooltip = withStyles({
    tooltip: {
        backgroundColor: '#000',
        width: '191px',
        textAlign: 'center',
    },
})(Tooltip);

export default CustomTooltip;
