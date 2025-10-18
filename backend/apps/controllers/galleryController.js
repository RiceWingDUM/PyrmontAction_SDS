const Gallery = require('../models/galleryModel');

module.exports = {
    // Upload single gallery image
    async uploadGalleryImage(req, res) {
        try {
            const { caption, alt } = req.body;
            
            if (!req.file) {
                return res.status(400).json({ error: 'No image uploaded' });
            }

            // Create gallery image record
            const galleryImage = new Gallery({
                image_file_name: req.file.filename,
                image_type: 'uploaded',
                caption: caption || '',
                alt: alt || req.file.originalname
            });

            await galleryImage.save();

            res.status(201).json({
                message: 'Image uploaded successfully',
                image: galleryImage
            });
        } catch (error) {
            console.error('Error uploading gallery image:', error);
            return res.status(400).json({ error: 'Error uploading image' });
        }
    },

    // Read

    async getAllGalleryImage(req, res){
        try{
            const images = await Gallery.find().sort({createdAt: -1});
            res.status(200).json(images);
        }
        catch(error){
            return res.status(400).json({error: 'Error with the Image page'});
        }

    },     

    // Update    
    async updateGalleryImage(req, res){
        try {
            const updatedImage = await Gallery.findByIdAndUpdate(req.params.id, req.body, { new: true });
            if (!updatedImage) return res.status(404).json({ error: 'Image not found' });
            res.status(200).json(updatedImage);
        } catch (error) {
            return res.status(400).json({ error: 'Error updating image' });
        }
    },


    // Delete
    async deleteGalleryImage(req, res){
        try {
            const deletedImage = await Gallery.findByIdAndDelete(req.params.id);
            if (!deletedImage) return res.status(404).json({ error: 'Image not found' });
            res.status(200).json({ message: 'Image deleted successfully' });
        } catch (error) {
            return res.status(400).json({ error: 'Error deleting image' });
        }
    },
}