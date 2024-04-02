import { Request, Response } from "express";

let todos = [
  {id: 1, text: 'Get Milk', completedAt: new Date()},
  {id: 2, text: 'Get Meat', completedAt: null},
  {id: 3, text: 'Buy Fruits', completedAt: new Date()},
]


export class TodosController {

  constructor(){};

  public getTodos = (req: Request, res: Response) => {
    return res.json(todos);
  };

  public getTodoById = (req: Request, res: Response) => {
    const id = + req.params.id;
    if (isNaN(id)) return res.status(400).json({error:'ID argument is not a number'});
    const todo = todos.find(todo => todo.id === id);
    (todo)
      ? res.json(todo)
      : res.status(404).json({error: `Todo with id ${id} not found`});
  };

  public createTodo = (req: Request, res: Response) => {
    const {text} = req.body;
    if (text.length <= 0) {
      return res.status(400).json({error: 'Invalid text provided'});
    }

    const newTodo = {
      id: todos.length + 1,
      text: text,
      completedAt: new Date()
    };
    todos.push(newTodo);
    res.json(newTodo);
  };

  public updateTodo = (req:Request, res: Response) => {
    const id = + req.params.id;
    if (isNaN(id)) return res.status(400).json({error:'ID argument is not a number'});
    
    const todo = todos.find(todo => todo.id === id);
    if (!todo) return res.status(404).json({error:`Todo with id: ${id} does not exist`});

    const {text, completedAt} = req.body;

    todo.text = text || todo.text;
    (completedAt === 'null')
      ? todo.completedAt = null
      : todo.completedAt = new Date(completedAt || todo.completedAt);
    res.json(todo);

  };

  public deleteTodo = (req: Request, res: Response) => {
    const id = + req.params.id;

    const todo = todos.find(todo => todo.id === id);
    if (!todo) return res.status(404).json({error:`Todo with id: ${id} does not exist`});

    todos = todos.filter(t => t.id !== id );
    res.json(todo);
  
  };

}