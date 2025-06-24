

export const addBlog = async(req,res)=> {
    try {
        const {title,subTitle,description,category,isPublished} = JSON.parse(req.body.blog); 
        const imageFile = req.file; 

        //Checking All fields 
        if(!title || !subTitle || !description || !category || !isPublished || !imageFile) return res.status(400).json({success:false,message:"All fields are required"}); 

        
    } catch (error) {
        
    }
} 