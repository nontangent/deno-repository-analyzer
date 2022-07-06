import { CSVWriter } from "https://deno.land/x/csv@v0.7.5/mod.ts";
import { basename } from "https://deno.land/std@0.95.0/path/mod.ts";
import { Target } from "./analyzer.ts";

export class Exporter {
  async tsv(outputPath: string, record: Record<string, Target[]>) {
    const fileName = basename(outputPath, '.tsv');
    const columns = Object.values(record)?.[0].map(t => t.label);
    const rows = [
      [fileName, ...columns],
      ...Object.entries(record).reverse().map(([k, t]) => [k, ...t.map(({count}) => `${count}`)]),
    ];
    await writeTsv(outputPath, transpose(rows));
  }
}

async function writeTsv(outputPath: string, rows: string[][]) {
  const file = await Deno.open(outputPath, {write: true, create: true, truncate: true});

  const writer = new CSVWriter(file, {
    columnSeparator: "\t",
    lineSeparator: "\r\n",
  });
  for (const row of rows) {
    for (const cell of row) {
      await writer.writeCell(cell);
    }
    await writer.nextLine();
  }
}

const transpose = (a: string[][]) => a[0].map((_, c) => a.map(r => r[c]));
