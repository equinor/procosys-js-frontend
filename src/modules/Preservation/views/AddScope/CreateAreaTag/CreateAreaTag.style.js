import styled from 'styled-components';
import { tokens } from '@equinor/eds-tokens';
import { TextField } from '@equinor/eds-core-react';

export const Header = styled.header`
    display: flex;
    align-items: baseline;

    h1 {
        margin-right: calc(var(--grid-unit) * 2);
    };
`;

export const Container = styled.div`
    display: grid;
    grid-template-columns: 1fr auto;
`;

export const MainContainer = styled.div`
    display: flex;

    #createAreaTag {
        width: 70%;
    }
`;

export const TopContainer = styled.div`
    display: flex;
    flex-direction: column;
    margin-top: calc(var(--grid-unit));

    p {
        display: block;
        height: calc(var(--grid-unit) * 2);
        color: ${tokens.colors.interactive.danger__text.rgba};
    }
`;

export const InputContainer = styled.div`
    margin:  calc(var(--grid-unit) * 2) 0px;
    display: flex;
    flex-direction: row;
    align-items: center;
`;

export const SuffixTextField = styled(TextField)`
    max-width: 200px;
`;

export const Next = styled.div`
    display: flex;
    flex: 1;
    flex-direction: column;
    align-items: flex-end;
    margin-right: var(--grid-unit);

    p {
        padding-top: var(--grid-unit);
        color: ${tokens.colors.interactive.danger__text.rgba};
    }
`;

export const ButtonContainer = styled.div`
    display: flex;
    justify-content: center;
    button:last-of-type {
        margin-left: calc(var(--grid-unit) * 2);
    }
`;

export const FormFieldSpacer = styled.div`
    margin-right: calc(var(--grid-unit) * 2);

    #dropdownIcon {
        height: calc(var(--grid-unit) * 3);
    }
`;

export const ButtonContent = styled.span`
    display: flex;
    align-items: center;
    color: ${tokens.colors.interactive.primary__resting.rgba};
    svg path {
        color: ${tokens.colors.interactive.primary__resting.rgba};
    }
    svg {
        margin-right: var(--grid-unit);
    }
`;

export const CenterContent = styled.span`
    display: flex;
    align-items: center;
`;

export const DropdownItem = styled.div`
    padding: calc(var(--grid-unit) * 2) calc(var(--grid-unit) * 3);
    :hover {
        background-color: ${tokens.colors.ui.background__light.rgba}
    }
`;

export const ErrorContainer = styled.div`
    min-height: 1rem;
`;

export const SelectedTag = styled.div`
    width: 30%;
    margin-left: var(--grid-unit);
    margin-bottom: calc(var(--grid-unit) * 4);
`;

export const Divider = styled.div`
    margin-top: calc(var(--margin-module--top) * -1);
    margin-bottom: -1000px;
    margin-right: calc(var(--grid-unit) * 2);
    margin-left: calc(var(--grid-unit) * 5);
    border-left: solid 1px ${tokens.colors.ui.background__medium.rgba};
`;

export const TagList = styled.div`
    margin-top: calc(var(--grid-unit) * 4);
    border-left: solid 2px ${tokens.colors.ui.background__medium.rgba};
    border-top: solid 2px ${tokens.colors.ui.background__medium.rgba};
    border-right: solid 2px ${tokens.colors.ui.background__medium.rgba};
`;

export const TagContainer = styled.div`
    font-weight: 500;
    font-size: calc(var(--grid-unit) * 2);
    line-height: calc(var(--grid-unit) * 3);

    button:hover {
        background: ${tokens.colors.interactive.primary__hover_alt.rgba};
    }

    svg {
        padding: calc(var(--grid-unit) * 2);
    }

    svg path {
        color: ${tokens.colors.interactive.primary__resting.rgba};
    }
`;

export const Collapse = styled.div`
    display: flex;
    border-bottom: solid 2px ${tokens.colors.ui.background__medium.rgba};
`;

export const CollapseInfo = styled.div`
    flex-grow: 1;
    padding-top: calc(var(--grid-unit) * 2 + 4px);
    padding-right: calc(var(--grid-unit) * 2);
    padding-bottom: calc(var(--grid-unit) * 2);
    padding-left: calc(var(--grid-unit) * 2);
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
`;

export const Expand = styled.div`
    border-bottom: solid 2px ${tokens.colors.ui.background__medium.rgba};
    padding-top: 0px;
    padding-right: calc(var(--grid-unit) * 2);
    padding-bottom: calc(var(--grid-unit) * 2);
    padding-left: calc(var(--grid-unit) * 2);
    font-weight: normal;
`;

export const ExpandHeader = styled.div`
    font-size: calc(var(--grid-unit) + 4px);
    line-height: calc(var(--grid-unit) * 2);
`;

export const ExpandSection = styled.div`
    margin-top: calc(var(--grid-unit) * 2);
`;
