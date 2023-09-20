const mssql = require('mssql')
const { v4 } = require('uuid');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { userRegistrationController } = require('./authenticationController');

// User registration tests
describe('User Registration Tests', () => {
    afterEach(()=>{
        jest.clearAllMocks()
    })
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

    // Test 4: Cheking if it raises an error if user already exists
    it("Should return an error if user already exists", async () => {
        const req = {
            body: {
                email: 'itsregalobin47@gmail.com',
                username: 'itsregalo',
                full_name: 'Gift',
                password: 'Gift1234',
                repeat_password: 'Gift1234'
            }
        }

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        }

        jest.spyOn(mssql, 'connect').mockResolvedValueOnce({
            request: jest.fn().mockReturnThis(),
            input: jest.fn().mockReturnThis(),
            execute: jest.fn().mockResolvedValueOnce({
                rowsAffected: [1]
            })
        })

        await userRegistrationController(req, res)

        expect(res.status).toHaveBeenCalledWith(400)
        expect(res.json).toHaveBeenCalledWith({message:"User already exists"})
    })
    
    // Test 5: Should return a success message if user is created
    it("Should return a success message if user is created", async () => {
        const req = {
            body: {
                email: 'itsregalobin47@gmail.com',
                username: 'itsregalo',
                full_name: 'Gift',
                password: 'Gift1234',
                repeat_password: 'Gift1234'
            }
        }

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        }

        jest.spyOn(mssql, 'connect').mockResolvedValueOnce({
            request: jest.fn().mockReturnThis(),
            input: jest.fn().mockReturnThis(),
            execute: jest.fn().mockResolvedValueOnce({
                rowsAffected: [0]
            })
        })

        jest.spyOn(bcrypt, 'hash').mockResolvedValueOnce('hashedPassword')

        await userRegistrationController(req, res)

        expect(res.status).toHaveBeenCalledWith(201)
        expect(res.json).toHaveBeenCalledWith({
            token: expect.any(String),
            user: expect.any(Object),
            message:"User created successfully"})
        })
})