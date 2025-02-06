import { useLocation, UNSAFE_NavigationContext } from 'react-router-dom';
import React, {
    useEffect,
    useMemo,
    useState,
    useContext,
    PropsWithChildren,
} from 'react';
import propTypes from 'prop-types';
import { History } from 'history';

export interface IDirtyContext {
    isDirty: boolean;
    setDirtyStateFor: (componentName: string) => void;
    unsetDirtyStateFor: (componentName: string) => void;
    unsetDirtyStateForMany: (componentNames: string[]) => void;
    clearDirtyState: () => void;
}

export const unsavedChangesConfirmationMessage =
    'You have unsaved changes. Are you sure you want to continue?';

const DirtyContext = React.createContext<IDirtyContext>({} as IDirtyContext);

export const DirtyContextProvider = ({
    children,
}: PropsWithChildren): JSX.Element => {
    const [dirtyList, setDirtyList] = useState<Set<string>>(new Set<string>());
    const location = useLocation();
    const isDirty = useMemo<boolean>(() => {
        return dirtyList.size > 0;
    }, [dirtyList]);

    const unblockRef = React.useRef<undefined | VoidFunction>();

    const { navigator } = useContext(UNSAFE_NavigationContext);
    const history = navigator as History;

    function setDirtyStateFor(componentName: string): void {
        setDirtyList((oldDirtyList) => {
            const newList = new Set(oldDirtyList);
            return newList.add(componentName);
        });
    }

    function unsetDirtyStateFor(componentName: string): void {
        setDirtyList((oldDirtyList) => {
            const newList = new Set(oldDirtyList);
            newList.delete(componentName);
            return newList;
        });
    }

    function unsetDirtyStateForMany(componentNames: string[]): void {
        setDirtyList((oldDirtyList) => {
            const newList = new Set(oldDirtyList);
            componentNames.forEach((componentName) =>
                newList.delete(componentName)
            );
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

    /** Handle dirty state when trying to navigate outside the application */
    useEffect(() => {
        if (isDirty) {
            window.addEventListener('beforeunload', handleBeforeUnloadEvent);

            unblockRef.current = history.block((tx) => {
                if (window.confirm(unsavedChangesConfirmationMessage)) {
                    unblockRef.current && unblockRef.current();
                    tx.retry();
                }
            });

            return (): void => {
                window.removeEventListener(
                    'beforeunload',
                    handleBeforeUnloadEvent
                );
                if (unblockRef.current) unblockRef.current();
            };
        }
    }, [isDirty, history]);

    return (
        <DirtyContext.Provider
            value={{
                setDirtyStateFor,
                unsetDirtyStateFor,
                unsetDirtyStateForMany,
                clearDirtyState,
                isDirty,
            }}
        >
            {children}
        </DirtyContext.Provider>
    );
};

DirtyContextProvider.propTypes = {
    children: propTypes.node,
};

export const useDirtyContext = (): IDirtyContext =>
    React.useContext<IDirtyContext>(DirtyContext);
