var models = require('../dist/server/models')

//WARNING: Do not run this script in live mode.
 models.sequelize.sync({
    force: true,
  }).then(() => {
    process.exit();
  });
