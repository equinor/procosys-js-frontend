import React, { ReactElement } from 'react';
import { ColumnInstance } from 'react-table';
import { ResizeHandleComponent } from './style';

export const ResizeHandle = ({
    column,
}: {
    column: ColumnInstance
}): ReactElement => {
    return (
        <ResizeHandleComponent handleActive={column.isResizing} {...column.getResizerProps()} />
    );
};
