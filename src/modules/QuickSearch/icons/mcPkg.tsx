import React from 'react';

const MCPkgIcon = (): JSX.Element => {
    return (
        <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M13 5C13 3.89543 13.8954 3 15 3L19 3C20.1046 3 21 3.89543 21 5V19C21 20.1046 20.1046 21 19 21H15C13.8954 21 13 20.1046 13 19V5Z"
                fill="#007079"
            />
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M9 5H5V19H9V5ZM5 3C3.89543 3 3 3.89543 3 5V19C3 20.1046 3.89543 21 5 21H9C10.1046 21 11 20.1046 11 19V5C11 3.89543 10.1046 3 9 3H5Z"
                fill="#007079"
            />
        </svg>
    );
};

export default MCPkgIcon;
