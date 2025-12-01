import {UserInterface} from "./user.interface.ts";

export interface IRequest {
    _id: string;
    fullName: string;
    email: string;
    question: string;
    answer?: string;
    answered: boolean;
    answeredAt?: Date;
    answeredBy?: UserInterface;
    createdAt: Date;
    updatedAt: Date;
}

export interface RequestState {
    requests: IRequest[];
    currentRequest: IRequest | null;
    isLoadingRequests: boolean;
    isLoadingRequest: boolean;
    isLoadingCreateRequest: boolean;
    isLoadingAnswerRequest: boolean;
    successRequests: boolean;
    successCreateRequest: boolean;
    successAnswerRequest: boolean;
    errorRequests: string;
    errorRequest: string;
    errorCreateRequest: string;
    errorAnswerRequest: string;
}
