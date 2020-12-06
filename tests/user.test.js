const request = require('supertest');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const app = require('../src/app');
const User = require('../src/models/user');

const userOneId = new mongoose.Types.ObjectId();
const userOne = {
    _id: userOneId,
    name: 'John',
    email: 'john@example.com',
    password: 'abc123!',
    tokens: [{
        token: jwt.sign({ _id: userOneId }, process.env.JWT_SECRET),
    }, ],
};

const userTwo = {
    name: 'Iannis',
    email: 'iannis@example.com',
    password: 'abc123!',
};

beforeEach(async() => {
    await User.deleteMany();
    await new User(userOne).save();
});

test('Should sign up a new user', async() => {
    const response = await request(app)
        .post('/profile/register')
        .send({ name: 'Can', email: 'can@example.com', password: 'abc1234!' })
        .expect(201);

    const user = await User.findById(response.body.user._id);
    expect(user).not.toBeNull();
    // expecting password to be hashed
    expect(user.password).not.toBe('abc1234!');
});

test('Should not sign up a new user if password is short', async() => {
    await request(app)
        .post('/profile/register')
        .send({ name: 'Can', email: 'can@example.com', password: 'abc1' })
        .expect(400);
});

test('Should log in existing user', async() => {
    const response = await request(app)
        .post('/profile/login')
        .send({
            email: userOne.email,
            password: userOne.password,
        })
        .expect(200);

    const user = await User.findById(response.body.user._id);
    expect(user.tokens[0].token).toBe(userOne.tokens[0].token);
});

test('Should not log in if user does not exist', async() => {
    await request(app)
        .post('/profile/login')
        .send({ email: userTwo.email, password: userTwo.password })
        .expect(400);
});

test('Should get profile for the user', async() => {
    await request(app)
        .get('/profile')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200);
});

test('Should not get profile for unauthorized user', async() => {
    await request(app).get('/profile').send().expect(401);
});

test('Should delete account for user', async() => {
    await request(app)
        .delete('/profile')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200);
    const user = await User.findById(userOneId);
    expect(user).toBeNull();
});

test('Should not delete account for unauthorized user', async() => {
    await request(app).delete('/profile').send().expect(401);
});