const ora = require("ora");
const inquirer = require("inquirer");
const util = require("util");
const path = require("path");
const chalk = require("chalk");
const downloadGitRepo = require("download-git-repo");
// 添加加载动画
async function wrapLoading(fn, message, ...args) {
  // 使用 ora 初始化，传入提示信息 message
  const spinner = ora(message);
  // 开始加载动画
  spinner.start();

  try {
    // 执行传入方法 fn
    const result = await fn(...args);
    // 状态为修改为成功
    spinner.succeed();
    return result;
  } catch (error) {
    // 状态为修改为失败
    spinner.fail("Request failed, refetch ...", error);
  }
}
class Generator {
  constructor(name, targetDir) {
    // 目录名称
    this.name = name;
    // 创建位置
    this.targetDir = targetDir;
    // 对 download-git-repo 进行 promise 化改造
    this.downloadGitRepo = util.promisify(downloadGitRepo);
  }

  async getRepo() {
    // 过滤我们需要的模板名称
    const repos = ["umi-pc", "umi-h5", "next-pc", "next-h5", "node"];

    // 2）用户选择自己新下载的模板名称
    const { repo } = await inquirer.prompt({
      name: "repo",
      type: "list",
      choices: repos,
      message: "Please choose a template to create project",
    });

    // 3）return 用户选择的模版
    return repo;
  }

  // 核心创建逻辑
  async create() {
    const res = await this.getRepo();
    if (res) {
      const requestUrl = "sameer1994kiki/umi-pc-templete";
      console.log(path.resolve(process.cwd(), this.targetDir), "???????");
      await wrapLoading(
        this.downloadGitRepo, // 远程下载方法
        "waiting download template", // 加载提示信息
        requestUrl, // 参数1: 下载地址
        path.resolve(process.cwd(), this.targetDir)
      ); // 参数2: 创建位置downloadGitRepo
      // 4）模板使用提示
      console.log(`\r\nSuccessfully created project ${chalk.cyan(this.name)}`);
      console.log(`\r\n  cd ${chalk.cyan(this.name)}`);
      console.log("  npm run dev\r\n");
    }
  }
}

module.exports = Generator;
