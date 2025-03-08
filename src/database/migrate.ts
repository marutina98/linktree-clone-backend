import IPool from '../interfaces/pool.interfaces';

const UserMigration = require('./../migrations/users.migration');
const ProfilesMigration = require('./../migrations/profiles.migration');
const LinksMigration = require('./../migrations/links.migration');

const migrate = async (pool: IPool) => {

  const userMigration = new UserMigration(pool);
  const profilesMigration = new ProfilesMigration(pool);
  const linksMigration = new LinksMigration(pool);

  const migrations = [userMigration, profilesMigration, linksMigration];

  for (let migration of migrations) {
    await migration.createTable();
  }

}

module.exports = migrate;