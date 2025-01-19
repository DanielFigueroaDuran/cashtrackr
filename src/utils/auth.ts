import bcript from "bcrypt";

export const hashPassword = async (password: string) => {
      const salt = await bcript.genSalt(10);
      return await bcript.hash(password, salt);
};

export const checkPassword = async (password: string, hash: string) => {
      // console.log(password);
      // console.log(hash);
      return await bcript.compare(password, hash);
};