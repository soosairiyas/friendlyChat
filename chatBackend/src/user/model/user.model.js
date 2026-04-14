import { DataTypes } from "sequelize";
import { sequelize } from "../../config/db.js";

export const User = sequelize.define("Users", {
  userName: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: {
        msg: "Email is Required",
      },
      isEmail: {
        msg: "Enter the Valid Gmail Address",
      },
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: "Password is Required",
      },
    },
  },
});
