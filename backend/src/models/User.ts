import { Model, DataTypes } from 'sequelize'
import { database } from '../Database.js'   

export class User extends Model {   
    public id!: number;
    public username!: string;
    public email!: string;
    public password!: string;

    // Statistiche
    public drawingsCount!: number;
    public drawingsGuessedCount!: number;   
    public guessedCount!: number;
    public failedCount!: number;
    public totalAttemptsUsed!: number;
}

User.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true 
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
   drawingsCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    field: 'drawings_count'
   },
   drawingsGuessedCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    field: 'drawings_guessed_count'
   },
   guessedCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    field: 'guessed_count'
   },
   failedCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    field: 'failed_count'
   },
   totalAttemptsUsed: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    field: 'total_attempts_used'
   },
}, {
    sequelize: database,
    modelName: 'User',
    tableName: 'users', 
    timestamps: true    
});