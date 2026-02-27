import { Request, Response } from "express";
import mongoose from 'mongoose';
import Project from "../models/Project";

interface UpdatedObject {
    name?: string,
    description?: string
}

export const createProject = async (req: Request, res: Response) => {
    try {
        const { name, description } = req.body;
        const logged_in_user = req.user!;
        const project = await Project.create({
            name,
            description,
            owner: logged_in_user._id
        });
        res.status(201).json({
            _id: project._id,
            name: project.name,
            description: project.description,
            owner: logged_in_user
        });
    }
    catch (error: any) {
        if (error.name === 'ValidationError') {
            res.status(400).json({ message: error.message });
            return;
        }
        res.status(500).json({ message: 'Server error' });
    }

}

export const getAllUserProjects = async (req: Request, res: Response) => {
    try {
        const logged_in_user = req.user!;
        const user_id = logged_in_user._id;
        const projects = await Project.find({ owner: user_id });
        res.status(200).json({
            'projects': projects
        }
        );
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
}

export const getProject = async (req: Request, res: Response) => {
    try {
        const project_id = req.params.project_id;
        if (!mongoose.Types.ObjectId.isValid(project_id as string)) {
            res.status(404).json({ "message": "Project not found" });
            return;
        }
        const project = await Project.findById(project_id);
        if (project) {
            if (project.owner.equals(req.user!._id)) {
                res.status(200).json(project);
                return;
            }
            else {
                res.status(403).json({
                    "message": "You don't have access to this project, wrong owner"
                });
                return;
            }
        }
        else {
            res.status(404).json({
                "message": "Project not found"
            });
        }
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
}

export const deleteProject = async (req: Request, res: Response) => {
    try {
        const project_id = req.params.project_id;
        if (!mongoose.Types.ObjectId.isValid(project_id as string)) {
            res.status(404).json({ "message": "Project not found" });
            return;
        }
        const project = await Project.findById(project_id);
        if (project) {
            if (project.owner.equals(req.user!._id)) {
                await Project.deleteOne({ _id: project_id });
                res.status(200).json({
                    "message": "Project deleted successfully"
                });
                return;
            }
            else {
                res.status(403).json({
                    "message": "You don't have access to this project, wrong owner"
                });
                return;
            }
        }
        else {
            res.status(404).json({
                "message": "Project not found"
            });
        }
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
}

export const updateProject = async (req: Request, res: Response) => {
    try {
        const { name, description } = req.body;
        let properties_to_update: UpdatedObject = {}
        if (name) {
            properties_to_update.name = name;
        }
        if (description) {
            properties_to_update.description = description;
        }
        const project_id = req.params.project_id;
        if (!mongoose.Types.ObjectId.isValid(project_id as string)) {
            res.status(404).json({ "message": "Project not found" });
            return;
        }
        const project = await Project.findById(project_id);
        if (project) {
            if (project.owner.equals(req.user!._id)) {
                const updated_project = await Project.findByIdAndUpdate(project_id, properties_to_update, { new: true });
                res.status(200).json({
                    "message": "Project updated successfully",
                    "project": updated_project
                });
                return;
            }
            else {
                res.status(403).json({
                    "message": "You don't have access to this project, wrong owner"
                });
                return;
            }
        }
        else {
            res.status(404).json({
                "message": "Project not found"
            });
        }
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
}