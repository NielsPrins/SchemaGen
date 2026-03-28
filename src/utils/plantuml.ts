import { OpenAiProvider } from "../lib/open-api-port";
import { generateText } from "ai";
import ora from "ora";
import { readPlantUmlDocsTool } from "../tools/read-docs";

export class PlantUML extends OpenAiProvider {
  constructor(openApiKey: string) {
    super(openApiKey);
  }

  public async generate(content: string[]): Promise<string> {
    const loader = ora("Generating diagram").start();

    // generate the plantUML diagram of type `Information Engineering Diagrams` and `Class Diagrams`.
    // read the docs for information on propper PlantUML syntax located at ./docs/*.md
    const { text } = await generateText({
      model: this.openAi("gpt-5.4-nano"),
      tools: {
        read_docs: readPlantUmlDocsTool,
      },
      system: `
You generate valid PlantUML markup only.

You MUST call read_docs first and verify the correct syntax from ./docs/*.md before writing the diagram. Never guess PlantUML syntax.

Rules:
- Return only PlantUML markup
- No markdown fences
- No explanations
- No title directive
- No colors or custom styling unless explicitly requested
- Follow UML and PlantUML conventions strictly
- Prefer correctness, clarity, and minimalism
`,
      prompt: "",
    });

    loader.succeed();

    return text;
  }
}
