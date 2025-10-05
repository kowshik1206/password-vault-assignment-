import mongoose from 'mongoose';

const VaultEntrySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: [true, 'Please provide a title.'],
  },
  username: {
    type: String,
    required: [true, 'Please provide a username.'],
  },
  password: {
    type: String,
    required: [true, 'Please provide a password.'],
  },
  url: {
    type: String,
  },
  notes: {
    type: String,
  },
});

export default mongoose.models.VaultEntry || mongoose.model('VaultEntry', VaultEntrySchema);
