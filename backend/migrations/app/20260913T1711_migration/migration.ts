#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/28da62286f141967f282b1bdd49e9bbf9697abd0219c5a3a96d9086046dfae11/contract';
import endContract from '../../snapshots/28da62286f141967f282b1bdd49e9bbf9697abd0219c5a3a96d9086046dfae11/contract.json' with { type: 'json' };
import type { Contract as Start } from '../../snapshots/b2aa6300159b72dca651455608d19f6492838b875d815b58bb53a2d5ac4b7fed/contract';
import startContract from '../../snapshots/b2aa6300159b72dca651455608d19f6492838b875d815b58bb53a2d5ac4b7fed/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col, fn, primaryKey } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.createTable({
        schema: 'public',
        table: 'user',
        columns: [
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('email', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('passwordHash', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.addUnique({
        schema: 'public',
        table: 'user',
        constraint: 'user_email_key',
        columns: ['email'],
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
