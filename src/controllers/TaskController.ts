import type { Request, Response } from "express";
import Project from "../models/Project";
import Task from "../models/Task";


// export class Taskcontroller {
//     static createTask = async (req: Request, res: Response) => {
//         // obtengo el id del proyecto
//         const { projectId } = req.params
//         // verifico si existe
//         const project = await Project.findById(projectId)
//         if(!project){
//             const error = new Error('Projecto no encontrado')
//             return res.status(404).json({error: error.message})
//         }
//         try {
//             //creo la tarea
//             const task = new Task(req.body)
//             //le linkeo el projecto a esa tarea
//             task.project = project.id
//             //le linkeo la tarea al proyecto
//             project.tasks.push(task.id)
//             //guardo ambos en la db
//             await task.save()
//             await project.save()
//             res.send('Tarea creada correctamente')
//         } catch (error) {
//             console.log(error)
//         }
//     }
// }

export class TaskController {
    static createTask = async (req: Request, res: Response) => {
        try {
            const task = new Task(req.body)
            task.project = req.project.id
            req.project.tasks.push(task.id)
            await Promise.allSettled([task.save(), req.project.save() ])
            res.send('Tarea creada correctamente')
        } catch (error) {
            res.status(500).json({error: 'Hubo un error'})
        }
    }

    static getProjectTasks = async (req: Request, res: Response) => {   
        try {
            const tasks = await Task.find({project: req.project.id}).populate('project')
            res.json(tasks)

        } catch (error) {
            res.status(500).json({error: 'Hubo un error'})
        }
    }

    static getTaskById = async (req: Request, res: Response) => {   
        try {
            res.json(req.task)
        } catch (error) {
            res.status(500).json({error: 'Hubo un error'})
        }
    }

    static updateTask = async (req: Request, res: Response) => {   
        try {
            req.task.name = req.body.name
            req.task.description = req.body.description
            await req.task.save()
            res.send('Tarea actualizada correctamente')
        } catch (error) {
            res.status(500).json({error: 'Hubo un error'})
        }
    }

    
    static deleteTask = async (req: Request, res: Response) => {   
        try {
            req.project.tasks = req.project.tasks.filter( task => task.toString() !== req.task.id.toString() )

            await Promise.allSettled([ req.task.deleteOne(), req.project.save() ])
            res.send('Tarea eliminada correctamente')
        } catch (error) {
            res.status(500).json({error: 'Hubo un error'})
        }
    }

    static updateStatus = async (req: Request, res: Response) => {
        try {
            const { status } = req.body
            req.task.status = status
            if(status === 'pending') {
                req.task.completedBy = null
            } else {
                req.task.completedBy = req.user.id
            }
            req.task.completedBy = req.user.id
            await req.task.save()
            res.send('Tarea Actualizada')
        } catch (error) {
            res.status(500).json({error: 'Hubo un error'})
        }
    }
}