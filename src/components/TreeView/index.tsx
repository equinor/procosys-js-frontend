import React, { useState } from 'react';

import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import { TreeContainer, NodeContainer, ExpandCollapseIcon, NodeName, NodeLink } from './style';

/**
 * @param id Unique identifier across all nodes in the tree (number or string).
 * @param name Node display name.
 * @param getChildren Optional: function to load children.
 * @param onClick Optional: function to handle click event on node.
 */
export interface TreeViewNode {
    id: number | string;
    name: string;
    getChildren?: () => Promise<TreeViewNode[]>;
    onClick?: () => void;
}

// internal props
interface NodeData extends TreeViewNode {
    parentId?: number | string;
    isExpanded?: boolean;
    children?: NodeData[];
}

interface TreeViewProps {
    rootNodes: TreeViewNode[];
}

const TreeView = ({
    rootNodes
}: TreeViewProps): JSX.Element => {

    const [treeData, setTreeData] = useState<NodeData[]>(rootNodes);

    const collapseNode = (node: NodeData): void => {
        // set collapsed state
        node.isExpanded = false;

        const collapsingNodeId = node.id;
        const collapsingNodeIndex = treeData.findIndex(data => data.id === collapsingNodeId);

        let childCount = 0;

        // get number of child nodes to remove
        treeData.forEach(treeNode => {
            let nodeParentId: number | string | null | undefined = treeNode.parentId;

            while (nodeParentId) {
                // check whether the child exists under node being collapsed
                if (nodeParentId === collapsingNodeId) {
                    treeNode.isExpanded = false;
                    childCount++;
                }

                // move up the tree
                const parent = treeData.find(data => data.id === nodeParentId);
                nodeParentId = parent ? parent.parentId : null;
            }
        });

        // remove children after parent
        const newTreeData = [...treeData];
        newTreeData.splice(collapsingNodeIndex + 1, childCount);

        setTreeData(newTreeData);
    };

    const expandNode = async (node: NodeData): Promise<void> => {
        // set expanded state
        node.isExpanded = true;

        let children: NodeData[] = [];

        if (node.children && node.children.length > 0) {
            // use already loaded children
            children = node.children;
        } else {
            // load children 
            if (node.getChildren) {
                children = await node.getChildren();
            }

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
        let parentId: string | number | null | undefined = node.parentId;

        // add indentation based on number of parents up the tree
        while (parentId) {
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
        if (!node.getChildren) {
            // node has no function for fetching children and cannot be expanded
            return null;
        }

        const isExpanded = node.isExpanded === true;

        return (
            <ExpandCollapseIcon
                isExpanded={isExpanded}
                onClick={async (): Promise<void> => {
                    isExpanded ? collapseNode(node) : await expandNode(node);
                }}
            >
                {isExpanded && <KeyboardArrowDownIcon />}
                {!isExpanded && <KeyboardArrowRightIcon />}
            </ExpandCollapseIcon>
        );
    };

    const getNodeLink = (node: NodeData): JSX.Element => {
        return (
            <NodeName
                hasChildren={node.getChildren ? true : false}
                isExpanded={node.isExpanded === true}>
                {
                    node.onClick && (
                        <NodeLink
                            isExpanded={node.isExpanded === true}
                            onClick={node.onClick}
                        >
                            {node.name}
                        </NodeLink>
                    )
                }
                {
                    !node.onClick && node.name
                }
            </NodeName>
        );
    };

    const getNode = (node: NodeData): JSX.Element => {
        const indent = getNodeIndentation(node);

        return (
            <NodeContainer key={node.id} indentMultiplier={indent}>
                {getExpandCollapseIcon(node)}
                {getNodeLink(node)}
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