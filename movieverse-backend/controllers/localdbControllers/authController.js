import jwt from 'jsonwebtoken';
import userModel from '../../models/User.js'; 
import ApiError from '../../middleware/ApiError.js';
import bcrypt from 'bcrypt';

const register = async (req, res, next) => {
    try {
        const { email, password, firstName, lastName } = req.body;
        const existingUser = await userModel.findUserByEmail(email);

        if (existingUser) {
            return next(new ApiError(400, 'User already exists'));
        }

        const newUser = await userModel.createUser(email, password, firstName, lastName);
        res.status(201).json({ message: 'User registered successfully', user: newUser });
    } catch (error) {
        next(error);
    }
};

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await userModel.findUserByEmail(email);

        if (!user) {
            return next(new ApiError(400, 'Invalid email or password'));
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return next(new ApiError(400, 'Invalid email or password'));
        }

        const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
        res.status(200).json({ token, message: 'Login successful' });
    } catch (error) {
        next(error);
    }
};

export default { register, login };
