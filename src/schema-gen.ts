import plantumlEncoder, { encode } from "plantuml-encoder";
import { ParsePlantUml } from "./utils/parse-plant-uml";
import chalk from "chalk";
import ora from "ora";
import { SchemaDiscovery } from "./utils/schema-discovery";
import { PlantUmlFormatType } from "./lib/definitions";
import { PlantUML } from "./utils/plantuml";

interface SchemaGenConfig {
  openAiKey: string;
  directory: string;
  outputDirectory: string;
  fileType: PlantUmlFormatType;
}

export class SchemaGen {

  private readonly config: SchemaGenConfig;

  constructor(config: SchemaGenConfig) {
    this.config = config;
  }

  async start(): Promise<void> {
    console.log(chalk.cyan("--- ", chalk.white(chalk.bgGreen("SchemaGen")) + " ---"));
    console.log(chalk.cyan("Starting schema generation..."));

    const schemaDiscovery = new SchemaDiscovery(this.config.openAiKey);
    const files = await schemaDiscovery.discover(this.config.directory);

    const contentOfFiles = schemaDiscovery.readFiles(files);

    const plantUML = new PlantUML(this.config.openAiKey);
    const plantUmlDefinition = await plantUML.generate(contentOfFiles);

    const parsePlantUml = new ParsePlantUml(plantUmlDefinition, this.config.outputDirectory);
    const filePath = await parsePlantUml.save(this.config.fileType);

    console.log(``);
    console.log(chalk.green(`✔ Successfully generated a ERD schema`));
    console.log(chalk.green(`Diagram is saved as ${this.config.fileType}: ${filePath}`));
  }
}


