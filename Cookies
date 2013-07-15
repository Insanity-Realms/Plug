/*jslint regexp: true, browser: true */
/**
 * jaaulde.cookies.js
 *
 * Copyright (c) 2005 - 2012, James Auldridge
 * All rights reserved.
 *
 * Licensed under the BSD, MIT, and GPL (your choice!) Licenses:
 *   @link http://code.google.com/p/cookies/wiki/License
 *
 */
(function (global) {
    "use strict";

        /* localize globals */
    var document = global.document,
        Object = global.Object,
        JSON = global.JSON,
        /* localize first party support */
        jaaulde = global.jaaulde = (global.jaaulde || {});

    /* jaaulde.utils Namespace */
    jaaulde.utils = (jaaulde.utils || {});

    /* The library */
    jaaulde.utils.cookies = (function () {
        var defaultOptions,
            resolveOptions,
            cookieOptions,
            isNaN,
            trim,
            parseCookies;

        defaultOptions = {
            expiresAt: null,
            path: '/',
            domain: null,
            secure: false
        };

        resolveOptions = function (o) {
            var r,
                e;

            if (typeof o !== 'object' || o === null) {
                r = defaultOptions;
            } else {
                r = {
                    expiresAt: defaultOptions.expiresAt,
                    path: defaultOptions.path,
                    domain: defaultOptions.domain,
                    secure: defaultOptions.secure
                };

                if (typeof o.expiresAt === 'object' && o.expiresAt instanceof Date) {
                    r.expiresAt = o.expiresAt;
                } else if (typeof o.hoursToLive === 'number' && o.hoursToLive !== 0) {
                    e = new global.Date();
                    e.setTime(e.getTime() + (o.hoursToLive * 60 * 60 * 1000));
                    r.expiresAt = e;
                }

                if (typeof o.path === 'string' && o.path !== '') {
                    r.path = o.path;
                }

                if (typeof o.domain === 'string' && o.domain !== '') {
                    r.domain = o.domain;
                }

                if (o.secure === true) {
                    r.secure = o.secure;
                }
            }

            return r;
        };

        cookieOptions = function (o) {
            o = resolveOptions(o);

            return (
                (typeof o.expiresAt === 'object' && o.expiresAt instanceof Date ? '; expires=' + o.expiresAt.toGMTString() : '') +
                '; path=' + o.path +
                (typeof o.domain === 'string' ? '; domain=' + o.domain : '') +
                (o.secure === true ? '; secure' : '')
            );
        };

        /* Some logic for `trim` and `isNaN` borrowed from http://jquery.com/ */
        if (global.String.prototype.trim) {
            trim = function (s) {
                return global.String.prototype.trim.call(s);
            };
        } else {
            trim = (function () {
                var l,
                    r;

                l = /^\s+/;
                r = /\s+$/;

                return function (s) {
                    return s.replace(l, '').replace(r, '');
                };
            }());
        }

        isNaN = (function () {
            var p = /\d/,
                isNaN = global.isNaN;

            return function (v) {
                return (v === null || !p.test(v) || isNaN(v));
            };
        }());

        parseCookies = (function () {
            var parseJSON,
                p;

            if (JSON && typeof JSON.parse === 'function') {
                parseJSON = function (s) {
                    var r = null;

                    if (typeof s === 'string' && s !== '') {
                        s = trim(s);

                        if (s !== '') {
                            try {
                                r = JSON.parse(s);
                            } catch (e1) {
                                r = null;
                            }
                        }
                    }

                    return r;
                };
            } else {
                parseJSON = function () {
                    return null;
                };
            }

            p = /^(?:\{.*\}|\[.*\])$/;

            return function () {
                var c = {},
                    s1 = document.cookie.split(';'),
                    q = s1.length,
                    i,
                    s2,
                    n,
                    v,
                    vv;

                for (i = 0; i < q; i = i + 1) {
                    s2 = s1[i].split('=');

                    n = trim(s2.shift());
                    if (s2.length >= 1) {
                        v = s2.join('=');
                    } else {
                        v = '';
                    }

                    try {
                        vv = decodeURIComponent(v);
                    } catch (e2) {
                        vv = v;
                    }

                    /* Logic borrowed from http://jquery.com/ dataAttr method */
                    try {
                        vv = (vv === 'true')
                            ? true : (vv === 'false')
                                ? false : !isNaN(vv)
                                    ? parseFloat(vv) : p.test(vv)
                                        ? parseJSON(vv) : vv;
                    } catch (e3) {}

                    c[n] = vv;
                }

                return c;
            };
        }());

        return {
            /**
             * get - get one, several, or all cookies
             *
             * @access public
             * @paramater Mixed n - String:name of single cookie; Array:list of multiple cookie names; Void (no param):if you want all cookies
             * @return Mixed - Value of cookie as set; Null:if only one cookie is requested and is not found; Object:hash of multiple or all cookies (if multiple or all requested);
             */
            get: function (n) {
                var r,
                    i,
                    c = parseCookies();

                if (typeof n === 'string') {
                    r = (c[n] !== undefined) ? c[n] : null;
                } else if (typeof n === 'object' && n !== null) {
                    r = {};

                    for (i in n) {
                        if (Object.prototype.hasOwnProperty.call(n, i)) {
                            if (c[n[i]] !== undefined) {
                                r[n[i]] = c[n[i]];
                            } else {
                                r[n[i]] = null;
                            }
                        }
                    }
                } else {
                    r = c;
                }

                return r;
            },
            /**
             * filter - get array of cookies whose names match the provided RegExp
             *
             * @access public
             * @paramater Object RegExp p - The regular expression to match against cookie names
             * @return Mixed - Object:hash of cookies whose names match the RegExp
             */
            filter: function (p) {
                var n,
                    r = {},
                    c = parseCookies();

                if (typeof p === 'string') {
                    p = new RegExp(p);
                }

                for (n in c) {
                    if (Object.prototype.hasOwnProperty.call(c, n) && n.match(p)) {
                        r[n] = c[n];
                    }
                }

                return r;
            },
            /**
             * set - set or delete a cookie with desired options
             *
             * @access public
             * @paramater String n - name of cookie to set
             * @paramater Mixed v - Any JS value. If not a string, will be JSON encoded (http://code.google.com/p/cookies/wiki/JSON); NULL to delete
             * @paramater Object o - optional list of cookie options to specify
             * @return void
             */
            set: function (n, v, o) {
                if (typeof o !== 'object' || o === null) {
                    o = {};
                }

                if (v === undefined || v === null) {
                    v = '';
                    o.hoursToLive = -8760;
                } else {
                    /* Logic borrowed from http://jquery.com/ dataAttr method and reversed */
                    v = (v === true)
                        ? 'true' : (v === false)
                            ? 'false' : !isNaN(v)
                                ? String(v) : v;

                    if (typeof v !== 'string') {
                        if (typeof JSON === 'object' && JSON !== null && typeof JSON.stringify === 'function') {
                            v = JSON.stringify(v);
                        } else {
                            throw new Error('cookies.set() received value which could not be serialized.');
                        }
                    }
                }

                document.cookie = n + '=' + encodeURIComponent(v) + cookieOptions(o);
            },
            /**
             * del - delete a cookie (domain and path options must match those with which the cookie was set; this is really an alias for set() with parameters simplified for this use)
             *
             * @access public
             * @paramater Mixed n - String name of cookie to delete, or Bool true to delete all
             * @paramater Object o - optional list of cookie options to specify ( path, domain )
             * @return void
             */
            del: function (n, o) {
                var d = {},
                    i;

                if (typeof o !== 'object' || o === null) {
                    o = {};
                }

                if (typeof n === 'boolean' && n === true) {
                    d = this.get();
                } else if (typeof n === 'string') {
                    d[n] = true;
                }

                for (i in d) {
                    if (Object.prototype.hasOwnProperty.call(d, i) && typeof i === 'string' && i !== '') {
                        this.set(i, null, o);
                    }
                }
            },
            /**
             * test - test whether the browser is accepting cookies
             *
             * @access public
             * @return Boolean
             */
            test: function () {
                var r = false,
                    n = 'cookiesCT',
                    v = 'data';

                this.set(n, v);

                if (this.get(n) === v) {
                    this.del(n);
                    r = true;
                }

                return r;
            },
            /**
             * setOptions - set default options for calls to cookie methods
             *
             * @access public
             * @param Object o - list of cookie options to specify
             * @return void
             */
            setOptions: function (o) {
                if (typeof o !== 'object') {
                    o = null;
                }

                defaultOptions = resolveOptions(o);
            }
        };
    }());
}(window));
