import { readdirSync, statSync } from "node:fs";
import { basename, resolve } from "node:path";
import { generateText, generateObject, Output } from "ai";
import { z } from "zod";

const ignored = ['node_modules', '.git', '.idea', '.vscode', 'dist', 'build', 'out', 'logs',]

export class SchemaDiscovery {
  static discover(_key: string, path?: string): string {
    const root = path ? resolve(process.cwd(), path) : process.cwd();
    const tree = this.buildTree(root);

    const {} = generateText({
      model: "gpt-4", // I need a super fast model
      prompt: ``,
      output: Output.object() // output a
    })

    return tree;
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
