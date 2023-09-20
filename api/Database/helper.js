const { pool } = require("../Config/Config");

class DB {
    static addRequeststoInput = async (request, data={}) => {
        const keys = Object.keys(data);
        keys.map(key => request.input(key, data[key]));
        return request;
    }

    static exec = async (stored_procedure, data={}) => {
        let request = await pool.request();
        request = await DB.addRequeststoInput(request, data);
        try {
            return await request.execute(stored_procedure);
        } catch (error) {
            throw error;
        }
    }

    static query = async query_string => {
        try {
            return await pool.request().query(query_string);
        } catch (error) {
            throw error;
        }
    }
}

module.exports = DB;