import { Checkbox } from '@equinor/eds-core-react';
import React from 'react';
import styled, { css } from 'styled-components';

export const TableHeader = styled.div`
    outline: 0;
    overflow: hidden;
    vertical-align: middle;
    font-weight: 500;
    line-height: 1.5rem;
    align-items: center;
    position: sticky;
    z-index: 10;
    top: 0;
    border-bottom: 1px solid rgba(224, 224, 224, 1);
    &:hover {
        opacity: 1;
    }
`;

export const Table = styled.div`
    border-spacing: 0;
    overflow-y: auto;
    max-height: 100%;
    width: fit-content;
`;

export const TableHeadCell = styled.div<{ align?: string }>`
    padding: 10px 0px 0px 4px;
    font-size: 0.875rem;
    min-height: 40px;
    flex-direction: column;
    vertical-align: inherit;
    font-weight: 500;
    background-color: rgb(247, 247, 247);
    line-height: 1.5rem;
    justify-content: ${(props): string => props.align === 'right' ? 'flex-end' : 'flex-start'};
    align-items: 'flex-start';
    display: 'flex';
    text-align: ${(props): string => props.align === 'right' ? 'right' : 'left'};
    // border-right: 1px solid rgba(224, 224, 224, 1);
    :last-child {
        border-right: none;
    }
`;

export const TableHeadFilterCell = styled.div`
    padding: 8px 1px 8px 2px;
    font-size: 0.875rem;
    min-height: 40px;
    flex-direction: column;
    text-align: left;
    vertical-align: inherit;
    font-weight: 500;
    line-height: 1.5rem;
`;

export const TableRow = styled.div<{ selected: boolean }>`
    color: inherit;
    outline: 0;
    vertical-align: middle;

    &:hover {
        background-color: rgba(0, 0, 0, 0.07);
    }
    :last-child {
        border-bottom: none;
    }
    ${(props): any => props.selected && css`
        background-color: rgb(230, 250, 236);
        &:hover {
            background-color: rgba(0, 0, 0, 0.07);
        }
    `}

`;

export const LoadingDiv = styled.div`
    display: flex;
    justify-content: center;
    width: 100%;
    > div {
        text-align: center;
    }
`;


export const TableCell = styled.div<{ align?: string }>`
    padding: 10px 4px 0px 4px;
    font-size: inherit;
    border-bottom: 1px solid rgba(224, 224, 224, 1);
    font-weight: 400;
    line-height: 1.43;
    vertical-align: inherit;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    color: inherit;
    justify-content: ${(props): string => props.align === 'right' ? 'flex-end' : 'flex-start'};
    align-items: 'flex-start';
    display: 'flex';
    text-align: ${(props): string => props.align === 'right' ? 'right' : 'left'};
    :last-child {
        border-right: none;
    }
`;

export const ColumnFilter = styled.div`
    display: block;
    width: 100%;
`;

export const ResizeHandleComponent = styled.div<{ handleActive: boolean }>`
    position: absolute;
    cursor: col-resize;
    z-index: 100;
    opacity: 1;
    border-left: 1px solid rgba(0, 0, 0, 0.2);
    /* border-right: 1px solid rgba(0, 0, 0, 0.5); */
    height: 60%;
    top: 20%;
    transition: all linear 100ms;
    right: -2px;
    width: 3px;
    ${(props): any => props.handleActive && css`
        opacity: 1;
        border: none;
        background-color: rgba(0, 0, 0, 0.5);
        height: calc(100% - 4px);
        top: 2px;
        right: -1px;
        width: 1px;
    `}
`;

export const HeaderCheckbox = styled(Checkbox)`
    padding: 0;
    margin-top: -4px;
    > span {
        padding: 2px 0px 0px 0px;
    }
`;

export const RowCheckbox = styled(Checkbox)`
    padding: 0px;
    margin-top: -2px;
    > span {
        padding: 0;
    }
`;
