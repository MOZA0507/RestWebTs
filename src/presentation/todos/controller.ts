import { Request, Response } from "express";
import { prisma } from "../../data/postgres";
import { CreateTodoDto, UpdateTodoDto } from "../../domain/dtos";


export class TodosController {

  constructor(){};

  public getTodos = async (req: Request, res: Response) => {
    const todosDB = await prisma.todo.findMany();
    return res.json(todosDB);
  };

  public getTodoById = async (req: Request, res: Response) => {
    const id = + req.params.id;
    if (isNaN(id)) return res.status(400).json({error:'ID argument is not a number'});
    const todo = await prisma.todo.findFirst({where: {id: Number(id)}});
    (todo)
      ? res.json(todo)
      : res.status(404).json({error: `Todo with id ${id} not found`});
  };

  public createTodo = async(req: Request, res: Response) => {
    const [error, createTodoDto] = CreateTodoDto.create(req.body); 
    if (error) return res.status(400).json({error: error});

    const todo = await prisma.todo.create({
      data: createTodoDto!
    });
  
    res.status(201).json(todo);
  };

  public updateTodo = async (req:Request, res: Response) => {
    const id = + req.params.id;
    const [error, updateTodoDto] = UpdateTodoDto.create({...req.body, id});
    if (error) return res.status(400).json({error: error});
    
    const todo = await prisma.todo.findFirst({where: {id: Number(id)}});
    if (!todo) return res.status(404).json({error:`Todo with id: ${id} does not exist`});

    const updatedTodo = await prisma.todo.update({
      where: {id: Number(id)},
      data: updateTodoDto!.values,
    });

    res.json(updatedTodo);

  };

  public deleteTodo = async (req: Request, res: Response) => {
    const id = + req.params.id;

    const todo = await prisma.todo.findFirst({ where: {id: Number(id)}});
    if (!todo) return res.status(404).json({error:`Todo with id: ${id} does not exist`});

    const deletedTodo = await prisma.todo.delete({where: {id: Number(id)}});
    (deletedTodo)
      ? res.json(deletedTodo)
      : res.status(400).json({error: `Todo with id: ${id} not found`});
  };

}