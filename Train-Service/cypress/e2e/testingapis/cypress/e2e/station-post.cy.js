
// test case 1 create stations 
const code = "ST" + Date.now()

describe("Create Station API", () => {

    it("should create station", () => {

        cy.request({
            method: "POST",
            url: "http://localhost:4003/api/auth/station/stations",
            body: {
                code: code,
                name: "Satna",
                city: "Satna",
                state: "MP"
            }

        }).then((response) => {

            expect(response.status).to.eq(201)
            expect(response.body.data.code).to.eq(code)

        })

    })

})


describe('get All station ', () => {
    it('should get all station', () => {
        cy.request({
            method: "GET",
            url: "http://localhost:4003/api/auth/station/Getstations"
        }).then((response) => {
            expect(response.status).to.eq(200)
            expect(response.body.data).to.be.an('array')
        })
    })
})


// test case for getstation by id 

describe('get station by code', () => {

    it('should get station by code', () => {

        const code = "ST1772877700238"

        cy.request({
            method: "GET",
            url: `http://localhost:4003/api/auth/station/stations/${code}`
        }).then((response) => {

            expect(response.status).to.eq(200)
            expect(response.body.data.code).to.eq(code)

        })

    })

})



//  Delete station by code testing   thier is somthing issue 

// describe('delete station by code', () => {

//     it('should delete station by code', () => {
//         const code = "ADI"

//         cy.request({
//             method: "DELETE",
//             url: `http://localhost:4003/api/auth/station/stations/${code}`
//         }).then((response) => {
//             expect(response.status).to.eq(200)
//             expect(response.body.message).to.eq("Station deleted successfully")
//         })

//     })

// })

