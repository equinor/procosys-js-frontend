import styled from 'styled-components';

export const ProCoSysRootLayout = styled.div`
    input::-webkit-datetime-edit-ampm-field:focus,
    input::-webkit-datetime-edit-day-field:focus,
    input::-webkit-datetime-edit-hour-field:focus,
    input::-webkit-datetime-edit-millisecond-field:focus,
    input::-webkit-datetime-edit-minute-field:focus,
    input::-webkit-datetime-edit-month-field:focus,
    input::-webkit-datetime-edit-second-field:focus,
    input::-webkit-datetime-edit-week-field:focus,
    input::-webkit-datetime-edit-year-field:focus {
        background-color: highlight;
        color: highlighttext;
    }
    display: flex;
    flex-direction: column;
    //max-height: calc(100vh);
    overflow-y: auto;
    height: 100vh;

    #root-content {
        overflow: auto;
        height: 100%;
    }
`;
