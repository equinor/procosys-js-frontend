import { render } from '@testing-library/react';
import React from 'react';

import TagDetails from '../TagDetails';

const selectedTags = [
    {
        tagNo: 'tagno-1',
        description: 'description-1',
        mcPkgNo: 'mcpkgno-1',
    },
    {
        tagNo: 'tagno-2',
        description: 'description-2',
        mcPkgNo: 'mcpkgno-2',
    },
    {
        tagNo: 'tagno-3',
        description: 'description-3',
        mcPkgNo: 'mcpkgno-3',
    },
];

describe('Module: <TagDetails />', () => {
    it('Should render all selected tags', () => {
        const { getByText } = render(
            <TagDetails selectedTags={selectedTags} />
        );
        expect(getByText('tagno-1')).toBeInTheDocument();
        expect(getByText('tagno-2')).toBeInTheDocument();
        expect(getByText('tagno-3')).toBeInTheDocument();
    });

    it('Should show and hide tag details when expand button is clicked', () => {
        const { container, queryByText } = render(
            <TagDetails selectedTags={selectedTags} />
        );

        const expandButton = container.querySelector('button');

        // collapsed by default
        expect(queryByText('mcpkgno-1')).toBeNull();
        expect(queryByText('description-1')).toBeNull();

        // expand
        expandButton.click();
        expect(queryByText('mcpkgno-1')).not.toBeNull();
        expect(queryByText('description-1')).not.toBeNull();

        // collapse
        expandButton.click();
        expect(queryByText('mcpkgno-1')).toBeNull();
        expect(queryByText('description-1')).toBeNull();
    });
});
