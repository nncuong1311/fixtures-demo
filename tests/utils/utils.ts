import * as Team from './team';
import * as Tournament from './tournament';
import * as Match from './match';
import { truncateDb as truncateDatabase } from '../../src/utils/db';

export { Team, Tournament, Match };

export async function truncateDb(): Promise<void> {
    await truncateDatabase();
}
