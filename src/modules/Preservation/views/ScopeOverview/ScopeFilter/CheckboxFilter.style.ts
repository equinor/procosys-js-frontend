import { Checkbox } from '@equinor/eds-core-react';
import styled from 'styled-components';

export const ExpandedContainer = styled.div`
    padding-left: calc(var(--grid-unit) * 2);
`;

export const ScopeFilterCheckbox = styled(Checkbox).withConfig({
    displayName: 'scope-filter-item-',
})`
    display: flex;
    height: 40px;
    & > span:last-child {
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
    }
`;
