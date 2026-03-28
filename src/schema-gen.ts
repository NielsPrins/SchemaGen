import plantumlEncoder from "plantuml-encoder";
import { ParsePlantUml } from "./utils/parse-plant-uml";
import chalk from "chalk";
import ora from "ora";
import { SchemaDiscovery } from "./utils/schema-discovery";

interface SchemaGenConfig {
  openAiKey: string;
  directory: string;
  outputDirectory: string;
}

export class SchemaGen {

  private readonly config: SchemaGenConfig;

  constructor(config: SchemaGenConfig) {
    this.config = config;
  }

  start() {
    console.log(chalk.cyan("Starting schema generation..."));

    const schemaDiscovery = new SchemaDiscovery();

    // Search repo with OpenAI (PrismaJs, TypeORM, Laravel Eloquent or XML files.)
    // read the docs for information on propper PlantUML syntax
    // Create Plantuml diagram
    // Retrieve svg from PlantUml
    // Save to temp folder
    // Show to the user

    // @TODO fill with plantUml
    const somePlantUml = "A -> B: Hello";

    const parsePlantUml = new ParsePlantUml(somePlantUml, this.config.outputDirectory);
    const svgPath = parsePlantUml.saveAsSvg();
    console.log(chalk.green(`Saved as SVG: ${svgPath}`));
  }
}


