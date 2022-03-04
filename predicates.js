function getTag(value) {
    if (value == null) {
        return value === undefined ? '[object Undefined]' : '[object Null]'
    }
    return Object.prototype.toString.call(value)
}

function isRegex(value) {
    // In older browsers, typeof regex incorrectly returns 'function'
    if (!value || (typeof value !== 'object' && typeof value !== 'function')) {
        return false;
    }

    return `${value}` === regexClass;
}

function ofType(type) {
    if (isString(type)) {
        return function isPrimitive(value) {
            return typeof value === type
        }
    } else if (isFunction(type)) {
        return function isInstance(value) {
            return isObject(value) && value instanceof type
        }
    } else {
        throw new Error(`Unknown type ${type}`)
    }
}

function isObjectLike(obj) {
    return 'object' === typeof obj && null !== obj
}

function isObject(value) {
    return 'function' === typeof value || isObjectLike(value)
}

function isNumber(value) {
    return 'number' === typeof value;
}

function isString(value) {
    return 'string' === typeof value;
}

function isBoolean(value) {
    return 'boolean' === typeof value;
}

function isUnsignedInteger(number) {
    return isNumber(number) && Number.isInteger(number) && number > 0;
}

function isNatural(number) {
    return isNumber(number) && Number.isInteger(number) && number >= 0;
}

function isDeepObject(object) {
    return isObjectLike(object) && Object.keys(object).some(name => isObjectLike(object[name]))
}

function isDefined(o) {
    return !('undefined' === typeof o || null === o)
}

function isPromise(promise) {
    return promise && isFunction(promise.then) && isFunction(promise.catch)
}

function isFunction(cb) {
    return 'function' === typeof cb
}

function isPlainObject(obj) {
    return isObjectLike(obj) && (!obj.constructor || Object === obj.constructor);
}

const isHexObjectId = string => typeof string === 'string' && ObjectIdRegExp.test(string)

function isEmpty(obj) {
    if (isString(obj)) {
        return obj.trim().length === 0
    }
    if (!isObjectLike(obj)) {
        return !obj
    }
    if (Array.isArray(obj)) {
        return obj.length === 0
    }
    return Object.keys(obj).length === 0
}

function isNaN(n) {
    return Number.isNaN(n)
}

function isStrictComparable(value) {
    return value === value && !isObject(value)
}

function isPrototype(value) {
    const Ctor = value && value.constructor
    const proto = (typeof Ctor === 'function' && Ctor.prototype) || objectProto

    return value === proto
}

function isArguments(value) {
    if (hasToStringTag && value && typeof value === 'object' && Symbol.toStringTag in value) {
        return false;
    }
    return getTag(value) === '[object Arguments]';
}

function isSymbol(value) {
    const type = typeof value
    return type == 'symbol' || (type === 'object' && value != null && getTag(value) == '[object Symbol]')
}

const GeneratorFunction = (function* () { }).constructor

function isGeneratorFunction(value) {
    return isFunction(value) && value instanceof GeneratorFunction
}

function not(predicate) {
    return function (...args) {
        return !predicate(...args)
    }
}

function or(...predicates) {
    return function (...args) {
        for (const predicate of predicates) {
            if (predicate(...args)) {
                return true
            }
        }
        return false
    }
}

function and(...predicates) {
    return function (...args) {
        for (const predicate of predicates) {
            if (!predicate(...args)) {
                return false
            }
        }
        return true
    }
}

function endsWith(string, part) {
    return string.indexOf(part) === string.length - part.length - 1
}

function startsWith(string, part) {
    return string.indexOf(part) === 0
}

function isStringEquals(a, b) {
    return a === b || (a && b && a.toString() === b.toString());
  }
  
function isAdmin(user) {
    return user && 'admin' === user.role
}

const isJsonSchemaObject = obj => 'object' === obj.type
  && optional(obj.required, Array.isArray)
  && isObject(obj.properties)
  && Object.keys(obj.properties).every(name => isJsonSchemaType(obj.properties[name]))

module.exports = {
    and,
    endsWith,
    getTag,
    isAdmin,
    isArguments,
    isBoolean,
    isDeepObject,
    isDefined,
    isEmpty,
    isFunction,
    isGeneratorFunction,
    isHexObjectId,
    isJsonSchemaObject,
    isNaN,
    isNatural,
    isNumber,
    isObject,
    isObjectLike,
    isPlainObject,
    isPromise,
    isPrototype,
    isRegex,
    isStrictComparable,
    isString,
    isStringEquals,
    isSymbol,
    isUnsignedInteger,
    not,
    ofType,
    or,
    startsWith,
}
