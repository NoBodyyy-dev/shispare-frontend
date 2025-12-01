import {UserInterface} from "./user.interface.ts";
import {ProductInterface} from "./product.interface.ts";

export interface CommentInterface {
    _id: string;
    owner: UserInterface;
    product: ProductInterface;
    rating: number;
    content: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface PaginationInfo {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

export interface CommentState {
    comments: CommentInterface[];
    pagination: PaginationInfo | null;
    isLoadingActionComment: boolean;
    isLoadingComments: boolean;
    errorActionComment: string;
    errorComments: string;
    canComment: boolean | null;
    canCommentReason: string | null;
    isLoadingCanComment: boolean;
}