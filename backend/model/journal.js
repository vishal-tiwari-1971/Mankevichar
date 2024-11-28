const mongoose =require('mongoose')

const journalSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  image: {type: String, required: false},
  visibility: { type: String, enum: ['private', 'public'], default: 'private' },
  userId: { type: mongoose.Schema.Types.ObjectId, ref:'User' },
  createdAt: { type: Date, default: Date.now },
  likeCount: { type: Number, default: 0 },
  likes: { type: [mongoose.Schema.Types.ObjectId], ref: 'User', default: [] },
});

const Journal = mongoose.model('Journal', journalSchema);

module.exports=Journal;