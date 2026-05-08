import { Model, DataTypes } from "sequelize";
import { database } from "../Database.js";

export class Word extends Model {
    public id!: number;
    public text!: string;
}

Word.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    text: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    }
}, {
    sequelize: database,
    modelName: 'Word',
    tableName: 'words',
    timestamps: false
});