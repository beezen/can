let digo = require("digo");

/**
 * 清理仓库 默认dist
 */
exports.clean = () => {
    const dir = digo.parseArgs()[1];
    digo.cleanDir(dir || 'dist');
}

/**
 * 清理历史记录（危险操作慎用）
 */
exports.delGitHistory = () => {
    const message = digo.parseArgs()[1];
    if (!message) {
        digo.error("请补充操作描述，如：digo delGitHistory '初始化仓库'");
        return;
    }
    digo.exec('git checkout --orphan latest_branch && git add -A && git commit -am "first commit" && git branch -D master && git branch -m master && git push -f origin master');
}
