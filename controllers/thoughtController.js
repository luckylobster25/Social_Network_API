const { User, Thought } = require('../models');

module.exports ={
    getThought(req, res) {
        Thought.find()
          .populate({ path: 'reactions', select: '-__v' })
          .then((thought) => res.json(thought))
          .catch((err) => res.status(500).json(err));
      },
       getSingleThought(req, res) {
        Thought.findOne({ _id: req.params.thoughtId })
          .populate({ path: 'reactions', select: '-__v' })
          .select('-__v')
          .then((thought) =>
            !thought
              ? res.status(404).json({ message: 'No thought with that ID' })
              : res.json(thought)
          )
          .catch((err) => res.status(500).json(err));
      },
      createThought(req, res) {
        Thought.create(req.body)
        .then(thought => {
            User.findOneAndUpdate(
                { _id: req.body.userId },
                { $push: { thought: thought._id } },
                { new: true }
            )
            .then(user => {
                if (!user) {
                    res.status(404).json({ message: 'No user found with this id' });
                    return;
                }
                res.json(user);
            })
            .catch(err => res.json(err));
        })
        .catch(err => res.status(400).json(err));
    },
         
      deleteThought(req, res) {
        Thought.findOneAndDelete({ _id: req.params.thoughtId })
          .then((thought) =>
            !thought
              ? res.status(404).json({ message: 'No thought with that ID' })
              : User.findOneAndUpdate({ _id: thought.userId },
                {$pull: {thought: req.params.id}})
          )
          .then(() => res.json({ message: 'Deleted Thought succesfully!' }))
          .catch((err) => res.status(500).json(err));
      },
      updateThought(req, res) {
        Thought.findOneAndUpdate(
          { _id: req.params.thoughtId },
          { $set: req.body },
          { runValidators: true, new: true }
        )
          .then((thought) =>
            !thought
              ? res.status(404).json({ message: 'No thought with this id!' })
              : res.json(thought)
          )
          .catch((err) => {
            console.log(err);
            res.status(500).json(err);
          });
      },
      addReaction(req, res) {
        Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $addToSet: { reactions: req.body } },
            { new: true, runValidators: true }
        )
        .then(thought => {
            if (!thought) {
                res.status(404).json({ message: 'No thought found with this id' });
                return;
            }
            res.json(thought);
        })
        .catch(err => res.status(500).json(err));
    },
    deleteReaction(req, res) {
        Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $pull: { reaction: { reactionId: req.params.reactionId } } },
            { new: true, runValidators: true }
        )
        .then(thought => {
            if (!thought) {
                res.status(404).json({ message: 'No thought found with this id' });
                return;
            }
            res.json(thought);
        })
        .catch(err => res.status(500).json(err));
    },
}