const app = require("../app");
const request = require("supertest");
const connection = require("../db/connection");
const expect = require("chai").expect;

describe("/api", () => {
  after(() => {
    return connection.destroy();
  });
  beforeEach(() => {
    return connection.seed.run();
  });
  describe("/api/kennels", () => {
    describe("GET", () => {
      it("Responds with 200 and object containing a an array off all the kennels in the db", async () => {
        const { status, body } = await request(app).get("/api/kennels");
        expect(status).to.eql(200);
        expect(body).to.have.ownProperty("kennels");
        expect(body.kennels.length).to.equal(2);
      });
      it("Each kennel should have a property dogCount which represents the number of dogs living in that kennel", async () => {
        const { status, body } = await request(app).get("/api/kennels");
        expect(body.kennels[0]).to.have.ownProperty("dogCount");
        expect(body.kennels[0].dogCount).to.equal("3");
      });
    });
    describe("POST", () => {
      it("Responds with 201 and the new kennel object", async () => {
        const { status, body } = await request(app).post("/api/kennels").send({
          kennel_name: "Keep Dreaming",
          established: 2012,
          location: "Norway",
        });

        expect(status).to.equal(201);
        expect(body).to.eql({
          kennel: {
            kennel_id: 3,
            kennel_name: "Keep Dreaming",
            established: 2012,
            location: "Norway",
          },
        });
      });
      describe("ERRORS", () => {
        it("400 - bad request invalid data type", async () => {
          const { status, body } = await request(app)
            .post("/api/kennels")
            .send({ kennel_name: "Keep Dreaming", established: "notAyear" });

          expect(status).to.equal(400);
          expect(body.msg).to.equal("Invalid input type");
        });
        it("400 - missing data from post request", async () => {
          const { status, body } = await request(app)
            .post("/api/kennels")
            .send({ established: 2012 });
          expect(status).to.equal(400);
          expect(body.msg).to.equal("Incomplete request");
        });
      });
    });
  });
  describe("/api/mushers", () => {
    describe("GET", () => {
      it("Responds with 200 and an object containing an array of all mushers", async () => {
        const { status, body } = await request(app).get("/api/mushers");

        expect(status).to.equal(200);
        expect(body).to.haveOwnProperty("mushers");
        expect(body.mushers.length).to.equal(2);
      });
      it("Mushers should have the expected keys including kennel name instead of id and dogCount", async () => {
        const { status, body } = await request(app).get("/api/mushers");
        expect(body.mushers[0]).to.haveOwnProperty("dogCount");
        expect(body.mushers[0]).to.haveOwnProperty("kennel");
        expect(body.mushers[0]).to.have.all.keys([
          "display_pic",
          "dogCount",
          "kennel",
          "name",
          "nationality",
        ]);
      });
    });
  });
  describe.only("/api/kennels/:kennel_id/dogs", () => {
    describe("GET", () => {
      it("Responds with 200 and an object containing an array of all dogs in that kennel", async () => {
        const { status, body } = await request(app).get("/api/kennels/1/dogs");

        expect(status).to.equal(200);
        expect(body).to.haveOwnProperty("dogs");
        expect(body.dogs.length).to.equal(3);
      });
      it("Dogs should have the expected", async () => {
        const { body } = await request(app).get("/api/kennels/1/dogs");

        expect(body.dogs[0]).to.have.all.keys([
          "birth_date",
          "display_pic",
          "gender",
          "kennel_id",
          "km_ran",
          "name",
          "needs-booties",
          "nickname",
          "team_position",
        ]);
      });
    });
  });
});
