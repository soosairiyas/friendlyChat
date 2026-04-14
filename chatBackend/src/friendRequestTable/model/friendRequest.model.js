import { DataTypes } from "sequelize";
import { sequelize } from "../../config/db.js";

export const friendRequest = sequelize.define("friendRequests", {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
  },
  senderId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  receiverId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM("pending", "Accepted", "Rejected"),
    defaultValue: "pending",
  },
});
