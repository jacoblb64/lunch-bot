require('mocha');
const expect = require('chai').expect;
import { parseGroups } from '../src/match'

describe('Match.js', () => {
    
    describe('parseGroups()', () => {

        it('should pass a basic smoke test', () => {
            const smokeTestUsers = ['jacob', 'zack', 'kamran', 'igor'];
            const expected = smokeTestUsers;

            const result = parseGroups(smokeTestUsers)[0];

            expect(result).to.have.members(expected);
        })

        it('should create 4 even groups of 4 for 16 users', () => {
            const userCount = 16;
            const users = [];
            for(let i = 0; i < userCount; i++) {
                users.push(i.toString());
            }

            const result = parseGroups(users);

            expect(result.length).to.equal(userCount / 4);
            const allresults = [];
            result.map(group => {
                expect(group.length).to.equal(4);
                group.map(u => allresults.push(u))
            });
            expect(allresults).to.have.members(users);
        });

        it('should create 3 groups of 4 and one group of 3 for 15 users', () => {
            const userCount = 15;
            const users = [];
            for(let i = 0; i < userCount; i++) {
                users.push(i.toString());
            }

            const result = parseGroups(users);

            expect(result.length).to.equal(Math.ceil(userCount / 4));
            const allresults = [];

            for(let i = 0; i < result.length; i++) {
                let group = result[i];
                if (i === result.length -1 ) {
                    expect(group.length).to.equal(3);
                }
                else {
                    expect(group.length).to.equal(4);
                }
                group.map(u => allresults.push(u))
            }
            expect(allresults).to.have.members(users);
        });

        it('should create groups for 17 users', () => {
            const userCount = 17;
            const users = [];
            for(let i = 0; i < userCount; i++) {
                users.push(i.toString());
            }
            const expectedSizes = [3, 4, 4, 4, 2];

            const result = parseGroups(users);
            // console.log(result);

            expect(result.length).to.equal(Math.ceil(userCount / 4));
            const allresults = [];
            const resultLengths = [];

            result.map(group => {
                resultLengths.push(group.length);
                group.map(u => allresults.push(u))
            });

            expect(resultLengths).to.have.members(expectedSizes);

            expect(allresults).to.have.members(users);
        });

        it('should create groups for 18 users', () => {
            const userCount = 18;
            const users = [];
            for(let i = 0; i < userCount; i++) {
                users.push(i.toString());
            }
            const expectedSizes = [4, 4, 4, 4, 2];

            const result = parseGroups(users);
            // console.log(result);

            expect(result.length).to.equal(Math.ceil(userCount / 4));
            const allresults = [];
            const resultLengths = [];

            result.map(group => {
                resultLengths.push(group.length);
                group.map(u => allresults.push(u))
            });

            expect(resultLengths).to.have.members(expectedSizes);

            expect(allresults).to.have.members(users);
        });
    });
});