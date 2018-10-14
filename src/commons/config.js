// 后端接口
let definedBaseURL = {
  dev: "",
  prd: "",
};
let baseURL = definedBaseURL[__wd_define_env__];

// 构建环境变量
let definedEnv = __wd_define_env__;

module.exports = {
  baseURL, // 后端接口前缀
  definedEnv, // 环境变量
}