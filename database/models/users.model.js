module.exports = (sequelize, Sequelize) => {
    const stats = sequelize.define("users", {

        mail: {
            type: Sequelize.STRING(),
            allowNull: false,
        },

        password: {
            type: Sequelize.TEXT(),
            allowNull: true,
        },


    }, {
        charset: 'utf8mb4',
        collate: 'utf8mb4_bin'
    });

    return stats;
};