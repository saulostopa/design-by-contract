"use strict"

// This is the Pact test for the s2pro-application 

const { pactWith } = require("jest-pact")

// Load the consumer client code which we will call in our test
const { getMeDogs, getMeDog } = require("../s2pro-application")

pactWith({ consumer: "s2pro-application", provider: "s2pro-provider" }, provider => {
  // This is the body we expect to get back from the provider
  const EXPECTED_BODY = [
    {
      dog: 1,
    },
    {
      dog: 2,
    },
  ]

  describe("get /dogs", () => {
    beforeEach(() => {
      // First we setup the expected interactions that should occur during the test
      const interaction = {
        state: "i have a list of dogs",
        uponReceiving: "a request for all dogs",
        withRequest: {
          method: "GET",
          path: "/dogs",
          headers: {
            Accept: "application/json",
          },
        },
        willRespondWith: {
          status: 200,
          headers: {
            "Content-Type": "application/json",
          },
          body: EXPECTED_BODY,
        },
      }
      
      return provider.addInteraction(interaction)
    })

    it("returns the correct response", () => {
      // We call our consumer code, and that will make requests to the mock server
      getMeDogs(provider.mockService.baseUrl).then(response => {
        return expect(response.data).toEqual(EXPECTED_BODY)
      })
    })
  })

  describe("get /dog/1", () => {
    beforeEach(() => {
      const interaction = {
        state: "i have a list of dogs",
        uponReceiving: "a request for a single dog",
        withRequest: {
          method: "GET",
          path: "/dogs/1",
          headers: {
            Accept: "application/json",
          },
        },
        willRespondWith: {
          status: 200,
          headers: {
            "Content-Type": "application/json",
          },
          body: EXPECTED_BODY,
        },
      }

      return provider.addInteraction(interaction)
    })

    it("returns the correct response", () => {
      getMeDog(provider.mockService.baseUrl).then(response => {
        return expect(response.data).toEqual(EXPECTED_BODY)
      })
    })
  })
})
