import { Prompt, useLocation } from 'react-router-dom';
import React, { useEffect, useMemo, useState } from 'react';

import propTypes from 'prop-types';

export interface IDirtyContext {
    isDirty: boolean;
    setDirtyStateFor: (componentName: string) => void;
    unsetDirtyStateFor: (componentName: string) => void;
    unsetDirtyStateForMany: (componentNames: string[]) => void;
    clearDirtyState: () => void;
}

export const unsavedChangesConfirmationMessage = 'You have unsaved changes. Are you sure you want to continue?';

const DirtyContext = React.createContext<IDirtyContext>({} as IDirtyContext);

export const DirtyContextProvider: React.FC = ({ children }): JSX.Element => {
    const [dirtyList, setDirtyList] = useState<Set<string>>(new Set<string>());
    const location = useLocation();
    const isDirty = useMemo<boolean>(() => {
        return dirtyList.size > 0;
    }, [dirtyList]);

    function setDirtyStateFor(componentName: string): void {
        setDirtyList(oldDirtyList => {
            const newList = new Set(oldDirtyList);
            return newList.add(componentName);
        });
    }

    function unsetDirtyStateFor(componentName: string): void {
        setDirtyList(oldDirtyList => {
            const newList = new Set(oldDirtyList);
            newList.delete(componentName);
            return newList;
        });
    }

    function unsetDirtyStateForMany(componentNames: string[]): void {
        setDirtyList(oldDirtyList => {
            const newList = new Set(oldDirtyList);
            componentNames.forEach(componentName => newList.delete(componentName));
            return newList;
        });
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

    function handleBeforeUnloadEvent(e: BeforeUnloadEvent): void {
        e.preventDefault();
        //On older browsers, the return value will be displayed in the dialog box. For newer browser, the text is 
        //controlled by the browser. 
        e.returnValue = unsavedChangesConfirmationMessage;
    }

    /** Handle dirty state when trying to navigate outside application */
    useEffect(() => {
        if (isDirty) {
            window.addEventListener('beforeunload', handleBeforeUnloadEvent);
            return (): void => {
                window.removeEventListener('beforeunload', handleBeforeUnloadEvent);
            };
        }
    }, [isDirty]);

    return (<DirtyContext.Provider value={{
        setDirtyStateFor: setDirtyStateFor,
        unsetDirtyStateFor,
        unsetDirtyStateForMany,
        clearDirtyState,
        isDirty,
    }}>
        <Prompt message={unsavedChangesConfirmationMessage} when={isDirty} />
        {children}
    </DirtyContext.Provider>);
};

DirtyContextProvider.propTypes = {
    children: propTypes.node
};

export const useDirtyContext = (): IDirtyContext => React.useContext<IDirtyContext>(DirtyContext);
