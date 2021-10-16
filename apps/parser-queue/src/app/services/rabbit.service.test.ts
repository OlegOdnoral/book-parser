import * as rabbit_service from "./rabbit.service"

// @ponicode
describe("tryConnect", () => {
    let inst: any

    beforeEach(() => {
        inst = new rabbit_service.RabbitConnector("b'http://example.com/foo;1234?bar#frag'", "user123", "!Lov3MyPianoPony")
    })

    test("0", async () => {
        await inst.tryConnect("4.0.0-beta1\t")
    })

    test("1", async () => {
        await inst.tryConnect("^5.0.0")
    })

    test("2", async () => {
        await inst.tryConnect("v4.0.0-rc.4")
    })

    test("3", async () => {
        await inst.tryConnect("1.0.0")
    })

    test("4", async () => {
        await inst.tryConnect("v1.2.4")
    })

    test("5", async () => {
        await inst.tryConnect("")
    })
})

// @ponicode
describe("disconnect", () => {
    let inst: any

    beforeEach(() => {
        inst = new rabbit_service.RabbitConnector("b'http://example.com/foo?bar'", "user-name", "accessdenied4u")
    })

    test("0", async () => {
        await inst.disconnect()
    })
})

// @ponicode
describe("clearQueue", () => {
    let inst: any

    beforeEach(() => {
        inst = new rabbit_service.RabbitConnector("http://example.com/foo?bar", "user-name", "YouarenotAllowed2Use")
    })

    test("0", async () => {
        await inst.clearQueue("^5.0.0")
    })

    test("1", async () => {
        await inst.clearQueue("1.0.0")
    })

    test("2", async () => {
        await inst.clearQueue("v4.0.0-rc.4")
    })

    test("3", async () => {
        await inst.clearQueue("4.0.0-beta1\t")
    })

    test("4", async () => {
        await inst.clearQueue("v1.2.4")
    })

    test("5", async () => {
        await inst.clearQueue("")
    })
})

// @ponicode
describe("publishToQueue", () => {
    let inst: any

    beforeEach(() => {
        inst = new rabbit_service.RabbitConnector("http://another.example.com/", "user-name", "YouarenotAllowed2Use")
    })

    test("0", async () => {
        await inst.publishToQueue("v4.0.0-rc.4", "data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20version%3D%221.1%22%20baseProfile%3D%22full%22%20width%3D%22undefined%22%20height%3D%22undefined%22%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22grey%22%2F%3E%3Ctext%20x%3D%22NaN%22%20y%3D%22NaN%22%20font-size%3D%2220%22%20alignment-baseline%3D%22middle%22%20text-anchor%3D%22middle%22%20fill%3D%22white%22%3Eundefinedxundefined%3C%2Ftext%3E%3C%2Fsvg%3E")
    })

    test("1", async () => {
        await inst.publishToQueue("1.0.0", "data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20version%3D%221.1%22%20baseProfile%3D%22full%22%20width%3D%22undefined%22%20height%3D%22undefined%22%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22grey%22%2F%3E%3Ctext%20x%3D%22NaN%22%20y%3D%22NaN%22%20font-size%3D%2220%22%20alignment-baseline%3D%22middle%22%20text-anchor%3D%22middle%22%20fill%3D%22white%22%3Eundefinedxundefined%3C%2Ftext%3E%3C%2Fsvg%3E")
    })

    test("2", async () => {
        await inst.publishToQueue("^5.0.0", "data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20version%3D%221.1%22%20baseProfile%3D%22full%22%20width%3D%22undefined%22%20height%3D%22undefined%22%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22grey%22%2F%3E%3Ctext%20x%3D%22NaN%22%20y%3D%22NaN%22%20font-size%3D%2220%22%20alignment-baseline%3D%22middle%22%20text-anchor%3D%22middle%22%20fill%3D%22white%22%3Eundefinedxundefined%3C%2Ftext%3E%3C%2Fsvg%3E")
    })

    test("3", async () => {
        await inst.publishToQueue("4.0.0-beta1\t", "data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20version%3D%221.1%22%20baseProfile%3D%22full%22%20width%3D%22undefined%22%20height%3D%22undefined%22%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22grey%22%2F%3E%3Ctext%20x%3D%22NaN%22%20y%3D%22NaN%22%20font-size%3D%2220%22%20alignment-baseline%3D%22middle%22%20text-anchor%3D%22middle%22%20fill%3D%22white%22%3Eundefinedxundefined%3C%2Ftext%3E%3C%2Fsvg%3E")
    })

    test("4", async () => {
        await inst.publishToQueue("v1.2.4", "data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20version%3D%221.1%22%20baseProfile%3D%22full%22%20width%3D%22undefined%22%20height%3D%22undefined%22%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22grey%22%2F%3E%3Ctext%20x%3D%22NaN%22%20y%3D%22NaN%22%20font-size%3D%2220%22%20alignment-baseline%3D%22middle%22%20text-anchor%3D%22middle%22%20fill%3D%22white%22%3Eundefinedxundefined%3C%2Ftext%3E%3C%2Fsvg%3E")
    })

    test("5", async () => {
        await inst.publishToQueue("", "")
    })
})

// @ponicode
describe("subscribeOnChannelAB", () => {
    let inst: any

    beforeEach(() => {
        inst = new rabbit_service.RabbitConnector("b'http://example.com/foo;1234?bar#frag'", "user-name", "YouarenotAllowed2Use")
    })

    test("0", async () => {
        await inst.subscribeOnChannelAB("4.0.0-beta1\t")
    })

    test("1", async () => {
        await inst.subscribeOnChannelAB("v4.0.0-rc.4")
    })

    test("2", async () => {
        await inst.subscribeOnChannelAB("1.0.0")
    })

    test("3", async () => {
        await inst.subscribeOnChannelAB("^5.0.0")
    })

    test("4", async () => {
        await inst.subscribeOnChannelAB("v1.2.4")
    })

    test("5", async () => {
        await inst.subscribeOnChannelAB("")
    })
})

// @ponicode
describe("checkQueue", () => {
    let inst: any

    beforeEach(() => {
        inst = new rabbit_service.RabbitConnector("http://backend.userland.com/rss", "user123", "NoWiFi4you")
    })

    test("0", async () => {
        await inst.checkQueue("1.0.0")
    })

    test("1", async () => {
        await inst.checkQueue("v4.0.0-rc.4")
    })

    test("2", async () => {
        await inst.checkQueue("v1.2.4")
    })

    test("3", async () => {
        await inst.checkQueue("^5.0.0")
    })

    test("4", async () => {
        await inst.checkQueue("4.0.0-beta1\t")
    })

    test("5", async () => {
        await inst.checkQueue("")
    })
})
