import React, { useState } from 'react';

import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import { TreeContainer, NodeContainer, ExpandCollapseIcon, NodeName } from './style';
// import Spinner from './../Spinner';

export interface NodeData {
    id: number;
    parentId: number | null;
    name: string;
    nodeType: string;
    hasChildren: boolean;
    isExpanded: boolean;
    getChildren: (() => NodeData[]) | null;
    children: NodeData[] | null;
}

interface TreeViewProps {
    rootNodes: NodeData[];
}

const TreeView = ({
    rootNodes
}: TreeViewProps): JSX.Element => {

    const [treeData, setTreeData] = useState<NodeData[]>(rootNodes);

    const collapseNode = (node: NodeData): void => {
        if (!node.children || node.children.length === 0 || !node.isExpanded) {
            return;
        }

        node.isExpanded = false;

        const collapsingNodeId = node.id;
        const collapsingNodeIndex = treeData.findIndex(data => data.id === collapsingNodeId);

        let childCount = 0;

        // get number of child nodes to remove
        treeData.forEach(node => {
            let nodeParentId: number | null = node.parentId;

            while (nodeParentId !== null) {

                // check whether the child exists under node being collapsed
                if (nodeParentId === collapsingNodeId) {
                    node.isExpanded = false;
                    childCount++;
                }

                // move up the tree
                const parent = treeData.find(data => data.id === nodeParentId);
                nodeParentId = parent ? parent.parentId : null;
            }
        });

        const newTreeData = [...treeData];
        newTreeData.splice(collapsingNodeIndex + 1, childCount);

        setTreeData(newTreeData);
    };

    const expandNode = (node: NodeData): void => {
        if (!node.getChildren || node.isExpanded) {
            return;
        }

        node.isExpanded = true;

        let children: NodeData[] = [];

        if (node.children && node.children.length > 0) {
            // use already loaded children
            children = node.children;
        } else {
            // load children
            children = node.getChildren();

            // set parent relation for all children
            children.forEach(child => child.parentId = node.id);

            // set child relations for the parent
            node.children = children;
        }

        // insert children after parent
        const parentIndex = treeData.findIndex(data => data.id === node.id);

        const newTreeData = [...treeData];
        newTreeData.splice(parentIndex + 1, 0, ...children);

        setTreeData(newTreeData);
    };

    const getNodeIndentation = (node: NodeData): number => {
        let indentMultiplier = 0;
        let parentId = node.parentId;

        while (parentId !== null) {
            const parent = treeData.find(node => node.id === parentId);

            if (parent) {
                parentId = parent.parentId;
                indentMultiplier += 3;
            } else {
                parentId = null;
            }
        }

        return indentMultiplier;
    };

    const getExpandCollapseIcon = (node: NodeData): JSX.Element | null => {
        if (!node.hasChildren) {
            return null;
        }

        return (
            <ExpandCollapseIcon 
                onClick={(): void => {
                    node.isExpanded ? collapseNode(node) : expandNode(node);
                }}
            >
                { node.isExpanded && <KeyboardArrowDownIcon /> }
                { !node.isExpanded && <KeyboardArrowRightIcon /> }
            </ExpandCollapseIcon>  
        );
    };

    const getNode = (node: NodeData): JSX.Element => {
        const indent = getNodeIndentation(node);

        return (
            <NodeContainer key={node.id} indentMultiplier={indent}>
                {
                    getExpandCollapseIcon(node)
                }
                <NodeName hasChildren={node.hasChildren}>
                    {node.name}
                </NodeName>
            </NodeContainer>
        );
    };

    return (
        <TreeContainer>
            {
                treeData.map(node => getNode(node))
            }            
        </TreeContainer>
    );
};

export default TreeView;