import { SchemaDiscovery } from "./schema-discovery";

export function main() {
  const files = SchemaDiscovery.discover(
    process.env.OPEN_AI_KEY ?? '',
    "./examples/prisma/schema.prisma",
  );
}

main()
