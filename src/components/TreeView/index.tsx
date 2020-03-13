import React, { useState } from 'react';

import { TreeContainer, NodeContainer } from './style';
// import Spinner from './../Spinner';

export interface NodeData {
    id: number;
    parentId: number | null;
    name: string;
    nodeType: string;
    hasChildren: boolean;
    isExpanded: boolean;
    getChildren: (() => NodeData[]) | null;
}

interface TreeViewProps {
    rootNodes: NodeData[];
}

const TreeView = ({
    rootNodes
}: TreeViewProps): JSX.Element => {

    const [treeData, setTreeData] = useState<NodeData[]>(rootNodes);

    const expandNode = (nodeId: number, getChildren: () => NodeData[]): void => {
        const children = getChildren();

        const newTreeData = [...treeData];
        const parentIndex = treeData.findIndex(data => data.id === nodeId);
        newTreeData.splice(parentIndex + 1, 0, ...children);

        setTreeData(newTreeData);
    };

    const getNodes = (): JSX.Element => {

        return (
            <NodeContainer>
                {
                    treeData.map(node => {
                        return (
                            <div key={node.id} style={{display: 'flex'}}>
                                {
                                    node.hasChildren && (
                                        <button onClick={(): void => {
                                            node.getChildren && expandNode(node.id, node.getChildren);                     
                                        }}>
                                            expand
                                        </button>  
                                    )
                                }                             
                                {
                                    node.name
                                }
                            </div>
                        );
                    })
                }
            </NodeContainer>
        );
    };

    return (
        <TreeContainer>
            {
                // treeData.map(node => getNode(node))
                getNodes()
            }            
        </TreeContainer>
    );
};

export default TreeView;