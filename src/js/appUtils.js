isNotEmpty = (object) => {
    try {
        if (object === undefined || object === null || object === "") {
            return false
        } else {
            return true
        }
    } catch (e) {
        console.log(e)
        return false
    }
}

isNotEmptyObject = (object) => {
    try {
        if (Object.keys(object).length === 0 && obj.constructor === Object) {
            return false
        } else {
            return true
        }
    } catch (e) {
        console.log(e)
        return false
    }
}

export { isNotEmpty, isNotEmptyObject }