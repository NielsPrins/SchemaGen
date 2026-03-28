import { generateText, tool, stepCountIs } from "ai";
import { z } from "zod";

export const readPlantUmlDocsTool = tool({
  description:
    "Reads PlantUML documentation to verify correct syntax for diagram types",
  inputSchema: z.object({}),
  execute: async ({}) => {
    const { readdir, readFile } = await import("node:fs/promises");
    const path = await import("node:path");

    const docsDirectory = path.resolve(__dirname, "../../docs");
    const markdownFiles = (await readdir(docsDirectory))
      .filter((fileName) => fileName.endsWith(".md"))
      .sort();

    if (markdownFiles.length === 0) {
      throw new Error(`No markdown files found in ${docsDirectory}`);
    }

    const docs = await Promise.all(
      markdownFiles.map(async (fileName) => {
        const filePath = path.join(docsDirectory, fileName);
        const content = await readFile(filePath, "utf8");

        return `FILE: ${fileName}\n\n${content}`;
      }),
    );

    return {
      docs: docs.join("\n\n---\n\n"),
    };
  },
});
