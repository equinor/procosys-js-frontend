import React, { useContext } from 'react';
import { Account } from 'msal';

interface IAzureAccount extends Account {
    accessToken: string;
    data: any;
}

const userContext = React.createContext<any>(null);
const useUser = (): IAzureAccount => useContext(userContext);
export {
    useUser
};
export default userContext;
