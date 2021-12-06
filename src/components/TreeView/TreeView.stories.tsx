import React, { useState } from 'react';
import TreeView, {
    TreeViewProps,
    TreeViewNode,
} from '@procosys/components/TreeView';
import { Story, Meta } from '@storybook/react';
import styled from 'styled-components';
import { LibraryType } from '@procosys/modules/PlantConfig/views/Library/Library';

const Wrapper = styled.div`
    margin: 32px;
    display: grid;
    grid-gap: 32px;
    width: 200px;
`;

const getRegisterNodes = async (): Promise<TreeViewNode[]> => {
    const children: TreeViewNode[] = [
        { id: 'Child1', name: 'Child1', getChildren: getRegisterNodes2 },
        { id: 'Child2', name: 'Child2' },
    ];
    return children;
};

const getRegisterNodes2 = async (): Promise<TreeViewNode[]> => {
    const children: TreeViewNode[] = [
        { id: 'GrandChild1', name: 'GrandChild1' },
        { id: 'GrandChild2', name: 'GrandChild2' },
    ];
    return children;
};

const rootNodes: TreeViewNode[] = [
    {
        id: LibraryType.TAG_FUNCTION,
        name: 'Tag functions',
        getChildren: getRegisterNodes,
    },
    {
        id: LibraryType.MODE,
        name: 'Modes',
    },
    {
        id: LibraryType.PRES_JOURNEY,
        name: 'Preservation journeys',
        getChildren: getRegisterNodes,
    },
    {
        id: LibraryType.PRES_REQUIREMENT,
        name: 'Preservation requirements',
    },
];

export default {
    title: 'Procosys/TreeView',
    component: TreeView,
    parameters: {
        docs: {
            description: {
                component: `TreeView component used in Procosys.
        `,
            },
        },
        info: {},
    },
    args: {
        rootNodes: rootNodes,
    },
} as Meta;

export const Default: Story<TreeViewProps> = (
    args: JSX.IntrinsicAttributes &
        TreeViewProps & { children?: React.ReactNode }
) => {
    return (
        <Wrapper>
            <TreeView {...args}></TreeView>
        </Wrapper>
    );
};
