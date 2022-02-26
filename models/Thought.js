const { Schema, model } = require('mongoose');
const Reaction = require('./Reaction.js')
const thoughtSchema = new Schema(
    {
        thoughtText: {
            type: String,
            required: true,
            max_length: 280, 
        },
        creatdAt: {
            type: Date,
            default: Date.now,
            get: (timestamp) => formatter(timestamp),
        },
        username: {
            type: Schema.Types.ObjectId, ref: 'User',
            required: true
        },
        reactions: [Reaction]
    },
{
  toJSON: {
    getters: true,
  },
  id: false,
});

thoughtSchema.virtual('reactionCount').get(function () {
return this.reactions?.length;
});

const Thoughts = model('Thoughts', thoughtSchema);

module.exports = Thoughts;