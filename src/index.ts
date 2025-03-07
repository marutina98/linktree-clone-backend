
// export {} fixes redeclaration error
// in a file without exports.

export {}

const pool = require('./database/connection');

const migrate = require('./database/migrate');

const User = require('./models/user.model');
const user = new User(pool);

const Profile = require('./models/profile.model');
const profile = new Profile(pool);

(async () => {

  // Migrate Database

  // @todo: migrate database only when needed
  // maybe a if ?

  // await migrate(pool);

})();