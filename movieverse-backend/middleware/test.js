import fs from 'fs';
import path from 'path';
import { pool } from './db.js';
import { hash } from 'bcrypt'
import jwt from 'jsonwebtoken'
const { sign } = jwt

const __dirname = import.meta.dirname

const initializeTestDb = () => {
    const sql = fs.readFileSync(path.resolve(__dirname,'../movieverse.sql'), "utf8");
    pool.query(sql)
}

const insertTestUser = (email, password, firstName, lastName, uniqueUrl) => {
    hash(password,10,(error,hashedPassword) => {
        pool.query(`
        INSERT INTO account (email, password, first_name, last_name, is_active, link, unique_profile_url)
        VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *;`,
            [email,hashedPassword,firstName,lastName,true,"",uniqueUrl])
    })
}

const getToken = (email) => {
    return sign({user: email},process.env.JWT_SECRET_KEY)
}

export { initializeTestDb, insertTestUser, getToken }