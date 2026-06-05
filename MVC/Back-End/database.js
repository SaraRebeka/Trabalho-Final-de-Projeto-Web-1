import { Pool } from "pg";

const URL = "postgresql://postgres:123456@localhost:5432/mvc_lojinha";

export const database = new Pool({
  connectionString: URL,
});
