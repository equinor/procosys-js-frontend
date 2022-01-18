import styled from 'styled-components';
import { tokens } from '@equinor/eds-tokens';

export const InputContainer = styled.div`
    margin: calc(var(--grid-unit) * 2) 0px;
    display: flex;
`;

export const FormFieldSpacer = styled.div`
    margin-right: calc(var(--grid-unit) * 2);
    align-self: flex-start;
    #dropdownIcon {
        height: calc(var(--grid-unit) * 3);
    }
`;

export const OverflowColumn = styled.div`
    text-overflow: ellipsis;
    overflow: hidden;
`;
