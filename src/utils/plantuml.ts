import { OpenAiProvider } from "../lib/open-api-port";
import { generateText, stepCountIs } from "ai";
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
      prompt: `
You are given source content from a codebase. Your task is to generate a valid PlantUML diagram based on that content.

Before generating anything, you MUST call \`read_docs\` and use the documentation in \`./docs/*.md\` to verify the correct PlantUML syntax. Do not rely on memory. Do not guess syntax.

Goal:
Generate exactly one valid PlantUML diagram in plain text.

Diagram selection rules:
- If the content mainly describes database tables, entities, columns, primary keys, foreign keys, or relations between persisted data structures, generate an Information Engineering diagram.
- If the content mainly describes software types, classes, interfaces, inheritance, composition, methods, or object-oriented structure, generate a UML Class Diagram.
- If both are present, choose the single diagram type that best represents the primary structure in the input. Do not mix incompatible notations unless the docs explicitly support it cleanly.

Requirements:
- Output ONLY valid PlantUML markup.
- Start with \`@startuml\` and end with \`@enduml\`.
- Do NOT output explanations, markdown fences, comments, or prose.
- Do NOT include a \`title\`.
- Do NOT use colors, themes, or custom \`skinparam\` unless explicitly requested.
- Keep the diagram minimal, readable, and standards-aligned.
- Follow UML and PlantUML conventions strictly.
- Use correct cardinalities, inheritance, aggregation, composition, and dependency notation where applicable.
- Only include relationships that are clearly supported by the input.
- Do not invent fields, methods, keys, or associations.
- Use stable, clear names taken from the input.
- Avoid duplicate entities/classes.
- Prefer a compact diagram over an overly detailed one when the input is ambiguous.

Information Engineering diagram rules:
- Represent entities/tables clearly.
- Include important attributes/columns when present.
- Mark primary keys and foreign keys when supported by the source content and docs.
- Show relationships with correct cardinality.
- Focus on schema structure, not application behavior.

Class Diagram rules:
- Represent classes/interfaces cleanly.
- Include important properties and methods only when clearly present and useful.
- Show inheritance, implementation, composition, aggregation, association, and dependency only when justified by the input.
- Keep visibility and typing consistent with the source content when available.

Validation rules:
- Ensure the final output is syntactically valid PlantUML.
- Ensure the notation matches the selected diagram type.
- Ensure the output can be rendered directly by a PlantUML renderer.
- If the input is incomplete, generate the safest minimal valid diagram rather than guessing.

Source content:
${content.join("\\n\\n")}
`,
      stopWhen: stepCountIs(2),
    });

    loader.succeed();

    return text;
  }
}
