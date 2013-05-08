/*
 * @name: nobuc.js
 * @description: 
 *      just a expressjs middleware
 *      http://docs.alibaba-inc.com/pages/viewpage.action?pageId=98078830
 * @author: wondger@gmail.com
 * @date: 2013-04-26
 * @param: 
 * @todo: 
 * @changelog: 
 */
var https = require("https");

/*
 * @param filter[RegExp]
 * @param options[Object]
 *      - hostname[String]: BUC hostname for change env
 *      - appname[String]: AppName applied in BUC
 *      - sendBucSSOTokenPath[String]: backurl after login. default:
 *      "/nobuc/sendBucSSOToken"
 */
module.exports = exports = function(filter, options) {
    filter = Object.prototype.toString.call(filter) === "[object RegExp]" ? filter : /.*/;
    options = Object.prototype.toString.call(options) === "[object Object]" ? options : null;

    if (!options || !options.hostname || !options.appname) {
        return;
    }

    // BUC不支持login callback url自定义
    //options.sendBucSSOTokenPath = options.sendBucSSOTokenPath || "/sendBucSSOToken.do";
    options.sendBucSSOTokenPath = "/sendBucSSOToken.do";

    options.key = Object.prototype.toString.call(options) === "[object String]" ? options.key : "_user";

    function registerClient(backurl, callback) {
        if (!backurl) {
            callback(new Error("backurl error"));
            return;
        }

        var req = https.request({
                hostname: options.hostname,
                port: 443,
                path: "/updateAppVersion.do?APP_NAME=" + options.appname + "&BACK_URL=" + backurl + "&CLIENT_VERSION=0.3.0",
                method: "POST"
            }, function(res) {
                res.on("data", function(d) {
                    //process.stdout.write(d);
                });

                if (res.statusCode === 200) {
                    callback(null);
                }
                else {
                    callback(new Error(res.statusCode));
                }
            });

        req.end();

        req.on('error', function(e) {
            callback(e);
        });
    }

    function register(req, res) {
        var registerBackUrl = encodeURIComponent(getUrl(req)),
            sendBucSSOTokenUrl = encodeURIComponent(getUrl(req, options.sendBucSSOTokenPath));

        res.clearCookie("_nb_tk_");
        res.clearCookie("_nb_uid_");

        registerClient(registerBackUrl, function(err) {
            if (!err) {
                res.redirect("https://" + options.hostname + "/ssoLogin.htm?APP_NAME=" + options.appname + "&BACK_URL=" + registerBackUrl);
            }
            else {
                res.send("Register app " + err.message);
            }
        });
    }

    function getUser(token, callback) {

        var req = https.request({
            hostname: options.hostname,
            port: 443,
            path: '/rpc/sso/communicate.json?SSO_TOKEN=' + token + '&RETURN_USER=true',
            method: 'POST'
        }, function(res) {
            res.on('data', function(d) {
                d = d ? JSON.parse(d) : null;

                if (d && !d.hasError && d.content) {
                    callback(null, JSON.parse(d.content));
                }
                else {
                    callback(new Error("empty"));
                }
            });

            if (res.statusCode !== 200) {
                callback(new Error(res.statusCode));
            }
        });

        req.end();

        req.on('error', function(e) {
            callback(e);
        });
    }

    function getUrl(req, path) {
        return req.protocol + "://" + req.host + (path || req.url);
    }

    return function(req, res, next) {
        if (req.url.indexOf(options.sendBucSSOTokenPath) === 0) {
            var backurl = req.query.BACK_URL || getUrl(req, "/");

            if (req.query && req.query.SSO_TOKEN) {
                getUser(req.query.SSO_TOKEN, function(err, data){

                    if (err) {
                        res.send("Get user info " + err.message);
                        return;
                    }

                    if (data) {
                        res.cookie("_nb_tk_", String(data.token), {signed: true});
                        res.cookie("_nb_uid_", String(data.id), {signed: true});
                        res.redirect(backurl);
                    }
                    else {
                        res.send("Login error.");
                    }
                });
            }
        }

        else if (!filter.test(req.url)) {
            next();
            return;
        }

        else {
            if (!req.signedCookies._nb_uid_ || !req.signedCookies._nb_tk_) {
                register(req, res);
            }
            else {
                getUser(req.signedCookies._nb_tk_, function(err, data){
                    if (err) {
                        register(req, res);
                        return;
                    }

                    if (data) {
                        req[options.key] = {
                            available: data.available,
                            authType: data.authType,
                            account: data.account,
                            empId: data.empId,
                            depId: data.depId,
                            loginName: data.loginName,
                            nickNameCn: data.nickNameCn,
                            gender: data.gender,
                            hireDate: data.hireDate,
                            jobDesc: data.jobDesc,
                            aliWW: data.aliWW,
                            tbWW: data.tbWW,
                            emailAddr: data.emailAddr,
                            busnPhone: data.busnPhone,
                            extensionPhone: data.extensionPhone,
                            cellphone: data.cellphone,
                            locationDesc: data.locationDesc,
                            emailPrefix: data.emailPrefix,
                            depDesc: data.depDesc,
                            supervisorName: data.supervisorName
                        };
                        req["_" + options.key] = data;
                        res.cookie("_nb_tk_", String(data.token), {signed: true});
                        res.cookie("_nb_uid_", String(data.id), {signed: true});
                        next();
                    }
                    else {
                        register(req, res);
                    }
                });
            }
        }
    };
}
