const router = require('express').Router();
const {
    getThought,
    getSingleThought,
    createThought,
    updateThought,
    deleteThought,
    addReaction,
    deleteReaction,
} = require('../../controllers/thoughtController');

router
.route('/')
.get(getThought)
.post(createThought);

router
.route('/:thoughtsId')
.get(getSingleThought)
.put(updateThought)
.delete(deleteThought);

router
.route('/:thoughtsId/reactions')
.post(addReaction);

router
.route('/:thoughtsId/reactions/:reactionId')
.delete(deleteReaction);

module.exports = router;