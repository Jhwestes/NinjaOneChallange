import { Selector, t } from 'testcafe';
import { ClientFunction } from 'testcafe';

class Device {
    constructor (name, type, capacity){
        this.deviceName     = Selector('.device-name').withText(name);
        this.deviceType     = Selector('.device-type').withText(type);
        this.deviceCapacity = Selector('.device-capacity').withText(capacity);
        this.editButton     = this.deviceName.nextSibling('.device-edit');
        this.deleteButton   = this.deviceName.nextSibling('.device-remove');
    }
}

class Page {
    constructor () {
        this.deviceTypeSelect       = Selector('#device_type');
        this.deviceTypeSelectOption = this.deviceTypeSelect.find('option');

        this.sortBySelect           = Selector('#sort_by');
        this.sortBySelectOption     = this.sortBySelect.find('option');

        this.deviceName             = Selector('.device-name');
        this.deviceType             = Selector('.device-type');
        this.deviceCapacity         = Selector('.device-capacity');
        this.editButton             = Selector('.device-edit');
        this.deleteButton           = Selector('.device-remove');

        this.addDeviceButton        = Selector('.submitButton');
        
        this.systemNameInput        = Selector('#system_name');

        this.typeInput              = Selector('#type');
        this.typeInputOption        = this.typeInput.find('option');

        this.capacityInput          = Selector('#hdd_capacity');
    }

    /**
     * Fills new/edit devices form.
     * @param {String} name - Name your device
     * @param {String} type - Select from WINDOWS_WORKSTATION, WINDOWS SERVER or MAC
     * @param {String} capacity - HDD capacity in GB's
     */
    async fillDeviceInfo (name, type, capacity) {
        await t
            .typeText(this.systemNameInput, name)
            .click(this.typeInput)
            .click(this.typeInputOption.withText(type))
            .typeText(this.capacityInput, capacity)

            .expect(this.systemNameInput.value).eql(name)
            .expect(this.typeInput.value).eql(type)
            .expect(this.capacityInput.value).eql(capacity)
            
            .click(this.addDeviceButton);
    }

    async compareDevicesVsList () {
        const deviceCount   = await Selector('div[class="device-main-box"]').count;
        const response      = await t.request(`http://localhost:3000/devices/`).body;
        const body          = JSON.stringify(response);

        for (let i = 0; i < deviceCount; i++) {
            const currentName           = await this.deviceName.nth(i).innerText;
            const currentType           = await this.deviceType.nth(i).innerText;
            const capacityString        = await this.deviceCapacity.nth(i).innerText;   // inner text returns '## GB'
            const currentCapacity       = capacityString.replace(' GB', '');            // delete ' GB' to keep only the number
            const editButtonExists      = await this.editButton.nth(i).exists;
            const deleteButtonExists    = await this.deleteButton.nth(i).exists;

            await t
                .expect(body).contains(currentName)
                .expect(body).contains(currentType)
                .expect(body).contains(currentCapacity)
                .expect(editButtonExists).ok()
                .expect(deleteButtonExists).ok();

            console.log(currentName + ' is displayed')
          }
        
        console.log('All edit and delete buttons are displayed');
    }

    /**
     * Fills new/edit devices form.
     * @param {String} name - Device name
     * @param {String} type - Device type within WINDOWS_WORKSTATION, WINDOWS SERVER or MAC
     * @param {String} capacity - Device HDD capacity in GB's
     */
    async compareDeviceVsList (name, type, capacity) {
        const currentName       = await this.deviceName.withText(name).visible;
        const currentType       = await this.deviceType.withText(type).visible;
        const currentCapacity   = await this.deviceCapacity.withText(capacity).visible;

        await t
            .expect(currentName).ok()
            .expect(currentType).ok()
            .expect(currentCapacity).ok();

        console.log(name + ': ' + type + ' with ' + capacity + 'GB is displayed as expected')
    }

    async updateFirstDevice () {
        const putResponse = await t.request({
            url: `http://localhost:3000/devices/e8okoP2l5`,
            method: "put",
            body: {
                id: "e8okoP2l5",
                system_name: "Renamed Device",
                type: "WINDOWS",
                hdd_capacity: "10"
             },
          });
        
        await t
          .navigateTo('http://localhost:3001');

        const currentName           = await this.deviceName.nth(0).innerText;
        const currentType           = await this.deviceType.nth(0).innerText;
        const capacityString        = await this.deviceCapacity.nth(0).innerText;
        const currentCapacity       = capacityString.replace(' GB', '');

       await this.compareDeviceVsList(currentName, currentType, currentCapacity);
    }

    async deleteLastDevice () {
        const deleteResponse = await t.request({
            url: `http://localhost:3000/devices/Th3ngERn9`,
            method: "delete",
          });
        
        await t.expect(deleteResponse.status).eql(204);
    }
}

export default new Page();