const mongoose = require('mongoose')

const NotificationSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    message: { type: String, required: true }, // E.g., "Your donation was released"
    type: { 
      type: String, 
      enum: ['donation', 'milestone', 'aid_request', 'alert'] 
    },
    read: { type: Boolean, default: false },
    link: { type: String }, // E.g., "/donation/123"
    createdAt: { type: Date, default: Date.now }
  });

module.exports = mongoose.model('Notifications', NotificationSchema)