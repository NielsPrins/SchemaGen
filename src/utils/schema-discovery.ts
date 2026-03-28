import { readdirSync, statSync } from "node:fs";
import { basename, resolve } from "node:path";
import { generateText, Output } from "ai";
import { z } from "zod";
import { createOpenAI } from "@ai-sdk/openai";

import ora from "ora";

const ignored = [
  "node_modules",
  ".git",
  ".idea",
  ".vscode",
  "dist",
  "build",
  "out",
  "logs",
];

export class SchemaDiscovery {
  static async discover(key: string, path?: string) {
    const loader = ora("Building tree").start();

    const root = path ? resolve(process.cwd(), path) : process.cwd();
    const tree = this.buildTree(root);

    try {
      const { output } = await this.lookup(tree, key);

      loader.succeed();

      return output.files;
    } catch (e) {
      console.error(e);
      loader.fail();
    }
  }

  private static lookup(tree: string, key: string) {
    const openai = createOpenAI({
      apiKey: key,
    });

    return generateText({
      model: openai("gpt-5.4-nano"),
      system: [
        "You are a codebase analysis assistant.",
        "Your job is to identify files that define the database schema.",
        "Return only file paths that appear in the provided tree.",
        "Prefer precision over recall.",
        "Do not guess missing paths.",
        "Include files that directly define tables, models, entities, Prisma schema, Drizzle schema, TypeORM entities, or database relations.",
        "Include migrations only if they are clearly the primary source of schema definition.",
        "Exclude seeds, fixtures, generated files, build output, tests, docs, and config files unless they directly define the database schema.",
      ].join(" "),
      prompt: [
        "Identify the files that define the database schema in this project tree.",
        "",
        "Rules:",
        "- Return only paths that are explicitly present in the tree.",
        "- Return relative file paths exactly as shown.",
        "- Only include files that directly define the schema.",
        "- If unsure, leave the file out.",
        "",
        "Project tree:",
        tree,
      ].join("\n"),
      output: Output.object({
        name: "files",
        description: "an array of files that define the schema",
        schema: z.object({
          files: z.array(z.string()),
        }),
      }),
    });
  }

  private static buildTree(target: string, prefix = ""): string {
    const stats = statSync(target);
    const name = basename(target);

    if (stats.isFile()) {
      return `${prefix}${name}`;
    }

    const tree = [`${prefix}${name}`];

    const entries = readdirSync(target, { withFileTypes: true }).filter(
      (entry) => !entry.isDirectory() || !ignored.includes(entry.name),
    );
    entries.forEach((entry, index) => {
      const isLast = index === entries.length - 1;
      const branch = isLast ? "└── " : "├── ";
      const path = resolve(target, entry.name);

      if (entry.isDirectory()) {
        tree.push(`${prefix}${branch}${entry.name}/`);
        tree.push(
          ...this.buildTree(path, prefix + (isLast ? "    " : "│   "))
            .split("\n")
            .slice(1),
        );

        return;
      }

      tree.push(`${prefix}${branch}${entry.name}`);
    });

    return tree.join("\n");
  }
}
