import { AxiosError, AxiosRequestConfig } from 'axios';

import ApiClient from '../../../http/ApiClient';
import { IAuthService } from '../../../auth/AuthService';
import {ProCoSysApiError} from '../../../core/ProCoSysApiError';
import {ProCoSysSettings} from '../../../core/ProCoSysSettings';
import { RequestCanceler } from '../../../http/HttpClient';

export class IpoApiError extends ProCoSysApiError {
    constructor(error: AxiosError)
    {
        super(error);
        this.name = 'IpoApiError';
    }
}

type InvitationResponse = {
    projectName: string;
    title: string;
    description: string;
    location: string;
    type: string;
    status: string;
    rowVersion: string;
    startTimeUtc: string;
    endTimeUtc: string;
    participants: ParticipantInvitationResponse[];
    mcPkgScope: McPkgScopeResponse[];
    commPkgScope: CommPkgScopeResponse[];
}

type McPkgScopeResponse = {
    mcPkgNo: string;
    description: string;
    commPkgNo: string;
}

type CommPkgScopeResponse = {
    commPkgNo: string;
    description: string;
    status: string;
}

type ParticipantInvitationResponse = {
    organization: string;
    sortKey: number;
    externalEmail: ExternalEmailInvitationResponse;
    person: PersonInvitationResponse;
    functionalRole: FunctionalRoleInvitationResponse;
}

type FunctionalRoleInvitationResponse = {
    id: number;
    code: string;
    email: string;
    persons: PersonInvitationResponse[]
    response?: string;
    rowVersion: string;
}

type PersonInvitationResponse = {
    id: number;
    firstName: string;
    lastName: string;
    azureOid: string;
    email: string;
    required: boolean;
    response?: string;
    rowVersion: string;
}

type ExternalEmailInvitationResponse = {
    id: number;
    externalEmail: string;
    rowVersion: string;
}

type AttachmentResponse = {
    id: number;
    fileName: string;
    rowVersion: string;
}

type ProjectResponse = {
    id: number;
    name: string;
    description: string;
}

interface CommPkgResponse {
    id: number;
    commPkgNo: string;
    description: string;
    status: string;
}

interface McPkgResponse {
    id: number;
    mcPkgNo: string;
    description: string;
    disciplineCode: string;
}

interface PersonResponse {
    azureOid: string;
    userName: string;
    firstName: string;
    lastName: string;
    email: string;
}

interface FunctionalRoleResponse {
    code: string;
    description: string;
    usePersonalEmail: boolean;
    persons: PersonResponse[];
}

export type PersonDto = {
    azureOid: string | null;
    firstName: string;
    lastName: string;
    email: string;
    required: boolean;
}

export type FunctionalRoleDto = {
    code: string;
    persons: PersonDto[] | null;  
}

export type ExternalEmailDto = {
    email: string;
}

export type ParticipantDto = {
    organization: string;
    sortKey: number;
    externalEmail: ExternalEmailDto | null;
    person: PersonDto | null;
    functionalRole: FunctionalRoleDto | null;
}

/**
 * API for interacting with data in InvitationForPunchOut API.
 */
class InvitationForPunchOutApiClient extends ApiClient {

    constructor(authService: IAuthService) {
        super(
            authService,
            ProCoSysSettings.ipo.scopes.join(' '),
            ProCoSysSettings.ipo.url
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
     * Holds a reference to an internal callbackID used to set the plantId on requests.
     */
    private plantIdInterceptorId: number | null = null;

    /**
     * Sets the current context for relevant api requests
     *
     * @param plantId Plant ID
     */
    setCurrentPlant(plantId: string): void {
        console.log('Setting current plant for IPO: ', plantId);
        if (this.plantIdInterceptorId) {
            this.client.interceptors.request.eject(this.plantIdInterceptorId);
            this.plantIdInterceptorId = null;
        }
        this.plantIdInterceptorId = this.client.interceptors.request.use(
            config => {
                config.headers = {
                    ...config.headers,
                    'x-plant': plantId,
                };
                return config;
            },
            error => Promise.reject(error)
        );
    }

    /**
     * Get all available projects for currently logged in user in current plant context
     *
     * @param setRequestCanceller Returns a function that can be called to cancel the request
     */
    async getAllProjectsForUserAsync(setRequestCanceller?: RequestCanceler): Promise<ProjectResponse[]> {
        const endpoint = '/projects';
        const settings: AxiosRequestConfig = {};
        this.setupRequestCanceler(settings, setRequestCanceller);
        
        try {
            const result = await this.client.get<ProjectResponse[]>(endpoint,settings);
            return result.data;
        } catch (error) {
            throw new IpoApiError(error);
        }
    }

    /**
     * Get comm pkgs starting with comm pkg no in project
     *
     * @param setRequestCanceller Returns a function that can be called to cancel the request
     */
    async getCommPkgsAsync(projectId: number, startWith: string, setRequestCanceller?: RequestCanceler): Promise<CommPkgResponse[]> {
        const endpoint = '/CommPkgs';
        const settings: AxiosRequestConfig = {params: {
            projectId: projectId,
            startsWithCommPkgNo: startWith
        },};
        this.setupRequestCanceler(settings, setRequestCanceller);
        
        try {
            const result = await this.client.get<CommPkgResponse[]>(endpoint, settings);
            return result.data;
        } catch (error) {
            throw new IpoApiError(error);
        }
    }

    /**
     * Get mc pkgs under a comm pgk in project
     *
     * @param setRequestCanceller Returns a function that can be called to cancel the request
     */
    async getMcPkgsAsync(projectName: string, commPkgNo: string, setRequestCanceller?: RequestCanceler): Promise<McPkgResponse[]> {
        const endpoint = '/McPkgs';
        const settings: AxiosRequestConfig = {params: {
            projectName: projectName,
            CommPkgNo: commPkgNo
        },};
        this.setupRequestCanceler(settings, setRequestCanceller);
        
        try {
            const result = await this.client.get<McPkgResponse[]>(endpoint, settings);
            return result.data;
        } catch (error) {
            throw new IpoApiError(error);
        }
    }

    /**
     * Get functional roles for IPO
     *
     * @param setRequestCanceller Returns a function that can be called to cancel the request
     */
    async getFunctionalRolesAsync(setRequestCanceller?: RequestCanceler): Promise<FunctionalRoleResponse[]> {
        const endpoint = '/FunctionalRoles/ByClassification/IPO';
        const settings: AxiosRequestConfig = {};
        this.setupRequestCanceler(settings, setRequestCanceller);
        
        try {
            const result = await this.client.get<FunctionalRoleResponse[]>(endpoint, settings);
            return result.data;
        } catch (error) {
            throw new IpoApiError(error);
        }
    }


    /**
     * Get IPO details
     *
     * @param setRequestCanceller Returns a function that can be called to cancel the request
     */
    async getIPO(
        id: number,
        setRequestCanceller?: RequestCanceler): Promise<InvitationResponse> {
        const endpoint = `/invitations/${id}`;
        const settings: AxiosRequestConfig = {};
        this.setupRequestCanceler(settings, setRequestCanceller);

        try {
            const result = await this.client.get(
                endpoint,
                settings
            );
            return result.data;
        } catch (error) {
            throw new IpoApiError(error);
        }
    }

    /**
     * Create IPO
     *
     * @param setRequestCanceller Returns a function that can be called to cancel the request
     */
    async createIpo(
        title: string,
        projectName: string,
        type: string,
        startTime: Date,
        endTime: Date,
        description: string | null,
        location: string | null,
        participants: ParticipantDto[],
        mcPkgScope: string[] | null,
        commPkgScope: string[] | null,
        setRequestCanceller?: RequestCanceler): Promise<number> {
        const endpoint = '/invitations';
        const settings: AxiosRequestConfig = {};
        this.setupRequestCanceler(settings, setRequestCanceller);

        try {
            const result = await this.client.post(
                endpoint,
                {
                    title: title,
                    description: description,
                    location: location,
                    startTime: startTime,
                    endTime: endTime,
                    projectName: projectName,
                    type: type,
                    participants: participants,
                    mcPkgScope: mcPkgScope,
                    commPkgScope: commPkgScope
                },
                settings
            );
            return result.data;
        } catch (error) {
            throw new IpoApiError(error);
        }
    }
    
    /**
     * Get attachments
     *
     * @param setRequestCanceller Returns a function that can be called to cancel the request
     */
    async getAttachments(
        id: number,
        setRequestCanceller?: RequestCanceler): Promise<AttachmentResponse[]> {
        const endpoint = `/Invitations/${id}/Attachments`;
        const settings: AxiosRequestConfig = {};
        this.setupRequestCanceler(settings, setRequestCanceller);

        try {
            const result = await this.client.get(
                endpoint,
                settings
            );
            return result.data;
        } catch (error) {
            throw new IpoApiError(error);
        }
    }

    /**
     * Get attachment
     *
     * @param setRequestCanceller Returns a function that can be called to cancel the request
     */
    async getAttachment(
        id: number,
        attachmentId: number,
        setRequestCanceller?: RequestCanceler): Promise<string> {
        const endpoint = `/Invitations/${id}/Attachments/${attachmentId}`;
        const settings: AxiosRequestConfig = {};
        this.setupRequestCanceler(settings, setRequestCanceller);

        try {
            const result = await this.client.get(
                endpoint,
                settings
            );
            return result.data;
        } catch (error) {
            throw new IpoApiError(error);
        }
    }

    /**
     * Delete attachment
     *
     * @param setRequestCanceller Returns a function that can be called to cancel the request
     */
    async deleteAttachment(
        id: number,
        attachmentId: number,
        rowVersion: string,
        setRequestCanceller?: RequestCanceler): Promise<AttachmentResponse[]> {
        const endpoint = `/Invitations/${id}/Attachments/${attachmentId}`;
        const settings: AxiosRequestConfig = {};
        this.setupRequestCanceler(settings, setRequestCanceller);

        try {
            const result = await this.client.delete(
                endpoint, 
                {
                    data: { rowVersion: rowVersion }
                }
            );
            return result.data;
        } catch (error) {
            throw new IpoApiError(error);
        }
    }

    /**
     * Upload IPO Attachment
     *
     * @param setRequestCanceller Returns a function that can be called to cancel the request
     */
    async uploadAttachment(
        id: number,
        file: File,
        overwriteIfExists: boolean,
        setRequestCanceller?: RequestCanceler): Promise<number> {
        const endpoint = `/Invitations/${id}/Attachments`;

        const formData = new FormData();
        formData.append('OverwriteIfExists', overwriteIfExists.toString());
        formData.append('File', file);

        const settings: AxiosRequestConfig = {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        };

        this.setupRequestCanceler(settings, setRequestCanceller);

        try {
            const result = await this.client.post(
                endpoint,
                formData,
                settings
            );
            return result.data;
        } catch (error) {
            throw new IpoApiError(error);
        }
    }

    /**
     * Get persons with the privilege group IPO_PLAN
     *
     * @param setRequestCanceller Returns a function that can be called to cancel the request
     */
    async getRequiredSignerPersonsAsync(searchString: string, setRequestCanceller?: RequestCanceler): Promise<PersonResponse[]> {
        const endpoint = '/Persons/ByPrivileges/RequiredSigners';
        const settings: AxiosRequestConfig = {params: {
            searchString: searchString
        }};
        this.setupRequestCanceler(settings, setRequestCanceller);
        
        try {
            const result = await this.client.get<PersonResponse[]>(endpoint, settings);
            return result.data;
        } catch (error) {
            throw new IpoApiError(error);
        }
    }

    /**
     * Get persons with the user group IPO_SIGN
     *
     * @param setRequestCanceller Returns a function that can be called to cancel the request
     */
    async getAdditionalSignerPersonsAsync(searchString: string, setRequestCanceller?: RequestCanceler): Promise<PersonResponse[]> {
        const endpoint = '/Persons/ByPrivileges/AdditionalSigners';
        const settings: AxiosRequestConfig = {params: {
            searchString: searchString
        }};
        this.setupRequestCanceler(settings, setRequestCanceller);
        
        try {
            const result = await this.client.get<PersonResponse[]>(endpoint, settings);
            return result.data;
        } catch (error) {
            throw new IpoApiError(error);
        }
    }

    /**
     * Get persons in PCS
     *
     * @param setRequestCanceller Returns a function that can be called to cancel the request
     */
    async getPersonsAsync(searchString: string, setRequestCanceller?: RequestCanceler): Promise<PersonResponse[]> {
        const endpoint = '/Persons';
        const settings: AxiosRequestConfig = {params: {
            searchString: searchString
        }};
        this.setupRequestCanceler(settings, setRequestCanceller);
        
        try {
            const result = await this.client.get<PersonResponse[]>(endpoint, settings);
            return result.data;
        } catch (error) {
            throw new IpoApiError(error);
        }
    }

} export default InvitationForPunchOutApiClient;
