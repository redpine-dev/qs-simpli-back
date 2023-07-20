import { Types, Document } from "mongoose";
import UserModel, { User } from "../models/User";

class AuthService {
  static async createUser(data: Partial<User>) {
    const { username, password } = data;
    const user = new UserModel({ username, password });
    try {
      const savedUser = await user.save();
      return { success: true, data: savedUser };
    } catch (err) {
      return { success: false, error: err, status: 400 };
    }
  }

  static async userInfo(
    user: Document<any, any, User> & User & { _id: Types.ObjectId }
  ) {
    return {
      username: user.username,
      id: user._id,
    };
  }

  static async show(
    user: Document<any, any, User> & User & { _id: Types.ObjectId }
  ) {
    try {
      const userData = await AuthService.userInfo(user);
      return { success: true, data: userData };
    } catch (err) {
      return { success: false, error: err, status: 500 };
    }
  }

  static async authenticate(data: { username: string; password: string }) {
    const { username, password } = data;
    try {
      const user = await UserModel.findByCredentials(username, password);
      if (!user) {
        return {
          success: false,
          error: "Invalid login credentials",
          status: 401,
        };
      }
      const token = await user.generateAuthToken(36000000000);
      const userData = await AuthService.userInfo(
        user as unknown as Document<any, any, User> &
          User & {
            _id: Types.ObjectId;
          }
      );
      return {
        success: true,
        data: {
          token,
          user: userData,
        },
      };
    } catch (err) {
      return { success: false, error: err, status: 500 };
    }
  }

  static async tokenValidation(token: string) {
    try {
      const user = await UserModel.findByToken(token);
      if (!user) {
        return { success: false, error: "Could't find user", status: 401 };
      }
      return { success: true, data: user };
    } catch (err) {
      return { success: false, error: err, status: 500 };
    }
  }

  static async destroy(username: string) {
    try {
      const foundUser = await UserModel.findOne({ username });
      if (!foundUser) {
        return { success: false, error: "Couldn't find user", status: 404 };
      }
      await foundUser.remove();
      return { success: true, data: "User deleted" };
    } catch (err) {
      return { success: false, error: err, status: 500 };
    }
  }

  static async updatePassword(data: Partial<User>) {
    const { username, password } = data;
    try {
      const foundUser = await UserModel.findOne({ username: username });
      if (!foundUser) {
        return { success: false, error: "Couldn't find user", status: 404 };
      }
      foundUser.password = password!;
      await foundUser.save();
      return { success: true, data: "Password updated" };
    } catch (err) {
      return { success: false, error: err, status: 500 };
    }
  }

  static async getUserByUsername(username: string) {
    try {
      const foundUser = await UserModel.findOne({ username: username });
      if (!foundUser) {
        return { success: false, error: "Couldn't find user", status: 404 };
      }
      return { success: true, data: foundUser };
    } catch (err) {
      return { success: false, error: err, status: 500 };
    }
  }
}

export default AuthService;
