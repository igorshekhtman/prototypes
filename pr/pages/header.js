/**
 * Created by rezaalemy on 15-03-29.
 */

function Header() {
}
Header.prototype = {
    openUserMenu: function () {
        return this.getUserMenu().element(by.css("a[bs-dropdown]")).click();
    },
    getUserMenu: function () {
        return element(by.css("div.user-menu"));
    },
    getAboutLink: function () {
        return this.getUserMenu().element(by.xpath("//*[contains(text(),'About')]"));
    },
    getMsgBoxClose: function () {
        return this.getMsgBox().element(by.xpath(".//button[contains(text(),'Close')]"));
    },
    getMsgBox: function () {
        return element(by.css("body>div.modal"));
    },
    msgBoxStatus: function () {
        return this.getMsgBox().isPresent();
    },
    openAbout: function () {
        var self = this;
        return self.openUserMenu().then(function () {
            return self.getAboutLink().click();
        });
    },
    closeAbout: function () {
        return this.getMsgBoxClose().click();
    },
    getLogout: function () {
        var self = this;
        return this.openUserMenu().then(function () {
            return self.getUserMenu().element(by.css("a[href='/logout']"));
        });
    },
    logout: function () {
        return this.getLogout().then(function (el) {
            return el.click();
        });
    },
    get: function () {
        return browser.get("/#/Overview");
    }

};

module.exports = new Header();
