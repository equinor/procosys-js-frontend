import { Card } from "@equinor/eds-core-react";
import styled from "styled-components";

export const Container = styled.div`
    display: flex;
    width: 100%;
    flex-wrap: wrap;
`;

export const StyledCard50 = styled(Card)`
    flex: 1 1 50%;
`;

export const StyledCard100 = styled(Card)`
    flex: 1 1 100%;
`;