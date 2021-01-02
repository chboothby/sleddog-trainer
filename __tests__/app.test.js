const app = require("../app");
const request = require("supertest");
const connection = require("../db/connection");
const { response } = require("express");
const chai = require("chai"),
  expect = chai.expect;

chai.use(require("chai-sorted"));

describe("/api", async function () {
  this.timeout(10000);
  after(function () {
    connection.destroy();
  });
  beforeEach(async function () {
    await connection.seed.run();
  });
  // KENNELS *************************
  describe("/api/kennels", async () => {
    describe("GET", async () => {
      it("Responds with 200 and object containing a an array off all the kennels in the db", async () => {
        return request(app)
          .get("/api/kennels")
          .then(({ body, status }) => {
            expect(status).to.eql(200);
            expect(body).to.have.ownProperty("kennels");
            expect(body.kennels.length).to.equal(2);
          });
      });
      it("Each kennel should have a property dogCount which represents the number of dogs living in that kennel", async () => {
        return request(app)
          .get("/api/kennels")
          .then(({ body }) => {
            expect(body.kennels[0]).to.have.ownProperty("dogCount");
            expect(body.kennels[0].dogCount).to.equal("3");
          });
      });
    });
    describe("POST", async () => {
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
      describe("ERRORS", async () => {
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
  // MUSHERS ***********************
  describe("/api/mushers", async () => {
    describe("GET", async () => {
      it("Responds with 200 and an object containing an array of all mushers", async () => {
        const { status, body } = await request(app).get("/api/mushers");

        expect(status).to.equal(200);
        expect(body).to.haveOwnProperty("mushers");
        expect(body.mushers.length).to.equal(2);
      });
      it("Mushers should have the expected keys including kennel name instead of id and dogCount", async () => {
        const { body } = await request(app).get("/api/mushers");
        expect(body.mushers[0]).to.haveOwnProperty("dogCount");
        expect(body.mushers[0]).to.haveOwnProperty("kennel");
        expect(body.mushers[0]).to.have.all.keys([
          "musher_id",
          "display_pic",
          "dogCount",
          "kennel",
          "name",
          "nationality",
        ]);
      });
      it("Should return mushers in alphabetical name order by default", async () => {
        const {
          body: { mushers },
        } = await request(app).get("/api/mushers");
        expect(mushers).to.be.sortedBy("name");
      });
      it("Should return mushers sorted by given params", async () => {
        const {
          body: { mushers },
        } = await request(app).get("/api/mushers?sort_by=dogs&order=desc");
        expect(mushers).to.be.sortedBy("dogCount", { descending: true });
      });
    });
    describe("POST", async () => {
      it("Responds with 201 and an object containing new musher", async () => {
        const { status, body } = await request(app).post("/api/mushers").send({
          name: "Jeremias",
          kennel: "Northern Soul Journeys",
          nationality: "Swedish",
        });

        expect(status).to.equal(201);
        expect(body).to.haveOwnProperty("musher");
      });
      it("Mushers should have the expected keys including kennel name instead of id and dogCount", async () => {
        const { body } = await request(app).get("/api/mushers");
        expect(body.mushers[0]).to.haveOwnProperty("dogCount");
        expect(body.mushers[0]).to.haveOwnProperty("kennel");
        expect(body.mushers[0]).to.have.all.keys([
          "musher_id",
          "display_pic",
          "dogCount",
          "kennel",
          "name",
          "nationality",
        ]);
      });
    });

    describe("/api/mushers/:musher_id", () => {
      describe("GET", () => {
        it("Responds with 200 and a an object containing that mushers details, with a key of dog count representing the number of dogs in that mushers kennel", async () => {
          const { status, body } = await request(app).get("/api/mushers/2");
          expect(status).to.equal(200);
          expect(body).to.haveOwnProperty("musher");
          expect(body.musher).to.eql({
            musher_id: 2,
            name: "Eric",
            kennel: "Yellow Snow Husky Tours",
            nationality: "Dutch",
            display_pic: null,
            dogCount: "2",
          });
        });
      });
      describe("DELETE", () => {
        it("Responds with 204, content not found and removes that musher from db", async () => {
          const { status } = await request(app).delete("/api/mushers/1");
          expect(status).to.equal(204);
          const response = await request(app).get("/api/mushers/1");
          expect(response.status).to.equal(404);
          expect(response.body.msg).to.equal("Dog musher not found");
        });
      });
      describe("PATCH", () => {
        it("Responds with 201, created and returns updated dog musher", async () => {
          const {
            status,
            body: { musher },
          } = await request(app)
            .patch("/api/mushers/1")
            .send({ nationality: "British" });
          expect(status).to.equal(201);
          expect(musher.nationality).to.equal("British");
        });
      });
      describe("ERRORS", () => {
        it("Responds with 404 not found when searching for musher with non existent ID", async () => {
          const { status, body } = await request(app).get("/api/mushers/1000");
          expect(status).to.equal(404);
          expect(body.msg).to.equal("Dog musher not found");
        });
        it("Responds with 404 not found when attempting to delete a musher with non existent ID", async () => {
          const { status, body } = await request(app).delete(
            "/api/mushers/1000"
          );
          expect(status).to.equal(404);
          expect(body.msg).to.equal("Dog musher not found");
        });
        it("Responds with 400 when invalid input type for id", async () => {
          const methods = ["get", "delete"];
          const responses = methods.map(async (method) => {
            await request(app)[method]("/api/mushers/notAnID");
          });
          return Promise.all(responses).then((response) => {
            console.log(response);
          });
        });
        it("Responds with 400 when missing data from post request", async () => {
          const { status, body } = await request(app)
            .post("/api/mushers")
            .send({ name: "Jeremias", nationality: "Swedish" });

          expect(status).to.equal(400);
          expect(body.msg).to.equal("Request missing kennel name");
        });
        it("Responds with 400 when missing data from post request", async () => {
          const { status, body } = await request(app)
            .post("/api/mushers")
            .send({ name: "Jeremias", kennel: "Northern Soul Journeys" });

          expect(status).to.equal(400);
          expect(body.msg).to.equal("Incomplete request");
        });
        it("Responds with 400 when tries to update non existent row", async () => {
          const { status, body } = await request(app)
            .patch("/api/mushers/1")
            .send({ notAColumn: "Jeremias" });

          expect(status).to.equal(400);
          expect(body.msg).to.equal("Invalid input type");
        });
        //   // sort mushers
      });
    });
  });
  // DOGS *********************************
  describe("/api/kennels/:kennel_id/dogs", async () => {
    describe("GET", async () => {
      it("Responds with 200 and an object containing an array of all dogs in that kennel", async () => {
        const { status, body } = await request(app).get("/api/kennels/1/dogs");

        expect(status).to.equal(200);
        expect(body).to.haveOwnProperty("dogs");
        expect(body.dogs.length).to.equal(3);
      });
      it("Dogs should have the expected keys including kennel name instead of kennel id  ", async () => {
        const { body } = await request(app).get("/api/kennels/1/dogs");

        expect(body.dogs[0]).to.have.all.keys([
          "dog_id",
          "birth_date",
          "display_pic",
          "gender",
          "kennel",
          "km_ran",
          "name",
          "needs_booties",
          "nickname",
          "team_position",
        ]);
      });
      it("Accepts QUERIES and filters results by name, needs-booties, team_position, gender", async () => {
        const queries = [
          `name=shaggy`,
          `needs_booties=true`,
          `team_position=wheel`,
          "gender=male",
        ];
        const promisesArray = await queries.map(async (query) => {
          return request(app).get(`/api/kennels/1/dogs?${query}`);
        });
        const [name, booties, position, gender] = await Promise.all(
          promisesArray
        );
        expect(name.body.dogs.length).to.equal(1);
        expect(name.body.dogs[0].name).to.equal("Shaggy");

        expect(booties.body.dogs.length).to.equal(0);

        expect(position.body.dogs.length).to.equal(2);
        expect(gender.body.dogs.length).to.equal(3);
      });
      it("Accepts an SORT by query which defaults to ascending", async () => {
        const orderByQueries = ["name", "km_ran", "birth_date"];
        const promises = await orderByQueries.map(async (query) => {
          return request(app).get(`/api/kennels/1/dogs?sort_by=${query}`);
        });

        const responses = await Promise.all(promises);

        expect(responses[0].body.dogs).to.be.sortedBy("name");
        expect(responses[1].body.dogs).to.be.sortedBy("km_ran", {
          coerce: true,
        });
        expect(responses[2].body.dogs).to.be.sortedBy("birth_date");
      });
      it("Accepts an ORDER query", async () => {
        const orderByQueries = ["name", "km_ran", "birth_date"];
        const promises = await orderByQueries.map(async (query) => {
          return request(app).get(
            `/api/kennels/1/dogs?sort_by=${query}&order=desc`
          );
        });

        const responses = await Promise.all(promises);

        expect(responses[0].body.dogs).to.be.sortedBy("name", {
          descending: true,
        });
        expect(responses[1].body.dogs).to.be.sortedBy("km_ran", {
          descending: true,
        });
        expect(responses[2].body.dogs).to.be.sortedBy("birth_date", {
          descending: true,
        });
      });
    });
    describe("GET DOG", () => {
      it("responds with 200 and object containing given dogs details", async () => {
        const { body, status } = await request(app).get("/api/dogs/2");
        expect(status).to.equal(200);
        expect(Object.keys(body.dog)).to.eql([
          "name",
          "dog_id",
          "birth_date",
          "gender",
          "km_ran",
          "kennel",
          "display_pic",
          "needs_booties",
          "nickname",
          "team_position",
        ]);
      });
    });
    describe("POST", async () => {
      it("responds with 201 and returns newly added dog", async () => {
        const response = await request(app).post("/api/kennels/1").send({
          name: "Moa",
          birth_date: "17/3/2016",
          nickname: "Tiny Ol' Moa",
          team_position: "lead",
          gender: "female",
          km_ran: 102,
        });

        expect(response.status).to.equal(201);
        expect(Object.keys(response.body.dog)).to.eql([
          "dog_id",
          "name",
          "nickname",
          "kennel_id",
          "display_pic",
          "birth_date",
          "km_ran",
          "needs_booties",
          "team_position",
          "gender",
        ]);
      });
    });
    describe("PATCH details", async () => {
      it("should allow user alter dogs details", async () => {
        const {
          status,
          body: { dog },
        } = await request(app)
          .patch("/api/dogs/1")
          .send({ needs_booties: true, team_position: "swing" });
        expect(status).to.equal(201);
      });
      expect(status).to.equal(201);
      expect(dog.needs_booties).to.equal(true);
      expect(dog.team_position).to.equal("swing");
    });
    describe("ERRORS", () => {
      describe("/api/dogs/:dog_id", () => {
        it("400 PATCH", async () => {
          const {
            status,
            body: { msg },
          } = await request(app).patch("/api/dogs/1");

          expect(status).to.equal(400);
          expect(msg).to.equal("Empty request body");
        });
        it("400 PATCH", async () => {
          const {
            status,
            body: { msg },
          } = await request(app)
            .patch("/api/dogs/1")
            .send({ km_ran: "notANumber" });

          expect(status).to.equal(400);
          expect(msg).to.equal("Invalid input type");
        });
        it("404 GET dog not found", async () => {
          const {
            status,
            body: { msg },
          } = await request(app).get("/api/dogs/1000");
          expect(status).to.equal(404);
          expect(msg).to.equal("Dog not found");
        });

        it("400 GET bad request", async () => {
          const {
            status,
            body: { msg },
          } = await request(app).get("/api/dogs/notAnId");

          expect(status).to.equal(400);
          expect(msg).to.equal("Invalid input type");
        });
        it("405 invalid method", async () => {
          const methods = ["post", "delete"];
          const promises = await methods.map((method) => {
            return request(app)[method]("/api/dogs/2");
          });

          const responses = await Promise.all(promises);
          expect(responses.every(({ status }) => status === 405)).to.equal(
            true
          );
          expect(
            responses.every(({ body: { msg } }) => msg === "Invalid method")
          ).to.equal(true);
        });
      });
    });
  });
  // RUNS  ********************
  describe("/api/kennels/:kennel_id/runs", async () => {
    describe("PATCH add km to multiple dogs", () => {
      it("should allow user increment multiple dogs mileage", async () => {
        const { status, body } = await request(app)
          .post("/api/kennels/1/runs")
          .send({
            dogs: [1, 2, 5],
            km_ran: 12,
            mushers: [1],
            route: "mountain circuit",
            date: "11/12/20",
          });

        expect(status).to.equal(201);
        expect(body.newRun.dogs.length).to.equal(3);
        expect(body.newRun.dogs[0].km_ran).to.equal(192);
      });
      it("should return the new run within the object", async () => {
        const { body } = await request(app)
          .post("/api/kennels/1/runs")
          .send({
            dogs: [1, 2, 5],
            km_ran: 12,
            mushers: [1],
            route: "mountain circuit",
            date: "11/12/20",
          });
        expect(Object.keys(body.newRun.run)).to.eql([
          "run_id",
          "route",
          "kennel_id",
          "dogs",
          "distance",
          "date",
          "mushers",
        ]);
      });
    });
    describe("GET", () => {
      it("returns 200 and array of dogs", async () => {
        const {
          status,
          body: { runs },
        } = await request(app).get("/api/kennels/1/runs");

        expect(status).to.equal(200);
        expect(runs.length).to.equal(1);
      });
    });
  });
  // delete run by run id, patch run by run id
  // sort runs by distance ?by dog id, date
  // errors
});
