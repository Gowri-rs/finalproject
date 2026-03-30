/**
 * Run ONCE to create the admin account:
 *   node createAdmin.js
 *
 * Make sure your .env is filled in first.
 */
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt   = require('bcrypt');
const User     = require('./models/user');

const EMAIL    = 'admin@mindbloom.com';
const PASSWORD = 'Admin@123';

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅  Connected to MongoDB');

    const exists = await User.findOne({ email: EMAIL });
    if (exists) { console.log('⚠️   Admin already exists:', EMAIL); process.exit(0); }

    await User.create({
      name: 'Admin', email: EMAIL,
      password: await bcrypt.hash(PASSWORD, 10),
      role: 'admin', status: 'approved',
    });
    console.log('✅  Admin created!');
    console.log('   Email:   ', EMAIL);
    console.log('   Password:', PASSWORD);
  } catch (err) {
    console.error('❌  Error:', err.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
})();
