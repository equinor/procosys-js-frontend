import React, { useRef, useEffect, MutableRefObject } from 'react'

/**
 * Hook that alerts us when user clicks outside the given ref.
 * @param cb Will be called when user clicks outside the referenced element
 * @param targetRef Reference to a <HTMLElement>
 */
const useClickOutsideNotifier = (
    cb: (originalEvent: Event) => void,
    targetRef: MutableRefObject<HTMLElement | null>
) => {

    const handleClickOutsideTarget = (event: Event): void => {
        console.log("Clicked somewhere");
        if (targetRef.current && !targetRef.current.contains((event.target as Node))) {
            console.log("Clicked outside");
            cb(event);
        }
    }

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutsideTarget);
        return () => {
            document.removeEventListener('mousedown', handleClickOutsideTarget);
        }
    })
}

export default useClickOutsideNotifier
