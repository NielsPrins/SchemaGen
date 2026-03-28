import plantumlEncoder from "plantuml-encoder";
import fs from "fs";
import path from "path";
import chalk from "chalk";

type PlantUmlFormatType = "svg" | "png";

export class ParsePlantUml {
  constructor(
    private plantUmlDefinitionString: string,
    private outputPath: string,
  ) {}

  public async saveAsSvg(): Promise<string> {
    const type = "svg";
    const plantUmlUrl = this.getPlantUmlUrl(type);
    return await this.downloadFile(plantUmlUrl, type);
  }

  public async saveAsPng(): Promise<string> {
    const type = "png";
    const plantUmlUrl = this.getPlantUmlUrl(type);
    return await this.downloadFile(plantUmlUrl, type);
  }

  private getPlantUmlUrl(type: PlantUmlFormatType): string {
    const encoded = plantumlEncoder.encode(this.plantUmlDefinitionString);
    return `https://www.plantuml.com/plantuml/${type}/${encoded}`;
  }

  private async downloadFile(url: string, type: PlantUmlFormatType): Promise<string> {
    let outputPath = this.outputPath;

    const hasFilePath = outputPath.endsWith(".svg") || outputPath.endsWith(".png");
    if (!hasFilePath) {
      outputPath = `${outputPath}/ERD_diagram.${type}`;

      // Remove double slashes
      outputPath = outputPath.replace(/\/+/g, "/");
    }

    const response = await fetch(url);

    if (!response.ok || !response.body) {
      console.log(chalk.red("Unable to retrieve file, check your internet connection"));
      throw new Error(`Failed to get '${url}' (${response.status})`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    fs.writeFileSync(outputPath, buffer);

    return outputPath;
  }

}
