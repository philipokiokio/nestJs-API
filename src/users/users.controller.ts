import { Body,Controller,Delete,Get,Post,Param, Patch, Query, NotFoundException, ClassSerializerInterceptor, Session,UseGuards } from '@nestjs/common';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
// import {  Serialize } from '../src/interceptors/serialize.interceptor';
import { UserDto } from './dto/user.dto';
import { CurrentUser } from './decorators/current-user.decorator';
import { User } from './user.entity';
import { AuthGuard } from '../guards/auth.guard';
import { Serialize } from '../interceptors/serialize.interceptor';

@Controller('auth')
@Serialize(UserDto)

export class UsersController {

    constructor(private usersService:UsersService, private authService:AuthService){

    }



    // @Get('/colors/:color')
    // setColor(@Param('color') color:string, @Session() session:any){

    //     session.color=color;
    // }

    // @Get('/colors')
    // getcolor(@Session() session:any){
    //      return session.color;
    // }

    // @Get('whoami')
    // whoAmI(@Session() session:any){
    //     if (!session.userId){
    //         throw new NotFoundException("No User signed in. Please sign in.")
    //     }
    //     return this.usersService.findOne(session.userId);
    // }

    @Get('whoami')
    @UseGuards(AuthGuard)
    whoAmI(@CurrentUser() user:User){

        return user;
    }



    @Post('/signup')
    async createUser(@Body() body:CreateUserDto,@Session() session:any){
        
        const user= await this.authService.signup(body.email, body.password);
        session.userId = user.id;

        return user;
    }

    @Post('/signin')
    async signin(@Body() body:CreateUserDto,@Session() session:any){
        const user =await this.authService.signin(body.email,body.password);
        session.userId = user.id;

        return user
    }

    @Post('/signout')
    signOut(@Session() session:any){
        session.userId=null;
    }

    @Get('/:id')
    async findUser(@Param('id')id:string){
        console.log('Handler is running')
        const user = await this.usersService.findOne(parseInt(id));
        if (!user){
            throw new NotFoundException('user not found')
        }
        return user;
    }

    @Get()
    async findAllUsers(@Query('email')email:string){
        const user = await this.usersService.find(email);
        if (!user){
            throw new NotFoundException('user not found')
        }
        return user;        

    }


    @Delete('/:id')
    removeUser(@Param('id')id:string){
        return this.usersService.remove(parseInt(id));
    }

    @Patch('/:id')
    updateUser(@Param('id')id:string, @Body() body:UpdateUserDto){

        return this.usersService.update(parseInt(id), body);
    }
}
