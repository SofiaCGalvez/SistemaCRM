require("dotenv").config();
const bcrypt = require("bcryptjs");
const sequelize = require("../config/database");
const User = require("../models/User");

const createUsers = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();

    const users = [
      {
        name: "Sofia Admin",
        email: "admin@test.com",
        password: "123456",
        role: "admin"
      },
      {
        name: "Usuario Staff",
        email: "staff@test.com",
        password: "123456",
        role: "staff"
      }
    ];

    for (const user of users) {
      const hashedPassword = await bcrypt.hash(user.password, 10);

      await User.findOrCreate({
        where: { email: user.email },
        defaults: {
          name: user.name,
          email: user.email,
          password: hashedPassword,
          role: user.role
        }
      });
    }

    console.log("✅ Usuarios creados correctamente");
    process.exit();
  } catch (error) {
    console.log("❌ Error al crear usuarios:", error);
    process.exit(1);
  }
};

createUsers();