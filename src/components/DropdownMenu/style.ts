import styled, { css } from 'styled-components';

export const Container = styled.div`
    position: relative;
    width: 100%;
    ul {
        position: absolute;
        top: 2rem;
        width: 100%;
        background-color: var(--ui-background--default);
        border-radius: 4px;
        box-shadow: var(--shadow-raised)
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
        background-color: var(--interactive-primary--selected-highlight);
        /* :focus & {
            outline: none;
        } */
    `}
`

export type DropDownItemProps = {
    selected: boolean;
}

export const DropdownItem = styled.li<DropDownItemProps>`
    background-color: ${props => props.selected ? 'var(--ui-background--light)' : 'transparent'};
    padding: 24px 16px;
    border: 0;
    text-align:left;
    font-weight: normal;
`
DropdownItem.defaultProps = {
    selected: false
}
