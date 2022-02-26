const { User, Thoughts } = require('../models');

module.exports ={
    getThoughts(req, res) {
        Thoughts.find()
          .populate({ path: 'reactions', select: '-__v' })
          .then((thoughts) => res.json(thoughts))
          .catch((err) => res.status(500).json(err));
      },
       getSingleThought(req, res) {
        Thoughts.findOne({ _id: req.params.thoughtsId })
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
        Thoughts.create(req.body)
        .then(thoughts => {
            User.findOneAndUpdate(
                { _id: req.body.userId },
                { $push: { thoughts: thoughts._id } },
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
        Thoughts.findOneAndDelete({ _id: req.params.thoughtsId })
          .then((thoughts) =>
            !thoughts
              ? res.status(404).json({ message: 'No thought with that ID' })
              : User.findOneAndUpdate({ _id: thoughts.userId },
                {$pull: {thoughts: req.params.id}})
          )
          .then(() => res.json({ message: 'Deleted Thought succesfully!' }))
          .catch((err) => res.status(500).json(err));
      },
      updateThought(req, res) {
        Thoughts.findOneAndUpdate(
          { _id: req.params.thoughtsId },
          { $set: req.body },
          { runValidators: true, new: true }
        )
          .then((thoughts) =>
            !thoughts
              ? res.status(404).json({ message: 'No thought with this id!' })
              : res.json(thoughts)
          )
          .catch((err) => {
            console.log(err);
            res.status(500).json(err);
          });
      },
      addReaction(req, res) {
        Thoughts.findOneAndUpdate(
            { _id: req.params.thoughtsId },
            { $addToSet: { reactions: req.body } },
            { new: true, runValidators: true }
        )
        .then(thoughts => {
            if (!thoughts) {
                res.status(404).json({ message: 'No thought found with this id' });
                return;
            }
            res.json(thoughts);
        })
        .catch(err => res.status(500).json(err));
    },
    deleteReaction(req, res) {
        Thoughts.findOneAndUpdate(
            { _id: req.params.thoughtsId },
            { $pull: { reactions: { reactionId: req.params.reactionId } } },
            { new: true, runValidators: true }
        )
        .then(thoughts => {
            if (!thoughts) {
                res.status(404).json({ message: 'No thought found with this id' });
                return;
            }
            res.json(thoughts);
        })
        .catch(err => res.status(500).json(err));
    },
}