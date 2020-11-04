import { CommPkg, McPkg, Project } from './types';

export const projects: Project[] = [
    {
        id: 0,
        name: 'Project 1',
        description: 'laskdj alksdj alsjdk alskdj'
    },
    {
        id: 2,
        name: 'Project 2',
        description: 'laskdj alksdj alsjdk alskdj'
    },
    {
        id: 3,
        name: 'Project 3',
        description: 'laskdj alksdj alsjdk alskdj'
    },
];

export const commPkgs: CommPkg[] = [
    {
        id: 0,
        commPkgNo: 'ASD0-DW8',
        description: 'laskdj alksdj alsjdk alskdj',
        status: 'OK',
        punchStatus: 'OK'
    },
    {
        id: 1,
        commPkgNo: 'KJASD-DW8',
        description: 'laai ajdwlijd skdj alksdj alsjdk alskdj',
        status: 'OK',
        punchStatus: 'OK'
    },
    {
        id: 2,
        commPkgNo: 'CO001-M234',
        description: 'laskdj awdj wijdw diwjdiwalskdj',
        status: 'OK',
        punchStatus: 'OK'
    },
];

export const mcPkgs: McPkg[] = [
    {
        id: 0,
        mcPkgNo: '4302-A002',
        description: 'LCI-1 deliverable',
        disciplineCode: 'OK',
        punchStatus: 'OK'
    },
    {
        id: 1,
        mcPkgNo: '4302-E001',
        description: 'RP Flare KO Drum, Metering & Flare Tip - ...',
        disciplineCode: 'OK',
        punchStatus: 'OK'
    },
    {
        id: 2,
        mcPkgNo: '4302-J004',
        description: 'RP Flare System - Interface Signals and C...',
        disciplineCode: 'OK',
        punchStatus: 'OK'
    },
    {
        id: 3,
        mcPkgNo: '4302-L500',
        description: 'Flare gas metering, R-43JX001',
        disciplineCode: 'OK',
        punchStatus: 'OK'
    },
];
