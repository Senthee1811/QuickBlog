import fs from 'fs';
import imagekit from '../configs/imageKit.js';
import Blog from '../models/Blog.js';
import Comment from '../models/Comment.js';

export const addBlog = async(req,res)=> {
    try {
        const {title,subTitle,description,category,isPublished} = JSON.parse(req.body.blog); 
        const imageFile = req.file; 

        //Checking All fields 
        if(!title || !subTitle || !description || !category || !isPublished || !imageFile) return res.status(400).json({success:false,message:"All fields are required"}); 

        const fileBuffer = fs.readFileSync(imageFile.path); 
        //Upload to imagekit
        const response = await imagekit.upload({
            file:fileBuffer,
            fileName:imageFile.originalname,
            folder:"/blogs"
        }); 
        //Optimization Image 
        const optimizedImageUrl =  imagekit.url({
            path: response.filePath,
            transformation:[
                {quality: 'auto'}, //Auto compression
                {format: 'webp'}, //Format convertion
                {width:'1280'} //Width resize
            ]
        }); 

        const image = optimizedImageUrl; 
        await Blog.create({title,subTitle,description,category,image,
            isPublished}); 
        res.json({success:true,message:"Blog added successfully"})


    } catch (error) {
        res.json({success:false,message:error.message});
        
    }
}  

export const getAllBlogs = async(req,res) => {
    try {
        const blogs = await Blog.find({isPublished:true}); 
        return res.json({success:true,blogs});
    } catch (error) {
        res.json({success:false,message:error.message});
        
    }
} 

export const getBlogById = async(req,res) => {
    try {
        const {blogId} = req.params; 
        const blog = await Blog.findById(blogId);
        if(!blog){
            return res.status(404).json({success:false,message:"Blog Not Found"})
        } 
        res.json({success:true,blog});
    } catch (error) { 
        res.json({message:error.message,success:false});
        
    }
} 

export const deleteBlog = async(req,res) => {
    try {
        const {id} = req.body; 
    await Blog.findByIdAndDelete(id); 

    //Delete All comments associated with the blog 
    await Comment.deleteMany({blog:id});
    res.json({success:true,message:"Blog deleted successfully"});
    } catch (error) { 
        res.json({message:error.message,success:false});
        
    }
} 

export const togglePublish = async(req,res) => {
    try {
        const {id} = req.body; 
        const blog = await Blog.findById(id); 
        blog.isPublished = !blog.isPublished; 
        await blog.save(); 
        res.json({success:true,message:"Blog published successfully"});
    } catch (error) { 
        res.json({message:error.message,succes:false});
        
    }
} 

export const addComment = async(req,res) => {
    try {
        const {blog,name,content} = req.body; 
        await Comment.create({blog,name,content,isApproved:false}); 
        res.json({success:true,message:"Comment added for review"});
    } catch (error) {
        res.json({success:false,message:error.message});
        
    }

} 

export const getBlogComments = async(req,res) => {
    try {
        const {blogId} = req.body; 
        const comments = await Comment.find({blog:blogId,isApproved:true}).sort({
            createdAt: -1
        }); 
        res.json({success:true,comments});
        
    } catch (error) {
        res.json({message:error.message,success:false});
        
    }
}