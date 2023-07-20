import { Model, model, Schema } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config(
  {
    path: __dirname + "/.env"
  }
)

export interface User extends Document {
  username: string;
  password: string;
  role: string;
  seller: Schema.Types.ObjectId;
  supervisor: Schema.Types.ObjectId;
  truck: Schema.Types.ObjectId;
  logistic: Schema.Types.ObjectId;
  typist: Schema.Types.ObjectId;
  generateAuthToken: (caducity: number) => Promise<string>;
}

export interface IUserModel extends Model<User> {
  findByCredentials(username: string, password: string): Promise<User>;
  findByToken(token: string): Promise<User>;
  generateAuthToken(caducity: string): Promise<string>;
}

const schema = new Schema<User>({
  username: { type: String, required: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["seller", "manager", "supervisor", "truck", "logistic", "typist"],
  },
  supervisor: { type: Schema.Types.ObjectId, ref: "Supervisor", required: false },
  seller: { type: Schema.Types.ObjectId, ref: "Seller", required: false },
  truck: { type: Schema.Types.ObjectId, ref: "Truck", required: false },
  typist: { type: Schema.Types.ObjectId, ref: "Typist", required: false },
});

schema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
  }
  next();
});

schema.methods.generateAuthToken = async function (caducity: number | string) {
  const user = this;
  const token = jwt.sign({ id: user._id }, process.env.SECRET || "", {
    expiresIn: caducity,
  });
  return token;
};

schema.statics.findByCredentials = async (username, password) => {
  const user = await UserModel.findOne({ username });

  if (!user) {
    return null;
  }
  const isPasswordMatch = await bcrypt.compare(password, user.password);
  if (!isPasswordMatch) {
    return null;
  }
  return user;
};

schema.statics.findByToken = async (token) => {
  const verified = jwt.verify(token, process.env.SECRET || "") as {
    id: string;
  };
  if (!verified) {
    return null;
  }

  const user = await UserModel.findById(verified.id);
  if (!user) {
    return null;
  }
  return user;
};

const UserModel = model<User, IUserModel>("User", schema);

export default UserModel;
