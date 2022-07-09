import {BadRequestException, Injectable, NotFoundException} from "@nestjs/common";
import { UsersService } from "./users.service";
import { randomBytes, scrypt as _scrypt } from "crypto";
import { promisify } from "util";

const scrypt = promisify(_scrypt);


@Injectable()
export class AuthService{
    constructor(private usersService: UsersService){}


    async signup(email:string, password:string){


        // See if an email is in use
        const users= await this.usersService.find(email)

        if (users.length){
            throw new BadRequestException('email in use')
        }
        // hash the user password

        // Generate a salt
        const salt = randomBytes(8).toString('hex');

        // Hash the salt and the password
        const hash = (await scrypt(password, salt, 32)) as Buffer

        // join the salt and the hash password and save
        const hashedSaltPassword = salt + '.' + hash.toString('hex')


        // create a new user and save it
        const user = await this.usersService.create(email, hashedSaltPassword)

        // return the user
        return user;
    }

    async signin(email:string, password:string){

        // check if an email exist.
        const [user] = await this.usersService.find(email);

        if (!user){
            throw new NotFoundException('User not found');
        }

        const [salt, storedHash] = user.password.split('.');

        // hash the salt and the password
        const hash = (await scrypt(password, salt,32)) as Buffer

        

        if (storedHash !== hash.toString('hex')){
            throw new BadRequestException('User email/password is incorrect')
            
        }
            
        return user;
    }
}