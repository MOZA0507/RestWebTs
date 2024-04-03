

export class TodoEntity {
  constructor(
    public id: number,
    public text: string,
    public completedAt?: Date|null,
  ){}

  get isCompleted() {
    return !!this.completedAt;
  }

  public static fromObject( object: {[key:string]: any}) {
    const {id, text, completedAt} = object;
    if (!id) throw 'Id is required';
    if (!text) throw 'Text is required';

    let newCompleteAt;
    if(completedAt) {
      newCompleteAt = new Date(completedAt);
      if(isNaN(newCompleteAt.getTime())){
        throw 'CompletedAt must be a valid Date';
      }
    }
    return new TodoEntity(id, text, completedAt);
  }
}