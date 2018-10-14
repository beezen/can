let digo = require("digo");
let fs = require('fs');
let path = require('path');

/**
 * 创建新组件
 */
exports.new = () => {
    const data = digo.parseArgs();
    if (!/[^\/]+\//.test(data[1])) {
        digo.info("用法: digo new <分类>/<组件名> [组件显示名] [组件描述]\n  如: digo new utils/query 字符串查询 用于处理url上的参数");
        digo.report = false;
        return;
    }
    data.moduleName = data[1]; // 模块名
    data.name = data.name || digo.getFileName(data.moduleName, false); // 文件名
    data.nameLower = data.name.toLowerCase(); // 小写名
    data.namePascal = data.name.charAt(0).toUpperCase() + data.name.slice(1); // 首字母大写名

    data.displayName = data[2] || data.name; // 显示名
    data.description = data[3] || data.displayName; // 显示描述

    data.author = data.author || digo.exec("git config user.name", {
        slient: true
    }).output.join("").trim();
    data.email = data.email || digo.exec("git config user.email", {
        slient: true
    }).output.join("").trim();
    data.version = "0.0.1";
    data.date = digo.formatDate(new Date(), "yyyy/MM/dd");

    data.tpl = `scripts/@tpl/@module`; // 通用模板
    data.module = 0;
    // utils 辅助函数目录
    if (data.moduleName.split('/')[0] === 'utils') {
        data.dir = `src/${data[1]}`;
    }
    // entries 入口页面目录
    if (data.moduleName.split('/')[0] === 'entries') {
        data.dir = `src/${data[1]}`;
        data.tpl = `scripts/@tpl/@reactModule`; // react模板
        data.module = 1;
        // 生成路由
        if (!digo.existsDir(data.dir)) {
            exports._createRouter(data.moduleName.split('/')[1], data.displayName || '');
        }
    }
    // components 组件目录
    if (data.moduleName.split('/')[0] === 'components') {
        data.dir = `src/${data[1]}`;
        data.tpl = `scripts/@tpl/@reactModule`; // react模板
        data.module = 1;

    }
    if (digo.existsDir(data.dir)) {
        digo.error(`将要创建的${data.dir}模块已经存在`)
        digo.report = false;
        return;
    }
    switch (data.module) {
        case 0:
            creatModule(data); // 创建标准模块
            return;
        case 1:
            creatReactModule(data); // 创建react模块
            return;
        default:
            creatModule(data); // 创建标准模块
    }
}

/**
 * 创建模块
 * @param data 创建包的基本数据
 */
function creatModule(data) {
    fs.readdir(`${data.tpl}`, function (err, files) {
        fs.mkdirSync(data.dir);
        files.forEach(e => {
            if (/\.md$/.test(e)) {
                let curData = `# ${data.displayName}\n## ${data.description}`;
                fs.writeFileSync(`${data.dir}/${e}`, curData);
            }
            if (/\.json$/.test(e)) {
                fs.readFile(`${data.tpl}/${e}`, function (err, fileData) {
                    let curData = fileData.toString().replace(/\_name/, data.nameLower).replace(/\_version/, data.version).replace(/\_main/, `./${data.name}.js`).replace(/\_author/, data.author);
                    fs.writeFileSync(`${data.dir}/${e}`, curData);
                });
            }
            if (/\.js$/.test(e)) {
                fs.writeFileSync(`${data.dir}/${data.name}.js`, '');
            }
        })
    })
}

/**
 * 创建入口页模块
 * @param data 创建包的基本数据
 */
function creatReactModule(data) {
    fs.readdir(`${data.tpl}`, function (err, files) {
        fs.mkdirSync(data.dir);
        files.forEach(e => {
            if (/\.md$/.test(e)) {
                let curData = `# ${data.displayName}\n## ${data.description}`;
                fs.writeFileSync(`${data.dir}/${e}`, curData);
            }
            if (/\.json$/.test(e)) {
                fs.readFile(`${data.tpl}/${e}`, function (err, fileData) {
                    let curData = fileData.toString().replace(/\_name/, data.nameLower).replace(/\_version/, data.version).replace(/\_main/, `./${data.name}.jsx`).replace(/\_author/, data.author);
                    fs.writeFileSync(`${data.dir}/${e}`, curData);
                })
            }
            if (/\.jsx$/.test(e)) {
                fs.readFile(`${data.tpl}/${e}`, function (err, fileData) {
                    let curData = fileData.toString().replace(/\_namePascal/g, data.namePascal).replace(/\_name/g, data.name).replace(/\_displayName/, data.displayName).replace(/\_description/, data.description);
                    fs.writeFileSync(`${data.dir}/${data.name}.jsx`, curData);
                })
            }
            if (/^styles$/.test(e)) {
                fs.mkdirSync(`${data.dir}/${e}`);
                fs.readFile(`${data.tpl}/${e}/index.less`, function (err, fileData) {
                    let curData = fileData.toString().replace(/\_name/, data.name);
                    fs.writeFileSync(`${data.dir}/${e}/${data.name}.less`, curData);
                })
            }
        })
    });
}


/**
 * 生成路由并配置
 * @param url 路由地址
 * @param displayName 显示名
 */
exports._createRouter = (url, displayName) => {
    let targetPath = path.resolve(process.cwd(), 'src/index.jsx');
    fs.readFile(targetPath, (err, data) => {
        let oldData = data.toString();
        let index = oldData.indexOf('{/* 路由配置 */}');
        if (index < 0) {
            return;
        }
        index += 12;
        let result = oldData.slice(0, index) + `\n\t<Route path="/${url}" exact component={loadable(() => import("entries/${url}"))} /> {/* ${displayName} */}` + oldData.slice(index);
        fs.writeFileSync(targetPath, result);
    });
}

/**
 * 打包静态资源
 */
exports.copyStatic = () => {
    digo.copyDir('static', 'dist');
}