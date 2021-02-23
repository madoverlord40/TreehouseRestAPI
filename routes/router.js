/*jshint esversion: 8 */
/* jshint node: true */
'use strict';


const express = require('express');
const { asyncHandler } = require('../middleware/async-handler');
const { User, Course } = require('../models');
const { authenticateUser } = require('../middleware/auth-user');
const bcrypt = require('bcrypt');

// Construct a router instance.
const router = express.Router();

// Route that returns a list of users.
router.get('/users', authenticateUser,
    asyncHandler(async(req, res) => {
        let userList = [];

        try {
            await User.findAll().then((users) => {
                let index = 0;
                users.map((user) => {
                    const userData = {firstName: user.firstName, lastName: user.lastName, email: user.emailAddress};
                    userList[index] = userData;
                    index++;
                    return user;
                  });
                  res.status(200);
                  res.json(userList);
             });
            } catch(error) {
                if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
                    const errors = error.errors.map(err => err.message);
                    res.status(400)
                    res.json({ errors });
                } else {
                    throw error;
                }
            } 
        res.end();
    })
);

// Route that returns a a list courses
router.get('/courses', authenticateUser,
    asyncHandler(
        async(req, res) => {
            let courseList = [];
            try {
                await Course.findAll(
                    {
                        where: {
                            userId: req.currentUser.id
                        }
                    }).then((courses) => {
                        let index = 0;
                        courses.map((course) => {
                            const courseData = course;
                            courseList[index] = courseData;
                            index++;
                            return course;
                        });
                        res.status(200);
                        res.json(courseList);
                    });
            }
            catch(error) {
                if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
                    const errors = error.errors.map(err => err.message);
                    res.status(400)
                    res.json({ errors });;
                } else {
                    throw error;
                }
            }
            res.end();
        
        }
    )
);

// Route that returns a course
router.get('/courses/:id', authenticateUser,
    asyncHandler(async(req, res) => {
        let courseDetail = null;

        try {
            await Course.findOne({
                where: {
                    userId: req.currentUser.id,
                    id: req.params.id
                }
            }).then(course => {
                courseDetail = {title: course.title, description: course.description, materialsNeeded: course.materialsNeeded}
            });
            res.status(200);
            res.json(courseDetail);
        } catch (error) {
            if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
                const errors = error.errors.map(err => err.message);
                res.status(400)
                res.json({ errors });
                res.end();
            } else {
                throw error;
            }
        } 
        res.end();
        
    })
);

// Route that creates a new course
router.post('/courses', authenticateUser,
    asyncHandler(async(req, res) => {
        try {
            let newCourse = {
                "title": req.body.title,
                "description": req.body.description,
                "estimatedTime": req.body.estimatedTime,
                "materialsNeeded": req.body.materialsNeeded,
                "userId": req.currentUser.id
            };
            await Course.create(newCourse).then (createdCourse => {
                res.status(201);
                res.header('location', `/course/${req.currentUser.id}`);
                res.json({ "message": `Successfully created course ${createdCourse.title}` });
            });

        } catch (error) {
            if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
                const errors = error.errors.map(err => err.message);
                res.status(400)
                res.json({ errors });
                res.end();
            } else {
                throw error;
            }
        } 
        res.end();
        
    })
);

// Route that updates a course
router.put('/courses/:id', authenticateUser,
    asyncHandler(async(req, res) => {
        try {
            await Course.update(req.body, {
                where: {
                    userId: req.currentUser.id,
                    id: req.params.id
                }
            }).then (updatedCourse => {
                res.status(204);
                res.json({"message": 'Course updated successfully!'})
            })
            
        } catch (error) {
            if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
                const errors = error.errors.map(err => err.message);
                res.status(400);
                res.json({ errors });
                
            } else {
                throw error;
            }
        } 
        res.end();
        
    })
);

// Route that deletes a course
router.delete('/courses/:id', authenticateUser,
    asyncHandler(async(req, res) => {
        try {
            await Course.destroy({
                where: {
                    userId: req.currentUser.id,
                    id: req.params.id
                }
            }).then(function(rowDeleted) { // rowDeleted will return number of rows deleted
                if(rowDeleted === 1){
                    res.status(204)
                    res.json({ "message": "Course successfully deleted!" });
                 } else {
                    res.status(404)
                    res.json({"message":"record not found"})
                 }
                }
            )
            .catch(function (error){
                res.status(500).json(error);
            });
        } catch (error) {
            if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
                const errors = error.errors.map(err => err.message);
                res.status(400)
                res.json({ errors });
            } else {
                throw error;
            }
        } 
        res.end();
        
    })
);

// Route that creates a new user.
router.post('/users', asyncHandler(async(req, res) => {
    try {
        if (typeof(req.body.password) !== 'undefined') {
            let password = req.body.password;
            const hashedPassword = bcrypt.hashSync(password, 10);
            let newUser = {
                "firstName": req.body.firstName,
                "lastName": req.body.lastName,
                "emailAddress": req.body.emailAddress,
                "password": hashedPassword
            };

            await User.create(newUser).then(createdUser => {
                res.status(201)
                res.header('location', '/');
                res.json({ "message": "Account successfully created!" });
            });
            
        } else {
            res.status(400)
            res.json({ "message": "No password provided! You must give a first name, last name, and an email address!" });
        }
    } catch (error) {
        if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
            const errors = error.errors.map(err => err.message);
            res.status(400)
            res.json({ errors });
        } else {
            throw error;
        }
    } 
    res.end();
    
}));

module.exports = router;