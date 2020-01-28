export type Tag = {
    tagNo: string;
    description: string;
    mcPkgNo: string;
}

export type TagRow = {
    tagNo: string;
    description: string;
    purchaseOrderNumber: string;
    commPkgNo: string;
    mcPkgNo: string;
    isPreserved: boolean;
    tableData?: {
        checked: boolean;
    };
}