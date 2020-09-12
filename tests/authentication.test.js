const server = require('../index')
const express = require('express')

test("Auth test", () => {
    expect(server).toBe(express())
})