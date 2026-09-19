#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/8feb48f293452b228b3aa467a4fe631b81b168c746a38c8d57d5903a2772c977/contract';
import endContract from '../../snapshots/8feb48f293452b228b3aa467a4fe631b81b168c746a38c8d57d5903a2772c977/contract.json' with { type: 'json' };
import type { Contract as Start } from '../../snapshots/b2aa6300159b72dca651455608d19f6492838b875d815b58bb53a2d5ac4b7fed/contract';
import startContract from '../../snapshots/b2aa6300159b72dca651455608d19f6492838b875d815b58bb53a2d5ac4b7fed/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col, fn, lit, primaryKey } from '@prisma/orm-postgres/migration';

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
      this.createTable({
        schema: 'public',
        table: 'userBook',
        columns: [
          col('bookId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('isFavorite', 'bool', {
            notNull: true,
            default: lit(false),
            codecRef: { codecId: 'pg/bool@1' },
          }),
          col('status', 'text', {
            notNull: true,
            default: lit('WANT_TO_READ'),
            codecRef: { codecId: 'pg/text@1' },
          }),
          col('userId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.addUnique({
        schema: 'public',
        table: 'user',
        constraint: 'user_email_key',
        columns: ['email'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'userBook',
        constraint: 'userBook_userId_bookId_key',
        columns: ['userId', 'bookId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'userBook',
        index: 'userBook_bookId_idx_3eec38a3',
        columns: ['bookId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'userBook',
        index: 'userBook_userId_idx_a489d58a',
        columns: ['userId'],
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'userBook',
        foreignKey: {
          name: 'userBook_userId_fkey',
          columns: ['userId'],
          references: { schema: 'public', table: 'user', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'userBook',
        foreignKey: {
          name: 'userBook_bookId_fkey',
          columns: ['bookId'],
          references: { schema: 'public', table: 'book', columns: ['id'] },
        },
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
