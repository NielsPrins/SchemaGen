import {Command} from "commander";
import {SchemaGen} from "./schema-gen";
import * as dotenv from "dotenv";
import chalk from "chalk";
import {PlantUmlFormatType, plantUmlFormatTypes} from "./lib/definitions";

console.clear();

const program = new Command();

program
  .name("schemagen")
  .description("Generate an ERD based on your database schema")
    .version("1.0.3");

program
  .option("--open-ai-key <string>", "Your OpenAI API key")
  .option("--dir <string>", "Modify the directory (default: current working directory)")
  .option("--output <string>", "The path to the output directory")
  .option("--type <string>", "Either 'svg' or 'png' (default: svg)", "svg")
  .option("--editor", "Open the generated diagram in the web editor")
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
      console.log(
        chalk.red("Or set the OPEN_AI_KEY environment variable in a .env file"),
      );
      process.exit(1);
    }

    if (!plantUmlFormatTypes.includes(fileType as PlantUmlFormatType)) {
      const supportedTypesString = plantUmlFormatTypes.join(", ");
      console.log(
        chalk.red(
          `Invalid file type: ${fileType}. Supported types are: ${supportedTypesString}`,
        ),
      );
      process.exit(1);
    }

    const schemaGen = new SchemaGen({
      openAiKey: openAiKey,
      directory: directory,
      outputDirectory: outputDirectory,
      fileType: fileType as PlantUmlFormatType,
      editor: args.editor,
    });

    schemaGen.start();
  });

program.parse();
