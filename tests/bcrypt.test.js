require('dotenv').config()
const { client } = require('../modules/mongo_connection')
const bcrypt = require('bcrypt')

beforeAll(async () => {
    await client.connect()
})
test("B-crypt test", async (done) => {
    const email = "anandparmar967@gmail.com"
    const password = "test"
    const users = client.db(process.env.DB_NAME).collection('users')

    users.findOne({ "email": email }, async (err, result) => {
        if (err) done(err)
        else {
            try {
                expect(result).not.toBe(undefined)
                expect(result.email).toBe(email)
                expect(await bcrypt.compare(password, result.password)).toBe(true)
                done()
            }
            catch (err) {
                done(err)
            }
        }
    })
})