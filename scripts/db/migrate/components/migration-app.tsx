import { useCallback, useEffect, useState } from "react";
import { Box, Text, useApp, useInput } from "ink";

import type { MigrationOptions } from "../config.ts";
import { applyMigrations } from "../runner.ts";

type MigrationAppProps = {
  options: MigrationOptions;
};

export function MigrationApp({ options }: MigrationAppProps) {
  const { exit, waitUntilRenderFlush } = useApp();
  const [status, setStatus] = useState<"confirm" | "running" | "done" | "failed" | "cancelled">(
    options.yes ? "running" : "confirm",
  );
  const [output, setOutput] = useState<string[]>([]);

  const run = useCallback(async () => {
    setStatus("running");
    const result = await applyMigrations(options, (line) => {
      setOutput((current) => [...current.slice(-5), line]);
    });
    setStatus(result.exitCode === 0 ? "done" : "failed");
    await waitUntilRenderFlush();
    exit(result.exitCode);
  }, [exit, options, waitUntilRenderFlush]);

  useEffect(() => {
    if (options.yes) {
      void run();
    }
  }, [options.yes, run]);

  useInput(
    (input, key) => {
      if (input.toLowerCase() === "y") {
        void run();
      } else if (input.toLowerCase() === "n" || key.return) {
        setStatus("cancelled");
        void waitUntilRenderFlush().then(() => exit(0));
      }
    },
    { isActive: status === "confirm" },
  );

  const target = options.local ? "local D1 database" : "remote D1 database";

  return (
    <Box flexDirection="column" gap={1}>
      <Text bold>Cloudflare D1 migrations</Text>
      <Text>
        Target: <Text color={options.local ? "cyan" : "yellow"}>{target}</Text>
      </Text>
      <Text>
        Database: <Text>{options.databaseId}</Text>
      </Text>
      <Text>
        Directory: <Text>{options.directory}</Text>
      </Text>
      {status === "confirm" && (
        <Text>Apply pending migrations? This may briefly affect database availability. [y/N]</Text>
      )}
      {status === "running" && <Text color="cyan">Applying migrations...</Text>}
      {status === "done" && <Text color="green">Migrations applied successfully.</Text>}
      {status === "failed" && <Text color="red">Migration command failed; see output above.</Text>}
      {status === "cancelled" && <Text>Migration cancelled.</Text>}
      {output.map((line, index) => (
        <Text key={`${index}-${line}`} wrap="truncate">
          {line}
        </Text>
      ))}
    </Box>
  );
}
