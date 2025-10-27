import {UserInterface} from "./user.interface.ts";
import {ProductInterface} from "./product.interface.ts";

export interface CommentInterface {
    _id: string;
    owner: UserInterface;
    product: ProductInterface;
    content: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface CommentState {
    comments: CommentInterface[];
    isLoadingActionComment: boolean;
    isLoadingComments: boolean;
    errorActionComment: string;
    errorComments: string;
}