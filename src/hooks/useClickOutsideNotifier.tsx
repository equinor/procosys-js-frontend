import { MutableRefObject, useEffect } from 'react';

/**
 * Hook that alerts us when user clicks outside the given ref.
 * @param cb Will be called when user clicks outside the referenced element
 * @param targetRef Reference to a <HTMLElement>
 */
const useClickOutsideNotifier = (
    cb: (originalEvent: Event) => void,
    targetRef: MutableRefObject<HTMLElement | null>
): void => {

    const handleClickOutsideTarget = (event: Event): void => {
        if (targetRef.current && !targetRef.current.contains((event.target as Node))) {
            cb(event);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutsideTarget);
        return (): void => {
            document.removeEventListener('mousedown', handleClickOutsideTarget);
        };
    });
};

export default useClickOutsideNotifier;
