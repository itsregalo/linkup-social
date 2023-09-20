const mssql = require('mssql');
const { updateUserProfileController } = require('./profileController');

jest.mock('mssql')

describe("Profile Controller Tests", () => {
    describe("updateUserProfileController", () => {
        it('Should return access denied if user does not own a profile',  async() => {
            const req = {
                user: {
                    id: 'some_id_generated_by_gift'
                },
                params: {
                    id: 'another_id_generated_by_gift'
                }
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            const pool = {
                request: jest.fn().mockReturnThis(),
                execute: jest.fn().mockReturnValue({
                    recordset: []
                })
            };
            mssql.connect = jest.fn().mockResolvedValue(pool);
            await updateUserProfileController(req, res);

            expect(res.status).toHaveBeenCalledWith(403);
            expect(res.json).toHaveBeenCalledWith({
                message: "Access denied"
            });
            
        });

        it('Should return user does not exist if user does not exist',  async() => {
            const req = {
                user: {
                    id: 'some_id_generated_by_gift'
                },
                params: {
                    id: 'some_id_generated_by_gift'
                }
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            
            const pool = {
                request: jest.fn().mockReturnThis(),
                input: jest.fn().mockReturnThis(),
                execute: jest.fn().mockReturnValue({
                    recordset: []
                })
            };

           jest.spyOn(mssql, 'connect').mockResolvedValue(pool);

            await updateUserProfileController(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                message: "User does not exist"
            });
        });

        it('Should return user updated successfully if user is updated successfully',  async() => {
            const profile_update = 
                {
                    "username": "itsregaloUp",
                    "full_name": "GiftM",
                    "location": "Mwatate",
                    "bio": "Space Cadate 56",
                    "profile_picture": null,
                    "background_picture": null
                }
            const req = {
                user: {
                    id: 'some_id_generated_by_gift'
                },
                params: {
                    id: 'some_id_generated_by_gift'
                },

                body: profile_update
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            const pool = {
                request: jest.fn().mockReturnThis(),
                input: jest.fn().mockReturnThis(),
                execute: jest.fn().mockReturnValue({
                    recordset: [profile_update]
                })
            };

            jest.spyOn(mssql, 'connect').mockResolvedValue(pool);

            await updateUserProfileController(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                message: "User profile updated successfully"
            });
        });

        it('Should return error if error occurs',  async() => {
            const req = {
                user: {
                    id: 'some_id_generated_by_gift'
                },
                params: {
                    id: 'some_id_generated_by_gift'
                }
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            
            const pool = {
                request: jest.fn().mockReturnThis(),
                input: jest.fn().mockReturnThis(),
                execute: jest.fn().mockRejectedValue(new Error('Error occurred'))
            };

            jest.spyOn(mssql, 'connect').mockResolvedValue(pool);

            await updateUserProfileController(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                error: "Error occurred"
            });
        });
    });
    
});