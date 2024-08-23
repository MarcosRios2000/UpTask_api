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
            await Promise.allSettled([task.save(), req.project.save()])
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
}