import request from "supertest";
import server, { connectDB } from "../../server";

describe('Test', () => {
      beforeAll(async () => {
            await connectDB();
      });

      it('should return a 200 status code from the homepage url', async () => {
            const response = await request(server).get('/');

            expect(response.statusCode).toBe(200);
            expect(response.text).toBe('Todo bien...');
      });
});
