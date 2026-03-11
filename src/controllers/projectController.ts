import { NextFunction, Request, Response } from "express";
import mongoose from 'mongoose';
import Project from "../models/Project";

interface UpdatedObject {
    name?: string,
    description?: string
}

export const createProject = async (req: Request, res: Response, next: NextFunction) => {
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
        next(error);
    }

}

export const getAllUserProjects = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const query_params = req.query;
        const page = parseInt(query_params.page as string);
        const pageNumber = page && page >=1 ? page : 1;
        const limit = parseInt(query_params.limit as string);
        const limitNumber = limit && limit >=1 ? limit : 10;
        const logged_in_user = req.user!;
        const user_id = logged_in_user._id;
        const projects = await Project.find({ owner: user_id }).limit(limitNumber).skip((pageNumber-1)*limitNumber);
        const totalRecords = await Project.countDocuments( {owner: user_id });
        res.status(200).json({
            'data': projects,
            'pagination': {
                'total': totalRecords,
                'page': pageNumber,
                'limit': limitNumber,
                'totalPages': Math.ceil(totalRecords/limitNumber)
            }
        }
        );
    }
    catch (error) {
        next(error);
    }
}

export const getProject = async (req: Request, res: Response, next: NextFunction) => {
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
        next(error);
    }
}

export const deleteProject = async (req: Request, res: Response, next: NextFunction) => {
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
        next(error);
    }
}

export const updateProject = async (req: Request, res: Response, next: NextFunction) => {
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
        next(error);
    }
}