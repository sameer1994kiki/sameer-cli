const path = require("path");
const fs = require("fs");
const fse = require("fs-extra");
const chalk = require("chalk"); //5.x会有问题，是esm格式
const inquirer = require("inquirer");
const Generator = require("./Generator");
const createTemplates = async (name, options) => {
  const cwd = process.cwd();
  const targetDir = path.join(cwd, name);
  if (fse.existsSync(targetDir)) {
    if (options.force) {
      await fse.remove(targetDir);
    } else {
      // 询问用户是否强制覆盖
      let { action } = await inquirer.prompt([
        {
          name: "action",
          type: "list",
          message: "Target directory already exists Pick an action:",
          choices: [
            {
              name: "Overwrite",
              value: true,
            },
            {
              name: "Cancel",
              value: false,
            },
          ],
        },
      ]);
      if (!action) {
        return;
      } else {
        console.log("remove......");
        await fse.remove(targetDir);
      }
    }
  }
  const generator = new Generator(name, targetDir);
  generator.create();
  // const templ = path.join(__dirname, "../templates");
  // console.log(chalk.bgBlue(templ), ">>>");
  // const cwdUrl = process.cwd();
  // fs.readdir(templ, (err, files) => {
  //   console.log(files, ">?");
  //   if (err) throw err;
  //   files.forEach((file) => {
  //     console.log(path.join(templ, file), "????");
  //     fs.readFile(path.join(templ, file), (err, data) => {
  //       console.log(err, "data>>", data);
  //       fs.writeFileSync(path.join(cwdUrl, file), data);
  //     });
  //   });
  // });
};

module.exports = createTemplates;
