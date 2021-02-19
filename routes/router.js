'use strict';

const express = require('express');
const { asyncHandler } = require('../middleware/async-handler');
const { User, Course } = require('../models');
const { authenticateUser } = require('../middleware/auth-user');

// Construct a router instance.
const router = express.Router();

// Route that returns a list of users.
router.get('/users', authenticateUser,
    asyncHandler(async(req, res) => {
        const user = req.currentUser;

        res.json({
            name: user.firstName,
            last: user.lastName,
            email: user.email
        });
    })
);

// Route that returns a course
router.get('/courses/:id', authenticateUser,
    asyncHandler(async(req, res) => {
        try {
            await Course.findOne(req.body);
            res.status(201).json({ "message": "found course successfully!" });
        } catch (error) {
            if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
                const errors = error.errors.map(err => err.message);
                res.status(400).json({ errors });
            } else {
                throw error;
            }
        }
    })
);

// Route that creates a new course
router.post('/courses', authenticateUser,
    asyncHandler(async(req, res) => {
        try {
            await Course.create(req.body);
            res.status(201).json({ "message": "Course successfully created!" });
        } catch (error) {
            if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
                const errors = error.errors.map(err => err.message);
                res.status(400).json({ errors });
            } else {
                throw error;
            }
        }
    })
);

// Route that updates a course
router.put('/courses/:id', authenticateUser,
    asyncHandler(async(req, res) => {
        try {
            await Course.update(req.body);
            res.status(201).json({ "message": "Course successfully updated!" });
        } catch (error) {
            if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
                const errors = error.errors.map(err => err.message);
                res.status(400).json({ errors });
            } else {
                throw error;
            }
        }
    })
);

// Route that deletes a course
router.delete('/courses/:id', authenticateUser,
    asyncHandler(async(req, res) => {
        try {
            await Course.delete(req.body);
            res.status(201).json({ "message": "Course successfully delete!" });
        } catch (error) {
            if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
                const errors = error.errors.map(err => err.message);
                res.status(400).json({ errors });
            } else {
                throw error;
            }
        }
    })
);

// Route that creates a new user.
router.post('/users', asyncHandler(async(req, res) => {
    try {
        await User.create(req.body);
        res.status(201).json({ "message": "Account successfully created!" });
    } catch (error) {
        if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
            const errors = error.errors.map(err => err.message);
            res.status(400).json({ errors });
        } else {
            throw error;
        }
    }
}));

module.exports = router;