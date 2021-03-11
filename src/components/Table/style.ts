import styled, { css } from 'styled-components';

export const TableHeader = styled.div`
    outline: 0;
    overflow: hidden;
    vertical-align: middle;
    font-weight: 500;
    line-height: 1.5rem;
    position: sticky;
    z-index: 10;
    top: 0;
    border-bottom: 1px solid rgba(224, 224, 224, 1);
    &:hover $resizeHandle: {
        opacity: 1;
    }
`;

export const Table = styled.div`
    border-spacing: 0;
    overflow-y: auto;
    max-height: 100%;
    width: 100vw;
`;

export const TableHeadCell = styled.div`
    padding: 8px 1px 1px 16px;
    font-size: 0.875rem;
    min-height: 40px;
    flex-direction: column;
    text-align: left;
    vertical-align: inherit;
    font-weight: 500;
    background-color: rgb(247, 247, 247);
    line-height: 1.5rem;
    border-right: 1px solid rgba(224, 224, 224, 1);
    :last-child {
        border-right: none;
    }
`;

export const TableHeadFilterCell = styled.div`
    padding: 8px 1px 8px 16px;
    font-size: 0.875rem;
    min-height: 40px;
    flex-direction: column;
    text-align: left;
    vertical-align: inherit;
    font-weight: 500;
    line-height: 1.5rem;
`;

export const TableRow = styled.div`
    color: inherit;
    outline: 0;
    vertical-align: middle;
    &:hover {
        background-color: rgba(0, 0, 0, 0.07);
    }
    :last-child {
        border-bottom: none;
    }
    &.rowSelected {
        background-color: rgba(0, 0, 0, 0.04);
        &:hover {
            background-color: rgba(0, 0, 0, 0.07);
        }
    }
`;


export const TableCell = styled.div`
    padding: 12px 16px 16px 16px;
    font-size: inherit;
    text-align: left;
    border-bottom: 1px solid rgba(224, 224, 224, 1);
    font-weight: 400;
    line-height: 1.43;
    vertical-align: inherit;
    :last-child {
        border-right: none;
    }
`;

export const ColumnFilter = styled.div`
    display: block;
    width: 100%;
`;