const request = require('supertest');
const app = require('../src/app');
const Symbol = require('../src/models/symbol');
const {
    userOneId,
    userOne,
    userTwoId,
    userTwo,
    symbolOne,
    symbolTwo,
    symbolThree,
    setupDb,
} = require('./fixtures/db');

beforeEach(setupDb);

test('Should add new symbol to favorites', async() => {
    const response = await request(app)
        .post('/')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({ symbol: 'AAPL' })
        .expect(201);

    const symbol = await Symbol.findById(response.body._id);
    expect(symbol).not.toBeNull();
    expect(symbol.owner).toEqual(userOneId);
});

test('Should get favorited symbols for userOne', async() => {
    const response = await request(app)
        .get('/')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200);

    expect(response.body.length).toBe(2);
});

test('Should not delete favorite symbol of first user from second users account', async() => {
    const response = await request(app)
        .delete(`/:${symbolOne._id}`)
        .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
        .send()
        .expect(404);

    const symbol = await Symbol.findById(response.body._id);
    expect(symbol).toBeNull();
});