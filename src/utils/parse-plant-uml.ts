import plantumlEncoder from "plantuml-encoder";
import fs from "fs";
import chalk from "chalk";
import { PlantUmlFormatType } from "../lib/definitions";
import ora from "ora";

export class ParsePlantUml {
  constructor(
    private plantUmlDefinitionString: string,
    private outputPath: string,
  ) {}

  public async save(type: PlantUmlFormatType): Promise<string> {
    const progressionSpinner = ora(chalk.cyan("Parsing  ERD diagram")).start();

    const plantUmlUrl = this.getPlantUmlUrl(type);
    progressionSpinner.text = chalk.blue("Downloading ERD diagram");

    const filePath = await this.downloadFile(plantUmlUrl, type);
    progressionSpinner.succeed("Retrieved ERD diagram");
    return filePath;
  }

  private getPlantUmlUrl(type: PlantUmlFormatType): string {
    const encoded = plantumlEncoder.encode(this.plantUmlDefinitionString);
    return `https://www.plantuml.com/plantuml/${type}/${encoded}`;
  }

  private async downloadFile(
    url: string,
    type: PlantUmlFormatType,
  ): Promise<string> {
    let outputPath = this.outputPath;

    const hasFilePath =
      outputPath.endsWith(".svg") || outputPath.endsWith(".png");
    if (!hasFilePath) {
      outputPath = `${outputPath}/ERD_diagram.${type}`;

      // Remove double slashes
      outputPath = outputPath.replace(/\/+/g, "/");
    }

    const response = await fetch(url);

    if (!response.ok || !response.body) {
      console.log(
        chalk.red("Unable to retrieve file, check your internet connection"),
      );
      throw new Error(`Failed to get '${url}' (${response.status})`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    fs.writeFileSync(outputPath, buffer);

    return outputPath;
  }
}
