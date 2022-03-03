import { Command, CommandRunner, Option } from 'nest-commander';
import { TrigsService } from 'src/trigs/trigs.service';

interface BasicCommandOptions {
  string?: string;
  boolean?: boolean;
  number?: number;
}

@Command({ name: 'basic', description: 'A parameter parse' })
export class MigrateService implements CommandRunner {
  constructor(private readonly trigsService: TrigsService) {}

  async run(
    passedParam: string[],
    options?: BasicCommandOptions,
  ): Promise<void> {
    if (options?.boolean !== undefined && options?.boolean !== null) {
      this.runWithBoolean(passedParam, options.boolean);
    } else if (options?.number) {
      this.runWithNumber(passedParam, options.number);
    } else if (options?.string) {
      this.runWithString(passedParam, options.string);
    } else {
      this.runWithNone(passedParam);
    }
  }

  @Option({
    flags: '-n, --number [number]',
    description: 'A basic number parser',
  })
  parseNumber(val: string): number {
    return Number(val);
  }

  @Option({
    flags: '-s, --string [string]',
    description: 'A string return',
  })
  parseString(val: string): string {
    return val;
  }

  @Option({
    flags: '-b, --boolean [boolean]',
    description: 'A boolean parser',
  })
  parseBoolean(val: string): boolean {
    return JSON.parse(val);
  }

  runWithString(param: string[], option: string): void {
    console.log({ param, string: option });
  }

  async runWithNumber(param: string[], option: number): Promise<void> {
    console.log({ param, number: option });
    // await new Promise((r) => setTimeout(r, 2000));
    // console.log('2secs later');
    var trig = await this.trigsService.findAll();
    console.log(trig);
  }

  runWithBoolean(param: string[], option: boolean): void {
    console.log({ param, boolean: option });
  }

  runWithNone(param: string[]): void {
    console.log({ param });
  }
}
