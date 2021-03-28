import Request from './setup.js';
describe("Testing orderRoutes", () => {
    let token;
    let Utoken;
    let orderId;
    let emailAddress;
  
    test("should signup and login for admin", () => {
        return Request
          .post("/api/users")
          .send({
            name: "admin",
            email: "admin@gmail.com",
            password: "123456",
            isAdmin: "true",
          })
          .then((res) => {
            return Request
              .post("/api/users/login")
              .send({
                email: "admin@gmail.com",
                password: "123456",
              })
              .then((res) => {
                  console.log(res.body);
                  token = res.body.token;
              });
          });
      });

      test("User login", () => {
        return Request.post("/api/users/login")
            .send({
                email: "soft@gmail.com",
                password: "123456"
            })
            .then(response => {
                Utoken = response.body.token;
                expect(response.statusCode).toBe(200);
                expect(response.body.name).not.toBe(undefined);
                expect(response.body.token).not.toBe(undefined);
            });
    });

      test("should be able to order", () => {
        return Request
          .post("/api/orders")
          .set("authorization", "Bearer " + Utoken)
          .send({
            shippingAddress: {
              address:'bhaktapur',
              city:'Dhuncheheight',
              postalCode:'001234',
              country:'Nepal',
            },
          })
          .then((res) => {
           console.log(res.body);
           orderId = res.body._id;
           emailAddress = res.body.email;
          });
      });  


      test("Retrieving all Order list", () => {
        return Request.get("/api/orders")
        .set("authorization", "Bearer " + token)
            .then(res => {
                expect(res.statusCode).toBe(200);
               console.log(res.body)
            });
    });

    test("Retrieving Order list by user ", () => {
      return Request.get("/api/orders/myorders")
      .set("authorization", "Bearer " + Utoken)
          .then(res => {
              expect(res.statusCode).toBe(200);
             console.log(res.body)
          });
  });

    test("Retrieving Order list by id", () => {
      return Request.get(`/api/orders/${orderId}`)
      .set("authorization", "Bearer " + token)
          .then(res => {
              expect(res.statusCode).toBe(200);
            console.log(res.body)
          });
  });

    test("Test if order not found", () => {
      let orderId = "5f25a3aab6844421f87d1518";
      return Request
        .get(`/api/orders/${orderId}`)
        .set("authorization", "Bearer " + token)
        .then((res) => {
        console.log(res.body);
        });
    });

    test("if order is delivered or not", () => {
      return Request
        .put(`/api/orders/${orderId}/delivery`)
        .set("authorization", "Bearer " + token)
        .send({
          id: "A101",
          status: "Paid",
          update_time: "10:00 am",
          email: emailAddress
        })
        .then((res) => {
          console.log(res.body);
        });
    });

    test("if order is paid or not", () => {
      return Request
        .put(`/api/orders/${orderId}/pay`)
        .set("authorization", "Bearer " + Utoken)
        .send({
          isPaid: 'true'
        })
        .then((res) => {
          console.log(res.body);
        });
    })
  
});