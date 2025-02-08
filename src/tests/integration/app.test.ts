import request from "supertest";
import server, { connectDB } from "../../server";

describe('Authentication - Create Account', () => {
      // beforeAll(async () => {
      //       await connectDB();
      // });

      it('should display validation errors when form is empty', async () => {
            const response = await request(server)
                  .post('/api/auth/create-account')
                  .send({});

            // console.log(response.body);

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('errors');
            expect(response.body.errors).toHaveLength(3);
      });
});

// {
//       "name": "Elias",
//       "password": "12345678",
//       "email": "figueroadurandanielelias@gmail.com"
//     }