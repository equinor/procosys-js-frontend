import React from 'react';
import CreateAreaTag, {areaTypes} from '../CreateAreaTag';
import { render } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import theme from '../../../../../../assets/theme';

const disciplines = [
    { 
        code: 'disc code 1',
        description: 'disc desr 1',
    },
    {
        code: 'disc code 2',
        description: 'disc desr 2',
    },
];

const areas = [
    { 
        code: 'area code 1',
        description: 'area desr 1',
    },
    {
        code: 'area code 2',
        description: 'area desr 2',
    },
];

const areaTypeNormal = areaTypes[0];
const areaTypeSite = areaTypes[1];

const renderWithTheme = Component => {
    return render(<ThemeProvider theme={theme}>{Component}</ThemeProvider>);
};

jest.mock('../../../../context/PreservationContext', () => ({
    usePreservationContext: jest.fn(() => {
        return {
            project: {
                id: 1,
                name: 'test',
                description: 'project'
            }
        };
    })
}));

describe('Module: <CreateAreaProperties />', () => {

    it('Next button should be disabled intially.', () => {
        const { getByText, queryByText } = renderWithTheme(<CreateAreaTag areaType={undefined} disciplines={disciplines} areas={areas}/>);
        expect(getByText('Next')).toHaveProperty('disabled', true);
        expect(queryByText('Area')).toBeNull();
    });

    it('Area dropdown should only be visible when area type is \'normal\'', () => {
        let testAreaType;
        const { getByText, queryByText, rerender } = renderWithTheme(
            <CreateAreaTag 
                disciplines={disciplines} 
                areas={areas}
                areaType={testAreaType}
                setAreaType={jest.fn((areaType) => {
                    testAreaType = areaType;
                })}       
            />);

        expect(queryByText('Area')).toBeNull();
        
        //Select Site as area type
        const areaTypeSelect = getByText('Select area type');
        areaTypeSelect.click();
        expect(getByText(areaTypeNormal.text)).toBeInTheDocument();
        expect(getByText(areaTypeSite.text)).toBeInTheDocument();      
        getByText(areaTypeSite.text).click();
        //Rerender to set props
        rerender(<CreateAreaTag 
            disciplines={disciplines} 
            areas={areas}
            areaType={areaTypeSite}      
            setAreaType={jest.fn((areaType) => {
                testAreaType = areaType;
            })}       
        />);    
            
        expect(getByText(areaTypeSite.text)).toBeInTheDocument();
        
        expect(queryByText('Area')).toBeNull();

        //Change to area type normal
        getByText(areaTypeSite.text).click();
        getByText(areaTypeNormal.text).click();
        //Rerender to set props
        rerender(<CreateAreaTag 
            disciplines={disciplines} 
            areas={areas}
            areaType={areaTypeNormal}      
            setAreaType={jest.fn((areaType) => {
                testAreaType = areaType;
            })}       
        />);    
        expect(queryByText('Area')).toBeInTheDocument();
    }); 
});

