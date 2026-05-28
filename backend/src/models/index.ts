import { User } from "./User.js";
import { Sketch } from "./Sketch.js";
import { Word } from "./Word.js";
import { Guess } from "./Guess.js"

// Relazione User -> Sketch (1 a Molti)
User.hasMany(Sketch, { foreignKey: 'authorId', as: 'sketches', onDelete: 'SET NULL' });
Sketch.belongsTo(User, { foreignKey: 'authorId', as: 'author'});

// Relazione Word -> Sketch (1 a Molti)
Word.hasMany(Sketch, { foreignKey: 'wordId', as: 'sketches'});
Sketch.belongsTo(Word, { foreignKey: 'wordId', as: 'word'});

// Relazione User -> Guess (1 a Molti)
User.hasMany(Guess, { foreignKey: 'userId', as: 'guesses'});
Guess.belongsTo(User, { foreignKey: 'userId', as: 'user'});

// Relazione Sketch -> Guess (1 a Molti)
Sketch.hasMany(Guess, { foreignKey: 'sketchId', as: 'guesses'});
Guess.belongsTo(Sketch, { foreignKey: 'sketchId', as: 'sketch'});

export { User, Sketch, Word, Guess };