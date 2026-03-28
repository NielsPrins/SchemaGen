import { SchemaDiscovery } from "./schema-discovery";
import "dotenv/config";
import { PlantUML } from "./plantuml";
import { encode } from "plantuml-encoder";

export async function main() {
  const apiKey = process.env.OPEN_AI_KEY ?? "";

  const discovery = new SchemaDiscovery(apiKey);
  const files = await discovery.discover('./examples');

  const content = discovery.readFiles(files);

  const plantUML = new PlantUML(apiKey);

  const str = await plantUML.generate(content);
  const codex = encode(str)

  console.log(`https://www.plantuml.com/plantuml/png/${codex}`);
}

main();
