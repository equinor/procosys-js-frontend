export type Tag = {
    id: number;
}

export type TagRow = {
    tagId: number;
    tagNo: string;
    description: string;
    tableData: {
        checked: boolean;
    };
}