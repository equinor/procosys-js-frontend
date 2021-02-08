import { TextField } from '@material-ui/core';
import styled from 'styled-components';

export const DatesContainer = styled.div`
    display: flex;
    justify-content: space-between;
    padding-bottom: calc(var(--grid-unit) * 2);
`;

export const DateField = styled(TextField)`
    width: 48%;
`;



export const CheckboxSection = styled.div`
    display: flex;
    justify-content: space-between;
    padding-bottom: calc(var(--grid-unit) * 2);
    padding-left: calc(var(--grid-unit) * 4);
`;


export const ExpandedContainer = styled.div`
`;


