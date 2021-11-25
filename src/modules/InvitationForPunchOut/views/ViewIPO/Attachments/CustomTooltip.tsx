import { Tooltip, withStyles } from '@material-ui/core';

const CustomTooltip = withStyles({
    tooltip: {
        backgroundColor: '#000',
        textAlign: 'center',
    },
})(Tooltip);

export default CustomTooltip;
