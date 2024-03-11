import { useRef, useState } from 'react';

import { TagListFilter } from './types';

export const numberOfFilters = (tagListFilter: TagListFilter): number =>
    Object.values(tagListFilter).filter((v) => v && JSON.stringify(v) != '[]')
        .length;

export const refreshScopeListCallback =
    useRef<(maxHeight: number, refreshOnResize?: boolean) => void>();

export const isFirstRender = useRef<boolean>(true);

export const moduleHeaderContainerRef = useRef<HTMLDivElement>(null);

export const [moduleHeaderHeight, setModuleHeaderHeight] =
    useState<number>(250);

export const moduleContainerRef = useRef<HTMLDivElement>(null);

export const [moduleAreaHeight, setModuleAreaHeight] = useState<number>(700);
