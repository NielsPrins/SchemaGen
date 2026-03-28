import { Command } from "commander";
import { SchemaGen } from "./schema-gen";
import * as dotenv from "dotenv";
import chalk from "chalk";

const program = new Command();

program
  .name("schemagen")
  .description("Generate an ERD based on your database schema")
  .version("0.1.0");

program
  .command("gen")
  .option("--open-ai-key", "Your OpenAI API key")
  .option("--dir", "Modify the directory (default: current working directory)")
  .option("--output", "The path to the output directory")
  .action((args) => {

    let openAiKey: string | undefined = args["open-ai-key"];
    let directory: string | undefined = args['dir'];
    let outputDirectory: string | undefined = args['output'];

    if (!directory) {
      directory = process.cwd();
    }

    if (!outputDirectory){
      outputDirectory = process.cwd();
    }

    if (!openAiKey) {
      dotenv.config({quiet: true});
      openAiKey = process.env.OPEN_AI_KEY;
    }

    if (!openAiKey){
      console.log(chalk.red("OpenAI API key is required"));
      console.log(chalk.red("Either use the --open-ai-key argument"));
      console.log(chalk.red("Or set the OPEN_AI_KEY environment variable in a .env file"));
      process.exit(1);
    }

    const schemaGen = new SchemaGen({
      openAiKey: openAiKey,
      directory: directory,
      outputDirectory: outputDirectory,
    });

    schemaGen.start();
  });

program.parse();
