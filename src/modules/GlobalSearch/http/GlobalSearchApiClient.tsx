import { ProCoSysApiError } from "@procosys/core/ProCoSysApiError";
import ProCoSysSettings from "@procosys/core/ProCoSysSettings";
import ApiClient from "@procosys/http/ApiClient";
import { RequestCanceler } from "@procosys/http/HttpClient";
import { AxiosRequestConfig } from "axios";
import { IAuthService } from "src/auth/AuthService";


export interface ContentDocument {
    id?: string;
    plant?: string;
    plantName?: string;
    project?: string;
    projectPath?: string;
    commPkg?: ContentDocumentCommPkg;
    mcPkg?: ContentDocumentMcPkg;
    type?: string;
    lastModified?: Date;
}

export interface ContentDocumentCommPkg {
    commPkgId: number;
    commPkgNo?: string;
    description?: string;
    descriptionOfWork?: string;
    remark?: string;
    responsible?: string;
    area?: string;
    path?: string;
    lastUpdated?: string;
    mcPkgs?: ContentDocumentCommPkgMcPkg[];
}

export interface ContentDocumentCommPkgMcPkg {
    mcPkgId: number;
    mcPkgDescription?: string;
    mcPkgNo?: string;
}

export interface ContentDocumentMcPkg {
    mcPkgId: number;
    mcPkgNo?: string;
    description?: string;
    discipline?: string;
    commPkgNo?: string;
    commPkgDescription?: string;
    responsible?: string;
    area?: string;
}

export interface SearchResult {
    hits: number;
    items: ContentDocument[];
}

class GlobalSearchApiClient extends ApiClient {

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

    /**
     * Perform search
     */
    async doSearch(searchString: string, setRequestCanceller?: RequestCanceler): Promise<SearchResult> {
        const endpoint = '/Search?query=' + searchString;
        const settings: AxiosRequestConfig = {};

        this.setupRequestCanceler(settings, setRequestCanceller);

        try {
            const result = await this.client.get<SearchResult>(endpoint, settings);
            result.data.items.map((item: ContentDocument) => {
                item.type = item.commPkg ? 'C' : 'MC';
            });
            return result.data;
        }
        catch (error) {
            throw new ProCoSysApiError(error);
        }
    }
}

export default GlobalSearchApiClient;