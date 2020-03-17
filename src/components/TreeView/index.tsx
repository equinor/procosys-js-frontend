import React, { useState } from 'react';

import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import { TreeContainer, NodeContainer, ExpandCollapseIcon, NodeName, NodeLink } from './style';

export interface NodeData {
    id: number | string;
    parentId: number | string | null;
    name: string;
    isExpanded: boolean;
    hasChildren: boolean;
    getChildren: (() => NodeData[]) | null;
    children: NodeData[] | null;
    onClick: (() => void) | null;
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
            let nodeParentId: number | string | null = node.parentId;

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

        // add indentation based on number of parents up the tree
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

        const isExpanded = node.isExpanded;

        return (
            <ExpandCollapseIcon 
                isExpanded={isExpanded}
                onClick={(): void => {
                    isExpanded ? collapseNode(node) : expandNode(node);
                }}
            >
                { isExpanded && <KeyboardArrowDownIcon /> }
                { !isExpanded && <KeyboardArrowRightIcon /> }
            </ExpandCollapseIcon>  
        );
    };

    const getNodeLink = (node: NodeData): JSX.Element => {
        const hasOnClickEvent = node.onClick;

        return (
            <NodeName 
                hasChildren={node.hasChildren} 
                isExpanded={node.isExpanded}>
                {
                    hasOnClickEvent && (
                        <NodeLink onClick={(): void => {
                            node.onClick && node.onClick();
                        }}>
                            {node.name}
                        </NodeLink>
                    )
                }
                {
                    !hasOnClickEvent && node.name
                }
            </NodeName>
        );
    };

    const getNode = (node: NodeData): JSX.Element => {
        const indent = getNodeIndentation(node);

        return (
            <NodeContainer key={node.id} indentMultiplier={indent}>
                { getExpandCollapseIcon(node) }
                { getNodeLink(node) }
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