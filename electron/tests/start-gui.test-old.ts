// This file contains tests that store and close the GUI
import 'chai';
import { expect } from 'chai';
import * as chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { initializeSpectronApp } from './utils';

chai.should();
chai.use(chaiAsPromised);

const app = initializeSpectronApp();

before('Start GUI', function() {
    console.log('Start GUI is here');
    console.log('chaiAsPromised: ', chaiAsPromised);
    console.log('app', app);
    chaiAsPromised.transferPromiseness = (app as any).transferPromiseness;  // transferPromiseness is not defined in the type
    return app.start();
});

after('Close GUI', async function() {
    if (app && app.isRunning()) {
        console.log("Closing application");
        await app.stop();
    }
});

describe('Start GUI', function() {
    it('open window', async function() {
        await app.client.waitUntilWindowLoaded();
        // Check that this is the splash screen
        expect(app.client.isElementDisplayed("#splash-window")).to.be.true;
    });
});