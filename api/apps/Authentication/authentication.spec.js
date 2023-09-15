const mssql = require('mssql')
const { userRegistrationController } = require('./authenticationController')

// User registration tests
describe('User Registration Tests', () => {
    // Test 1: Checking if all fields are filled
    it('Checking if all fields are filled', async () => {
        const req = {}

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        }

        await userRegistrationController(req, res)

        expect(res.status).toHaveBeenCalledWith(400)
        expect(res.json).toHaveBeenCalledWith({ 
            message: 'All fields are required' 
        })
    })

})