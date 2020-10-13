// This file tests that Typescript is working well with tests.

import { expect } from 'chai';

interface TestInterface {
    title: string;
    digit: number;
}

describe('Test Mocha and Typescript', () => {
    it('Checking Mocha', () => {
        const t: TestInterface = { title: 'My title', digit: 8 };
        expect(t.title).to.be.equal('My title');
        expect(t.digit).to.be.closeTo(7.99999, 0.01);
    });
});

