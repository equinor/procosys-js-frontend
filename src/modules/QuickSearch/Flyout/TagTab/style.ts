import { Card } from '@equinor/eds-core-react';
import { Divider } from '@equinor/eds-core-react';
import styled from 'styled-components';
import { tokens } from '@equinor/eds-tokens';
import { Typography } from '@equinor/eds-core-react';

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

export const StyledDivider = styled(Divider)`
    width: 100%;
`;

export const LinkIndicator = styled.span`
    display: inline-flex;
    width: 20px;
    height: 20px;
`;

export const StyledHeaderTitleLink = styled(Card.HeaderTitle)`
    > p {
        display: flex;
        align-items: center;
        color: ${tokens.colors.interactive.primary__resting.rgba};
    }

    mark {
        background-color: ${tokens.colors.infographic.primary__moss_green_21
            .rgba};
    }

    p > span:last-child {
        margin-top: -6px;
        margin-left: 5px;
    }
`;

export const StyledHeaderTitle = styled(Card.HeaderTitle)`
    mark {
        background-color: ${tokens.colors.infographic.primary__moss_green_21
            .rgba};
    }
`;

export const StyledTypographyLink = styled(Typography)`
    cursor: pointer;
    width: fit-content;
    :hover * {
        font-weight: 500;
    }
`;
