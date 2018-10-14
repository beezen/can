/* eslint-disable */
import axios from 'axios';
import qs from 'qs';
import {
    Toast
} from 'antd-mobile';
import {
    baseURL,
    definedEnv
} from "commons/config";
import {
    getQuery
} from 'utils/query';

const isMock = !!getQuery('mock');
/**
 * 公用的ajax实例
 */
let _ajax = axios.create({
    baseURL: isMock ? window.location.origin : (definedEnv == 'dev' ? (getQuery('api') || baseURL) : baseURL),
    timeout: 30000,
    withCredentials: true,
});

// 存储CancelToken
const promiseArr = {}

// 添加请求发送拦截器
_ajax.interceptors.request.use((config) => {
    const hash = `${config.url}-${JSON.stringify(config.data)}`;
    // 上次请求为完成时，取消请求并提示勿重复提交
    let clearLoad;
    if (promiseArr[hash]) {
        clearLoad = Toast.loading();
        promiseArr[hash].cancelToken('操作频繁，请稍后重试！');
    }
    // 过滤相同请求
    config.cancelToken = new axios.CancelToken(cancel => {
        promiseArr[hash] = {
            cancelToken: cancel
        };
        if (clearLoad) {
            promiseArr[hash].clearLoad = clearLoad;
        }
    });

    // 在发送请求之前做些什么
    if (definedEnv == 'dev') {
        // 开发环境判断接口是否用真实的
        if (isMock || baseURL == "") {
            config.method = "GET";
            config.url = config.url.replace(/([/a-zA-Z]*)(\.json)?$/, '$1.json');
        }
    }
    return config;
}, (error) => Promise.reject(error));

// 添加请求返回拦截器
_ajax.interceptors.response.use((response) => {
    const cfg = response.config;
    const hash = `${cfg.url.replace(cfg.baseURL, '')}-${cfg.data}`.replace(/\.json-/, "-");
    if (promiseArr[hash]) {
        promiseArr[hash].clearLoad && promiseArr[hash].clearLoad();
        delete promiseArr[hash];
    }

    let res = response.data;
    if (res.code == 0) {
        cfg.success && cfg.success(res.data, res);
        return Promise.resolve(res.data);
    } else {
        if (res.code > 0) {
            Toast.fail(res.message);
        } else if (res.code < 0) {
            Toast.fail("网络异常，请稍后重试");
        } else if (res.code == 10001) {
            Toast.hide();
            Toast.fail("请您登录后再做尝试");
        } else if (res.code == 10002) {
            Toast.hide();
            Toast.fail("权限不够，无法访问当前页面。");
        }
        cfg.error && cfg.error(res.message, res);
        return Promise.reject(res);
    }
}, (error) => {
    const cfg = error.config;
    const hash = `${cfg.url.replace(cfg.baseURL, '')}-${cfg.data}`.replace(/\.json-/, "-");
    if (promiseArr[hash]) {
        delete promiseArr[hash];
    }
    Toast.fail("网络异常，请稍后重试");
    return Promise.reject(error);
});

/**
 * ajax 请求
 * @param options
 */
export function ajax(options) {
    options.method = options.type || (options.data == null ? "GET" : "POST");

    if (options.cleanData !== false && options.data != null) {
        cleanData(options.data);
    }
    // 是否扁平化数据，默认为true
    if (!('flattenData' in options)) {
        options.flattenData = true
    }

    switch (options.method.toLocaleUpperCase()) {
        case 'GET':
            options.params = options.data
            break
        case 'POST':
            // 转表单提交
            if (options.contentType === 'application/x-www-form-urlencoded' || options.data instanceof FormData) {
                options.headers = {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
                options.data = qs.stringify(options.data)
            }
            break
    }

    if (options.flattenData && Object.prototype.toString.call(options.data) === '[object Object]' && !(options.data instanceof FormData)) {
        const data = options.data
        options.data = {}
        for (const key in data) {
            const value = data[key]
            if (Object.prototype.toString.call(value) === '[object Object]') {
                options.data = { ...options.data,
                    ...value
                }
            } else {
                options.data[key] = value
            }
        }
    }
    return _ajax(options)
}

function cleanData(obj) {
    if (obj && typeof obj === "object") {
        if (Array.isArray(obj)) {
            for (const item of obj) {
                cleanData(item);
            }
        } else {
            for (const key in obj) {
                let value = obj[key];
                if (typeof value === "string") obj[key] = value = value.trim();
                if (value == undefined || value === "") {
                    delete obj[key];
                } else {
                    cleanData(value);
                }
            }
        }
    }
}