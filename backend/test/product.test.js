import Request from './setup.js';
describe("Testing of product route", () => {
  let token;
  let usertoken;
  let userID;
  let productID;
  let adminID;
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
                adminID = res.body._id;
            });
        });
    });

    test("User registration", () => {
      return Request.post("/api/users")
          .send({
              name: "soft",
              email: "soft1@gmail.com",
              password: "123456"
          })
          .then(response => {
              console.log(response.body);
              expect(response.statusCode).toBe(201);
              expect(response.body.name).not.toBe(undefined);
          });
  });

  test("User login", () => {
    return Request.post("/api/users/login")
        .send({
            email: "soft1@gmail.com",
            password: "123456"
        })
        .then(response => {
            usertoken = response.body.token;
            userID = response.body._id;
            console.log(response.body);
        });
});

    test("should not login with invalid password and email", () => {
      return Request
            .post("/api/users/login")
            .send({
              email: "admin@gmail.com",
              password: "admin",
            })
            .then((res) => {
                console.log(res.body);
            });
    });
    
      test("should be able to add product", () => {
        return Request
          .post("/api/products")
          .set("authorization", "Bearer " + token)
          .send({
            name: 'jacket',
            image: 'jacket.jpg',
            brand: 'North Face',
            category: 'Winter Piece',
            description: 'Down Jacket',
            price: '4000',
          })
          .then((res) => {
            productID = res.body._id;
           console.log(res.body);
          });
      });  

      // test("should be able to add product", () => {
      //   return Request
      //     .post("/api/products")
      //     .set("authorization", "Bearer " + token)
      //     .send({
      //       name: 'lever',
      //       image: 'lever.jpg',
      //       brand: 'North Face',
      //       category: 'Winter ',
      //       description: 'good',
      //       price: '1000',
      //     })
      //     .then((res) => {
      //       productID = res.body._id;
      //      console.log(res.body);
      //     });
      // }); 

      test("Retrieving all Product list", () => {
        return Request.get("/api/products")
        .set("authorization", "Bearer " + token)
            .then(res => {
                expect(res.statusCode).toBe(200);
               console.log(res.body)
            });
    });

    test("Search top rated products", () => {
      return Request.get(`/api/products/top`)
          .query({ search: "jacket" })
          .then(res => {
              expect(res.statusCode).toBe(200);
            console.log(res.body)
          });
  });

    test("Retrieving Product list by id", () => {
      return Request.get(`/api/products/${productID}`)
      .set("authorization", "Bearer " + token)
          .then(res => {
              expect(res.statusCode).toBe(200);
             console.log(res.body)
          });
  });

    test("Updating product item", () => {
      return Request
        .put(`/api/products/${productID}`)
        .set("authorization", "Bearer " + token)
        .send({
          name: 'Trouser',
          image: 'trouser.jpg',
          brand: 'North Face',
          category: 'Winter Piece',
          countInStock: 1,
          description: 'trouser',
          price: '4000',
        })
        .then((res) => {
          console.log(res.body);
        });
    });

    test("Test if product not found", () => {
      let productID = "5f25a3aab6844421f87d1518";
      return Request
        .get(`/api/products/${productID}`)
        .then((res) => {
         console.log(res.body);
        });
    });

    test("If product not found", () => {
      return Request
        .put(`/api/products/${productID}/reviews`)
        .set("authorization", "Bearer " + token)
        .send({
          name: "admin",
          rating: "5",
          comment: "good",
          user: userID
        })
        .then((res) => {
          console.log(res.body);
        });
    });

    test("able to give review and comment in product", () => {
      return Request
        .post(`/api/products/${productID}/reviews`)
        .set("authorization", "Bearer " + token)
        .send({
          name: "admin",
          rating: "5",
          comment: "good",
          user: userID
        })
        .then((res) => {
          console.log(res.body);
        });
    });

    test("user can't reviewed item that already review", () => {
      return Request
        .post(`/api/products/${productID}/reviews`)
        .set("authorization", "Bearer " + token)
        .send({
          name: "admin",
          rating: "5",
          comment: "good",
          user: userID
        })
        .then((res) => {
          console.log(res.body);
        });
    });
  
    test("able to view review detail", () => {
      return Request.get(`/api/products/${productID}`)
      .set("authorization", "Bearer " + token)
          .then(res => {
              expect(res.statusCode).toBe(200);
             console.log(res.body)
          });
  });


    test("Deleting Product Item by Id", () => {
      return Request.delete(`/api/products/${productID}`)
          .set("authorization", "Bearer " + token)
          .then(res => {
              expect(res.statusCode).toBe(200);
              expect(res.body._id).toBe(undefined);
              console.log(res.body);
          });
  });

 
    test("Retrieving user by id", () => {
      return Request.get(`/api/users/${userID}`)
      .set("authorization", "Bearer " + token)
          .then(res => {
              expect(res.statusCode).toBe(200);
            console.log(res.body)
          });
  });

  test("update user role", () => {
    return Request.put(`/api/users/${userID}`)
    .set("authorization", "Bearer " + token)
        .send({
            name:"soft",
            email: "soft1@gmail.com",
            password: "123456",
            isAdmin: "true"    
        })
        .then(response => {
            console.log(response.body);
        });
});

    test("Deleting user by Id", () => {
      return Request.delete(`/api/users/${adminID}`)
          .set("authorization", "Bearer " + token)
          .then(res => {
              expect(res.statusCode).toBe(200);
              expect(res.body._id).toBe(undefined);
              console.log(res.body);
          });
  });

 
});  