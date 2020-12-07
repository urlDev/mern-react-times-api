const request = require('supertest');
const app = require('../src/app');
const User = require('../src/models/user');
const { userOneId, userOne, setupDb } = require('./fixtures/db');

const userTwo = {
    name: 'Iannis',
    email: 'iannis@example.com',
    password: 'abc123!',
};

beforeEach(setupDb);

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

test('Should upload avatar image', async() => {
    await request(app)
        .post('/profile/avatar')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .attach('avatar', 'tests/fixtures/profile-pic.jpg')
        .expect(200);

    const user = await User.findById(userOneId);
    // checking if user avatar is type of Buffer
    // Since I set avatar with both webp and png, I am checking one of them
    expect(user.avatar.png).toEqual(expect.any(Buffer));
});

test('Should update user', async() => {
    const response = await request(app)
        .patch('/profile')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({ name: 'John' })
        .expect(200);

    const user = await User.findById(response.body._id);
    expect(user.name).toBe('John');
});