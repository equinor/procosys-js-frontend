import '@testing-library/jest-dom/extend-expect';

function noOp () { }

if (typeof window.URL.createObjectURL === 'undefined') { 
  Object.defineProperty(window.URL, 'createObjectURL', { value: noOp})
}

jest.mock('react-virtualized-auto-sizer', () => {
  return (props) => {
      const renderCallback = props.children;

      return renderCallback({
          width: 1200,
          height: 900
      });
  };
});