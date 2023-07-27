import { AxiosError, AxiosRequestConfig } from 'axios';
import ApiClient from '../../../http/ApiClient';
import { IAuthService } from '../../../auth/AuthService';
import { ProCoSysApiError } from '../../../core/ProCoSysApiError';
import ProCoSysSettings from '../../../core/ProCoSysSettings';
import Qs from 'qs';
import { RequestCanceler } from '../../../http/HttpClient';
import { IpoStatusEnum } from '../views/enums';

export class IpoApiError extends ProCoSysApiError {
    constructor(error: AxiosError) {
        super(error);
        this.name = 'IpoApiError';
    }
}

type InvitationResponse = {
    canEdit: boolean;
    canCancel: boolean;
    canDelete: boolean;
    projectName: string;
    title: string;
    description: string;
    location: string;
    type: string;
    status: string;
    createdBy: PersonResponse;
    rowVersion: string;
    startTimeUtc: string;
    endTimeUtc: string;
    participants: ParticipantInvitationResponse[];
    mcPkgScope: McPkgScopeResponse[];
    commPkgScope: CommPkgScopeResponse[];
};

type McPkgScopeResponse = {
    mcPkgNo: string;
    description: string;
    system: string;
    commPkgNo: string;
};

type CommPkgScopeResponse = {
    commPkgNo: string;
    description: string;
    system: string;
    status: string;
};

type CommPkgPagingResponse = {
    maxAvailable: number;
    commPkgs: CommPkgResponse[];
};

type ParticipantInvitationResponse = {
    id: number;
    organization: string;
    sortKey: number;
    isAttendedTouched: boolean;
    isSigner: boolean;
    canEditAttendedStatusAndNote: boolean;
    rowVersion: string;
    externalEmail: ExternalEmailInvitationResponse;
    person: PersonInvitationResponse;
    functionalRole: FunctionalRoleInvitationResponse;
    signedBy?: PersonResponse;
    signedAtUtc?: Date;
    attended: boolean;
    note: string;
};

type FunctionalRoleInvitationResponse = {
    code: string;
    email: string;
    persons: PersonInFunctionalRoleResponse[];
    response?: string;
};

type PersonInFunctionalRoleResponse = {
    response?: string;
    id: number;
    firstName: string;
    lastName: string;
    userName: string;
    azureOid: string;
    email: string;
    required: boolean;
    rowVersion: string;
};

type PersonInvitationResponse = {
    response?: string;
    firstName: string;
    lastName: string;
    userName: string;
    azureOid: string;
    email: string;
};

type ExternalEmailInvitationResponse = {
    externalEmail: string;
    response?: string;
};

type CommentResponse = {
    id: number;
    comment: string;
    createdAtUtc: string;
    createdBy: {
        firstName: string;
        lastName: string;
    };
};

type HistoryResponse = {
    id: number;
    description: string;
    createdAtUtc: string;
    createdBy: {
        userName: string;
    };
};

type AttachmentResponse = {
    downloadUri: string;
    id: number;
    fileName: string;
    rowVersion: string;
    uploadedAt: Date;
    uploadedBy: PersonResponse;
};

type ProjectResponse = {
    id: number;
    name: string;
    description: string;
};

interface CommPkgResponse {
    id: number;
    commPkgNo: string;
    description: string;
    system: string;
    status: string;
}

interface McPkgResponse {
    id: number;
    mcPkgNo: string;
    description: string;
    system: string;
    disciplineCode: string;
}

interface PersonResponse {
    id: number;
    azureOid: string;
    userName: string;
    firstName: string;
    lastName: string;
    email: string;
    rowVersion: string;
}

//This interface is used for objects comming from main, and does not have an id or rowVersion
interface ParticipantPersonResponse {
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
    persons: ParticipantPersonResponse[];
}

interface IPO {
    id: number;
    title: string;
    status: IpoStatusEnum;
    type: string;
    createdAtUtc: Date;
    startTimeUtc: Date;
    completedAtUtc?: Date;
    acceptedAtUtc?: Date;
    contractorRep: string;
    constructionCompanyRep: string;
    commissioningReps: string[];
    operationReps: string[];
    technicalIntegrityReps: string[];
    supplierReps: string[];
    externalGuests: string[];
    additionalContractorReps: string[];
    additionalConstructionCompanyReps: string[];
    mcPkgNos?: string[];
    commPkgNos?: string[];
    projectName: string;
}

type IPOFilter = {
    ipoStatuses: string[];
    functionalRoleCode: string;
    personOid: string;
    ipoIdStartsWith: string;
    commPkgNoStartsWith: string;
    mcPkgNoStartsWith: string;
    titleStartsWith: string;
    lastChangedAtFromUtc?: Date;
    lastChangedAtToUtc?: Date;
    punhcOutDateFromUtc?: Date;
    punchOutDateToUtc?: Date;
    punchOutDates: string[];
};

interface IPOsResponse {
    maxAvailable: number;
    invitations: IPO[];
}

interface SavedIPOFilterResponse {
    id: number;
    title: string;
    defaultFilter: boolean;
    criteria: string;
    rowVersion: string;
}

export type PersonDto = {
    id?: number;
    azureOid: string | null;
    email: string;
    required: boolean;
    rowVersion?: string;
};

export type PersonInRoleDto = {
    id?: number;
    azureOid: string | null;
    email: string;
    required: boolean;
    rowVersion?: string;
};

export type FunctionalRoleDto = {
    id?: number;
    code: string;
    persons: PersonInRoleDto[] | null;
    rowVersion?: string;
};

export type ExternalEmailDto = {
    id?: number | null;
    email: string;
    rowVersion?: string;
};

export type ParticipantDto = {
    organization: string;
    sortKey: number;
    externalEmail: ExternalEmailDto | null;
    person: PersonDto | null;
    functionalRole: FunctionalRoleDto | null;
};

export type CompleteAcceptIPODto = {
    invitationRowVersion: string;
    participantRowVersion: string;
};

export type AttendedStatusDto = {
    id: number;
    attended: boolean;
    rowVersion: string;
};

export type NotesDto = {
    id: number;
    note: string;
    rowVersion: string;
};

export type SignIPODto = {
    participantId: number;
    participantRowVersion: string;
};

/**
 * API for interacting with data in InvitationForPunchOut API.
 */
class InvitationForPunchOutApiClient extends ApiClient {
    constructor(authService: IAuthService) {
        super(
            authService,
            ProCoSysSettings.ipoApi.scope.join(' '),
            ProCoSysSettings.ipoApi.url
        );
        this.client.interceptors.request.use(
            (config) => {
                config.params = {
                    ...config.params,
                };
                return config;
            },
            (error) => Promise.reject(error)
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
        if (this.plantIdInterceptorId) {
            this.client.interceptors.request.eject(this.plantIdInterceptorId);
            this.plantIdInterceptorId = null;
        }
        this.plantIdInterceptorId = this.client.interceptors.request.use(
            (config) => {
                config.headers = {
                    ...config.headers,
                    'x-plant': plantId,
                };
                return config;
            },
            (error) => Promise.reject(error)
        );
    }

    /**
     * Get IPOs
     *
     * @param setRequestCanceller Returns a function that can be called to cancel the request
     */
    async getIPOs(
        projectName: string | null,
        page: number,
        pageSize: number,
        orderBy: string | null,
        orderDirection: string | null,
        filter: IPOFilter,
        setRequestCanceller?: RequestCanceler
    ): Promise<IPOsResponse> {
        const endpoint = '/Invitations';

        projectName = projectName == 'All projects' ? null : projectName;
        const settings: AxiosRequestConfig = {
            params: {
                projectName: projectName,
                page: page,
                size: pageSize,
                property: orderBy,
                direction: orderDirection,
                ...filter,
            },
        };

        settings.paramsSerializer = (p): string => {
            return Qs.stringify(p);
        };

        this.setupRequestCanceler(settings, setRequestCanceller);

        try {
            const result = await this.client.get<IPOsResponse>(
                endpoint,
                settings
            );
            return result.data;
        } catch (error) {
            throw new IpoApiError(error as AxiosError);
        }
    }

    /**
     * Get all available projects for currently logged in user in current plant context
     *
     * @param setRequestCanceller Returns a function that can be called to cancel the request
     */
    async getAllProjectsForUserAsync(
        setRequestCanceller?: RequestCanceler
    ): Promise<ProjectResponse[]> {
        const endpoint = '/Scope/Projects';
        const settings: AxiosRequestConfig = {};
        this.setupRequestCanceler(settings, setRequestCanceller);

        try {
            const result = await this.client.get<ProjectResponse[]>(
                endpoint,
                settings
            );
            return result.data;
        } catch (error) {
            throw new IpoApiError(error as AxiosError);
        }
    }

    /**
     * Get comm pkgs starting with comm pkg no in project
     *
     * @param setRequestCanceller Returns a function that can be called to cancel the request
     */
    async getCommPkgsAsync(
        projectName: string,
        startWith: string,
        pageSize?: number,
        currentPage?: number,
        setRequestCanceller?: RequestCanceler
    ): Promise<CommPkgPagingResponse> {
        const endpoint = '/Scope/CommPkgsV2';
        const settings: AxiosRequestConfig = {
            params: {
                projectName: projectName,
                startsWithCommPkgNo: startWith,
                itemsPerPage: pageSize,
                currentPage: currentPage,
            },
        };
        this.setupRequestCanceler(settings, setRequestCanceller);

        try {
            const result = await this.client.get<CommPkgPagingResponse>(
                endpoint,
                settings
            );
            return result.data;
        } catch (error) {
            throw new IpoApiError(error as AxiosError);
        }
    }

    /**
     * Get mc pkgs under a comm pgk in project
     *
     * @param setRequestCanceller Returns a function that can be called to cancel the request
     */
    async getMcPkgsAsync(
        projectName: string,
        commPkgNo: string,
        setRequestCanceller?: RequestCanceler
    ): Promise<McPkgResponse[]> {
        const endpoint = '/Scope/McPkgs';
        const settings: AxiosRequestConfig = {
            params: {
                projectName: projectName,
                CommPkgNo: commPkgNo,
            },
        };
        this.setupRequestCanceler(settings, setRequestCanceller);

        try {
            const result = await this.client.get<McPkgResponse[]>(
                endpoint,
                settings
            );
            return result.data;
        } catch (error) {
            throw new IpoApiError(error as AxiosError);
        }
    }

    /**
     * Get functional roles for IPO
     *
     * @param setRequestCanceller Returns a function that can be called to cancel the request
     */
    async getFunctionalRolesAsync(
        setRequestCanceller?: RequestCanceler
    ): Promise<FunctionalRoleResponse[]> {
        const endpoint = '/Participants/FunctionalRoles/ByClassification/IPO';
        const settings: AxiosRequestConfig = {};
        this.setupRequestCanceler(settings, setRequestCanceller);

        try {
            const result = await this.client.get<FunctionalRoleResponse[]>(
                endpoint,
                settings
            );
            return result.data;
        } catch (error) {
            throw new IpoApiError(error as AxiosError);
        }
    }

    /**
     * Get IPO details
     *
     * @param setRequestCanceller Returns a function that can be called to cancel the request
     */
    async getIPO(
        id: number,
        setRequestCanceller?: RequestCanceler
    ): Promise<InvitationResponse> {
        const endpoint = `/Invitations/${id}`;
        const settings: AxiosRequestConfig = {};
        this.setupRequestCanceler(settings, setRequestCanceller);

        try {
            const result = await this.client.get(endpoint, settings);
            return result.data;
        } catch (error) {
            throw new IpoApiError(error as AxiosError);
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
        setRequestCanceller?: RequestCanceler
    ): Promise<number> {
        const endpoint = '/Invitations';
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
                    commPkgScope: commPkgScope,
                },
                settings
            );
            return result.data;
        } catch (error) {
            throw new IpoApiError(error as AxiosError);
        }
    }

    /**
     * Update IPO
     *
     * @param setRequestCanceller Returns a function that can be called to cancel the request
     */
    async updateIpo(
        ipoId: number,
        title: string,
        type: string,
        startTime: Date,
        endTime: Date,
        description: string | null,
        location: string | null,
        participants: ParticipantDto[],
        mcPkgScope: string[] | null,
        commPkgScope: string[] | null,
        rowVersion: string,
        setRequestCanceller?: RequestCanceler
    ): Promise<number> {
        const endpoint = `/Invitations/${ipoId}`;
        const settings: AxiosRequestConfig = {};
        this.setupRequestCanceler(settings, setRequestCanceller);

        try {
            const result = await this.client.put(
                endpoint,
                {
                    title: title,
                    description: description,
                    location: location,
                    startTime: startTime,
                    endTime: endTime,
                    type: type,
                    updatedParticipants: participants,
                    updatedMcPkgScope: mcPkgScope,
                    updatedCommPkgScope: commPkgScope,
                    rowVersion: rowVersion,
                },
                settings
            );
            return result.data;
        } catch (error) {
            throw new IpoApiError(error as AxiosError);
        }
    }

    /**
     * Update IPO participants
     *
     * @param setRequestCanceller Returns a function that can be called to cancel the request
     */
    async updateIpoParticipants(
        ipoId: number,
        participants: ParticipantDto[],
        setRequestCanceller?: RequestCanceler
    ): Promise<number> {
        const endpoint = `/Invitations/${ipoId}/Participants`;
        const settings: AxiosRequestConfig = {};
        this.setupRequestCanceler(settings, setRequestCanceller);

        try {
            const result = await this.client.put(
                endpoint,
                {
                    updatedParticipants: participants,
                },
                settings
            );
            return result.data;
        } catch (error) {
            throw new IpoApiError(error as AxiosError);
        }
    }

    /**
     * Get comments
     *
     * @param setRequestCanceller Returns a function that can be called to cancel the request
     */
    async getComments(
        id: number,
        setRequestCanceller?: RequestCanceler
    ): Promise<CommentResponse[]> {
        const endpoint = `/Invitations/${id}/Comments`;
        const settings: AxiosRequestConfig = {};
        this.setupRequestCanceler(settings, setRequestCanceller);

        try {
            const result = await this.client.get(endpoint, settings);
            return result.data;
        } catch (error) {
            throw new IpoApiError(error as AxiosError);
        }
    }

    /**
     * Add comment
     *
     * @param setRequestCanceller Returns a function that can be called to cancel the request
     */
    async addComment(
        id: number,
        comment: string,
        setRequestCanceller?: RequestCanceler
    ): Promise<void> {
        const endpoint = `/Invitations/${id}/Comments`;
        const settings: AxiosRequestConfig = {};
        this.setupRequestCanceler(settings, setRequestCanceller);

        try {
            const result = await this.client.post(
                endpoint,
                {
                    comment,
                },
                settings
            );
            return result.data;
        } catch (error) {
            throw new IpoApiError(error as AxiosError);
        }
    }

    /**
     * Get History
     *
     * @param setRequestCanceller Returns a function that can be called to cancel the request
     */
    async getHistory(
        id: number,
        setRequestCanceller?: RequestCanceler
    ): Promise<HistoryResponse[]> {
        const endpoint = `/Invitations/${id}/History`;
        const settings: AxiosRequestConfig = {};
        this.setupRequestCanceler(settings, setRequestCanceller);
        try {
            const result = await this.client.get(endpoint, settings);
            return result.data;
        } catch (error) {
            throw new IpoApiError(error as AxiosError);
        }
    }

    /**
     * Get attachments
     *
     * @param setRequestCanceller Returns a function that can be called to cancel the request
     */
    async getAttachments(
        id: number,
        setRequestCanceller?: RequestCanceler
    ): Promise<AttachmentResponse[]> {
        const endpoint = `/Invitations/${id}/Attachments`;
        const settings: AxiosRequestConfig = {};
        this.setupRequestCanceler(settings, setRequestCanceller);

        try {
            const result = await this.client.get(endpoint, settings);
            return result.data;
        } catch (error) {
            throw new IpoApiError(error as AxiosError);
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
        setRequestCanceller?: RequestCanceler
    ): Promise<AttachmentResponse> {
        const endpoint = `/Invitations/${id}/Attachments/${attachmentId}`;
        const settings: AxiosRequestConfig = {};
        this.setupRequestCanceler(settings, setRequestCanceller);

        try {
            const result = await this.client.get(endpoint, settings);
            return result.data;
        } catch (error) {
            throw new IpoApiError(error as AxiosError);
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
        setRequestCanceller?: RequestCanceler
    ): Promise<AttachmentResponse[]> {
        const endpoint = `/Invitations/${id}/Attachments/${attachmentId}`;
        const settings: AxiosRequestConfig = {};
        this.setupRequestCanceler(settings, setRequestCanceller);

        try {
            const result = await this.client.delete(endpoint, {
                data: { rowVersion: rowVersion },
            });
            return result.data;
        } catch (error) {
            throw new IpoApiError(error as AxiosError);
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
        setRequestCanceller?: RequestCanceler
    ): Promise<number> {
        const endpoint = `/Invitations/${id}/Attachments`;

        const formData = new FormData();
        formData.append('OverwriteIfExists', overwriteIfExists.toString());
        formData.append('File', file);

        const settings: AxiosRequestConfig = {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        };

        this.setupRequestCanceler(settings, setRequestCanceller);

        try {
            const result = await this.client.post(endpoint, formData, settings);
            return result.data;
        } catch (error) {
            throw new IpoApiError(error as AxiosError);
        }
    }

    /**
     * Get persons with the privilege group IPO_SIGN
     *
     * @param setRequestCanceller Returns a function that can be called to cancel the request
     */
    async getSignerPersonsAsync(
        searchString: string,
        setRequestCanceller?: RequestCanceler
    ): Promise<ParticipantPersonResponse[]> {
        const endpoint = '/Participants/Persons/ByPrivileges/Signers';
        const settings: AxiosRequestConfig = {
            params: {
                searchString: searchString,
            },
        };
        this.setupRequestCanceler(settings, setRequestCanceller);

        try {
            const result = await this.client.get<PersonResponse[]>(
                endpoint,
                settings
            );
            return result.data;
        } catch (error) {
            throw new IpoApiError(error as AxiosError);
        }
    }

    /**
     * Get persons in PCS
     *
     * @param setRequestCanceller Returns a function that can be called to cancel the request
     */
    async getPersonsAsync(
        searchString: string,
        setRequestCanceller?: RequestCanceler
    ): Promise<ParticipantPersonResponse[]> {
        const endpoint = '/Participants/Persons';
        const settings: AxiosRequestConfig = {
            params: {
                searchString: searchString,
            },
        };
        this.setupRequestCanceler(settings, setRequestCanceller);

        try {
            const result = await this.client.get<PersonResponse[]>(
                endpoint,
                settings
            );
            return result.data;
        } catch (error) {
            throw new IpoApiError(error as AxiosError);
        }
    }

    /**
     * CompletePunchOut
     *
     * @param setRequestCanceller Returns a function that can be called to cancel the request
     */
    async completePunchOut(
        id: number,
        completeDetails: CompleteAcceptIPODto,
        setRequestCanceller?: RequestCanceler
    ): Promise<string> {
        const endpoint = `/Invitations/${id}/Complete`;
        const settings: AxiosRequestConfig = {};
        this.setupRequestCanceler(settings, setRequestCanceller);

        try {
            const result = await this.client.put(
                endpoint,
                {
                    invitationRowVersion: completeDetails.invitationRowVersion,
                    participantRowVersion:
                        completeDetails.participantRowVersion,
                },
                settings
            );
            return result.data;
        } catch (error) {
            throw new IpoApiError(error as AxiosError);
        }
    }

    /**
     * UnCompletePunchOut
     *
     * @param setRequestCanceller Returns a function that can be called to cancel the request
     */
    async uncompletePunchOut(
        id: number,
        invitationRowVersion: string,
        participantRowVersion: string,
        setRequestCanceller?: RequestCanceler
    ): Promise<string> {
        const endpoint = `/Invitations/${id}/UnComplete`;
        const settings: AxiosRequestConfig = {};
        this.setupRequestCanceler(settings, setRequestCanceller);

        try {
            const result = await this.client.put(endpoint, {
                invitationRowVersion: invitationRowVersion,
                participantRowVersion: participantRowVersion,
                settings,
            });
            return result.data;
        } catch (error) {
            throw new IpoApiError(error as AxiosError);
        }
    }

    /**
     * AcceptPunchOut
     *
     * @param setRequestCanceller Returns a function that can be called to cancel the request
     */
    async acceptPunchOut(
        id: number,
        acceptDetails: CompleteAcceptIPODto,
        setRequestCanceller?: RequestCanceler
    ): Promise<PersonResponse[]> {
        const endpoint = `/Invitations/${id}/Accept`;
        const settings: AxiosRequestConfig = {};
        this.setupRequestCanceler(settings, setRequestCanceller);

        try {
            const result = await this.client.put(
                endpoint,
                {
                    invitationRowVersion: acceptDetails.invitationRowVersion,
                    participantRowVersion: acceptDetails.participantRowVersion,
                },
                settings
            );
            return result.data;
        } catch (error) {
            throw new IpoApiError(error as AxiosError);
        }
    }

    /**
     * UnAcceptPunchOut
     *
     * @param setRequestCanceller Returns a function that can be called to cancel the request
     */
    async unacceptPunchOut(
        id: number,
        invitationRowVersion: string,
        participantRowVersion: string,
        setRequestCanceller?: RequestCanceler
    ): Promise<string> {
        const endpoint = `/Invitations/${id}/UnAccept`;
        const settings: AxiosRequestConfig = {};
        this.setupRequestCanceler(settings, setRequestCanceller);

        try {
            const result = await this.client.put(endpoint, {
                invitationRowVersion: invitationRowVersion,
                participantRowVersion: participantRowVersion,
                settings,
            });
            return result.data;
        } catch (error) {
            throw new IpoApiError(error as AxiosError);
        }
    }

    /**
     * SignPunchOut
     *
     * @param setRequestCanceller Returns a function that can be called to cancel the request
     */
    async signPunchOut(
        id: number,
        signDetails: SignIPODto,
        setRequestCanceller?: RequestCanceler
    ): Promise<PersonResponse[]> {
        const endpoint = `/Invitations/${id}/Sign`;
        const settings: AxiosRequestConfig = {};
        this.setupRequestCanceler(settings, setRequestCanceller);
        try {
            const result = await this.client.put(endpoint, {
                ...signDetails,
            });
            return result.data;
        } catch (error) {
            throw new IpoApiError(error as AxiosError);
        }
    }

    /**
     * UnsignPunchOut
     *
     * @param setRequestCanceller Returns a function that can be called to cancel the request
     */
    async unsignPunchOut(
        id: number,
        participantId: number,
        participantRowVersion: string,
        setRequestCanceller?: RequestCanceler
    ): Promise<PersonResponse[]> {
        const endpoint = `/Invitations/${id}/Unsign`;
        const settings: AxiosRequestConfig = {};
        this.setupRequestCanceler(settings, setRequestCanceller);
        try {
            const result = await this.client.put(endpoint, {
                participantId,
                participantRowVersion,
                settings,
            });
            return result.data;
        } catch (error) {
            throw new IpoApiError(error as AxiosError);
        }
    }

    /**
     * Cancel PunchOut
     *
     * @param setRequestCanceller Returns a function that can be called to cancel the request
     */
    async cancelPunchOut(
        id: number,
        rowVersion: string,
        setRequestCanceller?: RequestCanceler
    ): Promise<void> {
        const endpoint = `/Invitations/${id}/Cancel`;
        const settings: AxiosRequestConfig = {};
        this.setupRequestCanceler(settings, setRequestCanceller);
        try {
            const result = await this.client.put(
                endpoint,
                { rowVersion: rowVersion },
                settings
            );
            return result.data;
        } catch (error) {
            throw new IpoApiError(error as AxiosError);
        }
    }

    /**

     * Attended status
     *
     * @param setRequestCanceller Returns a function that can be called to cancel the request
     */
    async updateAttendedStatus(
        id: number,
        participantDetails: AttendedStatusDto,
        setRequestCanceller?: RequestCanceler
    ): Promise<void> {
        const endpoint = `/Invitations/${id}/AttendedStatus`;
        const settings: AxiosRequestConfig = {};
        this.setupRequestCanceler(settings, setRequestCanceller);

        try {
            await this.client.put(endpoint, participantDetails, settings);
        } catch (error) {
            throw new IpoApiError(error as AxiosError);
        }
    }

    /**
     * Attended notes
     *
     * @param setRequestCanceller Returns a function that can be called to cancel the request
     */
    async updateNotes(
        id: number,
        participantDetails: NotesDto,
        setRequestCanceller?: RequestCanceler
    ): Promise<void> {
        const endpoint = `/Invitations/${id}/Note`;
        const settings: AxiosRequestConfig = {};
        this.setupRequestCanceler(settings, setRequestCanceller);

        try {
            await this.client.put(endpoint, participantDetails, settings);
        } catch (error) {
            throw new IpoApiError(error as AxiosError);
        }
    }

    /** Delete PunchOut
     *
     * @param setRequestCanceller Returns a function that can be called to cancel the request
     */
    async deletePunchOut(
        id: number,
        rowVersion: string,
        setRequestCanceller?: RequestCanceler
    ): Promise<void> {
        const endpoint = `/Invitations/${id}/Delete`;
        const settings: AxiosRequestConfig = {};
        this.setupRequestCanceler(settings, setRequestCanceller);
        try {
            const result = await this.client.delete(endpoint, {
                data: { rowVersion: rowVersion },
            });
            return result.data;
        } catch (error) {
            throw new IpoApiError(error as AxiosError);
        }
    }

    /**
     * Get saved IPO filters
     *
     * @param setRequestCanceller Returns a function that can be called to cancel the request
     */
    async getSavedIPOFilters(
        projectName: string | null,
        setRequestCanceller?: RequestCanceler
    ): Promise<SavedIPOFilterResponse[]> {
        const endpoint = '/Persons/SavedFilters';
        const settings: AxiosRequestConfig = {
            params: {
                projectName: projectName,
            },
        };
        this.setupRequestCanceler(settings, setRequestCanceller);

        try {
            const result = await this.client.get<SavedIPOFilterResponse[]>(
                endpoint,
                settings
            );
            return result.data;
        } catch (error) {
            throw new IpoApiError(error as AxiosError);
        }
    }
    /**
     * Add saved IPO filter
     *
     * @param setRequestCanceller Returns a function that can be called to cancel the request
     */
    async addSavedIPOFilter(
        projectName: string | null,
        title: string,
        defaultFilter: boolean,
        criteria: string,
        setRequestCanceller?: RequestCanceler
    ): Promise<void> {
        const endpoint = '/Persons/SavedFilter';
        const settings: AxiosRequestConfig = {};
        this.setupRequestCanceler(settings, setRequestCanceller);

        try {
            await this.client.post(
                endpoint,
                {
                    projectName: projectName,
                    title: title,
                    criteria: criteria,
                    defaultFilter: defaultFilter,
                },
                settings
            );
        } catch (error) {
            throw new IpoApiError(error as AxiosError);
        }
    }

    /**
     * Update saved IPO filter
     *
     * @param setRequestCanceller Returns a function that can be called to cancel the request
     */
    async updateSavedIPOFilter(
        savedFilterId: number,
        title: string,
        defaultFilter: boolean,
        criteria: string,
        rowVersion: string,
        setRequestCanceller?: RequestCanceler
    ): Promise<void> {
        const endpoint = `/Persons/SavedFilters/${savedFilterId}`;
        const settings: AxiosRequestConfig = {};
        this.setupRequestCanceler(settings, setRequestCanceller);
        try {
            const result = await this.client.put(
                endpoint,
                {
                    title: title,
                    criteria: criteria,
                    defaultFilter: defaultFilter,
                    rowVersion: rowVersion,
                },
                settings
            );
        } catch (error) {
            throw new IpoApiError(error as AxiosError);
        }
    }

    /**
     * Delete saved IPO filter
     *
     * @param setRequestCanceller Returns a function that can be called to cancel the request
     */
    async deleteSavedIPOFilter(
        savedFilterId: number,
        rowVersion: string,
        setRequestCanceller?: RequestCanceler
    ): Promise<void> {
        const endpoint = `/Persons/SavedFilters/${savedFilterId}`;
        const settings: AxiosRequestConfig = {};
        this.setupRequestCanceler(settings, setRequestCanceller);
        try {
            const result = await this.client.delete(endpoint, {
                data: { rowVersion: rowVersion },
            });
        } catch (error) {
            throw new IpoApiError(error as AxiosError);
        }
    }

    /**
     * Export invitations to excel
     *
     * @param setRequestCanceller Returns a function that can be called to cancel the request
     */
    async exportInvitationsToExcel(
        projectName: string | null,
        sortProperty: string | null,
        sortDirection: string | null,
        iPOFilter: IPOFilter,
        setRequestCanceller?: RequestCanceler
    ): Promise<BlobPart> {
        const endpoint = '/Invitations/ExportInvitationsToExcel';

        projectName = projectName == 'All projects' ? null : projectName;

        const settings: AxiosRequestConfig = {
            params: {
                projectName: projectName,
                property: sortProperty,
                direction: sortDirection,
                ...iPOFilter,
            },
            responseType: 'blob',
        };

        settings.paramsSerializer = (p): string => {
            return Qs.stringify(p);
        };

        this.setupRequestCanceler(settings, setRequestCanceller);

        try {
            const result = await this.client.get<BlobPart>(endpoint, settings);
            return result.data;
        } catch (error) {
            throw new IpoApiError(error as AxiosError);
        }
    }
}
export default InvitationForPunchOutApiClient;
