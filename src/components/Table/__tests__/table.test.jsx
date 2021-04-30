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
        minWidth: 150
    },
    {
        Header: 'Description',
        accessor: 'description',
        width: 250,
        maxWidth: 400,
        minWidth: 150
    },
    {
        Header: 'Resp',
        accessor: 'responsibleCode'
    },
    {
        Header: 'Disc',
        accessor: 'disciplineCode'
    },
    {
        Header: 'Status',
        accessor: 'actionStatus'
    }
];


const maxRows = 10;

describe('<ProcosysTable />', () => {
    it('Render test', async () => {
        const { queryAllByRole, queryAllByText } = render(

            <ProcosysTable
                setPageSize={() => { }}
                onSort={() => { }}
                onSelectedChange={() => { }}
                pageIndex={0}
                pageSize={10}
                columns={columns}
                maxRowCount={maxRows}
                data={tags.tags}
                fetchData={() => { }}
                loading={false}
                pageCount={1} />
        );

        expect(queryAllByText('ACPF').length).toBe(6);
        expect(queryAllByRole('row').length).toBe(11); // data + header
        expect(queryAllByText('0000-ML-11-0396-CA2-00-A').length).toBe(1);
    });
});
