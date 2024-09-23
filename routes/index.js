var express = require('express');
const passport = require('passport');
var router = express.Router();
const userModel = require('./users');
const postModel = require('./post');
const localStrategy = require('passport-local');
const upload = require('./multer');
passport.use(new localStrategy(userModel.authenticate()));

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/profile', isLoggedIn ,async function(req, res, next) {
  const user = await userModel.findOne({
    username : req.session.passport.user
  })
  .populate('posts');
  console.log(user);
  res.render('profile', {user});
});

router.get('/login',function(req, res, next) {
  res.render('login',{error : req.flash('error')});
});



router.post('/register',function(req,res){
  const { username, email, fullname } = req.body;
  const userData = new userModel({ username, email, fullname });

  userModel.register(userData, req.body.password)
  .then(function(){
    passport.authenticate('local')(req,res,function(){
      res.redirect('/profile')
    })
  })
});

router.get('/feed', isLoggedIn ,async function(req, res, next) {
  const user = await userModel.findOne({
    username: req.session.passport.user
  })
  .populate('posts');

  res.render('feed',{user});
});

router.post('/login',passport.authenticate("local",{
  successRedirect: '/profile',
  failureRedirect: '/login',
  failureFlash: true
}),function(req,res){})

router.post('/upload' ,isLoggedIn , upload.single('file') , async function(req,res,next){
  if(!req.file){
    return res.status(404).send('No Files Were Uploaded.');
  }
  const user = await userModel.findOne({username: req.session.passport.user});
  
  const post = await postModel.create({
    image: req.file.filename,
    imageText: req.body.filecaption,
    userid: user._id
  });
  user.posts.push(post._id);
  await user.save();
  res.redirect('/profile');
});

router.post('/fileupload',isLoggedIn,upload.single('dp'),async function(req,res,next){
  if(!req.file){
    return res.status(404).send('No Files Were Uploaded.');
  }

  const user = await userModel.findOne({ username: req.session.passport.user});

  user.dp = req.file.filename;
  await user.save();
  res.redirect('profile');
})

router.get('/edit', isLoggedIn ,async function(req,res){
  const user = await userModel.findOne({ username: req.session.passport.user});

  res.render('edit',{user});
})

router.get('/add', isLoggedIn ,async function(req,res){
  const user = await userModel.findOne({ username: req.session.passport.user});

  res.render('add',{user});
})


router.get('/logout',function(req,res){
    req.logout(function(err) {
      if (err) { return next(err); }
      res.redirect('/');
    });
})



function isLoggedIn(req,res,next){
  if(req.isAuthenticated()) return next();
  res.redirect('/');
}

module.exports = router;
