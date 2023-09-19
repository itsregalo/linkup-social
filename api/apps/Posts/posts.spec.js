const mssql = require("mssql")
const { getAllPostsController, getActivePostsController, getUserPostsController, createPostController, updatePostController, deletePostController, likeUnlikePostController, getPostComments } = require("./postsController")

jest.mock("mssql")

const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn()
}

// Test 1: Testing that the posts are returned
describe("Posts Controller Tests", () => {
    afterEach(() => {
        jest.clearAllMocks()
    })
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
        afterEach(() => {
            jest.clearAllMocks()
        })
        it('Should return a 404 if the user does not exist', async() => {

           const req = {
                params: {
                    id: "a396e20a-0e4a-49d6-9f72-5533a53a4a0b"
                }
            }

            jest.spyOn(mssql, 'connect').mockResolvedValueOnce({
                request: jest.fn().mockReturnThis(),
                input: jest.fn().mockReturnThis(),
                execute: jest.fn().mockResolvedValueOnce({
                    recordset: []
                })
            })

            await getUserPostsController(req, res)

            expect(res.status).toHaveBeenCalledWith(404)
            expect(res.json).toHaveBeenCalledWith({
                message: "User not found"
            })

        })

        it('Should return a list of posts', async() => {
            const user_posts = [
                {
                    "id": "5fdeb4bc-dcd7-4fc3-bf83-4751321b9251",
                    "user_id": "0dceaaad-20ef-4e33-a9c1-b6d7377de811",
                    "picture": null,
                    "content": "A new post here",
                    "category_id": "c2f9453b-3731-4a12-a38d-8259d2e583de",
                    "post_date": "2023-09-18T16:52:59.310Z",
                    "updated_at": "2023-09-18T16:53:11.860Z",
                    "is_deleted": false
                },
                {
                    "id": "fba4e447-484b-4bfa-90f8-52563630e33a",
                    "user_id": "0dceaaad-20ef-4e33-a9c1-b6d7377de811",
                    "picture": null,
                    "content": "A new movie here Will display",
                    "category_id": "c2f9453b-3731-4a12-a38d-8259d2e583de",
                    "post_date": "2023-09-18T16:53:41.323Z",
                    "updated_at": "2023-09-18T16:54:07.737Z",
                    "is_deleted": false
                }
            ]

            const req = {
                params: {
                    id: "0dceaaad-20ef-4e33-a9c1-b6d7377de811"
                }
            }

            jest.spyOn(mssql, 'connect').mockResolvedValueOnce({
                request: jest.fn().mockReturnThis(),
                input: jest.fn().mockReturnThis(),
                execute: jest.fn().mockResolvedValueOnce({
                    recordset: user_posts
                })
            })

            await getUserPostsController(req, res)

            expect(res.status).toHaveBeenCalledWith(200)
            // expect(res.json).toHaveBeenCalledWith({
            //     posts: user_posts
            // })
        })
    })

    describe("Creating a Oist Controller", () => {
        it("Should create an error if post's content is not provided", async() => {
            const req = {
                body: {
                    content: "",
                },
                user: {
                    id: "0dceaaad-20ef-4e33-a9c1-b6d7377de811"
                }
            }

            await createPostController(req, res)

            expect(res.status).toHaveBeenCalledWith(400)
            expect(res.json).toHaveBeenCalledWith({
                message: "Content is required"
            })      
        });

        it("Should create a post if all the required fields are provided", async() => {
            const content_body = {
                content: "A new post here",
                category_id: "c2f9453b-3731-4a12-a38d-8259d2e583de",
                picture: null
            } 
            
            const req = {
                body: content_body,
                user: {
                    id: "0dceaaad-20ef-4e33-a9c1-b6d7377de811"
                }
            }

            jest.spyOn(mssql, 'connect').mockResolvedValueOnce({
                request: jest.fn().mockReturnThis(),
                input: jest.fn().mockReturnThis(),
                execute: jest.fn().mockResolvedValueOnce({
                    rowsAffected: [1],
                    recordset: [
                        content_body
                    ]

                })
            })

            await createPostController(req, res)

            expect(res.status).toHaveBeenCalledWith(201)
            expect(res.json).toHaveBeenCalledWith({
                message: "Post created successfully"
            })
        })
    })

    describe("Updating a Post Controller", () => {
      
        it("Return an error if the post does not exist", async() => {
            const req = {
                params: {
                    id: "5fdeb4bc-dcd7-4fc3-bf83-4751321b9251"
                },
                body: {
                    content: "A new post here",
                    category_id: "c2f9453b-3731-4a12-a38d-8259d2e583de",
                    picture: null
                },
                user: {
                    id: "0dceaaad-20ef-4e33-a9c1-b6d7377de811"
                }
            }

            jest.spyOn(mssql, 'connect').mockResolvedValueOnce({
                request: jest.fn().mockReturnThis(),
                input: jest.fn().mockReturnThis(),
                execute: jest.fn().mockResolvedValueOnce({
                    rowsAffected: [0],
                    recordset: []
                })
            })

            await updatePostController(req, res)

            expect(res.status).toHaveBeenCalledWith(404)
            expect(res.json).toHaveBeenCalledWith({
                message: "Post not found"
            })
        })

        it("Should return an error if the user is not the owner of the post", async() => {
            const req = {
                params: {
                    id: "5fdeb4bc-dcd7-4fc3-bf83-4751321b9251"
                },
                body: {
                    content: "A new post here",
                    category_id: "c2f9453b-3731-4a12-a38d-8259d2e583de",
                    picture: null
                },
                user: {
                    id: "0dceaaad-20ef-4e33-a9c1-b6d7377de811"
                }
            }

            jest.spyOn(mssql, 'connect').mockResolvedValueOnce({
                request: jest.fn().mockReturnThis(),
                input: jest.fn().mockReturnThis(),
                execute: jest.fn().mockResolvedValueOnce({
                    rowsAffected: [1],
                    recordset: [
                        {
                            user_id: "a396e20a-0e4a-49d6-9f72-5533a53a4a0b"
                        }
                    ]
                })
            })

            await updatePostController(req, res)

            expect(res.status).toHaveBeenCalledWith(401)
            expect(res.json).toHaveBeenCalledWith({
                message: "You cannot update this post!"
            })
        })

        /**
         * it("Should update the post if everything is correct", async() => {
            const post_id = "5fdeb4bc-dcd7-4fc3-bf83-4751321b9251"
            const post_body = {
                content: "A new post here",
                user_id: "0dceaaad-20ef-4e33-a9c1-b6d7377de811",
                category_id: "c2f9453b-3731-4a12-a38d-8259d2e583de",
                picture: null
            }

            const req = {
                params: {
                    id: post_id
                },
                body: post_body,
                user: {
                    id: "0dceaaad-20ef-4e33-a9c1-b6d7377de811"
                }
            }

            jest.spyOn(mssql, 'connect').mockResolvedValueOnce({
                request: jest.fn().mockReturnThis(),
                input: jest.fn().mockReturnThis(),
                execute: jest.fn().mockResolvedValueOnce({
                    rowsAffected: [1],
                    recordset: [post_body]
                })

            })

            // second call
            jest.spyOn(mssql, 'connect').mockResolvedValueOnce({
                request: jest.fn().mockReturnThis(),
                input: jest.fn().mockReturnThis(),
                execute: jest.fn().mockResolvedValueOnce({
                    recordset: [post_body]
                })
            })

            await updatePostController(req, res)

            expect(res.status).toHaveBeenCalledWith(200)
            expect(res.json).toHaveBeenCalledWith({
                message: "Post updated successfully"
            })
        })
         */
        
    })


    describe("Deleting a Post Controller", () => {
        afterEach(() => {
            jest.clearAllMocks()
        })
        const post_id = "5fdeb4bc-dcd7-4fc3-bf83-4751321b9251"
        
        it("should return post not found if the post does not exist", async() => {
            const req = {
                params: {
                    id: post_id
                },
                user: {
                    id: "0dceaaad-20ef-4e33-a9c1-b6d7377de811"
                }
            }

            jest.spyOn(mssql, 'connect').mockResolvedValueOnce({
                request: jest.fn().mockReturnThis(),
                input: jest.fn().mockReturnThis(),
                execute: jest.fn().mockResolvedValueOnce({
                    rowsAffected: [0],
                    recordset: []
                })
            })

            await deletePostController(req, res)

            expect(res.status).toHaveBeenCalledWith(404)
            expect(res.json).toHaveBeenCalledWith({
                message: "Post not found"
            })
        })

        it("Should return an error if the user is not the owner of the post", async() => {
            const req = {
                params: {
                    id: post_id
                },
                user: {
                    id: "0dceaaad-20ef-4e33-a9c1-b6d7377de811"
                }
            }

            jest.spyOn(mssql, 'connect').mockResolvedValueOnce({
                request: jest.fn().mockReturnThis(),
                input: jest.fn().mockReturnThis(),
                execute: jest.fn().mockResolvedValueOnce({
                    rowsAffected: [1],
                    recordset: [
                        {
                            user_id: "a396e20a-0e4a-49d6-9f72-5533a53a4a0b"
                        }
                    ]
                })
            })

            await deletePostController(req, res)

            expect(res.status).toHaveBeenCalledWith(401)
            expect(res.json).toHaveBeenCalledWith({
                message: "You cannot delete this post!"
            })
        })

        it("Should delete the post if everything is correct", async() => {
            const req = {
                params: {
                    id: post_id
                },
                user: {
                    id: "0dceaaad-20ef-4e33-a9c1-b6d7377de811"
                }
            }

            jest.spyOn(mssql, 'connect').mockResolvedValueOnce({
                request: jest.fn().mockReturnThis(),
                input: jest.fn().mockReturnThis(),
                execute: jest.fn().mockResolvedValueOnce({
                    rowsAffected: [1],
                    recordset: [
                        {
                            user_id: "0dceaaad-20ef-4e33-a9c1-b6d7377de811"
                        }
                    ]
                })
            })

            await deletePostController(req, res)

            // expect(res.status).toHaveBeenCalledWith(200)
            expect(res.json).toHaveBeenCalledWith({
                message: "Post deleted successfully"
            })
        })

    })

    describe("Liking and Unliking a Post", () => { 
        it("Should return an error if the post does not exist", async() => {
            const req = {
                params: {
                    id: "5fdeb4bc-dcd7-4fc3-bf83-4751321b9251"
                },
                user: {
                    id: "0dceaaad-20ef-4e33-a9c1-b6d7377de811"
                }
            }

            jest.spyOn(mssql, 'connect').mockResolvedValueOnce({
                request: jest.fn().mockReturnThis(),
                input: jest.fn().mockReturnThis(),
                execute: jest.fn().mockResolvedValueOnce({
                    recordset: []
                })
            })

            await likeUnlikePostController(req, res)

            expect(res.status).toHaveBeenCalledWith(404)
            expect(res.json).toHaveBeenCalledWith({
                message: "Post not found"
            })
        })

        it("Should Unlike the post if the user has liked it", async() => {
            const req = {
                params: {
                    id: "5fdeb4bc-dcd7-4fc3-bf83-4751321b9251"
                },
                user: {
                    id: "0dceaaad-20ef-4e33-a9c1-b6d7377de811"
                }
            }

            jest.spyOn(mssql, 'connect').mockResolvedValueOnce({ // second call: like the post
                request: jest.fn().mockReturnThis(),
                input: jest.fn().mockReturnThis(),
                execute: jest.fn().mockResolvedValue({ // like the post
                    rowsAffected: [1]
                })
            })

            await likeUnlikePostController(req, res)

            expect(res.status).toHaveBeenCalledWith(200)
            expect(res.json).toHaveBeenCalledWith({
                message: "Post unliked successfully"
            })

        })

        it("Should Like the post if the user has not liked it", async() => {
            const req = {
                params: {
                    id: "5fdeb4bc-dcd7-4fc3-bf83-4751321b9251"
                },
                user: {
                    id: "0dceaaad-20ef-4e33-a9c1-b6d7377de811"
                }
            }

            jest.spyOn(mssql, 'connect').mockResolvedValueOnce({ // first call: unlike the post
                request: jest.fn().mockReturnThis(),
                input: jest.fn().mockReturnThis(),
                execute: jest.fn().mockResolvedValue({ // unlike the post
                    rowsAffected: [1],
                    recordset: [1]
                })
            })

            jest.spyOn(mssql, 'connect').mockResolvedValueOnce({ // second call: like the post
                request: jest.fn().mockReturnThis(),
                input: jest.fn().mockReturnThis(),
                execute: jest.fn().mockResolvedValue({ // like the post
                    rowsAffected: [1]
                })
            })


            await likeUnlikePostController(req, res)

            // // expect(res.status).toHaveBeenCalledWith(200)
            // expect(res.json).toHaveBeenCalledWith({
            //     message: "Post unliked successfully"
            // })

        })
    })

    describe("Getting posts Comments", () => {
        it("Should return an error if the post does not exist", async() => {
            const req = {
                params: {
                    id: "5fdeb4bc-dcd7-4fc3-bf83-4751321b9251"
                }
            }

            jest.spyOn(mssql, 'connect').mockResolvedValueOnce({ // first call: unlike the post
                request: jest.fn().mockReturnThis(),
                input: jest.fn().mockReturnThis(),
                execute: jest.fn().mockResolvedValue({ // unlike the post
                    rowsAffected: [0],
                    recordset: []
                })
            })

            await getPostComments(req, res)

            expect(res.status).toHaveBeenCalledWith(404)
            expect(res.json).toHaveBeenCalledWith({
                message: "Post not found"
            })
        })
    })




})