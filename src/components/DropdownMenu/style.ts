import styled, { css } from 'styled-components';

export const Container = styled.div`
    position: relative;
    width: 100%;
    ul {
        position: absolute;
        bottom: -2rem;
        width: 100%;
        background-color: ${props => props.theme.color.ui.background__default.hex};
        border-radius: 4px;
        padding: 4px;
        box-shadow: ${props => props.theme.shadow.raised}
    }
`;

export const DropdownIcon = styled.div`
    padding-left: 8px;
    display: flex;
    flex: 1;
    justify-content: flex-end;
    align-items: right;
`;

interface DropdownButtonProps {
    readonly isOpen: boolean;
}

export const DropdownButton = styled.button<DropdownButtonProps>`
    background-color: transparent;
    border: 0;
    display: flex;
    text-overflow: '...';
    align-items: center;
    padding: 6px;
    width: 100%;
    ${props => props.isOpen && css`
        background-color: ${props => props.theme.color.interactive.primary__selected_highlight.hex};
    `}
`

export const DropdownItem = styled.li`
    background-color: transparent;
    border: 0;
    button {
        text-align:left;
        width: 100%;
        background-color: transparent;
        border: 0;
    }
`
