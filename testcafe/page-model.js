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

            .expect(this.systemNameInput.value).eql(name, 'Device name does not match the given value')
            .expect(this.typeInput.value).eql(type, 'Device type does not match the given value')
            .expect(this.capacityInput.value).eql(capacity, 'Device capacity does not match the given value')
            
            .click(this.addDeviceButton);
    }

    /**
     * Gets the devices list from API and expects all of them are present in the UI
     */
    async compareDevicesVsList () {
        const deviceCount   = await Selector('div[class="device-main-box"]').count;
        const response      = await t.request(`http://localhost:3000/devices/`).body;
        const body          = JSON.stringify(response);

        for (let i = 0; i < deviceCount; i++) {                                                                     // iterate in UI elements
            const currentName           = await this.deviceName.nth(i).innerText;
            const currentType           = await this.deviceType.nth(i).innerText;
            const capacityString        = await this.deviceCapacity.nth(i).innerText;                               // inner text returns '## GB'
            const currentCapacity       = capacityString.replace(' GB', '');                                        // delete ' GB' to keep only the number
            const editButtonExists      = await this.editButton.nth(i).exists;
            const deleteButtonExists    = await this.deleteButton.nth(i).exists;

            await t                                                                                                 // compare devices info vs API response body
                .expect(body).contains(currentName, currentName + ' is not in the list')
                .expect(body).contains(currentType, currentType + ' is not in the list')
                .expect(body).contains(currentCapacity, currentCapacity + ' is not in the list')
                .expect(editButtonExists).ok('Edit button is not present for this element: ' + currentName)
                .expect(deleteButtonExists).ok('Delete button is not present for this element: ' + currentName);

            console.log(currentName + ' is displayed');
          }
        
        console.log('All edit and delete buttons are displayed');
    }

    /**
     * Asserts the prescence of a device in the UI device list
     * @param {String} name - Device name
     * @param {String} type - Device type within WINDOWS_WORKSTATION, WINDOWS SERVER or MAC
     * @param {String} capacity - Device HDD capacity in GB's
     */
    async compareDeviceVsList (name, type, capacity) {
        const currentName       = await this.deviceName.withText(name).visible;                 //Check if device elements are visible in UI
        const currentType       = await this.deviceType.withText(type).visible;
        const currentCapacity   = await this.deviceCapacity.withText(capacity).visible;

        await t
            .expect(currentName).ok(currentName + 'is not visible')
            .expect(currentType).ok(currentType + 'is not visible')
            .expect(currentCapacity).ok(currentCapacity + 'is not visible');

        console.log(name + ': ' + type + ' with ' + capacity + 'GB is displayed as expected');
    }

    /**
     * Edits an open item in UI with an API request.
     * @param {String} newName - new Device name
     */
    async updateDevice (newName) {
        const getURL    = await ClientFunction(() => window.location.href)();               // get UI url 
        const device_id = getURL.replace("http://localhost:3001/devices/edit/", "");        // trim url to keep only device id

        const requestUrl = 'http://localhost:3000/devices/' + device_id                     // add device id to request url

        const patchResponse = await t.request({                                             // PATCH method to modify a specific attribute
            url: requestUrl,
            method: "patch",
            body: {
                system_name: newName,
             },
          });
        
        await t
          .expect(deleteResponse.status).eql(200)
          .navigateTo('http://localhost:3001');                                             // return to base UI url to assert visibility of modified device

        const currentName           = await this.deviceName.nth(0).innerText;
        const currentType           = await this.deviceType.nth(0).innerText;
        const capacityString        = await this.deviceCapacity.nth(0).innerText;
        const currentCapacity       = capacityString.replace(' GB', '');

       await this.compareDeviceVsList(currentName, currentType, currentCapacity);
    }

     /**
     * Deletes an open item in UI with an API request.
     */
    async deleteDevice () {
        const getURL    = await ClientFunction(() => window.location.href)();
        const device_id = getURL.replace("http://localhost:3001/devices/edit/", "");

        const requestUrl = 'http://localhost:3000/devices/' + device_id

        const deleteResponse = await t.request({
            url: requestUrl,
            method: "delete",
          });
        
        await t.expect(deleteResponse.status).eql(204);


    }
}

export default new Page();