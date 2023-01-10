import mongoose from 'mongoose';

const queueSchema = new mongoose.Schema({
    position: {type: Number},
    date: {type: String},
    storeCode: {type: String}
});

const Queue = mongoose.model('queue', queueSchema)

export default Queue;
