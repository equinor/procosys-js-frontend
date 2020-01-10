// import {
//     AddBox,
//     ArrowDown,
//     Check,
//     ChevronLeft,
//     ChevronRight,
//     Clear,
//     DeleteToTrash,
//     Edit,
//     FilterList,
//     FirstPage,
//     LastPage,
//     Remove,
//     Save,
//     Search,
//     ViewColumn,
// } from '../../assets/edsIcons';
import MaterialTable, {MaterialTableProps} from 'material-table';

import React from 'react';

const tableIcons = {
    // Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
    // Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
    // Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    // Delete: forwardRef((props, ref) => <DeleteToTrash {...props} ref={ref} />),
    // DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    // Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
    // Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
    // Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
    // FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
    // LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
    // NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    // PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} />),
    // ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    // Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
    // SortArrow: forwardRef((props, ref) => <ArrowDown {...props} ref={ref} />),
    // ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
    // ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />)
};

const Table = (props: MaterialTableProps<any>): any => {
    return (<MaterialTable
        icons={tableIcons}
        {...props} />);
};

export default Table;
