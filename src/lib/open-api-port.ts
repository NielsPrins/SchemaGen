import { createOpenAI, OpenAIProvider } from "@ai-sdk/openai";

export abstract class OpenAiProvider {
  protected openAi: OpenAIProvider;

  protected constructor(openApiKey: string) {
    this.openAi = createOpenAI({ apiKey: openApiKey });
  }
}
