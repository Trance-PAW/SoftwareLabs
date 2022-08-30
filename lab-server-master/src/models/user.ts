export class User {
    public id: string;
    public email: string;
    public name: string;
    public role: number;

    constructor(id: string, email: string, name: string, role: number) {
        this.id = id;
        this.email = email;
        this.name = name;
        this.role = role;
    }
}
