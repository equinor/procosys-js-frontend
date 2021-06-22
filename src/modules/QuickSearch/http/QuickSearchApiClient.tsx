import { ProCoSysApiError } from "@procosys/core/ProCoSysApiError";
import ProCoSysSettings from "@procosys/core/ProCoSysSettings";
import ApiClient from "@procosys/http/ApiClient";
import { RequestCanceler } from "@procosys/http/HttpClient";
import { AxiosRequestConfig } from "axios";
import { IAuthService } from "src/auth/AuthService";

export enum ResultTypeEnum {
    COMM_PKG = 'C',
    MC_PKG = 'MC',
    TAG = 'T',
    PUNCH_ITEM = 'PI',
    OTHER = 'OTHER'
}

export interface ContentDocument {
    key?: string;
    plant?: string;
    plantName?: string;
    project?: string;
    projectNames?: string[];
    commPkg?: ContentDocumentCommPkg;
    mcPkg?: ContentDocumentMcPkg;
    type?: string;
    lastUpdated?: Date;
    tag?: ContentDocumentTag;
    punchItem?: ContentDocumentPunchItem;
}

export interface ContentDocumentCommPkg {
    area?: string;
    commPkgNo?: string;
    description?: string;
    descriptionOfWork?: string;
    remark?: string;
    responsible?: string;
}

export interface ContentDocumentMcPkg {
    area?: string;
    commPkgNo?: string;
    description?: string;
    discipline?: string;
    mcPkgNo?: string;
    remark?: string;
    responsible?: string;
}

export interface ContentDocumentTag {
    tagNo?: string;
    description?: string;
    mcPkgNo?: string;
    commPkgNo?: string;
    area?: string;
    disciplineCode?: string;
    disciplineDescription?: string;
    callOfNo?: string;
    purchaseOrderNo?: string;
    tagFunctionCode?: string;
}

export interface ContentDocumentPunchItem {
    punchItemNo?: string;
    tagNo?: string;
    category?: string;
    description?: string;
    formType?: string;
    responsible?: string;
}

export interface SearchResult {
    hits: number;
    items: ContentDocument[];
    totalHits: number;
    totalCommPkgHits: number;
    totalMcPkgHits: number;
    totalTagHits: number;
    totalPunchItemHits: number;
}

class QuickSearchApiClient extends ApiClient {

    constructor(authService: IAuthService) {
        super(
            authService,
            ProCoSysSettings.searchApi.scope.join(' '),
            ProCoSysSettings.searchApi.url
        );
        this.client.interceptors.request.use(
            config => {
                config.params = {
                    ...config.params,
                };
                return config;
            },
            error => Promise.reject(error)
        );
    }


    async doPreviewSearch(searchString: string, plantId: string, setRequestCanceller?: RequestCanceler): Promise<SearchResult> {
        const endpoint = '/Search?preview=true&plant=' + plantId + '&query=' + encodeURIComponent(searchString);
        const settings: AxiosRequestConfig = {};

        this.setupRequestCanceler(settings, setRequestCanceller);

        try {
            const result = await this.client.get<SearchResult>(endpoint, settings);
            result.data.items.map((item: ContentDocument) => {
                item.type = item.commPkg ? ResultTypeEnum.COMM_PKG
                    : item.mcPkg ? ResultTypeEnum.MC_PKG 
                    : item.tag ? ResultTypeEnum.TAG
                    : item.punchItem ? ResultTypeEnum.PUNCH_ITEM
                    : ResultTypeEnum.OTHER;
            });
            return result.data;
        }
        catch (error) {
            throw new ProCoSysApiError(error);
        }
    }

    async doSearch(searchString: string, plantId?: string, setRequestCanceller?: RequestCanceler): Promise<SearchResult> {
        const endpoint = '/Search?' + (plantId ? 'plant=' + plantId + '&' : '') + 'query=' + encodeURIComponent(searchString);
        const settings: AxiosRequestConfig = {};

        this.setupRequestCanceler(settings, setRequestCanceller);

        try {
            const result = await this.client.get<SearchResult>(endpoint, settings);
            result.data.items.map((item: ContentDocument) => {
                item.type = item.commPkg ? ResultTypeEnum.COMM_PKG
                    : item.mcPkg ? ResultTypeEnum.MC_PKG 
                    : item.tag ? ResultTypeEnum.TAG
                    : item.punchItem ? ResultTypeEnum.PUNCH_ITEM
                    : ResultTypeEnum.OTHER;
            });
            return result.data;
        }
        catch (error) {
            throw new ProCoSysApiError(error);
        }
    }

    async getMCPackages(commPkgNo: string, plant: string, setRequestCanceller?: RequestCanceler): Promise<SearchResult> {
        const endpoint = '/Search?plant=' + plant + "&mcPkgComPkg=" + commPkgNo;
        const settings: AxiosRequestConfig = {};

        this.setupRequestCanceler(settings, setRequestCanceller);

        try {
            const result = await this.client.get<SearchResult>(endpoint, settings);
            result.data.items.map((item: ContentDocument) => {
                item.type = ResultTypeEnum.MC_PKG;
            });
            return result.data;
        }
        catch (error) {
            throw new ProCoSysApiError(error);
        }
    }
}

export default QuickSearchApiClient;