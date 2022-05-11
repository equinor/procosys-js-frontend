import { TextField } from '@mui/material';
import styled from 'styled-components';

export const DatesContainer = styled.div`
    display: flex;
    justify-content: space-between;
    padding-bottom: calc(var(--grid-unit) * 2);
    > div {
        width: 48%;
    }
`;

export const DateField = styled(TextField)`
    > div input {
        height: 10px;
    }
`;

export const CheckboxSection = styled.div`
    display: flex;
    justify-content: space-between;
    padding-left: calc(var(--grid-unit) * 2);
`;
