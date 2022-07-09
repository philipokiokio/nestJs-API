import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { User } from './user.entity';

describe('UsersController', () => {
  let controller: UsersController;
  let fakeUsersService: Partial<UsersService>;
  let fakeAuthService: Partial<AuthService>;


  beforeEach(async () => {
    fakeUsersService = {
      find: (email:string) =>{
        return Promise.resolve([{id:1, email, password:'nest'}])  
      },
      findOne: (id:number) =>{
        return Promise.resolve({id, email:"raver@gmail.com", password:"areyouthere"})
      },
      // remove: () =>{},
      // update: () =>{}

    };
    fakeAuthService ={
      signin: (email, password) => {
        return Promise.resolve({id:1, email, password})
      },
      // signup: () => {}
    }


    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers:[
        {
          provide: UsersService,
          useValue:fakeUsersService
        },
        {
          provide:AuthService,
          useValue: fakeAuthService
        }
      ]
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('FindAllUsers returns a list of ysers with the given email', async()=>{
  const users = await controller.findAllUsers('raver@gmail.com');
  expect(users.length).toEqual(1);
  expect(users[0].email).toEqual('raver@gmail.com');
  
  })
  it('FindUser returns a single user with the given id', async ()=>{
    const user= await controller.findUser('1');
    expect(user).toBeDefined();
  })
  it('FindUser throws an error if a single user with the given id does not exist', async ()=>{

    fakeUsersService.findOne= () => null
    try{
      const user= await controller.findUser('1');
    }catch(err){

    }

  })
  it("Sign in and update session and returns user", async() =>{
    const session = {userId:-10};
    const user  = await controller.signin(
      {
        email: "test@mail.com", password:'wemove'
      
      },session
    )
    expect(user.id).toEqual(1);
    expect(session.userId).toEqual(1);
})
});
