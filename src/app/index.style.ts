import styled from 'styled-components';

export const ProCoSysRootLayout = styled.div`
    display: flex;
    flex-direction: column;
//    max-height: calc(100%);
    overflow-y: auto;
    height: 100vh;
    min-height: 100vh;
    //min-height: -webkit-fill-available;

    #root-content {
        overflow: auto;
        height: 100%;
    }
`;
