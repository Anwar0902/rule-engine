"use strict";
const ApiRequest = require("../apis/api-requests");
const ApiRequest1 = new ApiRequest();
class Util {
    async getIpCountry(ip1) {
        const ip = "127.0.0.1";
        console.log(ip);
        const ip_temp = ip.split(".");
        const ip_num = (16777216 * ip_temp[0]) + (65536 * ip_temp[1]) + (256 * ip_temp[2]) + parseInt(ip_temp[3]);
        const country_details = {};
        const url = `http://back1.shaadi.com/v1/ip-country?beginning_ip_num=${ip_num}`;
        const response = await ApiRequest1.apiRequest("get", "Get", url, {});
        country_details["country_code"] = response && response.data && response.data.iso_3166_country_code;
        country_details["country_name"] = response && response.data && response.data.country_name;
        console.log(country_details);
        return country_details;
    }
}
module.exports = Util;
//# sourceMappingURL=util.js.map