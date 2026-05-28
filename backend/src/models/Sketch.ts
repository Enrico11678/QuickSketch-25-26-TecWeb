import { Model, DataTypes } from 'sequelize'
import { database } from '../Database.js'

export class Sketch extends Model {
    public id!: number;
    public content!: string;
    public authorId!: number;
    public wordId!: number;
}

Sketch.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    content: {
        type: DataTypes.TEXT, // Uso TEXT per i dati pesanti della canvas
        allowNull: false,
    },
    authorId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: 'author_id',
    },
    wordId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'word_id'
    }
}, {
    sequelize: database,
    modelName: 'Sketch',
    tableName: 'sketches',
    timestamps: true // fondamentale per la data di creazione
});