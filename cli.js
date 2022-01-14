#! /usr/bin/env node -> 我要用系统中的这个目录/user/bin/env的node环境来执行此文件，且需要注意必须放在文件开头。
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");
const ejs = require("ejs");
const commander = require("commander");
const chalk = require("chalk"); //5.x会有问题，是esm格式
const ora = require("ora"); // 6.x会有问题，是esm格式
const spawn = require("cross-spawn");
const figlet = require("figlet");
const createTemplates = require("./utils/createTemplates");

const VERSION = `v${require("./package.json").version}`;
const spawnFnTest = () => {
  const dependencies = ["react"];
  const child = spawn("npm", ["install", "-D"].concat(dependencies), {
    stdio: "inherit",
  });
  child.on("close", (code) => {
    if (code === 0) {
      console.log(chalk.green("安装成功"));
    } else {
      console.log(chalk.red("依赖安装失败"));
      process.exit(1);
    }
  });
};

const oraFnTest = () => {
  const spinner = ora("Loading unicorns").start();
  spinner.color = "yellow";
  spinner.text = "Loading rainbows";
  setTimeout(() => {
    spinner.stop(); // 停止
    spinner.succeed("Loading succeed"); // 成功 ✔
  }, 3000);
};
commander
  .version(VERSION)
  .command("create <name>")
  .description("create a new project")
  // -f or --force 为强制创建，如果创建的目录存在则直接覆盖
  .option("-f, --force", "overwrite target directory if it exist")
  .action((name, options, command) => {
    console.log("project name is " + chalk.green(name));
    inquirer
      .prompt([
        {
          type: "input",
          name: "name",
          message: "your name",
          default: "my-node-cli",
        },
      ])
      .then((answers) => {
        console.log(chalk.underline(answers));
        // spawnFnTest();
        createTemplates(name, options);
        // oraFnTest();
      });
  });

// 配置 额外 命令 -h
commander
  .command("ui")
  .description("start add open roc-cli ui")
  .option("-p, --port <port>", "Port used for the UI Server")
  .action((option) => {
    console.log(option);
  });

commander.on("--help", () => {
  console.log(
    "\r\n" +
      figlet.textSync("sameer", {
        font: "Ghost",
        horizontalLayout: "default",
        verticalLayout: "default",
        width: 80,
        whitespaceBreak: true,
      })
  );
});
commander.parse();
