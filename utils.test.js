const {
  createKennelRef,
  addKennelId,
  formatDate,
} = require("./db/utils/data-manipulation");
const { expect, assert } = require("chai");
const chai = require("chai");
chai.use(require("chai-datetime"));

describe("createKennelRef", () => {
  it("An empty array will return an empty object", () => {
    const input = [];
    expect(createKennelRef(input)).to.eql({});
  });
  it("Should return an object with expected key value pairs", () => {
    const kennels = [
      {
        kennel_name: "Yellow Snow Husky Tours",
        kennel_id: 2,
        established: 2018,
      },
    ];
    expect(createKennelRef(kennels)).to.eql({
      "Yellow Snow Husky Tours": 2,
    });
  });
  it("Should not mutate original input", () => {
    const kennels = [
      { name: "Yellow Snow Husky Tours", kennel_id: 2, established: 2018 },
    ];
    createKennelRef(kennels);
    expect(kennels).to.eql([
      { name: "Yellow Snow Husky Tours", kennel_id: 2, established: 2018 },
    ]);
  });
});

describe("addKennelId", () => {
  it("Should return a new empty array if passed empty array", () => {
    const input = [];
    assert.isArray(addKennelId(input));
    expect(addKennelId(input)).to.eql([]);
    expect(addKennelId(input)).to.not.equal(input);
  });

  it("Each object in return array should have all the expected keys", () => {
    const input = [{ name: "Hannah", kennel: "Northern Soul Journeys" }];
    const kennelRef = { "Northern Soul Journeys": 1 };
    expect(addKennelId(input, kennelRef)[0]).to.have.keys([
      "kennel_id",
      "name",
    ]);
  });
  it("Returns expected object array", () => {
    const input = [{ name: "Hannah", kennel: "Northern Soul Journeys" }];
    const kennelRef = { "Northern Soul Journeys": 1 };
    expect(addKennelId(input, kennelRef)[0]).to.eql({
      kennel_id: 1,
      name: "Hannah",
    });
  });
  it("Does not mutate input array", () => {
    const input = [{ name: "Hannah", kennel: "Northern Soul Journeys" }];
    const kennelRef = { "Northern Soul Journeys": 1 };
    addKennelId(input, kennelRef);
    expect(input).to.eql([
      { name: "Hannah", kennel: "Northern Soul Journeys" },
    ]);
  });
});

describe("formatDate", () => {
  it("Should return a new empty array if passed an empty array", () => {
    const input = [];
    expect(formatDate(input)).to.eql([]);
    expect(formatDate(input)).to.not.equal(input);
  });
  it("objects in array should contain the expected keys", () => {
    const input = [
      {
        name: "Frost",
        nickname: "fluffyboi",
        kennel_id: 1,
        birth_date: "10/2/2017",
        km_ran: 180,
        team_position: "wheel",
      },
    ];
    expect(formatDate(input)[0]).to.have.keys([
      "team_position",
      "km_ran",
      "birth_date",
      "name",
      "nickname",
      "kennel_id",
    ]);
  });
  it("Should return birth_date in required format", () => {
    const input = [
      {
        name: "Frost",
        nickname: "fluffyboi",
        kennel_id: 1,
        birth_date: "10/2/2017",
        km_ran: 180,
        team_position: "wheel",
      },
    ];
    expect(formatDate(input)[0].birth_date).to.equalDate(new Date(2017, 2, 10));
  });
  it("should not mutate input array", () => {
    const input = [
      {
        name: "Frost",
        nickname: "fluffyboi",
        kennel_id: 1,
        birth_date: "10/2/2017",
        km_ran: 180,
        team_position: "wheel",
      },
    ];
    formatDate(input);
    expect(input).to.eql([
      {
        name: "Frost",
        nickname: "fluffyboi",
        kennel_id: 1,
        birth_date: "10/2/2017",
        km_ran: 180,
        team_position: "wheel",
      },
    ]);
  });
});
