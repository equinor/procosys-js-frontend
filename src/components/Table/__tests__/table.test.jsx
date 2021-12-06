import ProcosysTable from '..';
import React from 'react';
import { render } from '@testing-library/react';

const tags = require('./data.json');

const columns = [
    {
        Header: 'Tag nr',
        accessor: 'tagNo',
        id: 'tagNo',
        width: 180,
        maxWidth: 400,
        minWidth: 150,
    },
    {
        Header: 'Description',
        accessor: 'description',
        width: 250,
        maxWidth: 400,
        minWidth: 150,
    },
    {
        Header: 'Resp',
        accessor: 'responsibleCode',
    },
    {
        Header: 'Disc',
        accessor: 'disciplineCode',
    },
    {
        Header: 'Status',
        accessor: 'actionStatus',
    },
];

const maxRows = 10;

describe('<ProcosysTable />', () => {
    it('Render test', async () => {
        const { queryAllByRole, queryAllByText } = render(
            <ProcosysTable
                setPageSize={() => {}}
                onSort={() => {}}
                onSelectedChange={() => {}}
                pageIndex={0}
                pageSize={100}
                columns={columns}
                maxRowCount={maxRows}
                data={tags.tags}
                fetchData={() => {}}
                loading={false}
                pageCount={1}
            />
        );

        expect(queryAllByText('ACPF').length).toBe(12);
        expect(queryAllByRole('row').length).toBe(24); // data + header
        expect(queryAllByText('SX86M90011A').length).toBe(1);
    });
});
