import fs from 'fs';
import imagekit from '../configs/imageKit.js';
import Blog from '../models/Blog.js';

export const addBlog = async(req,res)=> {
    try {
        const {title,subTitle,description,category,isPublished} = JSON.parse(req.body.blog); 
        const imageFile = req.file; 

        //Checking All fields 
        if(!title || !subTitle || !description || !category || !isPublished || !imageFile) return res.status(400).json({success:false,message:"All fields are required"}); 

        const fileBuffer = fs.readFileSync(imageFile.path); 
        //Upload to imagekit
        const response = await imagekit({
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