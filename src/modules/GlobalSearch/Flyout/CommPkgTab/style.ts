import { Divider } from "@equinor/eds-core-react";
import { Card } from "@equinor/eds-core-react";
import styled from "styled-components";
import { tokens } from '@equinor/eds-tokens';

const { CardHeader, CardHeaderTitle } = Card;

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

export const MCPackageEntry = styled.div`
    display: flex;
    flex-direction: column;
    flex: 1 1 100%;
    width: 100%;
`;

export const StyledDivider = styled(Divider)`
    width: 100%;
`;

export const StyledHeaderTitle = styled(CardHeaderTitle)`
    > p {
        display: flex;
        align-items: center;
        color: ${tokens.colors.interactive.primary__resting.rgba};
    }
    > p > span {
            margin-top: -6px;
            margin-left: 5px;
        }
`;

export const StyledCardHeader = styled(CardHeader)`
    cursor: pointer;
    :hover * {
        font-weight: 500;
    }
`;