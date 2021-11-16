// import { keyExist, logging } from './util';
// import { ErrorCodes } from "../utils/errorCode";
// import { Messages } from "../utils/message";
// import Config from '../config';
import request from 'request';

const options = {
    'rejectUnauthorized': false,
    'strictSSL': false,
};
// const auth = "Basic " + Buffer.from(Config.IRCTC_USER_NAME + ":" + Config.IRCTC_USER_PASSWORD).toString("base64");
const headers = {
    'Content-Type': 'application/json',
};

class ApiRequest {
    get(url: string, reqHeaders: object): Promise<any> {
        const updatedHeaders = reqHeaders ? { ...reqHeaders, ...headers } : headers;
        console.log('API Get call url: ', url, ' headers: ', updatedHeaders);
        return new Promise((resolve, reject) => {
            request.get(url, { headers: updatedHeaders, ...options }, function (error: any, response: any, body: any) {
                console.log('API call get body: ', body);
                if (error) {
                    reject(error)
                } else if (body && response.statusCode && response.statusCode === 200) {
                    resolve(body);
                } else {
                    resolve(null);
                }
            });
        });
    }

    post(url: string, payload: object, reqHeaders: object): Promise<any> {
        const updatedHeaders = reqHeaders ? { ...reqHeaders, ...headers } : headers;
        console.log('API Post call url: ', url, ' headers: ', updatedHeaders);
        return new Promise((resolve, reject) => {
            try {
                request.post(url, { body: JSON.stringify(payload), headers: updatedHeaders, ...options }, function (error: any, response: any, body: any) {
                    console.log('API call post body: ', body);
                    if (error) {
                        reject(error)
                    } else if (response && response.statusCode && (response.statusCode >= 200 && response.statusCode < 300)) {
                        if (response.statusCode === 204) {
                            resolve(JSON.stringify({
                                success: true,
                                response: null,
                                erroCode: 0,
                                message: "success"
                            }));
                        } else {
                            resolve(body);
                        }
                    } else {
                        resolve(null);
                    }

                });
            }
            catch (error) {
                reject(error);
            }
        });
    }

    apiRequest(fname: string, reqMethod: string, reqUrl: string, reqHeaders: object, reqBody?: any): Promise<any> {
        return new Promise(async (resolve, reject) => {
            const start = Date.now();
            const body = reqBody || {};
            let errorCode = 3;
            let status = 1;

            const payload = {
                api: reqUrl,
                func: fname,
                timeTaken: 0,
                status,
                errorCode,
                logType: 'api',
                error: '',
                request: { url: reqUrl, headers: reqHeaders, payload: body },
                response: {},
                url: reqUrl,
                method: reqMethod
            }
            try {
                let result;
                switch (reqMethod) {
                    case "Get":
                        result = await this.get(reqUrl, reqHeaders);
                        break;
                    case "Post":
                        result = await this.post(reqUrl, body, reqHeaders);
                        break;
                }
                const response = JSON.parse(result);
                status = response && response.statusCode || 1;

                const ms = Date.now() - start;
                const uploadPayload = { ...payload, response: (false ? {} : response), status, errorCode: 0, timeTaken: ms, level: 'info' }
                console.log('apiRequest payload: ', uploadPayload);
                if (response) {
                    resolve(response);
                } else {
                    resolve(null);
                }

            } catch (error) {
                const uploadPayload = { ...payload, errorCode: 3, error, level: 'error' };
                console.log('apiRequest error: ', uploadPayload);
                reject(error);
            }
        });
    }
}

// export default {
//     apiRequest: (new ApiRequest()).apiRequest,
// }

export default new ApiRequest();