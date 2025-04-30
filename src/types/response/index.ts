export * from './CommentResponse'

export interface ApiResponse<T> {
    status: string;
    data: T;
}