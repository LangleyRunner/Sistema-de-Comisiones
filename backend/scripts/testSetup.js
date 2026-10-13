import 'dotenv/config';
process.env.DATABASE_FILE = ":memory:";
delete process.env.TURSO_DATABASE_URL;
delete process.env.TURSO_AUTH_TOKEN;
