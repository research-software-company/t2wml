import 'chai';
import { expect } from 'chai';
import * as chai from 'chai';
import chaiAsPromised from 'chai-as-promised';

chai.should();
chai.use(chaiAsPromised);

function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

describe('')