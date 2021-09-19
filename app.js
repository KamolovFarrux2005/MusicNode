const express = require('express');
const app = express();
const mongoose = require('mongoose');
const fileUpload  = require('express-fileupload');
const music = require('./models/music');
const cloudinary = require('cloudinary');

mongoose.connect('mongodb+srv://MusicFarrux:Kamalovfarrux1@music.8vqvy.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: true
}).then(()=> console.log('work mongodb'))
.catch((err)=>{console.log('err: ', err)})

const port = process.env.PORT || 5000;

app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.set('views', 'views');
app.set('view engine', 'ejs');

app.use(express.static('./public'));
app.use(fileUpload({useTempFiles: true}));

cloudinary.config({
    cloud_name :'file-upload',
    api_key:'731456294949825',
    api_secret:'FBVBUiPRE6xJmS_pEWWxjIhYMWU'
})

app.use('/', require('./routes/music'));

app.get('/music/admin/dashboard/', async(req,res)=>{
   await music.find().then((result)=>{
        res.render('admin', {music:result});
    })
});




app.post('/music/admin/dashboard/add', (req , res)=>{
    const {name, author} = req.body;
    const tempFilePath = req.files.file.tempFilePath;
    cloudinary.uploader.upload(tempFilePath,((error, result) =>{
        if(result){
            console.log(result.url)
           }else{
            console.log(error)
        }
    }), {resource_type:"video"}).then(async(result)=>{
        const musicsave = new music({name: name, author: author, musicUrl: result.url})
        await musicsave.save()
        .then(()=>{
            res.redirect('/')    
        }).catch((err)=>{console.log(err)})
    
    }).catch((err)=>{console.log(err)});
});

app.post('/music/admin/dashboard/delete', async(req, res)=>{
  await music.findOneAndDelete({_id: req.body.id}).then(()=>{
         res.redirect('/');
    }).catch((err)=>{console.log(err)})
})


app.listen(port , ()=> console.log('> Server is up and running on port : ' + port))