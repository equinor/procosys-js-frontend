import '@testing-library/jest-dom';

function noOp() { }

if (typeof window.URL.createObjectURL === 'undefined') {
    Object.defineProperty(window.URL, 'createObjectURL', { value: noOp })
}

jest.mock('react-virtualized-auto-sizer', () => {
    return (props: any) => {
        const renderCallback = props.children;

        return renderCallback({
            width: 1200,
            height: 900
        });
    };
});
