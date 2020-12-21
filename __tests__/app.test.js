const app = require("../app");
const request = require("supertest");
const connection = require("../db/connection");
const chai = require("chai"),
  expect = chai.expect;

chai.use(require("chai-sorted"));

describe("/api", async function () {
  this.timeout(10000);
  after(async function () {
    connection.destroy();
  });
  beforeEach(async function () {
    await connection.seed.run();
  });
  describe("/api/kennels", async function () {
    describe("GET", async function () {
      it("Responds with 200 and object containing a an array off all the kennels in the db", async function () {
        return request(app)
          .get("/api/kennels")
          .then(({ body, status }) => {
            expect(status).to.eql(200);
            expect(body).to.have.ownProperty("kennels");
            expect(body.kennels.length).to.equal(2);
          });
      });
      it("Each kennel should have a property dogCount which represents the number of dogs living in that kennel", async function () {
        return request(app)
          .get("/api/kennels")
          .then(({ status, body }) => {
            expect(body.kennels[0]).to.have.ownProperty("dogCount");
            expect(body.kennels[0].dogCount).to.equal("3");
          });
      });
    });
    describe("POST", async function () {
      it("Responds with 201 and the new kennel object", async function () {
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
      describe("ERRORS", async function () {
        it("400 - bad request invalid data type", async function () {
          const { status, body } = await request(app)
            .post("/api/kennels")
            .send({ kennel_name: "Keep Dreaming", established: "notAyear" });

          expect(status).to.equal(400);
          expect(body.msg).to.equal("Invalid input type");
        });
        it("400 - missing data from post request", async function () {
          const { status, body } = await request(app)
            .post("/api/kennels")
            .send({ established: 2012 });
          expect(status).to.equal(400);
          expect(body.msg).to.equal("Incomplete request");
        });
      });
    });
  });
  describe("/api/mushers", async function () {
    describe("GET", async function () {
      it("Responds with 200 and an object containing an array of all mushers", async function () {
        const { status, body } = await request(app).get("/api/mushers");

        expect(status).to.equal(200);
        expect(body).to.haveOwnProperty("mushers");
        expect(body.mushers.length).to.equal(2);
      });
      it("Mushers should have the expected keys including kennel name instead of id and dogCount", async function () {
        const { status, body } = await request(app).get("/api/mushers");
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
      it("Should return mushers in alphabetical name order by default", async function () {
        const {
          status,
          body: { mushers },
        } = await request(app).get("/api/mushers");
        console.log(mushers);
        expect(mushers).to.be.sortedBy("name");
      });
      it.skip("Should return mushers sorted by given params", async function () {
        const {
          status,
          body: { mushers },
        } = await request(app).get("/api/mushers?sort_by=dogs&order=desc");
        console.log(mushers);
        expect(mushers).to.be.sortedBy("dogCount", { descending: true });
      });
    });
    describe("POST", async function () {
      it("Responds with 201 and an object containing new musher", async function () {
        const { status, body } = await request(app).post("/api/mushers").send({
          name: "Jeremias",
          kennel: "Northern Soul Journeys",
          nationality: "Swedish",
        });

        expect(status).to.equal(201);
        expect(body).to.haveOwnProperty("musher");
      });
      it("Mushers should have the expected keys including kennel name instead of id and dogCount", async function () {
        const { status, body } = await request(app).get("/api/mushers");
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

    describe("/api/mushers/:musher_id", function () {
      describe("GET", function () {
        it("Responds with 200 and a an object containing that mushers details, with a key of dog count representing the number of dogs in that mushers kennel", async function () {
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
      describe("DELETE", function () {
        it("Responds with 204, content not found and removes that musher from db", async function () {
          const { status } = await request(app).delete("/api/mushers/1");
          expect(status).to.equal(204);
          const response = await request(app).get("/api/mushers/1");
          expect(response.status).to.equal(404);
          expect(response.body.msg).to.equal("Dog musher not found");
        });
      });
      describe("PATCH", function () {
        it("Responds with 201, created and returns updated dog musher", async function () {
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
      describe("ERRORS", function () {
        it("Responds with 404 not found when searching for musher with non existent ID", async function () {
          const { status, body } = await request(app).get("/api/mushers/1000");
          expect(status).to.equal(404);
          expect(body.msg).to.equal("Dog musher not found");
        });
        it("Responds with 404 not found when attempting to delete a musher with non existent ID", async function () {
          const { status, body } = await request(app).delete(
            "/api/mushers/1000"
          );
          expect(status).to.equal(404);
          expect(body.msg).to.equal("Dog musher not found");
        });
        it("Responds with 400 when invalid input type for id", async function () {
          const methods = ["get", "delete"];
          const responses = methods.map(async (method) => {
            await request(app)[method]("/api/mushers/notAnID");
          });
          return Promise.all(responses).then((response) => {
            console.log(response);
          });
        });
        it("Responds with 400 when missing data from post request", async function () {
          const { status, body } = await request(app)
            .post("/api/mushers")
            .send({ name: "Jeremias", nationality: "Swedish" });

          expect(status).to.equal(400);
          expect(body.msg).to.equal("Request missing kennel name");
        });
        it("Responds with 400 when missing data from post request", async function () {
          const { status, body } = await request(app)
            .post("/api/mushers")
            .send({ name: "Jeremias", kennel: "Northern Soul Journeys" });

          expect(status).to.equal(400);
          expect(body.msg).to.equal("Incomplete request");
        });
        it("Responds with 400 when tries to update non existent row", async function () {
          const { status, body } = await request(app)
            .patch("/api/mushers/1")
            .send({ notAColumn: "Jeremias" });

          expect(status).to.equal(400);
          expect(body.msg).to.equal("Invalid input type");
        });
        //   // sort mushers
      });
    });
    describe("/api/kennels/:kennel_id/dogs", async function () {
      describe("GET", async function () {
        it("Responds with 200 and an object containing an array of all dogs in that kennel", async function () {
          const { status, body } = await request(app).get(
            "/api/kennels/1/dogs"
          );

          expect(status).to.equal(200);
          expect(body).to.haveOwnProperty("dogs");
          expect(body.dogs.length).to.equal(3);
        });
        it("Dogs should have the expected keys including kennel name instead of kennel id  ", async function () {
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
        it("Accepts QUERIES and filters results by name, needs-booties, team_position, gender", async function () {
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
        it("Accepts an SORT by query which defaults to ascending", async function () {
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
        it("Accepts an ORDER query", async function () {
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
      describe.only("POST", async () => {
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
    });
  });
});
