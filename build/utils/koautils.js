"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ageRange = exports.tryCatch = void 0;
function tryCatch(fn) {
    try {
        console.log("in try catch wrapper");
        fn();
    }
    catch (error) {
        console.log("in catch block");
        console.error(error);
    }
}
exports.tryCatch = tryCatch;
exports.ageRange = {
    minAge: 18,
    maxAge: 33
};
//# sourceMappingURL=koautils.js.map