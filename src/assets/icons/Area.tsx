import SvgIcon, { SvgIconProps } from '@material-ui/core/SvgIcon';

import React from 'react';

const AreaIcon = (props: SvgIconProps): JSX.Element => {
    return (
        <SvgIcon {...props}>
            <path
                d="M12 8.5C12.5523 8.5 13 8.05228 13 7.5C13 6.94772 12.5523 6.5 12 6.5C11.4477 6.5 11 6.94772 11 7.5C11 8.05228 11.4477 8.5 12 8.5Z"
                fill="#6F6F6F"
            />
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M12.0002 16.5L15.8622 9.81082C16.2672 9.13537 16.5 8.34488 16.5 7.5C16.5 5.01472 14.4853 3 12 3C9.51472 3 7.5 5.01472 7.5 7.5C7.5 8.35027 7.73582 9.14545 8.14561 9.82373L12.0002 16.5ZM14.1469 8.78232L14.1384 8.7965L12.0002 12.5L9.86772 8.80651L9.85744 8.78949C9.63086 8.41447 9.5 7.97557 9.5 7.5C9.5 6.11929 10.6193 5 12 5C13.3807 5 14.5 6.11929 14.5 7.5C14.5 7.9726 14.3708 8.40891 14.1469 8.78232Z"
                fill="#6F6F6F"
            />
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M3 9C3 8.44772 3.44772 8 4 8H5.5C6.05228 8 6.5 8.44772 6.5 9V9.25C6.5 9.66421 6.16421 10 5.75 10C5.33579 10 5 10.3358 5 10.75V18C5 18.5523 5.44772 19 6 19H18C18.5523 19 19 18.5523 19 18V10.75C19 10.3358 18.6642 10 18.25 10C17.8358 10 17.5 9.66421 17.5 9.25V9C17.5 8.44772 17.9477 8 18.5 8H20C20.5523 8 21 8.44772 21 9V20C21 20.5523 20.5523 21 20 21H4C3.44772 21 3 20.5523 3 20V9Z"
                fill="#6F6F6F"
            />
        </SvgIcon>
    );
};

export default AreaIcon;
