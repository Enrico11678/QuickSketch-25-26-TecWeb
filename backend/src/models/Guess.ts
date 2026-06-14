import { Model, DataTypes } from 'sequelize'
import { database } from '../Database.js'

export class Guess extends Model {
    public id!: number;
    public attemptText!: string;
    public isCorrect!: boolean;
    public userId!: number; 
    public sketchId!: number;   
}

Guess.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    attemptText: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'attempt_text'
    },
    isCorrect: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        field: 'is_correct'
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'user_id'
    },
    sketchId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'sketch_id'
    }
}, {
    sequelize: database,
    modelName: 'Guess',
    tableName: 'guesses',
    timestamps: true    // Utile per sapere quando è stato fatto il tentativo
});