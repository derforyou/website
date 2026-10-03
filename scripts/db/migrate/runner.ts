import { spawn } from "node:child_process";

import { buildMigrationCommand } from "./command.ts";
import type { MigrationOptions } from "./config.ts";

export type MigrationResult = {
  exitCode: number;
  output: string[];
};

export function applyMigrations(
  options: MigrationOptions,
  onOutput: (line: string) => void,
): Promise<MigrationResult> {
  const { command, args } = buildMigrationCommand(options);

  return new Promise((resolve) => {
    const child = spawn(command, args, {
      env: process.env,
      stdio: ["ignore", "pipe", "pipe"],
    });
    const output: string[] = [];

    const appendOutput = (chunk: Buffer) => {
      const lines = chunk.toString().split(/\r?\n/).filter(Boolean);
      for (const line of lines) {
        output.push(line);
        onOutput(line);
      }
    };

    child.stdout.on("data", appendOutput);
    child.stderr.on("data", appendOutput);
    child.on("error", (error) => {
      const line = `Could not start Cloudflare CLI: ${error.message}`;
      output.push(line);
      onOutput(line);
      resolve({ exitCode: 1, output });
    });
    child.on("close", (code, signal) => {
      if (signal) {
        const line = `Cloudflare CLI stopped by signal ${signal}.`;
        output.push(line);
        onOutput(line);
      }
      resolve({ exitCode: code ?? 1, output });
    });
  });
}
