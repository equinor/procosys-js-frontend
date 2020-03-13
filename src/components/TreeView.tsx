import React, { useState } from 'react';
import styled from 'styled-components';

import Table from './Table';
import Spinner from '../components/Spinner';

const nodes = [
    {
        id: 1,
        nodeName: 'Node 1',
        hasChildren: true
    },
    {
        id: 100,
        nodeName: 'Dummy 100',
        parentId: 1,
        hasChildren: false
    },
    {
        id: 2,
        nodeName: 'Node 2',
        hasChildren: false
    },
    {
        id: 3,
        nodeName: 'Node 3',
        hasChildren: true
    },
    {
        id: 300,
        nodeName: 'Dummy 300',
        parentId: 3,
        hasChildren: false
    },
];

const SubNodes100 = [
    {
        id: 100,
        nodeName: 'SubNode 1-0',
        parentId: 1,
        hasChildren: false
    },
    {
        id: 101,
        nodeName: 'SubNode 1-1',
        parentId: 1,
        hasChildren: false
    },
    {
        id: 110,
        nodeName: 'SubNode 1-1-1',
        parentId: 101,
        hasChildren: false
    }
];

const SubNodes300 = [
    {
        id: 300,
        nodeName: 'SubNode 3-0',
        parentId: 3,
        hasChildren: false
    },
];

const TreeContainer = styled.div`
    width: 30%;

    td {
        border: 0;
        padding-left: 0;
    }
`;

const TreeView = (): JSX.Element => {

    const [treeData, setTreeData] = useState(nodes);

    const onTreeExpandChange = (data: any, isExpanded: boolean): void => {
        console.log('data', data);
    
        if (isExpanded) {
            
            setTimeout(() => {
                if (data.id === 1) {
                    const newTreeData = treeData.filter(data => data.nodeName !== 'Dummy 100');
                    setTreeData(newTreeData.concat(SubNodes100));
                }
    
                if (data.id === 3) {
                    const newTreeData = treeData.filter(data => data.nodeName !== 'Dummy 300');
                    setTreeData(newTreeData.concat(SubNodes300));
                }
            }, 2000);

        }    
    };

    const getTreeElement = (row: any): JSX.Element => {
        if (row.nodeName.startsWith('Dummy')) {
            return <Spinner />;
        }

        const marginLeft = row.parentId && row.parentId > 0 ? '0' : '0';

        return (
            <div style={{marginLeft: marginLeft}}>
                {row.nodeName}
            </div>
        );
    };

    return (
        <TreeContainer>
            <Table
                columns={[
                    { title: '-', render: getTreeElement }
                ]}
                data={treeData}
                parentChildData={
                    (row, rows): any => rows.find(r => r.id === row.parentId)
                }
                onTreeExpandChange={onTreeExpandChange}
                options={{
                    showTitle: false,
                    selection: false,
                    toolbar: false,
                    paging: false,
                    header: false,
                }}
            
                style={{ boxShadow: 'none' }}
            />
        </TreeContainer>
    );
};

export default TreeView;