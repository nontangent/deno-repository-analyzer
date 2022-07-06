import { Dayjs } from "https://deno.land/x/deno_dayjs@v0.2.1/index.d.ts";

async function exec(command: string) {
  const p = Deno.run({ cmd: ["bash"], stdout: "piped", stdin: "piped" });
  const encoder = new TextEncoder();
  await p.stdin.write(encoder.encode(command));
  await p.stdin.close();
  await p.output()
  p.close();
}

export async function checkoutMain(dir: string) {
  Deno.chdir(dir);
  console.debug(Deno.cwd());
  await exec('git checkout main');
}

export async function checkoutByDate(dir: string, date?: Dayjs) {
  Deno.chdir(dir);
  if (date) {
    const str = date.format('YYYY-MM-DD');
    try {
      await exec(`git log -1 --until=${str} --oneline | awk '{print $1}'| xargs git checkout`);
    } catch (e) {
      console.error('errors:', e.stderr) ;
    }
    console.debug(`checkout to ${str}`);
  }
}
