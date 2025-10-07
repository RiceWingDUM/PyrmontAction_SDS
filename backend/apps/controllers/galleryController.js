const Gallery = require('../models/galleryModel')
module.exports = {
    // Create
    async uploadGalleryImage(req, res){
        try { 
            const { image_file_name, caption,  } = req.body;
        }


   

    // Read

    async getAllGalleryImage(req, res){
        try{
            const images = await Gallery.find().sort({createdAt: -1});
            res.status(200).json({message: 'Successful images', images: images})
        }
        catch(error){
            return res.status(400).json({error: 'Error with the Image page'});
        }

    }     

    // Update
    router.put('/:id',
        jwtAuth.verifyToken,
        jwtAuth.verifyRole(['admin', 'editor']),
        controller.updateGalleryImage
    );

    // Delete
    router.delete('/:id',
        jwtAuth.verifyToken,
        jwtAuth.verifyRole(['admin', 'editor']),
        controller.deleteGalleryImage
    );

}