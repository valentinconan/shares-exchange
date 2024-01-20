export class CreateUserDto {

    constructor(lastName: string, firstName: string, login: string, rights: string[]) {
        this.firstName = firstName
        this.lastName = lastName
        this.login = login
        this.rights = rights
    }

    lastName: string
    firstName: string
    login: string
    rights: string[]

}
