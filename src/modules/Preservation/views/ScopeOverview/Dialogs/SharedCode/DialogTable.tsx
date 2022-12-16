import React from 'react';
import { PreservedTag } from '../../types';
import { Container } from './DialogTable.style';
import ProcosysTable from '@procosys/components/Table';

interface RequiredTableProps {
    tags: PreservedTag[];
    columns: any[];
    toolbarText?: string;
    toolbarColor?: string;
}

interface OptionalTableProps {
    textColor: string;
}

interface TableProps extends RequiredTableProps, OptionalTableProps {}

const defaultProps: OptionalTableProps = {
    textColor: 'black',
};

const DialogTable = ({
    tags,
    columns,
    toolbarText,
    toolbarColor,
    textColor,
}: TableProps): JSX.Element => {
    const numTags = tags.length;

    return (
        <Container>
            <div style={{ color: textColor }}>
                <ProcosysTable
                    columns={columns}
                    data={tags}
                    pageIndex={0}
                    pageSize={10}
                    maxRowCount={tags.length}
                    clientPagination={true}
                    clientSorting={true}
                    pageCount={Math.ceil(columns.length / 10)}
                    toolbarText={toolbarText && numTags + ' ' + toolbarText}
                    toolbarColor={toolbarColor}
                />
            </div>
        </Container>
    );
};

DialogTable.defaultProps = defaultProps;

export default DialogTable;
