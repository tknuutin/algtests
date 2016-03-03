
import _ from 'lodash';
import * as another from './another';

function startApp() {
    let mapped = _.map(another.teststuff(), (x) => x + 1);
    console.log('test started!', mapped);
}

window.onload = startApp;
