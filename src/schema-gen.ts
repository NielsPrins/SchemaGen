import plantumlEncoder from "plantuml-encoder";
import { ParsePlantUml } from "./utils/parse-plant-uml";
import chalk from "chalk";

interface SchemaGenConfig {
  workingDirectory: string;
  openAiKey: string;
}

export class SchemaGen {

  private readonly workingDirectory: string;

  constructor(config: SchemaGenConfig) {
    this.workingDirectory = config.workingDirectory;
  }

  start() {
    console.log("Starting schema generation...");

    // Search repo with OpenAI (PrismaJs, TypeORM, Laravel Eloquent or XML files.)
    // read the docs for information on propper PlantUML syntax
    // Create Plantuml diagram
    // Retrieve svg from PlantUml
    // Save to temp folder
    // Show to the user

    // @TODO fill with plantUml
    const somePlantUml = "A -> B: Hello";

    const parsePlantUml = new ParsePlantUml(somePlantUml, this.workingDirectory);
    const pngPath = parsePlantUml.saveAsPng();
    console.log(chalk.green(`Saved as PNG: ${pngPath}`));
  }
}


