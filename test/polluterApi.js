const [app, FOSSIL_DATA] = require("../app")

const chai = require("chai")
const chaiHttp = require("chai-http") 

const { POLLUTERS_WORST_API_PATH, POLLUTERS_API_PATH } = require("../constants")
const URL = POLLUTERS_API_PATH + POLLUTERS_WORST_API_PATH + "?"

chai.should()
chai.use(chaiHttp)

const fromQ = "from=", 
      toQ   = "to=",
      typeQ = "type=",
      topQ   = "top="

describe("pollutersApi " + URL, function() {

  describe("Query: from", function() {
    it("from - string as query", done => {
      chai.request(app)
        .get(URL + fromQ + "this is a string")
        .end((err, resp) => {
          resp.should.have.status(400)
          done()
        })
    })

    it("from - out of bounds lower", done => {
      chai.request(app)
      .get(URL + fromQ + -32)
      .end((err, resp) => {
        resp.should.have.status(200)
        resp.body[0].year.should.eql(FOSSIL_DATA.firstRecord)
        resp.body[0].polluters.should.be.a("array")
        
        done()
      })
    }) 

    it("from - out of bounds upper", done => {
      chai.request(app)
      .get(URL + fromQ + 3200)
      .end((err, resp) => {
        resp.should.have.status(200)
        resp.body[0].year.should.eql(FOSSIL_DATA.firstRecord)
        resp.body[0].polluters.should.be.a("array")

        done()
      })
    })

    
    it("from - empty", done => {
      chai.request(app)
      .get(URL + fromQ + 3200)
      .end((err, resp) => {
        resp.should.have.status(200)
        resp.body[0].year.should.eql(FOSSIL_DATA.firstRecord)
        resp.body[0].polluters.should.be.a("array")
        done()
      })
    })
  })


  describe("Query: to", function() {
    it("to - string as query", done => {
      chai.request(app)
        .get(URL + toQ + "this is a string")
        .end((err, resp) => {
          resp.should.have.status(400)
          done()
        })
    })

    it("to - out of bounds lower", done => {
      chai.request(app)
        .get(URL + toQ + -200)
        .end((err, resp) => {
          resp.should.have.status(200)
          resp.body[resp.body.length - 1].year.should.eql(FOSSIL_DATA.lastRecord)
          resp.body[resp.body.length - 1].polluters.should.be.a("array")
          
          done()
        })
    })

    it("to - out of bounds upper", done => {
      chai.request(app)
        .get(URL + toQ + 4300)
        .end((err, resp) => {
          resp.should.have.status(200)
          resp.body[resp.body.length - 1].year.should.eql(FOSSIL_DATA.lastRecord)
          resp.body[resp.body.length - 1].polluters.should.be.a("array")
          
          done()
        })
    })

    
    it("to - empty", done => {
      chai.request(app)
        .get(URL + toQ + 4300)
        .end((err, resp) => {
          resp.should.have.status(200)
          resp.body[resp.body.length - 1].year.should.eql(FOSSIL_DATA.lastRecord)
          resp.body[resp.body.length - 1].polluters.should.be.a("array")
          
          done()
        })
    })
  })


  describe("Query: type", function() {
    Object.values(FOSSIL_DATA.knownTypes).forEach(type => {
      it("type - " + type, done => {
        chai.request(app)
          .get(URL + typeQ + type)
          .end((err, resp) => {
            resp.body[0].year.should.eql(FOSSIL_DATA.firstRecord)
            resp.body[0].polluters.should.be.a("array")
            resp.body[resp.body.length - 1].year.should.eql(FOSSIL_DATA.lastRecord)
            resp.body[resp.body.length - 1].polluters.should.a("array")

            done()
          })
      })
    })

    it("type - " + "total lower case", done => {
      chai.request(app)
        .get(URL + typeQ + "total")
        .end((err, resp) => {
          resp.body[0].year.should.eql(FOSSIL_DATA.firstRecord)
          resp.body[0].polluters.should.be.a("array")
          resp.body[resp.body.length - 1].year.should.eql(FOSSIL_DATA.lastRecord)
          resp.body[resp.body.length - 1].polluters.should.a("array")

          done()
        })
    })

    it("type - " + "CEMENT upper case", done => {
      chai.request(app)
        .get(URL + typeQ + "CEMENT")
        .end((err, resp) => {
          resp.body[0].year.should.eql(FOSSIL_DATA.firstRecord)
          resp.body[0].polluters.should.be.a("array")
          resp.body[resp.body.length - 1].year.should.eql(FOSSIL_DATA.lastRecord)
          resp.body[resp.body.length - 1].polluters.should.a("array")

          done()
        })
    })

    it("type - " + "empty", done => {
      chai.request(app)
        .get(URL + typeQ + "")
        .end((err, resp) => {
          resp.body[0].year.should.eql(FOSSIL_DATA.firstRecord)
          resp.body[0].polluters.should.be.a("array")
          resp.body[resp.body.length - 1].year.should.eql(FOSSIL_DATA.lastRecord)
          resp.body[resp.body.length - 1].polluters.should.a("array")

          done()
        })
    })

    it("type - " + "Wrong type", done => {
      chai.request(app)
        .get(URL + typeQ + "fasdihfapsdf")
        .end((err, resp) => {
          resp.status.should.eql(400)
          done()
        })
    })
  })

  describe("Query: top", function() {
    it("top - 2", done => {
      chai.request(app)
      .get(URL + topQ + 2)
      .end((err, resp) => {
        resp.status.should.eql(200)
        resp.body[0].year.should.eql(FOSSIL_DATA.firstRecord)
        resp.body[resp.body.length - 1].year.should.eql(FOSSIL_DATA.lastRecord)

        for(let year of resp.body) {
          year.polluters.length.should.be.oneOf([1,2])
        }

        done()
      })
    })

    it("top - negative number", done => {
      chai.request(app)
      .get(URL + topQ + -5)
      .end((err, resp) => {
        resp.status.should.eql(400)
        
        done()
      })
    })

    it("top - zero", done => {
      chai.request(app)
      .get(URL + topQ + -5)
      .end((err, resp) => {
        resp.status.should.eql(400)
        
        done()
      })
    })
  })

  describe("Multiple query parameters", function() {
    it("from + top - same year", done => {
      chai.request(app)
      .get(URL + fromQ + "1950&" + toQ + "1950")
      .end((err, resp) => {
        resp.status.should.eql(200)
        resp.body.length.should.eql(1)
        resp.body[0].year.should.eql(1950)
        
        done()
      })
    })

    it("Assigment exaple API call - from 2000, to 2015, type cement & top 10", done => {
      chai.request(app)
      .get(URL + fromQ + "2000&" + toQ + "2015&" + typeQ + "cement&" + topQ + "10")
      .end((err, resp) => {
        resp.status.should.eql(200)
        resp.body.length.should.eql(15)
        resp.body[0].year.should.eql(2000)
        resp.body[resp.body.length - 1].year.should.eql(2014)
        
        for(let year of resp.body) {
          year.polluters.length.should.be.within(1,10)
        }

        done()
      })
    })

    it("Assigment exaple API call - from 2011, type Total & top 5", done => {
      chai.request(app)
      .get(URL + fromQ + "2011&" + typeQ + "Total&" + topQ + "5")
      .end((err, resp) => {
        resp.status.should.eql(200)
        resp.body.length.should.eql(4)
        resp.body[0].year.should.eql(2011)
        resp.body[resp.body.length - 1].year.should.eql(2014)
        
        for(let year of resp.body) {
          year.polluters.length.should.be.within(1,5)
        }

        done()
      })
    })
  
  })
})


after(() => process.exit())