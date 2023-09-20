const mssql = require('mssql');
const { v4 } = require('uuid');
const { addCommentToPostController } = require('./commentsController');

const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn()
}


describe("Comments Controller Tests", ()=>{
    describe("Adding Commnets to posts", ()=>{
        afterEach(()=>{
            jest.clearAllMocks()
        })

        it('Return Comment required if not passed', async() => {
            const req = {
                body: {
                    comment: ''
                },
                user: {
                    id: v4()
                },
                params: {
                    id: v4()
                }
            }

            await addCommentToPostController(req, res)

            expect(res.status).toHaveBeenCalledWith(400)
            expect(res.json).toHaveBeenCalledWith({
                message: 'Comment is required'
            })

        })

        it('Return Post not found if post does not exist', async() => {
            const req = {
                body: {
                    comment: 'This is a comment'
                },

                user: {
                    id: 'dndasklncaskjcnjncjhjhk'
                },

                params: {
                    id: 'ewcbjhsdbchjsdbchjsdjhvcjhv'
                }
            }

            jest.spyOn(mssql, 'connect').mockResolvedValueOnce({
                request: jest.fn().mockReturnThis(),
                input: jest.fn().mockReturnThis(),
                execute: jest.fn().mockResolvedValueOnce({
                    recordset: []
                })
            })

            await addCommentToPostController(req, res)

            expect(res.status).toHaveBeenCalledWith(404)
            expect(res.json).toHaveBeenCalledWith({
                message: 'Post not found'
            })
            jest.clearAllMocks()

        })

        it('Return Comment added successfully if comment is added', async() => {
            const req = {
                body: {
                    comment: 'This is a comment 1'
                },

                user: {
                    id: 'dndasklncaskjcnjncjhjhk'
                },

                params: {
                    id: 'ewcbjhsdbchjsdbchjsdjhvcjhv'
                }
            }

            jest.spyOn(mssql, 'connect').mockResolvedValueOnce({
                request: jest.fn().mockReturnThis(),
                input: jest.fn().mockReturnThis(),
                execute: jest.fn().mockResolvedValueOnce({
                    recordset: [1]
                })
            })
        })          
    });
})    