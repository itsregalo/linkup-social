const mssql = require("mssql")
const { getAllPostsController, getActivePostsController, getUserPostsController } = require("./postsController")

jest.mock("mssql")

const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn()
}

// Test 1: Testing that the posts are returned
describe("Posts Controller Tests", () => {
    describe("Testing Get Posts Tests", ()=> {
        it("Should return a list of posts", async() => {
            const post_list = [
                {
                    "id": "05688617-c838-4b23-9a96-0f8a4bc56a2f",
                    "user_id": "a396e20a-0e4a-49d6-9f72-5533a53a4a0b",
                    "picture": null,
                    "content": "@itsregalo1 should know all be The one in charge now is it 1",
                    "category_id": "c2f9453b-3731-4a12-a38d-8259d2e583de",
                    "post_date": "2023-09-11T16:59:51.843Z",
                    "updated_at": null,
                    "is_deleted": false
                },
                {
                    "id": "072be71a-36b1-464d-864e-1ae41b485574",
                    "user_id": "58c323b4-0ff6-45b1-9071-52f9b8d1e279",
                    "picture": "",
                    "content": "What is wrong with Kai",
                    "category_id": "c2f9453b-3731-4a12-a38d-8259d2e583de",
                    "post_date": "2023-09-13T12:08:49.860Z",
                    "updated_at": null,
                    "is_deleted": false
                }
            ]

            const req = {}

            // act
            jest.spyOn(mssql, "connect").mockReturnValueOnce({
                request: jest.fn().mockReturnThis(),
                execute: jest.fn().mockResolvedValueOnce({
                    recordset: post_list
                })
            })

            await getAllPostsController(req, res)

            // assert
            expect(res.status).toHaveBeenCalledWith(200)
            expect(res.json).toHaveBeenCalledWith({
                posts: post_list
            })
        })

        it("Should return an error if the database connection fails", async() => {
            const req = {}

            // act
            jest.spyOn(mssql, "connect").mockReturnValueOnce({
                request: jest.fn().mockReturnThis(),
                execute: jest.fn().mockRejectedValueOnce(new Error("Connection Failed"))
            })

            await getAllPostsController(req, res)

            // assert
            expect(res.status).toHaveBeenCalledWith(500)
            expect(res.json).toHaveBeenCalledWith({
                error: "Connection Failed"
            })
        })
    })

    describe("Getting active posts", () => {
        it("Should return a list of posts", async() => {
            const post_list = [
                {
                    "id": "05688617-c838-4b23-9a96-0f8a4bc56a2f",
                    "user_id": "a396e20a-0e4a-49d6-9f72-5533a53a4a0b",
                    "picture": null,
                    "content": "@itsregalo1 should know all be The one in charge now is it 1",
                    "category_id": "c2f9453b-3731-4a12-a38d-8259d2e583de",
                    "post_date": "2023-09-11T16:59:51.843Z",
                    "updated_at": null,
                    "is_deleted": false
                },
                {
                    "id": "072be71a-36b1-464d-864e-1ae41b485574",
                    "user_id": "58c323b4-0ff6-45b1-9071-52f9b8d1e279",
                    "picture": "",
                    "content": "What is wrong with Kai",
                    "category_id": "c2f9453b-3731-4a12-a38d-8259d2e583de",
                    "post_date": "2023-09-13T12:08:49.860Z",
                    "updated_at": null,
                    "is_deleted": false
                }
            ]

            const req = {}

            // act
            jest.spyOn(mssql, "connect").mockReturnValueOnce({
                request: jest.fn().mockReturnThis(),
                execute: jest.fn().mockResolvedValueOnce({
                    recordset: post_list
                })
            })

            await getActivePostsController(req, res)

            // assert
            expect(res.status).toHaveBeenCalledWith(200)
            expect(res.json).toHaveBeenCalledWith({
                posts: post_list
            })
        })

        it("Should return an error if the database connection fails", async() => {
            const req = {}

            // act
            jest.spyOn(mssql, "connect").mockReturnValueOnce({
                request: jest.fn().mockReturnThis(),
                execute: jest.fn().mockRejectedValueOnce(new Error("Connection Failed"))
            })

            await getActivePostsController(req, res)

            // assert
            expect(res.status).toHaveBeenCalledWith(500)
            expect(res.json).toHaveBeenCalledWith({
                error: "Connection Failed"
            })
        })
    })

    describe("Getting a specific User posts controller", () =>{
        it('Should return a 404 if the user does not exist', async() => {

            mssql.connect.mockResolvedValueOnce({
                request: jest.fn().mockResolvedValueOnce({
                  recordset: [], // Simulate no user found
                }),
            });

            const req = {
                params: {
                    id: "a396e20a-0e4a-49d6-9f72-5533a53a4a0b"
                }
            }

            await getUserPostsController(req, res)

            // expect(res.status).toHaveBeenCalledWith(404)
            expect(res.json).toHaveBeenCalledWith({
                message: "User not found"
            })

        })
    })

})