module.exports = (sequelize, Sequelize) => {
  const bornes = sequelize.define(
    "bornes",
    {
      lora_ID: {
        type: Sequelize.STRING(),
        allowNull: false,
      },
      nickname: {
        type: Sequelize.STRING(),
        allowNull: false,
      },
    },
    {
      charset: "utf8mb4",
      collate: "utf8mb4_bin",
    }
  );

  return bornes;
};
