import { Command } from "commander";
import { SchemaGen } from "./schema-gen";
import * as dotenv from "dotenv";
import chalk from "chalk";
import { PlantUmlFormatType, plantUmlFormatTypes } from "./lib/definitions";

const program = new Command();

program
  .name("schemagen")
  .description("Generate an ERD based on your database schema")
  .version("0.1.0");

program
  .command("gen")
  .option("--open-ai-key", "Your OpenAI API key")
  .option("--dir", "Modify the directory (default: current working directory)", "examples/drizzle-orm")
  .option("--output", "The path to the output directory")
  .option("--type", "Either 'svg' or 'png' (default: svg)", "svg")
  .action((args) => {
    let openAiKey: string | undefined = args["open-ai-key"];
    let directory: string | undefined = args["dir"];
    let outputDirectory: string | undefined = args["output"];
    let fileType: string | undefined = args["type"];

    const currentWorkingDirectory = process.cwd();
    directory = `${currentWorkingDirectory}/${directory ?? ""}`;
    directory = directory.replace(/\/+/g, "/").replace(/\/$/, "");

    outputDirectory = `${currentWorkingDirectory}/${outputDirectory ?? ""}`;
    outputDirectory = outputDirectory.replace(/\/+/g, "/").replace(/\/$/, "");

    if (!openAiKey) {
      dotenv.config({ quiet: true });
      openAiKey = process.env.OPEN_AI_KEY;
    }

    if (!openAiKey) {
      console.log(chalk.red("OpenAI API key is required"));
      console.log(chalk.red("Either use the --open-ai-key argument"));
      console.log(chalk.red("Or set the OPEN_AI_KEY environment variable in a .env file"));
      process.exit(1);
    }

    if (!plantUmlFormatTypes.includes(fileType as PlantUmlFormatType)) {
      const supportedTypesString = plantUmlFormatTypes.join(", ");
      console.log(chalk.red(`Invalid file type: ${fileType}. Supported types are: ${supportedTypesString}`));
      process.exit(1);
    }

    const schemaGen = new SchemaGen({
      openAiKey: openAiKey,
      directory: directory,
      outputDirectory: outputDirectory,
      fileType: fileType as PlantUmlFormatType,
    });

    schemaGen.start();
  });

program.parse();
