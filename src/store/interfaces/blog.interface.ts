export interface ISEO {
    metaTitle?: string;
    metaDescription?: string;
    metaKeywords?: string;
    ogImage?: string;
}

export type PostInterface = {
    _id: string;
    title: string;
    content: string;
    image: string;
    slug: string;
    seo?: ISEO;
    createdAt: Date,
    updatedAt: Date
}

export interface BlogState {
    posts: PostInterface[];
    currentPost: PostInterface | null;
    isLoadingPosts: boolean;
    isLoadingCurrentPost: boolean;
    isLoadingEventPosts: boolean;
    errorEventPost: string;
    errorPosts: string;
    errorCurrentPost: string;
}
