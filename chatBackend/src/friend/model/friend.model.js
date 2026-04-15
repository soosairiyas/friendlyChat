import { DataTypes } from "sequelize";
import { sequelize } from "../../config/db.js";

export const Friend = sequelize.define("Friends", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  requestId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  state: {
    type: DataTypes.STRING,
    defaultValue: "active",
  },
});
