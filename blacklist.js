blacklist = ["50aeb73a96fba52c3ca13afa"];

API.addEventListener(API.USER_JOIN, checkBlacklist);

function checkBlacklist(user) {
        if (blacklist.indexOf(user.id) > -1 ) {
                API.sendChat("/me Blacklisted user detected!");
                API.moderateBanUser(user.id, "Blacklisted User. banned for 30 days");
        }
}
