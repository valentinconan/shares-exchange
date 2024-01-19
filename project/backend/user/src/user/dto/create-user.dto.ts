
export class CreateUserDto {

    constructor(lastName:string,fistName:string,login:string) {
        this.fistName=fistName
        this.lastName=lastName
        this.login=login
    }

    lastName:string

    fistName:string

    login:string
}
