import styled, { css, FlattenSimpleInterpolation } from 'styled-components';
import { Search, Button } from '@equinor/eds-core-react';
import { Breakpoints } from '@procosys/core/styling';
import { tokens } from '@equinor/eds-tokens';
import { Chip } from '@equinor/eds-core-react';
import { ContentDocument } from './http/QuickSearchApiClient';
import { Accordion } from '@equinor/eds-core-react';
import { Typography } from '@equinor/eds-core-react';

const { AccordionHeader, AccordionPanel } = Accordion;

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
    margin-left: calc(var(--grid-unit) * 2);
    padding: 0 calc(var(--grid-unit) * 2);
    overflow-y: auto;
    min-width: 300px;
`;

export const SearchFilters = styled.div`
    display: flex;
    flex-direction: column;
`;

interface HeaderProps {
    filterActive: boolean;
}

export const Header = styled.header<HeaderProps>`
    display: flex;
    justify-content: space-between;
    padding-bottom: calc(var(--grid-unit) * 4);
    margin-left: var(--grid-unit);
    margin-top: var(--margin-module--top);
    h1 { color: ${(props): string => props.filterActive ? tokens.colors.interactive.primary__resting.rgba : 'initial'} }
`;

export const FlexDiv = styled.div`
    display: flex;
`;

export const SortOrder = styled.div`
    display: flex;
    flex: 0 1 150px;
    padding-bottom: 15px;
    margin-left: 8px;
`;

export const StyledButton = styled(Button)`
    flex: 0 1 140px;
    display: flex;
    margin-right: 4px;
`;

interface FiltersAndSortRowProps {
    currentItem?: ContentDocument;
}

export const FiltersAndSortRow = styled.div<FiltersAndSortRowProps>`
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: ${(props): string => props.currentItem ? 'calc(100% - 480px)' : '100%' };
`;

export const SelectedFilters = styled.div`
    display: flex;
    flex: 1 1 100%;
    flex-wrap: wrap;
`;


interface ResultsContainerProps {
    currentItem?: ContentDocument;
}

export const ResultsContainer = styled.div<ResultsContainerProps>`
    width: ${(props): string => props.currentItem ? 'calc(100% - 480px)' : '100%' };
`;



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
    margin-right: 20px;
    > span {
        padding-top: 3px;
    }
`;

export const DescriptionCell = styled.div`
    display: flex;
    height: 100%;
    align-items: center;
    width: calc(100% - 4px);
    color: ${tokens.colors.text.static_icons__default.rgba};
    cursor: pointer;
    &.selected {
        background-color: #e6faec;
        box-shadow: -4px 0px #e6faec;
    }
    ${Breakpoints.TABLET} {
        padding: 1px;
    }
    ${Breakpoints.MOBILE} {
        padding: 4px;
    }
`;

export const TypeCell = styled.div`
    display: flex;
    height: 100%;
    align-items: center;
    justify-content: center;
    width: calc(100% - 4px);
    color: ${tokens.colors.text.static_icons__default.rgba};
    cursor: pointer;
    &.selected {
        background-color: #e6faec;
        box-shadow: -4px 0px #e6faec;
    }
    ${Breakpoints.TABLET} {
        padding: 1px;
    }
    ${Breakpoints.MOBILE} {
        padding: 4px;
    }
`;

export const FiltersTypes = styled.div`
    display: flex;
    width: 100%;
    flex-direction: column;
`;

export const StyledAccordionHeader = styled(AccordionHeader)`
    border: none;
`;

export const StyledAccordionPanel = styled(AccordionPanel)`
    border: none;
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

export const ResultCell = styled(Typography)`
    mark {
        background-color: ${tokens.colors.infographic.primary__moss_green_21.rgba};
    }
`;

export const PackageNoPart = styled.div`
    display: flex;
    align-items: center;
    flex: 0 0 120px;

    mark {
        background-color: ${tokens.colors.infographic.primary__moss_green_21.rgba};
    }
`;

export const TopDiv = styled.div`
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    justify-content: flex-start;
`;

export const StyledHeader = styled(Typography)`
    flex: 0 1 325px;
    margin-right: 30px;
`;