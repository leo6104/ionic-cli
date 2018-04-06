import * as path from 'path';

import chalk from 'chalk';
import * as Debug from 'debug';

import { prettyPath, stringWidth } from '@ionic/cli-framework/utils/format';
import { fsReadFile, readDir } from '@ionic/cli-framework/utils/fs';

import { CommandGroup, CommandLineInputs, CommandLineOptions, CommandMetadata } from '@ionic/cli-utils';
import { Command } from '@ionic/cli-utils/lib/command';
import { FatalException } from '@ionic/cli-utils/lib/errors';
import { prettyProjectName } from '@ionic/cli-utils/lib/project';

const debug = Debug('ionic:cli:commands:migrate');

export class MigrateCommand extends Command {
  async getMetadata(): Promise<CommandMetadata> {
    const groups: CommandGroup[] = [CommandGroup.Beta];

    if (this.env.project.type !== 'angular') {
      groups.push(CommandGroup.Hidden);
    }

    return {
      name: 'migrate',
      type: 'project',
      summary: '',
      options: [
        {
          name: 'matches',
          type: Boolean,
          summary: 'Do not show the matches and their suggested replacements',
          aliases: ['m'],
          default: true,
        },
      ],
      groups,
    };
  }

  async run(inputs: CommandLineInputs, options: CommandLineOptions): Promise<void> {
    const { MIGRATION_RULES } = await import('@ionic/cli-utils/lib/project/ionic-angular/migrate');

    let matchCount = 0;

    if (this.env.project.type !== 'angular') {
      throw new FatalException(`The migrate tool is only available for ${chalk.bold('angular')} (${prettyProjectName('angular')}) projects.`);
    }

    this.env.tasks.next('Loading file list');
    const srcDir = await this.env.project.getSourceDir();
    const files = (await readDir(srcDir, { recursive: true })).filter(item => path.extname(item) === '.html' || path.extname(item) === '.ts');
    this.env.tasks.end();

    for (const filePath of files) {
      debug(`Checking ${prettyPath(filePath)}`);

      const fileContents = await fsReadFile(filePath, { encoding: 'utf8' });

      // if (!filePath.endsWith('speaker-list/speaker-list.html')) {
      //   continue;
      // }

      for (const rule of MIGRATION_RULES) {
        const matches = fileContents.match(rule.regex);

        // if (matches) {
        //   console.log(matches);
        //   return;
        // }

        if (matches) {
          matchCount += matches.length;

          const msg = `Found ${chalk.bold(matches.length.toString())} matches for rule: ${chalk.cyan(rule.name)}`;
          this.env.log.msg(msg);
          this.env.log.msg(chalk.dim('-').repeat(stringWidth(msg)));

          this.env.log.msg(`File: ${chalk.dim(prettyPath(filePath))}`);

          if (rule.url) {
            this.env.log.msg(`Docs: ${chalk.dim(rule.url)}`);
          }

          this.env.log.nl();

          if (rule.tagNameChanged) {
            this.env.log.warn(`Tag names changed. Don't forget to update the closing tags!`);
            this.env.log.nl();
          }

          if (options['matches']) {
            for (const i in matches) {
              const match = matches[i];

              this.env.log.msg(chalk.red(match));
              this.env.log.msg(chalk.green(match.replace(rule.regex, rule.replacement)));

              this.env.log.nl();
            }
          }

          // return;
        }
      }
    }

    if (matchCount === 0) {
      this.env.log.ok(`Your app is migrated! (maybe)`);
    } else {
      this.env.log.info(
        `Summary: Found ${chalk.bold(matchCount.toString())} matches in ${chalk.bold(files.length.toString())} files.\n` +
        `Replace the lines in ${chalk.red('red')} with the new lines below it in ${chalk.green('green')}.`
      );
    }
  }
}
