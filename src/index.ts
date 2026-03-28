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
  .option("--output", "The path to the output directory")
  .action((args) => {

    let outputDir: string | undefined = args['output'];
    let openAiKey: string | undefined = args["open-ai-key"];

    if (!outputDir){
      outputDir = process.cwd();
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
      workingDirectory: outputDir,
      openAiKey: openAiKey,
    });

    schemaGen.start();
  });

program.parse();
