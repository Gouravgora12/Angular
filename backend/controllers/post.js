const Post = require('../model/post');
exports.createPost=(req, res, next) => {
    const url = req.protocol + "://" + req.get("host")
    const p = new Post({
      title: req.body.title,
      Content: req.body.Content,
      imagePath: url + "/images/" + req.file.filename,
      creator:req.userData.userId
    });
    //console.log(p);
    p.save().then((createdPost) => {
        res.status(200).json({
          post: {
            id: createdPost._id,
            imagePath: createdPost.imagePath
          }
        });
      })
      .catch((error) => {
        res.status(400).json({message:"Failed to create a Post"});
      })
  
  }

  exports.getAllPost= (req, res, next) => {
    const pageSize = +req.query.pageSize;
    const currentPage = +req.query.page;
    const postQuery = Post.find({});
    let fetchPosts;
    if (pageSize && currentPage) {
      postQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
    }
    postQuery.then((document) => {
      fetchPosts = document
      return Post.count()
    }).then(count => {
      res.status(200).json({
        message: "Posts fetched successfully",
        post: fetchPosts,
        maxPost: count
      })
    }).catch(error=>{
      res.status(500).json({message:"Post not Fetched"})
    })
  }

  exports.getSinglePost=(req, res, next) => {

    Post.findById(req.params.id).then((post) => {
        res.status(200).json(post);
      })
      .catch((error) => {
        res.status(400).json({message:"Post not Fetched"});
      })
  }

  exports.deleteAPost=(req, res, next) => {
    console.log(req.params.id);
    Post.deleteOne({
        _id: req.params.id,creator:req.userData.userId
      }).then((result) => {
        if(result.n>0){
          res.status(200).json("Post Deleted");
        }
        else
        {
          res.status(401).json({message:"Not Authorized to Delete"})
        }
        
      })
      .catch((error) => {
        res.status(400).json({message:"Post not deleted Succesfully"});
      })
  }

  exports.updateAPost=(req, res, next) => {
  //console.log("check",req.file,req.body.image)
  let imagePath=req.body.image;
    if (req.file) {  
      const url = req.protocol + "://" + req.get("host");
      imagePath = url + "/images/" + req.file.filename
  
    }
    const post = new Post({
      _id: req.body._id,
      title: req.body.title,
      Content: req.body.Content,
      imagePath: imagePath,
      creator:req.userData.userId
    });
    console.log("My post",post)
    Post.updateOne({
      _id: req.params.id,creator:req.userData.userId
    }, post).then(result => {
     if(result.n>0)
     { res.status(200).json({
        message: "Post Updated Successfully"
      });}
      else{
        res.status(401).json({message:"Post Update Failed"})
      }
    }).catch(error=>{
      res.status(500).json({message:"Could not  update post"})
    })
  }