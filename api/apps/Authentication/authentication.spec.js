const mssql = require('mssql')
const { v4 } = require('uuid');
const { userRegistrationController } = require('./authenticationController');

// User registration tests
describe('User Registration Tests', () => {
    // Test 1: Checking if all fields are filled
    it('Checking if all fields are filled', async () => {
        const req = {
            body: {
                email: '',
                username: '',
                full_name: '',
                password: '',
                repeat_password: ''
            }
        }

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

    // Test 2: Checking if it raises an error if the passwords do not match
    it("Should return an error if the passwords do not match", async () => {
        const req = {
            body: {
                email: 'itsregalobin47@gmail.com',
                username: 'itsregalo',
                full_name: 'Gift',
                password: 'Gift11',
                repeat_password: 'Gift12'
            }
        }

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        }

        await userRegistrationController(req, res)

        expect(res.status).toHaveBeenCalledWith(400)
        expect(res.json).toHaveBeenCalledWith({message:"Passwords do not match"})
    })

    // Test 3: Checking if it raises an error if the password is less than 6 characters
    it("Should return an error if the password is less than 6 characters", async () => {
        const req = {
            body: {
                email: 'itsregalobin47@gmail.com',
                username: 'itsregalo',
                full_name: 'Gift',
                password: 'Gift1',
                repeat_password: 'Gift1'
            }
        }

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        }

        await userRegistrationController(req, res)

        expect(res.status).toHaveBeenCalledWith(400)
        expect(res.json).toHaveBeenCalledWith({error:"Password must be at least 6 characters long"})

    })

})