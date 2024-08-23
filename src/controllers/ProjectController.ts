import type { Request, Response } from "express"
import Project from "../models/Project"


export class ProjectController {

    static createProject = async (req: Request, res: Response) => {

        const project = new Project(req.body)
       try {
         await project.save()
         res.send('Proyecto creado correctamente')
       } catch (error) {
        res.status(500).json({error: 'Hubo un error'})
       }
    }

    static getAllProjects = async (req: Request, res: Response) => {
        try {
            const projects = await Project.find({})
            res.json(projects)
        } catch (error) {
            res.status(500).json({error: 'Hubo un error'})
        }
        
    }

    static getProjectById = async (req: Request, res: Response) => {
        const { id } = req.params
        try {
            const project = await Project.findById(id).populate('tasks')

            if(!project){
                const error = new Error('Projecto no encontrado')
                return res.status(404).json({error: error.message})
            }
            res.json(project)
        } catch (error) {
            res.status(500).json({error: 'Hubo un error'})
        }
        
    }

    static updateProduct = async (req: Request, res: Response) => {
        const { id } = req.params
        try {
            const project = await Project.findByIdAndUpdate(id, req.body)

            await project.save()
            res.send('Proyecto Actualizado')
        } catch (error) {
            res.status(500).json({error: 'Hubo un error'})
        }
        
    }


    static deleteProject = async (req: Request, res: Response) => {
        const { id } = req.params
        try {
            const project = await Project.findById(id)
            if(!project){
                const error = new Error('Projecto no encontrado')
                return res.status(404).json({error: error.message})
            }
            await project.deleteOne()
            res.send('Proyecto eliminado')
        } catch (error) {
            res.status(500).json({error: 'Hubo un error'})
        }
    }

    

}