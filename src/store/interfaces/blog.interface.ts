export type PostInterface = Partial<{
    _id: string;
    title: string;
    description: string;
    image: string;
    slug: string;
    createdAt: Date,
    updatedAt: Date
}>

export interface BlogState {
    posts: PostInterface[];
    currentPost: PostInterface;
    isLoadingPosts: boolean;
    isLoadingCurrentPost: boolean;
    errorPosts: string;
    errorCurrentPost: string;
}
