export class User {
    public email: string;
    public name: string;
    public role: number;
    public classroom: string;

    constructor(email: string, name: string, role: number, classroom: string) {
        this.email = email;
        this.name = name;
        this.role = role;
        this.classroom = classroom;
    }
}
