import * as path from "https://deno.land/std@0.95.0/path/mod.ts";
import { expandGlob } from "https://deno.land/std@0.95.0/fs/expand_glob.ts";

export interface Target {
  label: string;
  glob: string;
  files?: string[];
  count?: number;
}

const glob = async (path: string) => {
  const files: string[] = [];
  for await (const file of expandGlob(path)) {
    files.push(file.path);
  }
  return files;
}

export class RepositoryAnalyzer {
  constructor(
    private baseDir: string,
    private targets: Target[], 
  ) { }

  analyze(): Promise<Target[]> {
    const promises = this.targets.map(async target => {
      const files = await glob(path.resolve(this.baseDir, target.glob));
      return { ...target, files, count: this.countByFiles([...files]) };
    });
    return Promise.all(promises);
  }

  private countByFiles(paths: string[]) {
    const decoder = new TextDecoder("utf-8");
    const count = (path: string) => {
      const data = Deno.readFileSync(path);
      return decoder.decode(data).split('\n').length;
    }
    return paths.map(count).reduce((sum, count) => sum + count, 0);
  }
}
