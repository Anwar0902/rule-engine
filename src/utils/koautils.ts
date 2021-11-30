export function tryCatch(fn) {
    try {
        console.log("in try catch wrapper");
        fn();
    } catch(error) {
        console.log("in catch block");
        console.error(error);
    }
}

export const ageRange = {
    minAge: 18,
    maxAge: 33
}