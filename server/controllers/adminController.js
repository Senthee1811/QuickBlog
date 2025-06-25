import jwt from "jsonwebtoken"; 
import Blog from "../models/Blog.js";
export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("🔐 Incoming email:", email);
    console.log("🔐 Incoming password:", password);
    console.log("🔐 ENV email:", process.env.ADMIN_EMAIL);
    console.log("🔐 ENV password:", process.env.ADMIN_PASSWORD);

    console.log("✅ email match:", email === process.env.ADMIN_EMAIL);
    console.log("✅ password match:", password === process.env.ADMIN_PASSWORD);

    if (
      email !== process.env.ADMIN_EMAIL ||
      password !== process.env.ADMIN_PASSWORD
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    }

    const token = jwt.sign({ email }, process.env.JWT_SECRET);
    return res.json({ success: true, token });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
}; 

export const getAllBlogsAdmin = async(req,res) => {
  try {
    const blogs = await Blog.find({}).sort({createdAt:-1});
    res.json({success:true,blogs}); 

  } catch (error) {
    res.json({message:error.message,success:false});
  }
}

export const getAllComments = async(req,res) => {
  try { 
    const comments = await Comment.find({}).populate('blog').sort({createdAt:-1}); 
    res.json({success:true,comments});
    
  } catch (error) {
    res.json({success:false,message:error.message});
    
  }
} 

export const getDashbaord = async(req,res) => {
  try {
    const recentBlogs = await Blog.find({}).sort({createdAt: -1}).limit(5); 
    const blogs = await Blog.countDocuments(); 
    const comment = await Comment.countDocuments(); 
    const drafts = await Blog.countDocuments({isPublished:false}); 

    const dashboardData = {
      blogs,
      comment,
      drafts,
      recentBlogs
    } 
    res.json({success:true,dashboardData});
  } catch (error) {
    res.json({success:false,message:error.message});
    
  }
} 

export const deleteComentById = async(req,res) => {
  try {
    const {id} = req.body; 
    await Comment.findByIdAndDelete(id); 
    res.json({message:"Comment deleted successfully",success:true})
    
  } catch (error) {
    res.json({success:false,message:error.message});
    
  }
} 

export const approveByCommentById = async(req,res) => {
  const {id} = req.body; 
  await Comment.findByIdAndUpdate(id,{isApproved:true}); 
  res.json({success:true,message:"Comment approved successfully"});
  try {
    
  } catch (error) {
    res.json({success:false,message:error.message});
    
  }
}