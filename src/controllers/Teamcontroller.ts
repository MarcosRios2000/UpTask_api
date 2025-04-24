import { Request, Response } from "express"
import User from "../models/User"
import Project from "../models/Project"


export class TeamMemberController {
    static findMemberByEmail = async (req: Request, res: Response) => {
        try {
            const { email } = req.body

            const user = await User.findOne({ email }).select('id email name')
            if (!user) {
                const error = new Error('User not found.')
                return res.status(404).json({ error: error.message })
            }

            res.json(user)
        } catch (error) {
            res.status(500).json({ error: 'Something went wrong.' })
        }
    }

    static addMemberById = async (req: Request, res: Response) => {
        try {
            const { id } = req.body
    
            const user = await User.findById(id).select('id')
            if (!user) {
                const error = new Error('User not found.')
                return res.status(404).json({ error: error.message })
            }
    
            if (req.project.team.some(team => team.toString() === user.id.toString())) {
                const error = new Error('User is already part of the project.')
                return res.status(409).json({ error: error.message })
            }
    
            req.project.team.push(user.id)
            await req.project.save()
    
            res.send('User added to the project.')
        } catch (error) {
            res.status(500).json({ error: 'Something went wrong.' })
        }
    }

    static removeMemberById = async (req: Request, res: Response) => {
        try {
            const { userId } = req.params
    
            if (!req.project.team.some(team => team.toString() === userId)) {
                const error = new Error('User is not part of the project.')
                return res.status(409).json({ error: error.message })
            }
    
            req.project.team = req.project.team.filter(
                teamMember => teamMember.toString() !== userId
            )
    
            await req.project.save()
            res.send('User removed from the project')
        } catch (error) {
            res.status(500).json({ error: 'Something went wrong.' })
        }
    }
    

    static getProjectTeam = async (req: Request, res: Response) => {
        try {
            const project = await Project.findById(req.project.id).populate({
                path: 'team',
                select: 'id email name'
            })
    
            res.json(project.team)
        } catch (error) {
            res.status(500).json({ error: 'Something went wrong.' })
        }
    }

}