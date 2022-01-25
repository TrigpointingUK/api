import {
  ImATeapotException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import axios from 'axios';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  uniqueNamesGenerator,
  adjectives,
  animals,
} from 'unique-names-generator';
import { MyUserDto } from './dto/my-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  /**
   * Create a new user record
   * @param createUserDto
   * @returns Promise<User>
   */
  create(createUserDto: CreateUserDto): Promise<User> {
    console.log(createUserDto);
    return this.usersRepository.save({ ...createUserDto });
  }

  /**
   * Returns current user's personal details and preferences
   * @param oauthUser
   * @param oauthEmail
   * @param cryptpwCookie
   * @param authidCookie
   * @param bearerToken
   * @returns
   */
  async getMyUser(
    oauthUser: string,
    oauthEmail: string,
    cryptpwCookie: string,
    authidCookie: string,
    bearerToken?: string,
  ): Promise<MyUserDto> {
    if (oauthUser == null) {
      console.log('ERROR: oauthUser not provided');
      throw new NotFoundException(`No oauth user provided`);
    }

    // Happy days
    console.log(`Looking up by oauthUser : ${oauthUser}`);
    const userbyoauth: User = await this.usersRepository.findOne({
      where: { oauth: oauthUser },
    });
    if (userbyoauth?.oauth === oauthUser) {
      console.log(`User found : ${userbyoauth.nickname}`);
      return this._userToMyUserDto(userbyoauth);
    }

    // Legacy cookies
    if (cryptpwCookie != null && parseInt(authidCookie) != null) {
      console.log(`Looking up by cryptpw/authid cookies : ${authidCookie}`);
      const userbycryptpw: User = await this.usersRepository.findOne({
        where: {
          cryptpw: cryptpwCookie,
          id: parseInt(authidCookie),
          oauth: IsNull(),
        },
      });
      if (userbycryptpw?.id == parseInt(authidCookie)) {
        console.log('User found by cookies');
        await this._addAuth0Details(userbycryptpw, bearerToken);
        this.usersRepository.save(userbycryptpw);
        return this._userToMyUserDto(userbycryptpw);
      } else {
        console.log('Legacy cookies not matched');
      }
    } else {
      console.log('Legacy cookies not present');
    }

    // Email address // TODO: only for auth0 validated emails
    if (oauthEmail != null) {
      console.log(`Looking up by oauthEmail : ${oauthEmail}`);
      const userbyemail: User = await this.usersRepository.findOne({
        where: { email: oauthEmail, oauth: IsNull() },
      });
      if (userbyemail?.email == oauthEmail) {
        console.log('User found by email');
        await this._addAuth0Details(userbyemail, bearerToken);
        this.usersRepository.save(userbyemail);
        return this._userToMyUserDto(userbyemail);
      }
    } else {
      console.log('No matches to email address');
    }

    // User not found - create new TUK user
    let newUserDto = new CreateUserDto();
    await this._addAuth0Details(newUserDto, bearerToken);
    newUserDto.nickname = uniqueNamesGenerator({
      dictionaries: [adjectives, animals],
      separator: '-',
    });
    console.log(`New user - creating database entry - ${newUserDto.nickname}`);
    const newUser = await this.create(newUserDto);
    return this._userToMyUserDto(newUser);
  }

  /**
   *
   * @param updateUserDto
   * @returns Promise<User>
   */
  async updateMyUser(oauthUser: string, updateUserDto: UpdateUserDto) {
    const myUser = await this._findByOauth(oauthUser);
    return this.usersRepository.save({
      id: myUser.id,
      ...updateUserDto,
    });
  }

  /**
   * Soft delete a user record
   * @param id
   */
  async remove(id: number) {
    await this.usersRepository.softDelete(id);
  }

  /**
   *
   * @returns Promise<User[]>
   */
  async findAll() {
    const users = await this.usersRepository.find();
    return users;
  }

  /**
   *
   * @param id
   * @returns Promise<User>
   */
  findById(id: number) {
    return this.usersRepository.findOne(id);
  }

  async getAuth0UserDetails(bearerToken: string) {
    console.log(`getAuth0UserDetails`);
    try {
      const response = await axios.get(
        `${process.env.AUTH0_ISSUER_URL}userinfo`,
        {
          timeout: 5000,
          headers: {
            Authorization: `${bearerToken}`,
          },
        },
      );
      return response.data;
    } catch (err) {
      console.log(
        'getAuth0UserDetails failed : ' +
          err.message +
          ' : ' +
          err.response?.data?.error_description,
      );
    } finally {
    }
  }

  /**
   * Find a full existing user object or fail
   * @param oauthUser
   * @returns
   */
  async _findByOauth(oauthUser: string): Promise<User> {
    console.log(`Find existing user : ${oauthUser}`);
    if (oauthUser == null) {
      console.log('ERROR: oauthUser not provided');
      throw new NotFoundException(`No oauth user provided`);
    }
    const userbyoauth: User = await this.usersRepository.findOneOrFail({
      where: { oauth: oauthUser },
    });
    if (userbyoauth.oauth === oauthUser) {
      return userbyoauth;
    } else {
      throw new ImATeapotException(
        `FATAL: userbyoauth.oauth != oauthUser ${userbyoauth.oauth} != ${oauthUser}`,
      );
    }
  }

  /**
   * Add additional details to user record
   * @param user
   * @param bearerToken
   * @returns
   */
  async _addAuth0Details(
    user: User | CreateUserDto,
    bearerToken: string,
  ): Promise<User | CreateUserDto> {
    const auth0UserDetails = await this.getAuth0UserDetails(bearerToken);
    user.oauth = auth0UserDetails?.sub;
    user.email = auth0UserDetails?.email;
    user.email_verified = auth0UserDetails?.email_verified;
    user.firstname = auth0UserDetails?.given_name;
    user.lastname = auth0UserDetails?.family_name;
    user.avatar = auth0UserDetails?.picture;
    return user;
  }

  /**
   * Helper function to convert types
   * @param user
   * @returns
   */
  _userToMyUserDto(user: User): MyUserDto {
    //TODO There really should be a better way!
    let myUser = new MyUserDto();
    myUser.id = user.id;
    myUser.nickname = user.nickname;
    myUser.email = user.email;
    myUser.email_verified = user.email_verified;
    myUser.firstname = user.firstname;
    myUser.lastname = user.lastname;
    myUser.about = user.about;
    myUser.homepage = user.homepage;
    myUser.avatar = user.avatar;
    myUser.mobile_number = user.mobile_number;
    myUser.licence_default = user.licence_default;
    myUser.status_max = user.status_max;
    myUser.units = user.units;
    return myUser;
  }
}
