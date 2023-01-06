import { sequelize } from "../models";

export async function truncateDb(): Promise<void> {
    await truncateTable('matches');
    await truncateTable('teams');
    await truncateTable('tournaments');
}

async function truncateTable(table: string): Promise<void> {
    await sequelize.query(`DELETE FROM ${table};`)
    await sequelize.query(`ALTER TABLE ${table} AUTO_INCREMENT = 1;`);
}