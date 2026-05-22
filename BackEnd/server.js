const app = require("./app");
const sequelize = require("./config/database");

const PORT = process.env.PORT || 3000;

sequelize.authenticate()
  .then(() => {
    console.log("MySQL conectado");
    return sequelize.sync();
  })
  .then(() => {
    console.log("Tablas sincronizadas");

    app.listen(PORT, () => {
      console.log(`Servidor corriendo en puerto ${PORT}`);
    });
  })
  .catch((error) => {
    console.log("Error de conexion:");
    console.log(error);
  });
