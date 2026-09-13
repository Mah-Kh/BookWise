#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/b2aa6300159b72dca651455608d19f6492838b875d815b58bb53a2d5ac4b7fed/contract';
import endContract from '../../snapshots/b2aa6300159b72dca651455608d19f6492838b875d815b58bb53a2d5ac4b7fed/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col, primaryKey } from '@prisma/orm-postgres/migration';

export default class M extends Migration<never, End> {
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.createSchema({ schema: 'public' }),
      this.createTable({
        schema: 'public',
        table: 'book',
        columns: [
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('title', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
