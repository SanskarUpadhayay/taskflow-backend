import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import Task from '../models/Task';
import Project from '../models/Project';

interface UpdatedObject {
    title?: string,
    description?: string,
    status?: string
}

export const createTask = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const logged_in_user = req.user!;
        const project_id = req.params.project_id;
        if(!mongoose.Types.ObjectId.isValid(project_id as string)){
            res.status(404).json({ "message": "Project not found" });
            return;
        }
        const project = await Project.findById(project_id);
        if(!project){
            res.status(404).json({
                "message": "Project not found"
            });
            return;
        }
        if(project.owner.equals(logged_in_user._id)){
            const { title, description,status } = req.body;
            const task = await Task.create({
                title,
                description,
                status,
                project: project_id
            });
            res.status(201).json({
                _id: task._id,
                title: task.title,
                description: task.description,
                project: project
            });
    
        }
        else{
            res.status(403).json({
                "message": "Wrong owner"
            });
            return;
        }
    }
    catch (error: any){
        next(error);
    }
}

export const getAllTasksForProject = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const queryParamters = req.query;
        const status = queryParamters.status as string;
        const sort = queryParamters.sort as string;
        const page = parseInt(queryParamters.page as string);
        const pageNumber = page && page >=1 ? page : 1;
        const limit = parseInt(queryParamters.limit as string);
        const limitNumber = limit && limit >=1 ? limit : 10;
        const acceptable_status = ['todo','in-progress','done']; 
        let status_flag = false;
        if(status){
            if(acceptable_status.includes(status)){
                status_flag = true;
            }
            else{
                //Throw validation error
                const err = new Error('status must be todo,in-progress, or done');
                err.name = 'ValidationError';
                throw err;
            }
        }
        const sort_order = sort === 'asc' ? 1: -1;
        const logged_in_user = req.user!;
        const project_id = req.params.project_id;
        if(!mongoose.Types.ObjectId.isValid(project_id as string)){
            res.status(404).json({ "message": "Project not found" });
            return;
        }
        const project = await Project.findById(project_id);
        if(!project){
            res.status(404).json({
                "message": "Project not found"
            });
            return;
        }
        if(project.owner.equals(logged_in_user._id)){
            const task_filter= {project: project_id, ...(status_flag && {status})};
            const tasks = await Task.find(task_filter).sort({createdAt: sort_order}).limit(limitNumber).skip((pageNumber-1)*limitNumber);
            const totalRecords = await Task.countDocuments(task_filter);
            res.status(200).json({
            'data': tasks,
            'pagination': {
                'total': totalRecords,
                'page': pageNumber,
                'limit': limitNumber,
                'totalPages': Math.ceil(totalRecords/limitNumber)
            }
        });
        }
        else{
            res.status(403).json({
                "message": "Wrong owner"
            });
            return;
        }
    }
    catch(error){
        next(error);
    }
}

export const getTask = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const logged_in_user = req.user!;
        const project_id = req.params.project_id;
        if(!mongoose.Types.ObjectId.isValid(project_id as string)){
            res.status(404).json({ "message": "Project not found" });
            return;
        }
        const task_id = req.params.task_id;
        if(!mongoose.Types.ObjectId.isValid(task_id as string)){
            res.status(404).json({ "message": "Task not found" });
            return;
        }
        const project = await Project.findById(project_id);
        if(!project){
            res.status(404).json({
                "message": "Project not found"
            });
            return;
        }
        if(project.owner.equals(logged_in_user._id)){
            const task = await Task.findById(task_id);
            if(!task){
                res.status(404).json({"message": "Task not found"});
                return;
            }
            else{
                res.status(200).json(task);
                return;
            }
        }
        else{
            res.status(403).json({
                "message": "Wrong owner"
            });
            return;
        }
    }
    catch(error){
        next(error);
    }
}

export const updateTask = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const { title,description,status } = req.body;
        let properties_to_update: UpdatedObject = {}
        if(title){
            properties_to_update.title = title;
        }
        if(description){
            properties_to_update.description = description;
        }
        if(status){
            properties_to_update.status = status;
        }
        const logged_in_user = req.user!;
        const project_id = req.params.project_id;
        if(!mongoose.Types.ObjectId.isValid(project_id as string)){
            res.status(404).json({ "message": "Project not found" });
            return;
        }
        const task_id = req.params.task_id;
        if(!mongoose.Types.ObjectId.isValid(task_id as string)){
            res.status(404).json({ "message": "Task not found" });
            return;
        }
        const project = await Project.findById(project_id);
        if(!project){
            res.status(404).json({
                "message": "Project not found"
            });
            return;
        }
        if(project.owner.equals(logged_in_user._id)){
            const task = await Task.findById(task_id);
            if(!task){
                res.status(404).json({"message": "Task not found"});
                return;
            }
            else{
                await Task.findByIdAndUpdate(task_id, properties_to_update, {new : true, runValidators: true});
                res.status(200).json({
                    "message": "Task updated successfully"
                });
                return;
            }
        }
        else{
            res.status(403).json({
                "message": "Wrong owner"
            });
            return;
        }
    }
    catch(error: any){
        next(error);
    }
}

export const deleteTask = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const logged_in_user = req.user!;
        const project_id = req.params.project_id;
        if(!mongoose.Types.ObjectId.isValid(project_id as string)){
            res.status(404).json({ "message": "Project not found" });
            return;
        }
        const task_id = req.params.task_id;
        if(!mongoose.Types.ObjectId.isValid(task_id as string)){
            res.status(404).json({ "message": "Task not found" });
            return;
        }
        const project = await Project.findById(project_id);
        if(!project){
            res.status(404).json({
                "message": "Project not found"
            });
            return;
        }
        if(project.owner.equals(logged_in_user._id)){
            const task = await Task.findById(task_id);
            if(!task){
                res.status(404).json({"message": "Task not found"});
                return;
            }
            else{
                await Task.deleteOne({_id: task_id});
                res.status(200).json({
                    "message": "Task deleted successfully"
                });
                return;
            }
        }
        else{
            res.status(403).json({
                "message": "Wrong owner"
            });
            return;
        }
    }
    catch(error){
        next(error);
    }
}