import * as crypto from 'crypto';
import * as fs from 'fs';
import * as path from 'path';

import { CommandGroup, CommandMetadata } from '@ionic/cli-utils';
import { Command } from '@ionic/cli-utils/lib/command';
import { fsReadFile, fsWriteFile } from '@ionic/cli-framework/utils/fs';

import * as klaw from 'klaw';

interface DeployManifestItem {
  file: string;
  size: number;
  hash: string;
}

export class DeployManifestCommand extends Command {
  buildDir: string = path.resolve(this.env.project.directory, 'www');

  async getMetadata(): Promise<CommandMetadata> {
    return {
      name: 'manifest',
      type: 'project',
      summary: 'Generates a manifest file for the deploy service from a built app directory',
      groups: [CommandGroup.Hidden], // TODO: make part of start?
    };
  }

  async run(): Promise<void> {
    const manifest = await this.getFilesAndSizesAndHashesForGlobPattern();
    await (manifest);
    await fsWriteFile(path.resolve(this.buildDir, 'pro-manifest.json'), JSON.stringify(manifest), { encoding: 'utf8' });
  }

  private async getFilesAndSizesAndHashesForGlobPattern(): Promise<DeployManifestItem[]> {
    const items: Promise<DeployManifestItem>[] = [];

    return new Promise<DeployManifestItem[]>((resolve, reject) => {
      klaw(this.buildDir)
        .on('data', item => {
          if (item.stats.isFile()) {
            items.push(this.getFileAndSizeAndHashForFile(item.path, item.stats));
          }
        })
        .on('error', err => reject(err))
        .on('end', async () => resolve(await Promise.all(items)));
    });
  }

  private async getFileAndSizeAndHashForFile(file: string, stat: fs.Stats): Promise<DeployManifestItem> {
    const buffer: any = await fsReadFile(file, {encoding: (null as any)});

    return {
      file: path.relative(this.buildDir, file),
      size: stat.size,
      hash: this.getHash(buffer)
    };
  }

  private getHash(data: Buffer) {
    var sha256 = crypto.createHash('sha256');
    sha256.update(data);

    return sha256.digest('base64');
  }
}
