const Project = require('../models/projectModel');

module.exports = {
    // Create
    async createProject(req, res) {
        try {
            const { project_name, project_description, project_image, project_date } = req.body;
            
            const newProject = new Project({
                project_name, project_description, 
                project_image, project_date
            });
            
            await newProject.save();

            return res.status(201).json({
                message: 'Project created successfully',
                project: newProject
            });
        } catch (error) {
            console.error('Error creating project:', error);
            return res.status(500).json({ error: 'Error creating project' });
        }
    }, 

    // Read
    async openProjects(req, res){
        try{
            const openProjects = await Project.find({ project_type: 'open' });
            return res.status(200).json({projects: openProjects, type: "open"});
        }
        catch(error){
            return res.status(403).json({error: 'Error with the projects page'});
        }
    },

    async closedProjects(req, res){
        try{
            const closedProjects = await Project.find({ project_type: 'closed' });
            return res.status(200).json({projects: closedProjects, type: "closed"});
        }
        catch(error){
            return res.status(403).json({error: 'Error with the projects page'});
        }
    }, 

    async getProject(req, res) {
        try{
            const { id } = req.params;
            const project = await Project.findOne({ _id: id});
            res.status(200).json({project: project});
        }
        catch(error){
            return res.status(400).json({error: 'Error has occurred when retrieving project'});
        }
    },

    // Update
    async updateProject(req, res) {
        try {
            const { id } = req.params;
            const { project_name, project_description, project_type, project_image, project_date } = req.body;
            const updatedProject = await Project.findByIdAndUpdate(
                id,
                { project_name, project_description, project_type, project_image, project_date },
                { new: true }
            );
            if (!updatedProject) {
                return res.status(404).json({ error: 'Project not found' });
            }
            return res.status(200).json({
                message: 'Project updated successfully',
                project: updatedProject
            });
        } catch (error) {
            console.error('Error updating project:', error);
            return res.status(500).json({ error: 'Error updating project' });
        }
    },

    //Delete
    async deleteProject(req, res) {
        try {
            const { id } = req.params;
            const deletedProject = await Project.findByIdAndDelete(id);
            if (!deletedProject) {
                return res.status(404).json({ error: 'Project not found' });
            }
            return res.status(200).json({ message: 'Project deleted successfully' });
        } catch (error) {
            console.error('Error deleting project:', error);
            return res.status(500).json({ error: 'Error deleting project' });
        }
    },

}