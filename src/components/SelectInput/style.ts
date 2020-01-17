import styled from 'styled-components';
import { tokens } from '@equinor/eds-tokens';

export const Select = styled.select(tokens.shape.straight);
export const Option = styled.option(tokens.shape.straight);

export const Container = styled.div`
    max-width: 264px;
    label {
        color: ${tokens.colors.text.static_icons__tertiary.rgba};
        font-size: 12px;
        display: flex;
        flex-direction: column;
        span {
            margin-left: var(--grid-unit);
        }

        select {
            background-color: ${tokens.colors.ui.background__light.rgba};
            border: none;
            border-bottom: 1px solid black;
        }
    }
`;
