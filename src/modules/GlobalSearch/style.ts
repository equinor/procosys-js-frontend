import styled, { css, FlattenSimpleInterpolation } from 'styled-components';
import { Search, Button } from '@equinor/eds-core-react';
import { Breakpoints } from '@procosys/core/styling';
import { tokens } from '@equinor/eds-tokens';
import { Chip } from '@equinor/eds-core-react';
import { ContentDocument } from './http/GlobalSearchApiClient';

export const Container = styled.div`
    display: flex;
    margin-left: var(--margin-module--left);
    height: 100%;
`;

export const SearchContainer = styled.div<{ withSidePanel?: boolean }>`
    display: flex;
    margin-right: var(--margin-module--right);
    width: 100%;
    ${({ withSidePanel }): FlattenSimpleInterpolation | undefined => {
        if (withSidePanel) {
            return css`
            ${Breakpoints.MOBILE} {
                width: 0;
            }
                width: calc(100% - 300px);
                margin-right: var(--grid-unit);
            `;

        }
    }};
    overflow: hidden;
    flex-direction: column;
    margin-top: var(--margin-module--top);
    min-height: 400px; /* min-height to ensure that project dropdown (max 300px) is not cut off if empty table */
`;

export const FiltersContainer = styled.div`
    border-left: solid 1px ${tokens.colors.ui.background__medium.rgba};
    padding-left: calc(var(--grid-unit) * 2);
    margin-left: calc(var(--grid-unit) * 2);
    padding-right: calc(var(--grid-unit) * 2);
    overflow-y: auto;
    min-width: 300px;
`;

export const SearchFilters = styled.div`
    display: flex;
    flex-direction: column;
`;

export const Header = styled.header<{ filterActive: boolean }>`
    display: flex;
    justify-content: space-between;
    padding-bottom: calc(var(--grid-unit) * 4);
    margin-left: var(--grid-unit);
    margin-top: var(--margin-module--top);

    ${({ filterActive }): any => filterActive && css`
        h1 {
            color: ${tokens.colors.interactive.primary__resting.rgba};
        }
    `}`;


export const SearchAndFilter = styled.div`
    display: flex;
    padding-bottom: 10px;
    flex: 1 1 100%;
    flex-wrap: wrap;
    align-items: center;
`;

export const GlobalSearchSearchRow = styled.div`
    margin-top: 30px;
    display: flex;
    align-items: flex-end;
    justify-content: space-between;    
`;

export const StyledSearch = styled(Search)`
    margin-right: 50px;
    display: flex;
    max-width: 500px;
    min-width: 250px;
    margin-bottom: 20px;
`;

export const SortOrder = styled.div`
    display: flex;
    flex: 1 1;
    padding-bottom: 35px;
    min-width: 180px;
`;

export const StyledButton = styled(Button)`
    min-width: 160px;
    display: flex;
    margin-bottom: 20px;
`;

export const FiltersAndSortRow = styled.div<{ currentItem: ContentDocument | null }>`
    display: flex;
    justify-content: space-between;
    width: 100%;
    align-items: center;
    ${({ currentItem }): any => currentItem && css`
        width: calc(100% - 480px);
    `}`;

export const SelectedFilters = styled.div`
    display: flex;
    flex: 1 1 100%;
    flex-wrap: wrap;
    margin-bottom: 20px;
`;

export const ResultsContainer = styled.div<{ currentItem: ContentDocument | null }>`
    height: 70vh;
    width: 100%;
    ${({ currentItem }): any => currentItem && css`
        width: calc(100% - 480px);
    `}`;

export const LinkButton = styled(Button)`
    height: 24px;
    width: 24px;
    padding: 0;
    margin-right: 30px;
`;

export const TypeIndicator = styled.div`
    border-radius: 50%;
    min-width: 20px;
    min-height: 14px;
    padding: 4px;
    border: 1px solid var(--text--default);
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 12px;
    margin-right: 10px;
    > span {
        padding-top: 3px;
    }
`;

export const DescriptionCell = styled.div`
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    width: calc(100% - 4px);
    color: ${tokens.colors.interactive.primary__resting.rgba};
    cursor: pointer;
    &.selected {
        background-color: #deffde;
        box-shadow: 0px 0px 0px 7px #deffde;
    }
`;

export const FiltersTypes = styled.div`
    display: flex;
    width: 100%;
    flex-direction: column;
`;

export const AccordionContent = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    flex-wrap: wrap;

    > div {
        display: inline-block;
    }

    > div:first-child {
        width: 100%;
        margin-bottom: calc(var(--grid-unit) * 2);
    }

    > div:not(:first-child) {
        flex: 1;
    }
`;

export const FilterChip = styled(Chip)`
    margin-right: 8px;
    margin-bottom: 8px;
`;

export const DescriptionPart = styled.div`
    display: flex;
    align-items: flex-start;
    flex: 1 1;
`;

export const PackageNoPart = styled.div`
    display: flex;
    align-items: center;
    flex: 0 0 120px;
`;