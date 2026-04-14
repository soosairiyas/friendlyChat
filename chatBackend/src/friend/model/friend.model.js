import { DataTypes } from "sequelize";
import { sequelize } from "../../config/db.js";

export const Friend = sequelize.define("Friends", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  friendId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});
