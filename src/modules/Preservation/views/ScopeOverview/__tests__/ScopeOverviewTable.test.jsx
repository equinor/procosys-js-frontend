import React from 'react';
import ScopeOverviewTable from '../ScopeOverviewTable';
import { screen, render } from '@testing-library/react';

const mockTags = {
    maxAvailable: 1,
    tags: [{
        actionStatus: 'active',
        areaCode: 'areacode',
        calloffNo: 'calloffno',
        commPkgNo: 'commpkno',
        description: 'descripotion',
        disciplineCode: 'T',
        id: 1,
        isNew: true,
        isVoided: false,
        mcPkgNo: 'mcpkgno',
        mode: 'mode',
        nextMode: 'nextMode',
        nextResponsibleCode: 'nextresp',
        purchaseOrderNo: 'purchorderno',
        readyToBePreserved: true,
        readyToBeStarted: false,
        readyToBeTransferred: true,
        readyToBeCompleted: false,
        readyToBeRescheduled: true,
        isInUse: true,
        requirements: [
            {
                id: 1,
                requirementTypeCode: 'Area',
                requirementTypeIcon: 'Area',
                nextDueTimeUtc: '2020-06-24T07:41:29.8405826Z',
                nextDueAsYearAndWeek: '2020w26',
                nextDueWeeks: 10,
                readyToBePreserved: true
            }
        ],
        status: 'Active',
        responsibleCode: '1',
        responsibleDescription: 'respdesc',
        tagFunctionCode: 'tfc',
        tagNo: 'tagno',
        tagType: 'Standard',
        rowVersion: '1',
    }]
};


var getData = jest.fn(async () => {
    return mockTags;
});

describe('<ScopeOverviewTable />', () => {
    it('Display new-indicator in table', async () => {
        var propFunc = jest.fn();
        render(
            <ScopeOverviewTable
                setOrderDirection={propFunc}
                setOrderByField={propFunc}
                selectedTags={[]}
                setSelectedTags={propFunc}
                showTagDetails={true}
                getData={getData}
                pageSize={10}
                pageIndex={0}
                setRefreshScopeListCallback={propFunc} />
        );

        let exists = false;
        await screen.findByRole('new-indicator')
            .then(() => {
                exists = true;
            })
            .catch(() => {
                exists = false;
            });

        expect(exists).toBeTruthy();
    });
});
