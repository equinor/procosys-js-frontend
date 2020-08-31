import { Prompt, useLocation } from 'react-router-dom';
import React, { useEffect, useMemo, useState } from 'react';

import propTypes from 'prop-types';

export interface IDirtyContext {
    isDirty: boolean;
    setDirtyStateFor: (componentName: string) => void;
    unsetDirtyStateFor: (componentName: string) => void;
    clearDirtyState: () => void;
}

const DirtyContext = React.createContext<IDirtyContext>({} as IDirtyContext);

export const DirtyContextProvider: React.FC = ({ children }): JSX.Element => {
    const [dirtyList, setDirtyList] = useState<Set<string>>(new Set<string>());
    const location = useLocation();
    const isDirty = useMemo<boolean>(() => {
        return dirtyList.size > 0;
    }, [dirtyList]);

    function setDirtyStateFor(componentName: string): void {
        const newDirtyList = new Set(dirtyList);
        newDirtyList.add(componentName);
        setDirtyList(newDirtyList);
    }

    function unsetDirtyStateFor(componentName: string): void {
        const newDirtyList = new Set(dirtyList);
        // Only changes the state if there actually was a item removed
        newDirtyList.delete(componentName) && setDirtyList(newDirtyList);
    }

    function clearDirtyState(): void {
        setDirtyList(new Set());
    }

    useEffect(() => {
        clearDirtyState();
        return (): void => {
            clearDirtyState();
        };
    }, [location]);


    return (<DirtyContext.Provider value={{
        setDirtyStateFor: setDirtyStateFor,
        unsetDirtyStateFor,
        clearDirtyState,
        isDirty,
    }}>
        <Prompt message="You have unsaved changes, are you sure you want to continue?" when={isDirty} />
        {children}
    </DirtyContext.Provider>);
};

DirtyContextProvider.propTypes = {
    children: propTypes.node
};

export const useDirtyContext = (): IDirtyContext => React.useContext<IDirtyContext>(DirtyContext);
