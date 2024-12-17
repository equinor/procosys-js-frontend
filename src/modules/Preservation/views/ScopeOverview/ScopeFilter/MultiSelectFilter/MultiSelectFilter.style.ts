import styled from 'styled-components';
import { tokens } from '@equinor/eds-tokens';

export const SelectedItemsContainer = styled.div`
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    margin: var(--grid-unit) 0px;
`;

export const Item = styled.div`
    padding: 12px 24px;
    display: flex;
    align-items: center;
    :hover {
        background-color: ${tokens.colors.ui.background__light.rgba};
    }
    svg {
        margin-right: 1rem;
    }
`;

export const FilterContainer = styled.div`
    display: flex;
    flex-direction: column;
    margin: var(--grid-unit) calc(2 * var(--grid-unit));
    button {
        background-color: ${tokens.colors.ui.background__light.rgba};
        color: ${tokens.colors.text.static_icons__tertiary.rgba};
        border-bottom: 1px solid
            ${tokens.colors.text.static_icons__tertiary.rgba};
    }
`;

export const SelectedItem = styled.span`
    display: flex;
    justify-content: center;
    padding: 4px 8px;
    margin-right: 5px;
    margin-bottom: 8px;
    border-radius: 1rem;
    font-size: 12px;
    cursor: pointer;
    line-height: 1.6em;
    color: ${tokens.colors.interactive.primary__resting.rgba};
    background-color: ${tokens.colors.interactive.primary__hover_alt.rgba};
    svg {
        margin-right: 4px;
    }
`;
