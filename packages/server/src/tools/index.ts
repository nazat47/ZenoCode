import { Mode } from "@zenocode/database/enums";
import { createReadFileTool } from "./read";
import { createListDirectoryTool } from "./list-directory";
import { createGrepTool } from "./grep";
import { createGlobTool } from "./glob";
import { createWriteFileTool } from "./write";
import { createEditFileTool } from "./edit-file";
import { createBashTool } from "./bash";

export function createTools(cwd: string, mode: Mode) {
  const readOnlyTools = {
    readFile: createReadFileTool(cwd),
    listDirectory: createListDirectoryTool(cwd),
    grep: createGrepTool(cwd),
    glob: createGlobTool(cwd),
  };

  if (mode === Mode.PLAN) {
    return readOnlyTools;
  }

  return {
    ...readOnlyTools,
    writeFile: createWriteFileTool(cwd),
    editFile: createEditFileTool(cwd),
    bash: createBashTool(cwd),
  };
}
