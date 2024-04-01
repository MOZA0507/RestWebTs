import { Request, Response } from "express";

const todos = [
  {id: 1, text: 'Get Milk', createdAt: new Date()},
  {id: 2, text: 'Get Meat', createdAt: new Date()},
  {id: 3, text: 'Buy Fruits', createdAt: new Date()},
]


export class TodosController {

  constructor(){};

  public getTodos = (req: Request, res: Response) => {
    return res.json(todos);
  };

  public getTodoById = (req: Request, res: Response) => {
    
  };
}