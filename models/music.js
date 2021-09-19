const mongoose = require("mongoose");

const MusicSchema =  mongoose.Schema({
   name: {
       type: String,
       required: true
   },
   author:{
       type: String,
       required: true
   },
   musicUrl:{
       type: String,
       required: true
   }
});

const musicModel = mongoose.model('Musics', MusicSchema);

module.exports = musicModel