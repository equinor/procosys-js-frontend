import { Tooltip } from '@mui/material';
import { withStyles } from '@mui/styles';

const CustomTooltip = withStyles({
    tooltip: {
        backgroundColor: '#000',
        textAlign: 'center',
    },
})(Tooltip);

export default CustomTooltip;
