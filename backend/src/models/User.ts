import { Model, DataTypes } from 'sequelize'
import { database } from '../Database.js'   // import da Database.js perchè il file Database.ts viene transpilato in JavaScript

export class User extends Model {   // con export sequelize sa che User è un modello del db e ha tutte le capacità previste da sequelize
    public id!: number;
    public username!: string;
    public email!: string;
    public password!: string;

    // Statistiche
    public drawingsCount!: number;
    public drawingsGuessedCount!: number;   // Quanti dei suoi disegni sono stati indovinati
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
            isEmail: true // Validazione integrata per fare in modo che sia un formato email valido
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    /* Mapping esplicito: camelCase nel codice, snake_case nel DB PostgreSQL.
       In questo modo seguo le convenzioni SQL standard e rendo leggibile il codice TypeScript.
    */
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
    tableName: 'users', // Nome tabella esplicito e al plurale seguendo le convenzioni SQL
    timestamps: true    // Gestisce automaticamente createdAt e updatedAt
});