import Request from './setup.js';

describe("Testing userRoutes", () => {
    let token;
    let userID;
    test("User registration", () => {
        return Request.post("/api/users")
            .send({
                name: "Softwarica",
                email: "soft@gmail.com",
                password: "123456"
            })
            .then(response => {
                //console.log(response.body);
                expect(response.statusCode).toBe(201);
                expect(response.body.name).not.toBe(undefined);
                expect(response.body.token).not.toBe(undefined);   
            });
    });
    
    test("should not be able to register with registered email ", () => {
        return Request
          .post("/api/users")
          .send({
            name: "Softwarica",
            email: "soft@gmail.com",
            password: "123456",
          })
          .then((res) => {
                //console.log(res.body);
          });
      });

    test("User login", () => {
        return Request.post("/api/users/login")
            .send({
                email: "soft@gmail.com",
                password: "123456"
            })
            .then(response => {
                token = response.body.token;
                userID = response.body._id;
                expect(response.statusCode).toBe(200);
                expect(response.body.name).not.toBe(undefined);
                expect(response.body.token).not.toBe(undefined);
            });
    });

    test("Get user Profile", () => {
        return Request.get("/api/users/profile")
        .set("authorization", "Bearer " + token)
            .then(res => {
                expect(res.statusCode).toBe(200);
               //console.log(res.body)
            });
    });

    test("User profile update", () => {
        return Request.put("/api/users/profile")
        .set("authorization", "Bearer " + token)
            .send({
                name: "Kapil",
                email: "kapil@gmail.com",
                password: "123456",
            })
            .then(res => {
                expect(res.statusCode).toBe(200);
                console.log(res.body);
            });
    });
});