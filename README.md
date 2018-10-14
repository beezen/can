# react + webpack 项目开发脚手架

## 项目启动

```bash
cnpm i digo -g && cnpm run start
```

## 项目构建命令

```bash
cnpm run start # 启动开发环境
cnpm run build:dev # 构建项目（开发环境）。
cnpm run build:prd # 构建项目（生产环境）。  
```

## 使用说明

```bash
digo new <分类>/<组件名> [组件显示名] [组件描述] # 创建新组件
```

> 具体示范如下：

``` bash
digo new utils/test 测试工具 主要是用来测试的工具 # 创建辅助函数
digo new components/banner 轮播组件 主要是图片滚动播放 # 创建公用 react 组件
digo new entries/demo 案例 案例页面 # 创建入口组件
```

## Ajax

所有接口都应该生成在 `components/api` 目录（自动化生成接口应配合后端自定义完成），通过修改 `src/commons/config.js` 中的 baseURL 值来更改后端服务地址。开发环境下url添加参数 `mock=1` 取mock数据，添加参数 `api=http://xxx.com.cn` ,则指向api指定的服务地址。

## 注意

全局安装 `digo` 工具模块，提供一些便利的命令