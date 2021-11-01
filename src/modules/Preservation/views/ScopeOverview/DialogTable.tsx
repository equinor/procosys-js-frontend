import React from 'react';
import { PreservedTag } from './types';
import { Container } from './DialogTable.style';
import ProcosysTable from '@procosys/components/Table';

interface TableProps {
    tags: PreservedTag[];
    columns: any[];
    toolbarText?: string;
    toolbarColor?: string;
}

const DialogTable = ({
    tags,
    columns,
    toolbarText,
    toolbarColor
}: TableProps): JSX.Element => {

    const numTags = tags.length;

    return (
        <Container>
            <div>
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

export default DialogTable;
