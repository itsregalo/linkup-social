const mssql = require("mssql")
const { v4 } = require("uuid");
const { getUserFollowersController, getUserFollowingController } = require("./followersController");

const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn()
}

describe("Followers Tests", () => {
    afterEach(() => {
        jest.clearAllMocks()
    })
    describe("Get User Followers Tests", () => {
        
        it('Should return 404 if the user does not exist', async () => {
            const req = {
                params: {
                    id: v4()
                }
            }

            jest.spyOn(mssql, 'connect').mockResolvedValueOnce({
                request: jest.fn().mockReturnThis(),
                input: jest.fn().mockReturnThis(),
                execute: jest.fn().mockResolvedValueOnce({
                    recordset: []
                })
            })

            await getUserFollowersController(req, res)

            expect(res.status).toHaveBeenCalledWith(404)
            expect(res.json).toHaveBeenCalledWith({
                message: 'User not found'
            })
        });

        it('Should return 200 with the user followers', async () => {
            const user_followers = [
                {
                    "id": "5d8f34e2-8d8b-44e6-917c-46c34f3424ea",
                    "user_id": "e0a5c0d4-0c7f-4c7c-9c9d-3a1e9aebc5e3",
                    "follower_id": "5904c930-ddbb-4a9c-af56-0090790999ab",
                    "follow_date": "2023-09-18T15:20:38.710Z",
                    "updated_at": null
                },
                {
                    "id": "c516a624-25bf-46a8-ab78-b5b3c8d08568",
                    "user_id": "e0a5c0d4-0c7f-4c7c-9c9d-3a1e9aebc5e3",
                    "follower_id": "0dceaaad-20ef-4e33-a9c1-b6d7377de811",
                    "follow_date": "2023-09-18T16:54:35.350Z",
                    "updated_at": null
                }
            ]
            
            const req = {
                params: {
                    id: 'e0a5c0d4-0c7f-4c7c-9c9d-3a1e9aebc5e3'
                },
                user: {
                    id: 'bfbbshjhcb-0c7f-4c7c-9c9d-3a1e9aebc5e3'
                }

            }

            jest.spyOn(mssql, 'connect').mockResolvedValueOnce({
                request: jest.fn().mockReturnThis(),
                input: jest.fn().mockReturnThis(),
                execute: jest.fn().mockResolvedValueOnce({
                    recordset: user_followers
                })
            })
            await getUserFollowersController(req, res)

            expect(res.status).toHaveBeenCalledWith(200)
            // expect(res.json).toHaveBeenCalledWith({
            //     user_followers: user_followers
            // })
        });

        it('Should return 500 if there is an error', async () => {
            const req = {
                params: {
                    id: v4()
                }
            }

            jest.spyOn(mssql, 'connect').mockRejectedValueOnce(new Error('Connection failed'))

            await getUserFollowersController(req, res)

            expect(res.status).toHaveBeenCalledWith(500)
            expect(res.json).toHaveBeenCalledWith({
                error: expect.any(String)
            })
        });
    })

    describe("Follow Unfollow User Tests", () => {
        it('Check If the user Exists', async() => {
            const req = {
                params: {
                    id: "ffscsjahdgweuwae"
                }
            }

            jest.spyOn(mssql, 'connect').mockResolvedValueOnce({
                request: jest.fn().mockReturnThis(),
                input: jest.fn().mockReturnThis(),
                execute: jest.fn().mockResolvedValueOnce({
                    recordset: []
                })
            })

            await getUserFollowingController(req, res)

            // expect(res.status).toHaveBeenCalledWith(404)
            // expect(res.json).toHaveBeenCalledWith({
            //     message: 'User not found'
            // })
        });

        it('Should return 200 with the user following', async () => {
            const user_following = [
                {
                    "id": "5d8f34e2-8d8b-44e6-917c-46c34f3424ea",
                    "user_id": "e0a5c0d4-0c7f-4c7c-9c9d-eerffffffff",
                    "follower_id": "bfbbshjhcb-0c7f-4c7c-9c9d-3a1e9aebc5e3",
                    "follow_date": "2023-09-18T15:20:38.710Z",
                    "updated_at": null
                },
                {
                    "id": "c516a624-25bf-46a8-ab78-b5b3c8d08568",
                    "user_id": "e0a5c0d4-0c7f-4c7c-9c9d-eerffffffff",
                    "follower_id": "bfbbshjhcb-0c7f-4c7c-9c9d-3a1e9aebc5e3",
                    "follow_date": "2023-09-18T16:54:35.350Z",
                    "updated_at": null
                }
            ]

            const req = {
                params: {
                    id: 'e0a5c0d4-0c7f-4c7c-9c9d-3a1e9aebc5e3'
                },
                user: {
                    id: 'bfbbshjhcb-0c7f-4c7c-9c9d-3a1e9aebc5e3'
                }
            }

            jest.spyOn(mssql, 'connect').mockResolvedValueOnce({
                request: jest.fn().mockReturnThis(),
                input: jest.fn().mockReturnThis(),
                execute: jest.fn().mockResolvedValueOnce({
                    recordset: user_following
                })
            })

            await getUserFollowingController(req, res)

            // expect(res.status).toHaveBeenCalledWith(200)
            // expect(res.json).toHaveBeenCalledWith({
            //     user_following: user_following
            // })
        });

    });
})