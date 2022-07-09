import { Test } from "@nestjs/testing";
import { AuthService } from "./auth.service";
import { User } from "./user.entity";
import { UsersService } from "./users.service";

describe('AuthService',()=>{
    let service :AuthService;
    let fakeUsersService: Partial<UsersService>;
    beforeEach(async ()=>{
        // create a fake copy of th user service
        const users: User[]=[]; 
        fakeUsersService ={
            find: (email:string)=>{
                const filteredUsers = users.filter(user=> user.email === email);
                return Promise.resolve(filteredUsers)
            },
            create: (email:string, password:string)=>{
                const user = ({id: Math.floor(Math.random() * 9999999), email, password});
                users.push(user);

                return Promise.resolve(user)
             }
        }
        const module =  await Test.createTestingModule({
            providers:[
                AuthService,
            {
                provide:UsersService,
                useValue:fakeUsersService
            }]
        }).compile();
    
    
        service = module.get(AuthService);
    })

    it("can create an instance of the auth service", async()=>{

        expect(service).toBeDefined();
     

})
  it('creates a new user with a salted and hashed password', async ()=>{
    const user = await service.signup('raver@gmail.com','wemovewe');

    expect(user.password).not.toEqual('wemovewe');
    const [salt, hash] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  })    
 
  it('Throws an error if user signs up with email that is in use', async() =>{

    await service.signup('raver@gmail.com','sameemail');
    try{
     await service.signup('raver@gmail.com','sameemail');
    }catch (err){
        
    }
  })

  it('Throws an error if a user is not found duing sign in ', async ()=>{

    try{
        await service.signin('raver@gmail.com', 'failtopass')
    }
    catch(err){
     
    }

  })
  
  it('Throws an error when a users password is invalid', async()=>{
     await service.signup("raver@gmail.com","areyouthere")

      try{
        await service.signin("raver@gmail.com","areyouthere12");
      }catch(err){

      }
  })
  it('returns a user once correct cred is provided', async () =>{
    await service.signup ("raver@gmail.com","areyouthere")
    const user = await service.signin('raver@gmail.com', 'areyouthere');
    expect(user).toBeDefined();

  })

})
