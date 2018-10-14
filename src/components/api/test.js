"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
/**
 * @file API：/test
 */
var ajax_1 = require("components/ajax");
/**
 * @param success The request callback when succeed.
 * @param error The request callback when error occurs.
 */
function access(success, error, options) {
    return ajax_1.ajax(__assign({ url: "/test/access", type: "GET", success: success, error: error }, options));
}
exports.access = access;