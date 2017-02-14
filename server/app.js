/**
 * Created by eugenia on 14.02.17.
 */
'use strict';

const app = require('./app');

const PORT = process.env.PORT || 9000;

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}!`);
});