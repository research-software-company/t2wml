import 'chai';
import { expect } from 'chai';
import * as chai from 'chai';
import chaiAsPromised from 'chai-as-promised';

chai.should();
chai.use(chaiAsPromised);

import { initializeSpectronApp } from './utils';
const app = initializeSpectronApp();

function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

before('Try Before', async () => {
    console.log('before block here');
    chaiAsPromised.transferPromiseness = (app as any).transferPromiseness;  // transferPromiseness is not defined in the type
    await app.start();
    console.log('before block done');
});

describe('Actual Test Group', () => {
    it('Sync test', () => {
        const x = 5;
        expect(x).to.equal(5);
    });
    it('Async test', async () => {
        console.log('Async test starting');
        const x = 5;
        await delay(5000);
        expect(x).to.be.equal(5);
        console.log('Async test done');
    });
    it('Second sync test', () => {
        const x = 5;
        expect(x).to.equal(5);
    });
});