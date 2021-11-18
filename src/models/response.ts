export interface Response {
    success: boolean,
    message: string,
    errorCode: number,
    response: Array<any> | Object | null
}
