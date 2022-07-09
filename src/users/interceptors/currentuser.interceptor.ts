import { NestInterceptor, ExecutionContext,CallHandler, Injectable } from "@nestjs/common";
import { request } from "http";
import { Observable } from "rxjs";

import {UsersService} from "../users.service";


@Injectable()
export class CurrentUserInteceptor implements NestInterceptor{

    constructor(private usersService:UsersService){}
    

    async intercept(context: ExecutionContext, handler: CallHandler<any>) {
        const request = context.switchToHttp().getRequest();


        const {userId} = request.session || {};
        if (userId){
            const user = this.usersService.findOne(userId); 
            request.currentUser = user;
        }
        return handler.handle();

    }



}