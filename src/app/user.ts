export class User {
  public id: number;
  public name: string = '';
  public code: string = '';
  public status: boolean = true;

  constructor() {
    this.id = User.getNextId();
  }

  private static getNextId(): number {
    const storedTableData = localStorage.getItem('tableData');
    const tableData: User[] = storedTableData
      ? JSON.parse(storedTableData)
      : [];

    const maxId = tableData.reduce(
      (max, user) => (user.id > max ? user.id : max),
      0
    );

    const nextId = maxId + 1;

    return nextId;
  }
}
