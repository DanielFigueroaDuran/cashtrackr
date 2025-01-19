import Jwt from "jsonwebtoken";

export const generateJWT = (id: string): string => {
      //console.log(id);
      const token = Jwt.sign({ id }, process.env.JWT_SECRET, {
            expiresIn: '30d'
      });
      return token;
};