
export const isNilOrEmpty = (value:string | Array<any> | object | undefined) => {
    if (value == null) return true;
    if (value === "") return true;
    if (Array.isArray(value) && value.length === 0) return true;
    return false;
};
