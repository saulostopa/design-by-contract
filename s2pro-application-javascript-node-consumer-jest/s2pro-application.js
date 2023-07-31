"use strict"

const axios = require("axios")

// This is an example consumer that accesses the s2pro-provider via HTTP
// TODO: replace these functions with your actual ones
 
// Gets multiple entries from the s2pro-provider
exports.getMeDogs = endpoint => {
  return axios.request({
    method: "GET",
    baseURL: endpoint,
    url: "/dogs",
    headers: { Accept: "application/json" },
  })
}

// Gets a single entry by ID from the s2pro-provider
exports.getMeDog = endpoint => {
  return axios.request({
    method: "GET",
    baseURL: endpoint,
    url: "/dogs/1",
    headers: { Accept: "application/json" },
  })
}
