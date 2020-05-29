import SvgIcon, { SvgIconProps } from '@material-ui/core/SvgIcon';

import React from 'react';

const TagFunctionIcon = (props: SvgIconProps): JSX.Element => {
    return <SvgIcon {...props}>
        <path fillRule="evenodd" clipRule="evenodd" d="M12 6.5C12 6.22386 11.7761 6 11.5 6H2.5C2.22386 6 2 6.22386 2 6.5V7.5C2 7.77614 2.22386 8 2.5 8L5.5 8C5.77614 8 6 8.22386 6 8.5L6 18.5C6 18.7761 6.22386 19 6.5 19H7.5C7.77614 19 8 18.7761 8 18.5L8 8.5C8 8.22386 8.22386 8 8.5 8H11.5C11.7761 8 12 7.77614 12 7.5V6.5Z" fill="#3D3D3D"/>
        <path fillRule="evenodd" clipRule="evenodd" d="M13 6.5C13 6.22386 13.2239 6 13.5 6H21.5C21.7761 6 22 6.22386 22 6.5V7.5C22 7.77614 21.7761 8 21.5 8H15.5C15.2239 8 15 8.22386 15 8.5L15 11.5C15 11.7761 15.2239 12 15.5 12H19.5C19.7761 12 20 12.2239 20 12.5V13.5C20 13.7761 19.7761 14 19.5 14H15.5C15.2239 14 15 14.2239 15 14.5L15 18.5C15 18.7761 14.7761 19 14.5 19H13.5C13.2239 19 13 18.7761 13 18.5V14V12V8V6.5Z" fill="#3D3D3D"/>
    </SvgIcon>;
};

export default TagFunctionIcon;
