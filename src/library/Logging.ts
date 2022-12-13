import chalk from 'chalk';

/** Custom Logging Method */

export default class Logging {
  public static log = (args: any) => this.info(args);

  public static info = (args: any) =>
    console.log(
      chalk.whiteBright(`[${new Date().toLocaleString()}] [INFO]`),
      typeof args === 'string' ? chalk.blueBright(args) : args
    );

  public static warn = (args: any) =>
    console.log(
      chalk.whiteBright(`[${new Date().toLocaleString()}] [WARN]`),
      typeof args === 'string' ? chalk.yellowBright(args) : args
    );

  public static error = (args: any) =>
    console.log(
      chalk.whiteBright(`[${new Date().toLocaleString()}] [ERROR]`),
      typeof args === 'string' ? chalk.redBright(args) : args
    );
}
