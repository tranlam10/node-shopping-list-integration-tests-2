const chai = require("chai");
const chaiHttp = require("chai-http");

const { app, runServer, closeServer } = require("../server");
const expect = chai.expect;

chai.use(chaiHttp);

describe("Recipes", function() {
    before(function() {
        return runServer();
    });

    after(function() {
        return closeServer();
    });

    it("should list items on GET", function() {
        return chai
            .request(app)
            .get("/recipes")
            .then(function(res) {
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                const requiredItems = ["id", "name", "ingredients"];
                res.body.forEach(function(item) {
                    expect(item).to.include.keys(requiredItems);
                });
        });
    });

    it("should post all items on POST", function() {
        const item = {
            name: "meatloaf", 
            ingredients: ["gravy", "potatoes"]
        };
        return chai
            .request(app)
            .post("/recipes")
            .send(item)
            .then(function(res) {
                expect(res).to.have.status(201);
                expect(res.body).to.be.a("object");
                expect(res.body).to.include.keys("id", "name", "ingredients")
            });
    });

    it("should update item upon PUT", function(){ 
        const updatedData = {
            name: "boiled eggs",
            ingredients: ["shell", "water"]
        };
        return chai
            .request(app)
            .get("/recipes")
            .then(function(res) {
                updatedData.id = res.body[0].id;
                return chai
                    .request(app)
                    .put(`/recipes/${updatedData.id}`)
                    .send(updatedData)
            })
            .then(function(res) {
                expect(res).to.have.status(204);
            });
    });

    it("should delete item upon DELETE", function(){ 
        return chai
            .request(app)
            .get("/recipes")
            .then(function(res) {
                return chai
                    .request(app)
                    .delete(`/recipes/${res.body[0].id}`)
            })
            .then(function(res) {
                expect(res).to.have.status(204);
            });
    });
});