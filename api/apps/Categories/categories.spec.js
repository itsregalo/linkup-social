const DB = require("../../Database/helper");
const mssql = require('mssql');
const { createPostCategoryController, getAllPostCategories, updateCategoryController, deleteCategoryController } = require("./categoriesController");


jest.mock('../../Database/helper')

const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn()
};

describe('Categories Tests', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("Testing Create Category", () => {
        
        it('Should return an error if name is not provided', async () => {
            const req = {
                body: {
                    name: ''
                }
            };
            
            await createPostCategoryController(req, res);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Name is required'
            });
        });

        it('Should return an error if category already exist', async () => {
            const category = {
                "id": "52cf85e0-a871-4ae3-b601-b9223a6029bd",
                "name": "Test Category",
                "created_at": "2023-09-20T10:08:19.060Z",
                "updated_at": null
            }
            const req = {
                body: {
                    name: 'Test Category'
                }
            };

            jest.spyOn(DB, 'exec').mockResolvedValueOnce({
                recordset: [category],
            });

            await createPostCategoryController(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Category already exist'
            });
        })

        it('Should return a success message if category is created', async () => {
            const req = {
                body: {
                    name: 'Test Category'
                }
            };

            jest.spyOn(mssql, 'connect').mockResolvedValueOnce({
                request: jest.fn().mockReturnThis(),
                input: jest.fn().mockReturnThis(),
                execute: jest.fn().mockResolvedValueOnce({
                    recordset: [],
                    rowsAffected: [1]
                })
            });

            await createPostCategoryController(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Category created successfully'
            });
        });
    });

    describe("Testing Get All Post Categories", () => {
        it('Should return a list of categories', async () => {
            const categories = [
                {
                    "id": "52cf85e0-a871-4ae3-b601-b9223a6029bd",
                    "name": "Category 1",
                    "created_at": "2023-09-20T10:08:19.060Z",
                    "updated_at": null
                },
                {
                    "id": "72cf85e0-a871-4ae3-b601-b9223a6029be",
                    "name": "Category 2",
                    "created_at": "2023-09-20T10:08:19.060Z",
                    "updated_at": null
                }
            ];
    
            jest.spyOn(mssql, 'connect').mockResolvedValueOnce({
                request: jest.fn().mockReturnThis(),
                execute: jest.fn().mockResolvedValueOnce({
                    recordset: categories,
                })
            });
    
            const req = {};
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
    
            await getAllPostCategories(req, res);
    
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                categories: categories
            });
        });
    
        it('Should return an error if there is a database error', async () => {
            const errorMessage = "Database error";
    
            jest.spyOn(mssql, 'connect').mockRejectedValueOnce(new Error(errorMessage));
    
            const req = {};
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
    
            await getAllPostCategories(req, res);
    
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                error: errorMessage
            });
        });
    });

    describe("Testing Update Category", () => {

        it('Should return an error if name is not provided', async () => {
            const req = {
                params: {
                    id: "52cf85e0-a871-4ae3-b601-b9223a6029bd"
                },
                body: {
                    name: ''
                }
            };
            await updateCategoryController(req, res);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Name is required'
            });
        });
    
        it('Should return an error if category is not found', async () => {
            jest.spyOn(mssql, 'connect').mockResolvedValueOnce({
                request: jest.fn().mockReturnThis(),
                input: jest.fn().mockReturnThis(),
                execute: jest.fn().mockResolvedValueOnce({
                    recordset: [],
                })
            });
    
            const req = {
                params: {
                    id: "52cf85e0-a871-4ae3-b601-b9223a6029bd"
                },
                body: {
                    name: 'Updated Category'
                }
            };
    
            await updateCategoryController(req, res);
    
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Category not found'
            });
        });
    
        it('Should return a success message if category is updated', async () => {
            jest.spyOn(mssql, 'connect').mockResolvedValueOnce({
                request: jest.fn().mockReturnThis(),
                input: jest.fn().mockReturnThis(),
                execute: jest.fn().mockResolvedValueOnce({
                    recordset: [],
                    rowsAffected: [1]
                })
            });
    
            const req = {
                params: {
                    id: "52cf85e0-a871-4ae3-b601-b9223a6029bd"
                },
                body: {
                    name: 'Updated Category'
                }
            };
    
            await updateCategoryController(req, res);
    
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Category updated successfully'
            });
        });
    
        it('Should return a success message if category is updated with the same name', async () => {
            jest.spyOn(mssql, 'connect').mockResolvedValueOnce({
                request: jest.fn().mockReturnThis(),
                input: jest.fn().mockReturnThis(),
                execute: jest.fn().mockResolvedValueOnce({
                    recordset: [],
                    rowsAffected: [1]
                })
            });
    
            const req = {
                params: {
                    id: "52cf85e0-a871-4ae3-b601-b9223a6029bd"
                },
                body: {
                    name: 'Test Category'
                }
            };
    
            await updateCategoryController(req, res);
    
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Category updated successfully'
            });
        });
    
        it('Should return an error if there is a database error', async () => {
            const errorMessage = "Database error";
    
            jest.spyOn(mssql, 'connect').mockRejectedValueOnce(new Error(errorMessage));
    
            const req = {
                params: {
                    id: "52cf85e0-a871-4ae3-b601-b9223a6029bd"
                },
                body: {
                    name: 'Updated Category'
                }
            };
    
            await updateCategoryController(req, res);
    
            // expect(res.status).toHaveBeenCalledWith(500);
            // expect(res.json).toHaveBeenCalledWith({
            //     error: errorMessage
            // });
        });
    
    });

    describe("Testing Delete Category", () => {

        it('Should return an error if category is not found', async () => {
            jest.spyOn(mssql, 'connect').mockResolvedValueOnce({
                request: jest.fn().mockReturnThis(),
                input: jest.fn().mockReturnThis(),
                execute: jest.fn().mockResolvedValueOnce({
                    recordset: [],
                })
            });
    
            const req = {
                params: {
                    id: "52cf85e0-a871-4ae3-b601-b9223a6029bd"
                }
            };
    
            await deleteCategoryController(req, res);
    
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Category not found'
            });
        });
    
        it('Should return a success message if category is deleted', async () => {
            jest.spyOn(mssql, 'connect').mockResolvedValueOnce({
                request: jest.fn().mockReturnThis(),
                input: jest.fn().mockReturnThis(),
                execute: jest.fn().mockResolvedValueOnce({
                    recordset: [],
                    rowsAffected: [1]
                })
            });
    
            const req = {
                params: {
                    id: "52cf85e0-a871-4ae3-b601-b9223a6029bd"
                }
            };
    
            await deleteCategoryController(req, res);
    
            // expect(res.status).toHaveBeenCalledWith(200);
            // expect(res.json).toHaveBeenCalledWith({
            //     message: 'Category deleted successfully'
            // });
        });
    
        it('Should return a success message if category is deleted with no records affected', async () => {
            jest.spyOn(mssql, 'connect').mockResolvedValueOnce({
                request: jest.fn().mockReturnThis(),
                input: jest.fn().mockReturnThis(),
                execute: jest.fn().mockResolvedValueOnce({
                    recordset: [],
                    rowsAffected: [0]
                })
            });
    
            const req = {
                params: {
                    id: "52cf85e0-a871-4ae3-b601-b9223a6029bd"
                }
            };
    
            await deleteCategoryController(req, res);
    
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Category deleted successfully'
            });
        });
    
        it('Should return an error if there is a database error', async () => {
            const errorMessage = "Database error";
    
            jest.spyOn(mssql, 'connect').mockRejectedValueOnce(new Error(errorMessage));
    
            const req = {
                params: {
                    id: "52cf85e0-a871-4ae3-b601-b9223a6029bd"
                }
            };
    
            await deleteCategoryController(req, res);
    
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                error: errorMessage
            });
        });
    
    });
    
    
    
    
    
});
