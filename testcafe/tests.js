import { Selector, t } from 'testcafe';
import Page from './page-model';

fixture .page`http://localhost:3001` `DEVICE PAGE TESTS`

test
(`Device List is displayed correctly`, async t => {
    await Page.compareDevicesVsList();
});

test
(`New Device is added as expected`, async t => {
    await t.click(Page.addDeviceButton);
    await Page.fillDeviceInfo('Test', 'MAC', '100');
    await Page.compareDeviceVsList('Test', 'MAC', '100');
});

test
(`Update a device name with API call`, async t => {
    await Page.updateFirstDevice();
});

test
(`Delete a device name with API call`, async t => {
    await Page.deleteLastDevice();
});