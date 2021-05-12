import { ProCoSysApiError } from "@procosys/core/ProCoSysApiError";
import ProCoSysSettings from "@procosys/core/ProCoSysSettings";
import ApiClient from "@procosys/http/ApiClient";
import { RequestCanceler } from "@procosys/http/HttpClient";
import { AxiosRequestConfig } from "axios";
import { IAuthService } from "src/auth/AuthService";

export enum ResultTypeEnum {
    COMM_PKG = 'C',
    MC_PKG = 'MC',
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

export interface SearchResult {
    hits: number;
    items: ContentDocument[];
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


    async doSearch(searchString: string, setRequestCanceller?: RequestCanceler): Promise<SearchResult> {
        const endpoint = '/Search?query=' + searchString;
        const settings: AxiosRequestConfig = {};

        this.setupRequestCanceler(settings, setRequestCanceller);

        try {
            const result = await this.client.get<SearchResult>(endpoint, settings);
            result.data.items.map((item: ContentDocument) => {
                item.type = item.commPkg ? ResultTypeEnum.COMM_PKG : ResultTypeEnum.MC_PKG;
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