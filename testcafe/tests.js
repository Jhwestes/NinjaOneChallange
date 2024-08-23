import { Selector, t } from 'testcafe';
import Page from './page-model';

fixture .page`http://localhost:3001/` `DEVICE PAGE TESTS`   // Before each test open this URL

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
(`Update first device in list name with API call`, async t => {
    await t
        .click(Page.editButton.nth(0))
        .wait(1000);
    await Page.updateDevice();
});

test
(`Delete last device in list with API call`, async t => {
    const deletedName = await Page.deviceName.nth(-1).innerText;
    
    await t
        .click(Page.editButton.nth(-1))
        .wait(1000);
    await Page.deleteDevice();

    const currentName = await Page.deviceName.withText(deletedName).visible;        // check if deleted device is visible (T/F)
    await t.expect(currentName).notOk(currentName + 'is still visible');            // expect visibility status to be FALSE
    console.log(deletedName + 'was deleted successfully');
});