import dayjs from "https://deno.land/x/deno_dayjs@v0.2.1/mod.ts";
import { Dayjs } from "https://deno.land/x/deno_dayjs@v0.2.1/index.d.ts";
import { RepositoryAnalyzer, Target } from './analyzer.ts';
import { checkoutByDate, checkoutMain } from './git.ts';

export class SequentialAnalyzer {
  constructor(
    private repositoryPath: string,
    private targetsFactory: (date: Dayjs) => Target[],
  ) { }

  private async checkoutMain() {
    await checkoutMain(this.repositoryPath);
  }

  private async checkoutByDate(date: Dayjs) {
    await checkoutByDate(this.repositoryPath, date);
  }

  async analyze(since: Dayjs = dayjs()): Promise<Record<string, Target[]>> {
    const transitionMap: Record<string, Target[]> = {};
    await this.checkoutMain();

    try {
      for (let date = dayjs().date(1).add(1, 'month'); date.isAfter(dayjs(since)); date = date.add(-1, 'month')) {
        await this.checkoutByDate(date);
        const targets = this.targetsFactory(date);
        transitionMap[date.format('YYYY/MM/DD')] = await new RepositoryAnalyzer(this.repositoryPath, targets).analyze();
      }
    } finally {
      await this.checkoutMain();
    }

    return transitionMap;
  }
}
