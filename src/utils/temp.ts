import { SchemaDiscovery } from "./schema-discovery";
import 'dotenv/config'

export async function main() {
  const files = await SchemaDiscovery.discover(
    process.env.OPEN_AI_KEY ?? '',
  );

  console.log(files);
}

main()
