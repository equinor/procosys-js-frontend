import React, { useState, useEffect } from 'react';
import {
    TreeContainer,
    NodeContainer,
    ExpandCollapseIcon,
    NodeName,
    NodeLink,
} from './style';
import Spinner from '../Spinner';
import { KeyboardArrowDown, KeyboardArrowRight } from '@mui/icons-material';
import { Link, useLocation } from 'react-router-dom';

/**
 * @param id Unique identifier across all nodes in the tree (number or string).
 * @param name Node display name.
 * @param isVoided Optional: indicates that node is voided (will render different than non-voided nodes)
 * @param getChildren Optional: function to load children.
 * @param onClick Optional: function to handle click event on node.
 */
export interface TreeViewNode {
    id: number | string;
    name: string;
    isVoided?: boolean;
    getChildren?: () => Promise<TreeViewNode[]>;
    onClick?: () => void;
}

// internal props
interface NodeData extends TreeViewNode {
    parentId?: number | string;
    isExpanded?: boolean;
    isSelected?: boolean;
    children?: NodeData[];
}

export interface TreeViewProps {
    rootNodes: TreeViewNode[];
    dirtyNodeId?: number | string;
    resetDirtyNode?: () => void;
    hasUnsavedChanges?: boolean;
    unsavedChangesConfirmationMessage?: string;
}

const TreeView = ({
    rootNodes,
    dirtyNodeId,
    resetDirtyNode,
    hasUnsavedChanges = false,
    unsavedChangesConfirmationMessage = 'You have unsaved changes. Are you sure you want to continue?',
}: TreeViewProps): JSX.Element => {
    const [treeData, setTreeData] = useState<NodeData[]>(rootNodes);
    const [loading, setLoading] = useState<number | string | null>();
    const [selectedNodeId, setSelectedNodeId] = useState<number | string>();
    const [pathToExpandTree, setPathToExpandTree] =
        useState<(string | number)[]>();
    // const location = useLocation();

    const getNodeChildCountAndCollapse = (
        parentNodeId: string | number
    ): number => {
        let childCount = 0;

        treeData.forEach((treeNode) => {
            let nodeParentId: number | string | null | undefined =
                treeNode.parentId;

            while (nodeParentId) {
                // check whether the child exists under the parent node in question (and collapse)
                if (nodeParentId === parentNodeId) {
                    treeNode.isExpanded = false;
                    childCount++;
                }

                // move up the tree
                const parent = treeData.find(
                    (data) => data.id === nodeParentId
                );
                nodeParentId = parent ? parent.parentId : null;
            }
        });

        return childCount;
    };

    const getNodeChildren = async (node: NodeData): Promise<NodeData[]> => {
        let children: NodeData[] = [];

        if (node.getChildren) {
            setLoading(node.id);
            children = await node.getChildren();
            setLoading(null);
        }

        // set parent relation for all children
        children.forEach((child) => (child.parentId = node.id));

        // set child relations for the parent
        node.children = children;

        return children;
    };

    const collapseNode = (node: NodeData): void => {
        // set collapsed state
        node.isExpanded = false;

        const collapsingNodeId = node.id;
        const collapsingNodeIndex = treeData.findIndex(
            (data) => data.id === collapsingNodeId
        );

        // get number of child nodes to remove
        const childCount = getNodeChildCountAndCollapse(collapsingNodeId);

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
            children = await getNodeChildren(node);
        }

        // insert children after parent
        const expandingNodeIndex = treeData.findIndex(
            (data) => data.id === node.id
        );

        const newTreeData = [...treeData];
        newTreeData.splice(expandingNodeIndex + 1, 0, ...children);

        setTreeData(newTreeData);
    };

    /** Find path to selected node, recusively */
    const getPathToSelectedNode = (
        nodeId: string | number,
        path: (string | number)[]
    ): (string | number)[] => {
        const node = treeData.find((data) => data.id === nodeId);

        if (node && node.parentId) {
            path.unshift(node.parentId);
            getPathToSelectedNode(node.parentId, path);
        }
        return path;
    };

    const refreshNode = async (node: NodeData): Promise<void> => {
        //Find path to selected node, to get tree expanded after refresh
        let pathToSelectedNode;
        if (selectedNodeId) {
            pathToSelectedNode = getPathToSelectedNode(selectedNodeId, []);
            setPathToExpandTree(pathToSelectedNode);
        }

        const refreshingNodeId = node.id;
        const refreshingNodeIndex = treeData.findIndex(
            (data) => data.id === refreshingNodeId
        );

        // get number of child nodes to remove
        const childCount = getNodeChildCountAndCollapse(refreshingNodeId);

        // remove children after parent
        const newTreeData = [...treeData];
        newTreeData.splice(refreshingNodeIndex + 1, childCount);

        // get new children
        const newChildren = await getNodeChildren(node);

        // insert new children after parent
        newTreeData.splice(refreshingNodeIndex + 1, 0, ...newChildren);

        setTreeData(newTreeData);
    };

    const getNodeIndentation = (node: NodeData): number => {
        let indentMultiplier = 0;
        let parentId: string | number | null | undefined = node.parentId;

        // add indentation based on number of parents up the tree
        while (parentId) {
            const parent = treeData.find((node) => node.id === parentId);

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
                    loading
                        ? null
                        : isExpanded
                          ? collapseNode(node)
                          : await expandNode(node);
                }}
                spinner={loading == node.id}
            >
                {isExpanded && loading != node.id && <KeyboardArrowDown />}
                {!isExpanded && loading != node.id && <KeyboardArrowRight />}
                {loading == node.id && <Spinner />}
            </ExpandCollapseIcon>
        );
    };

    const selectNode = (node: NodeData): void => {
        if (selectedNodeId) {
            const currentSelectedNodeIndex = treeData.findIndex(
                (node) => node.id === selectedNodeId
            );
            if (currentSelectedNodeIndex != -1) {
                treeData[currentSelectedNodeIndex].isSelected = false;
            }
        }
        node.isSelected = true;
        setSelectedNodeId(node.id);
        node.onClick && node.onClick();
    };

    const handleOnClick = (node: NodeData): void => {
        if (!hasUnsavedChanges || confirm(unsavedChangesConfirmationMessage)) {
            selectNode(node);
        }
    };

    const getParentPath = (node: NodeData, treeData: NodeData[]): any => {
        if (!node.parentId) {
            return [node.name];
        } else {
            const parent = treeData.find((n) => n.id === node.parentId);
            if (parent) {
                const parentPath = getParentPath(parent, treeData);
                return [...parentPath, node.name];
            } else {
                return [node.name];
            }
        }
    };

    const constructPath = (node: NodeData, treeData: NodeData[]): string => {
        const parentPath = getParentPath(node, treeData);
        const path = parentPath.join('/');

        if (!node.parentId) {
            return path;
        } else {
            return `${path}/${node.id}`;
        }
    };

    const getNodeLink = (node: NodeData): JSX.Element => {
        const finalPath = constructPath(node, treeData);

        const linkContent = (
            <NodeName
                hasChildren={node.getChildren ? true : false}
                isExpanded={node.isExpanded === true}
                isVoided={node.isVoided === true}
                isSelected={node.isSelected === true}
                title={node.name}
            >
                {node.onClick ? (
                    <NodeLink
                        isExpanded={node.isExpanded === true}
                        isVoided={node.isVoided === true}
                        onClick={(): void => {
                            handleOnClick(node);
                        }}
                        isSelected={node.isSelected ? true : false}
                    >
                        {node.name}
                    </NodeLink>
                ) : (
                    node.name
                )}
            </NodeName>
        );
        if (node.onClick) {
            return (
                <Link
                    to={`/${finalPath}`}
                    style={{ textDecoration: 'none', color: 'inherit' }}
                >
                    {linkContent}
                </Link>
            );
        } else {
            return linkContent;
        }
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

    useEffect(() => {
        if (dirtyNodeId && dirtyNodeId !== '') {
            const dirtyNode = treeData.find((node) => node.id === dirtyNodeId);

            if (
                dirtyNode &&
                dirtyNode.children &&
                dirtyNode.children.length > 0
            ) {
                refreshNode(dirtyNode);
                resetDirtyNode && resetDirtyNode();
            }
        }
    }, [dirtyNodeId]);

    useEffect(() => {
        (async (): Promise<void> => {
            if (pathToExpandTree) {
                for (const nodeId of pathToExpandTree) {
                    const node = treeData.find((node) => node.id === nodeId);
                    if (node && !node.isExpanded) {
                        await expandNode(node);
                    }
                }
                setPathToExpandTree([]);
            }
            if (selectedNodeId) {
                const selected = treeData.find(
                    (node) => node.id === selectedNodeId
                );
                if (selected) {
                    selected.isSelected = true;
                }
            }
        })();
    }, [treeData]);

    // useEffect(() => {
    //     const pathname = location.pathname;
    //     const nodeNames = pathname.split('/').filter((name) => name !== '');

    //     console.log('nodeNames', nodeNames);

    //     let currentNode: NodeData | undefined = undefined;
    //     for (const name of nodeNames) {
    //         if (currentNode) {
    //             const childNode: NodeData | undefined =
    //                 currentNode.children?.find(
    //                     (node: NodeData) => node.name === name
    //                 );
    //             if (childNode) {
    //                 currentNode = childNode;
    //                 // currentNode.isExpanded = true;
    //                 expandNode(currentNode);
    //             } else {
    //                 break;
    //             }
    //         } else {
    //             const rootNode = treeData.find((node) => node.name === name);
    //             if (rootNode) {
    //                 // rootNode.isSelected = true;
    //                 // rootNode.isExpanded = true;
    //                 // setSelectedNodeId(rootNode.id);
    //                 expandNode(rootNode);
    //                 currentNode = rootNode;
    //             }
    //         }
    //     }
    // }, [location.pathname]);

    return (
        <TreeContainer>{treeData.map((node) => getNode(node))}</TreeContainer>
    );
};

export default TreeView;
