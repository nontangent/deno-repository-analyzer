## Deno Repository Analyzer
This is a tool for monthly analyzing source code size on Deno.

## Usage

1. Write config and main scripts.

```ts
// main.ts
import dayjs from "https://deno.land/x/deno_dayjs@v0.2.1/mod.ts";
import { Dayjs } from "https://deno.land/x/deno_dayjs@v0.2.1/index.d.ts";
import { resolve } from "https://deno.land/std@0.147.0/path/mod.ts";
import { Exporter, SequentialAnalyzer } from 'https://raw.githubusercontent.com/nontangent/deno-repository-analyzer/main/src/index.ts';


const CWD = Deno.cwd();
const REPOSITORY_PATH = resolve(CWD, '../../work/target_repository');

// You can switch config by date
const CONFIG_FACTORY = (date: Dayjs) => [
  {
    label: 'feature_01',
    glob: 'src/features/01/**.ts'
  },
  {
    label: 'feature_02',
    glob: 'src/features/02/**.ts'
  },
];

async function main() {
  const analyzer = new SequentialAnalyzer(REPOSITORY_PATH, CONFIG_FACTORY);
  const result = await analyzer.analyze(dayjs('2022-01')); // <- This is start month
  const outputPath = resolve(CWD, `./typescript.tsv`);
  await new Exporter().tsv(outputPath, result);
}

await main();
```


2. Execute following command.

```sh
$ deno run --allow-read --allow-write --allow-run main.ts
```

3. expected to create `typescript.tsv`.
```
typescipt 2022-01 2022-02 2022-03
feature_01  123 145 166
feature_02  20  45  45
```