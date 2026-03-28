import { ParsePlantUml } from "./utils/parse-plant-uml";
import chalk from "chalk";
import { SchemaDiscovery } from "./utils/schema-discovery";
import { PlantUmlFormatType } from "./lib/definitions";
import { PlantUML } from "./utils/plantuml";
import plantumlEncoder from "plantuml-encoder";
import open from "open";


interface SchemaGenConfig {
  openAiKey: string;
  directory: string;
  outputDirectory: string;
  fileType: PlantUmlFormatType;
  editor?: boolean;
}

export class SchemaGen {
  private readonly config: SchemaGenConfig;

  constructor(config: SchemaGenConfig) {
    this.config = config;
  }

  async start(): Promise<void> {
    console.log(chalk.cyan("----- ") + chalk.bgBlue(" SchemaGen ") + chalk.cyan(" -----"));
    console.log(chalk.cyan("Starting schema generation..."));

    const schemaDiscovery = new SchemaDiscovery(this.config.openAiKey);
    const files = await schemaDiscovery.discover(this.config.directory);

    const contentOfFiles = schemaDiscovery.readFiles(files);

    const plantUML = new PlantUML(this.config.openAiKey);
    const plantUmlDefinition = await plantUML.generate(contentOfFiles);

    const parsePlantUml = new ParsePlantUml(
      plantUmlDefinition,
      this.config.outputDirectory,
    );

    console.log(chalk.green(`✔ Successfully generated a ERD schema`));

    if (this.config.editor) {
      const url = `https://editor.plantuml.com/uml/${plantumlEncoder.encode(plantUmlDefinition)}`;
      open( url);
    } else {
      const filePath = await parsePlantUml.save(this.config.fileType);
      open(filePath);

      console.log(chalk.green(`Diagram is saved as ${this.config.fileType}: ${filePath}`));
    }
  }
}
