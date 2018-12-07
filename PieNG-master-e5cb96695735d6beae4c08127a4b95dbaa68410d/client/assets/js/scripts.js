var mr = function(a, b, c) {
    "use strict";

    function d(b) {
        b = "undefined" == typeof b ? a : b, g.documentReady.concat(g.documentReadyDeferred).forEach(function(a) {
            a(b)
        })
    }

    function e(b) {
        b = "object" == typeof b ? a : b, g.windowLoad.concat(g.windowLoadDeferred).forEach(function(a) {
            a(b)
        })
    }
    var f = {},
        g = {
            documentReady: [],
            documentReadyDeferred: [],
            windowLoad: [],
            windowLoadDeferred: []
        };
    return a(c).ready(d), a(b).on("load", e), f.setContext = function(b) {
        var c = a;
        return "undefined" != typeof b ? function(c) {
            return a(b).find(c)
        } : c
    }, f.components = g, f.documentReady = d, f.windowLoad = e, f
}(jQuery, window, document);
mr = function(a, b, c, d) {
        "use strict";
        return a.util = {}, a.util.requestAnimationFrame = c.requestAnimationFrame || c.mozRequestAnimationFrame || c.webkitRequestAnimationFrame || c.msRequestAnimationFrame, a.util.documentReady = function(a) {
            var b = new Date,
                c = b.getFullYear();
            a(".update-year").text(c)
        }, a.util.windowLoad = function(a) {
            a("[data-delay-src]").each(function() {
                var b = a(this);
                b.attr("src", b.attr("data-delay-src")), b.removeAttr("data-delay-src")
            })
        }, a.util.getURLParameter = function(a) {
            return decodeURIComponent((new RegExp("[?|&]" + a + "=([^&;]+?)(&|#|;|$)").exec(location.search) || [void 0, ""])[1].replace(/\+/g, "%20")) || null
        }, a.util.capitaliseFirstLetter = function(a) {
            return a.charAt(0).toUpperCase() + a.slice(1)
        }, a.util.slugify = function(a, b) {
            return "undefined" != typeof b ? a.replace(/ +/g, "") : a.toLowerCase().replace(/[\~\!\@\#\$\%\^\&\*\(\)\-\_\=\+\]\[\}\{\'\"\;\\\:\?\/\>\<\.\,]+/g, "").replace(/ +/g, "-")
        }, a.util.sortChildrenByText = function(a, c) {
            var d = b(a),
                e = d.children().get(),
                f = -1,
                g = 1;
            "undefined" != typeof c && (f = 1, g = -1), e.sort(function(a, c) {
                var d = b(a).text(),
                    e = b(c).text();
                return e > d ? f : d > e ? g : 0
            }), d.empty(), b(e).each(function(a, b) {
                d.append(b)
            })
        }, a.util.idleSrc = function(a, c) {
            c = "undefined" != typeof c ? c : "";
            var d = a.is(c + "[src]") ? a : a.find(c + "[src]");
            d.each(function(a, c) {
                c = b(c);
                var d = c.attr("src"),
                    e = c.attr("data-src");
                "undefined" == typeof e && c.attr("data-src", d), c.attr("src", "")
            })
        }, a.util.activateIdleSrc = function(a, c) {
            c = "undefined" != typeof c ? c : "";
            var d = a.is(c + "[src]") ? a : a.find(c + "[src]");
            d.each(function(a, c) {
                c = b(c);
                var d = c.attr("data-src");
                "undefined" != typeof d && c.attr("src", d)
            })
        }, a.util.pauseVideo = function(a) {
            var c = a.is("video") ? a : a.find("video");
            c.each(function(a, c) {
                var d = b(c).get(0);
                d.pause()
            })
        }, a.util.parsePixels = function(a) {
            var d, e = b(c).height();
            return /^[1-9]{1}[0-9]*[p][x]$/.test(a) ? parseInt(a.replace("px", ""), 10) : /^[1-9]{1}[0-9]*[v][h]$/.test(a) ? (d = parseInt(a.replace("vh", ""), 10), e * (d / 100)) : -1
        }, a.components.documentReady.push(a.util.documentReady), a.components.windowLoad.push(a.util.windowLoad), a
    }(mr, jQuery, window, document), mr = function(a, b, c, d) {
        "use strict";
        return a.window = {}, a.window.height = b(c).height(), a.window.width = b(c).width(), b(c).on("resize", function() {
            a.window.height = b(c).height(), a.window.width = b(c).width()
        }), a
    }(mr, jQuery, window, document), mr = function(a, b, c, d) {
        "use strict";
        a.scroll = {};
        var e = c.requestAnimationFrame || c.mozRequestAnimationFrame || c.webkitRequestAnimationFrame || c.msRequestAnimationFrame;
        a.scroll.listeners = [], a.scroll.busy = !1, a.scroll.y = 0, a.scroll.x = 0;
        var f = function(b) {
            jQuery(c).off("scroll.mr"), jQuery(c).on("scroll.mr", function(b) {
                a.scroll.busy === !1 && (a.scroll.busy = !0, e(function(b) {
                    a.scroll.update(b)
                })), b.stopPropagation && b.stopPropagation()
            })
        };
        return a.scroll.update = function(b) {
            var d = "undefined" != typeof c.mr_parallax ? !0 : !1;
            if (a.scroll.y = d ? mr_parallax.mr_getScrollPosition() : c.pageYOffset, a.scroll.busy = !1, d && mr_parallax.mr_parallaxBackground(), a.scroll.listeners.length > 0)
                for (var e = 0, f = a.scroll.listeners.length; f > e; e++) a.scroll.listeners[e](b)
        }, a.scroll.documentReady = f, a.components.documentReady.push(f), a
    }(mr, jQuery, window, document), mr = function(a, b, c, d) {
        "use strict";
        a.scroll.classModifiers = {}, a.scroll.classModifiers.rules = [], a.scroll.classModifiers.parseScrollRules = function(b) {
            var c = b.attr("data-scroll-class"),
                d = c.split(";");
            return d.forEach(function(c) {
                var d, e, f = {};
                if (d = c.replace(/\s/g, "").split(":"), 2 === d.length) {
                    if (e = a.util.parsePixels(d[0]), !(e > -1)) return !1;
                    if (f.scrollPoint = e, !d[1].length) return !1;
                    var g = d[1];
                    f.toggleClass = g, f.hasClass = b.hasClass(g), f.element = b.get(0), a.scroll.classModifiers.rules.push(f)
                }
            }), a.scroll.classModifiers.rules.length ? !0 : !1
        }, a.scroll.classModifiers.update = function(b) {
            for (var c, d = a.scroll.y, e = a.scroll.classModifiers.rules, f = e.length; f--;) c = e[f], d > c.scrollPoint && !c.hasClass && (c.element.classList.add(c.toggleClass), c.hasClass = a.scroll.classModifiers.rules[f].hasClass = !0), d < c.scrollPoint && c.hasClass && (c.element.classList.remove(c.toggleClass), c.hasClass = a.scroll.classModifiers.rules[f].hasClass = !1)
        };
        var e = function() {
                b('.main-container [data-scroll-class*="pos-fixed"]').each(function() {
                    var a = b(this);
                    a.css("max-width", a.parent().outerWidth()), a.parent().css("min-height", a.outerHeight())
                })
            },
            f = function(b) {
                b("[data-scroll-class]").each(function() {
                    var c = b(this);
                    !a.scroll.classModifiers.parseScrollRules(c)
                }), e(), b(c).on("resize", e), a.scroll.classModifiers.rules.length && a.scroll.listeners.push(a.scroll.classModifiers.update)
            };
        return a.components.documentReady.push(f), a.scroll.classModifiers.documentReady = f, a
    }(mr, jQuery, window, document), mr = function(a, b, c, d) {
        "use strict";
        return a.accordions = {}, a.accordions.documentReady = function(b) {
            b(".accordion__title").on("click", function() {
                a.accordions.activatePanel(b(this))
            }), b(".accordion").each(function() {
                var a = b(this),
                    c = a.outerHeight(!0);
                a.css("min-height", c)
            }), "" !== c.location.hash && a.accordions.activatePanelById(c.location.hash, !0), b('a[href^="#"]').on("click", function() {
                a.accordions.activatePanelById(b(this).attr("href"), !0)
            })
        }, a.accordions.activatePanel = function(a, c) {
            var e = b(a),
                f = e.closest(".accordion"),
                g = e.closest("li"),
                h = d.createEvent("Event"),
                i = d.createEvent("Event");
            if (h.initEvent("panelOpened.accordions.mr", !0, !0), i.initEvent("panelClosed.accordions.mr", !0, !0), g.hasClass("active")) c !== !0 && (g.removeClass("active"), e.trigger("panelClosed.accordions.mr").get(0).dispatchEvent(i));
            else if (f.hasClass("accordion--oneopen")) {
                var j = f.find("li.active");
                j.removeClass("active"), j.trigger("panelClosed.accordions.mr").get(0).dispatchEvent(i), g.addClass("active"), g.trigger("panelOpened.accordions.mr").get(0).dispatchEvent(h)
            } else g.is(".active") || g.trigger("panelOpened.accordions.mr").get(0).dispatchEvent(h), g.addClass("active")
        }, a.accordions.activatePanelById = function(c, d) {
            var e;
            "" !== c && "#" !== c && (e = b(".accordion > li > .accordion__title#" + c.replace("#", "")), e.length && (b("html, body").stop(!0).animate({
                scrollTop: e.offset().top - 50
            }, 1200), a.accordions.activatePanel(e, d)))
        }, a.components.documentReady.push(a.accordions.documentReady), a
    }(mr, jQuery, window, document), mr = function(a, b, c, d) {
        "use strict";
        var e = function(a) {
            a(".alert__close").on("click touchstart", function() {
                jQuery(this).closest(".alert").addClass("alert--dismissed")
            })
        };
        return a.alerts = {
            documentReady: e
        }, a.components.documentReady.push(e), a
    }(mr, jQuery, window, document), mr = function(a, b, c, d) {
        "use strict";
        var e = function(a) {
            a(".background-image-holder").each(function() {
                var b = a(this).children("img").attr("src");
                a(this).css("background", 'url("' + b + '")').css("background-position", "initial").css("opacity", "1")
            })
        };
        return a.backgrounds = {
            documentReady: e
        }, a.components.documentReady.push(e), a
    }(mr, jQuery, window, document), mr = function(a, b, c, d) {
        "use strict";
        var e = function(a) {
            a('.nav-container .bar[data-scroll-class*="fixed"]:not(.bar--absolute)').each(function() {
                var b = a(this),
                    c = b.outerHeight(!0);
                b.closest(".nav-container").css("min-height", c)
            })
        };
        return a.bars = {
            documentReady: e
        }, a.components.documentReady.push(e), a
    }(mr, jQuery, window, document), mr = function(a, b, c, d) {
        "use strict";
        return a.cookies = {
            getItem: function(a) {
                return a ? decodeURIComponent(d.cookie.replace(new RegExp("(?:(?:^|.*;)\\s*" + encodeURIComponent(a).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*([^;]*).*$)|^.*$"), "$1")) || null : null
            },
            setItem: function(a, b, c, e, f, g) {
                if (!a || /^(?:expires|max\-age|path|domain|secure)$/i.test(a)) return !1;
                var h = "";
                if (c) switch (c.constructor) {
                    case Number:
                        h = c === 1 / 0 ? "; expires=Fri, 31 Dec 9999 23:59:59 GMT" : "; max-age=" + c;
                        break;
                    case String:
                        h = "; expires=" + c;
                        break;
                    case Date:
                        h = "; expires=" + c.toUTCString()
                }
                return d.cookie = encodeURIComponent(a) + "=" + encodeURIComponent(b) + h + (f ? "; domain=" + f : "") + (e ? "; path=" + e : "") + (g ? "; secure" : ""), !0
            },
            removeItem: function(a, b, c) {
                return this.hasItem(a) ? (d.cookie = encodeURIComponent(a) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT" + (c ? "; domain=" + c : "") + (b ? "; path=" + b : ""), !0) : !1
            },
            hasItem: function(a) {
                return a ? new RegExp("(?:^|;\\s*)" + encodeURIComponent(a).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=").test(d.cookie) : !1
            },
            keys: function() {
                for (var a = d.cookie.replace(/((?:^|\s*;)[^\=]+)(?=;|$)|^\s*|\s*(?:\=[^;]*)?(?:\1|$)/g, "").split(/\s*(?:\=[^;]*)?;\s*/), b = a.length, c = 0; b > c; c++) a[c] = decodeURIComponent(a[c]);
                return a
            }
        }, a
    }(mr, jQuery, window, document), mr = function(a, b, c, d) {
        "use strict";
        var e = function(a) {
            a(".countdown[data-date]").each(function() {
                var b, c = a(this),
                    d = c.attr("data-date"),
                    e = "days";
                "undefined" != typeof c.attr("data-date-fallback") && (b = c.attr("data-date-fallback")), "undefined" != typeof c.attr("data-days-text") && (e = c.attr("data-days-text")), c.countdown(d, function(a) {
                    a.elapsed ? c.text(b) : c.text(a.strftime("%D " + e + " %H:%M:%S"))
                })
            })
        };
        return a.countdown = {
            documentReady: e
        }, a.components.documentReadyDeferred.push(e), a
    }(mr, jQuery, window, document), mr = function(a, b, c, d) {
        "use strict";
        var e = function(a) {
            a(".datepicker").length && a(".datepicker").pickadate()
        };
        return a.components.documentReadyDeferred.push(e), a
    }(mr, jQuery, window, document), mr = function(a, b, c, d) {
        "use strict";

        function e(a) {
            a(".dropdown__container").each(function() {
                var a, b, c, d, e;
                jQuery(this).css("left", ""), a = jQuery(this), b = a.offset().left, c = jQuery(".containerMeasure").offset().left, d = a.closest(".dropdown").offset().left, e = null, a.css("left", -b + c), a.find('.dropdown__content:not([class*="md-12"])').length && (e = a.find(".dropdown__content"), e.css("left", d - c))
            }), a(".dropdown__content").each(function() {
                var a, b, d, e, f, g;
                a = jQuery(this), b = a.offset().left, d = a.outerWidth(!0), e = b + d, f = jQuery(c).outerWidth(!0), g = jQuery(".containerMeasure").outerWidth() - d, e > f && a.css("left", g)
            })
        }

        function f(a) {
            var b = jQuery(c).width();
            a(".dropdown__container").each(function() {
                var a, c, d, e, f;
                jQuery(this).css("left", ""), a = jQuery(this), c = b - (a.offset().left + a.outerWidth(!0)), d = jQuery(".containerMeasure").offset().left, e = b - (a.closest(".dropdown").offset().left + a.closest(".dropdown").outerWidth(!0)), f = null, a.css("right", -c + d), a.find('.dropdown__content:not([class*="md-12"])').length && (f = a.find(".dropdown__content"), f.css("right", e - d))
            }), a(".dropdown__content").each(function() {
                var a, d, e, f, g, h;
                a = jQuery(this), d = b - (a.offset().left + a.outerWidth(!0)), e = a.outerWidth(!0), f = d + e, g = jQuery(c).outerWidth(!0), h = jQuery(".containerMeasure").outerWidth() - e, f > g && a.css("right", h)
            })
        }
        a.dropdowns = {}, a.dropdowns.done = !1;
        var g = function(b) {
            var g = !1;
            b('html[dir="rtl"]').length && (g = !0), a.dropdowns.done || (jQuery(d).on("click", "body:not(.dropdowns--hover) .dropdown:not(.dropdown--hover), body.dropdowns--hover .dropdown.dropdown--click", function(a) {
                var c = jQuery(this);
                jQuery(a.target).is(".dropdown--active > .dropdown__trigger") ? (c.siblings().removeClass("dropdown--active").find(".dropdown").removeClass("dropdown--active"), c.toggleClass("dropdown--active")) : (b(".dropdown--active").removeClass("dropdown--active"), c.addClass("dropdown--active"))
            }), jQuery(d).on("click touchstart", "body:not(.dropdowns--hover)", function(a) {
                jQuery(a.target).is('[class*="dropdown"], [class*="dropdown"] *') || b(".dropdown--active").removeClass("dropdown--active")
            }), jQuery("body.dropdowns--hover .dropdown").on("click", function(a) {
                a.stopPropagation();
                var b = jQuery(this);
                b.toggleClass("dropdown--active")
            }), jQuery("body").append('<div class="container containerMeasure" style="opacity:0;pointer-events:none;"></div>'), g === !1 ? (e(b), jQuery(c).on("resize", function() {
                e(b)
            })) : (f(b), jQuery(c).on("resize", function() {
                f(b)
            })), a.dropdowns.done = !0)
        };
        return a.dropdowns.documentReady = g, a.components.documentReady.push(g), a
    }(mr, jQuery, window, document), mr = function(a, b, c, d) {
        "use strict";
        a.forms = {}, a.forms.captcha = {}, a.forms.captcha.widgets = [], a.forms.captcha.done = !1;
        var e = function(b) {
            a.forms.captcha.widgets = [], b('.input-checkbox input[type="checkbox"], .input-radio input[type="radio"]').each(function(a) {
                var c = b(this),
                    d = c.siblings("label"),
                    e = "input-assigned-" + a;
                "undefined" == typeof c.attr("id") || "" === c.attr("id") ? (c.attr("id", e), d.attr("for", e)) : (e = c.attr("id"), d.attr("for", e))
            }), b(".input-number__controls > span").off("click.mr").on("click.mr", function() {
                var a = jQuery(this),
                    b = a.closest(".input-number"),
                    c = b.find('input[type="number"]'),
                    d = c.attr("max"),
                    e = c.attr("min"),
                    f = 1,
                    g = parseInt(c.attr("value"), 10);
                b.is("[data-step]") && (f = parseInt(b.attr("data-step"), 10)), a.hasClass("input-number__increase") ? d >= g + f && c.attr("value", g + f) : g - f >= e && c.attr("value", g - f)
            }), b(".input-file .btn").off("click.mr").on("click.mr", function() {
                return b(this).siblings("input").trigger("click"), !1
            }), b('form.form-email, form[action*="list-manage.com"], form[action*="createsend.com"]').attr("novalidate", !0).off("submit").on("submit", a.forms.submit), b(d).on("change, input, paste, keyup", ".attempted-submit .field-error", function() {
                b(this).removeClass("field-error")
            }), b('form[data-recaptcha-sitekey]:not([data-recaptcha-sitekey=""])').each(function() {
                var b, c, d, e, f, g, h, i = jQuery(this),
                    j = i.find("div.recaptcha");
                g = i.attr("data-recaptcha-theme"), g = "undefined" != typeof g ? g : "", h = i.attr("data-recaptcha-size"), h = "undefined" != typeof h ? h : "", a.forms.captcha.sitekey = i.attr("data-recaptcha-sitekey"), j.length || (b = i.find("button[type=submit]").closest('[class*="col-"]'), j = jQuery("<div>").addClass("recaptcha"), c = jQuery("<div>").addClass("col-xs-12").append(j), c.insertBefore(b)), d = {
                    element: j.get(0),
                    parentForm: i,
                    theme: g,
                    size: h
                }, a.forms.captcha.widgets.push(d), a.forms.captcha.done === !1 ? jQuery('script[src*="recaptcha/api.js"]').length || (e = jQuery("<script async defer>"), f = "https://www.google.com/recaptcha/api.js?onload=mrFormsCaptchaInit&render=explicit", e.attr("src", f), jQuery("body").append(e), a.forms.captcha.done = !0) : "undefined" != typeof grecaptcha && a.forms.captcha.renderWidgets()
            })
        };
        return a.forms.documentReady = e, a.forms.submit = function(d) {
            d.preventDefault ? d.preventDefault() : d.returnValue = !1;
            var e, f, g, h, i, j = b("body"),
                k = b(d.target).closest("form"),
                l = "undefined" != typeof k.attr("action") ? k.attr("action") : "",
                m = k.find('button[type="submit"], input[type="submit"]'),
                n = 0,
                o = k.attr("original-error"),
                p = k.find("div.recaptcha").length ? !0 : !1;
            if (j.find(".form-error, .form-success").remove(), m.attr("data-text", m.text()), h = k.attr("data-error") ? k.attr("data-error") : "Please fill all fields correctly", i = k.attr("data-success") ? k.attr("data-success") : "Thanks, we'll be in touch shortly", j.append('<div class="form-error" style="display: none;">' + h + "</div>"), j.append('<div class="form-success" style="display: none;">' + i + "</div>"), f = j.find(".form-error"), g = j.find(".form-success"), k.addClass("attempted-submit"), -1 !== l.indexOf("createsend.com") || -1 !== l.indexOf("list-manage.com"))
                if ("undefined" != typeof o && o !== !1 && f.html(o), 1 !== a.forms.validateFields(k)) {
                    k.removeClass("attempted-submit"), f.fadeOut(200), m.addClass("btn--loading");
                    try {
                        b.ajax({
                            url: k.attr("action"),
                            crossDomain: !0,
                            data: k.serialize(),
                            method: "GET",
                            cache: !1,
                            dataType: "json",
                            contentType: "application/json; charset=utf-8",
                            success: function(b) {
                                "success" !== b.result && 200 !== b.Status ? (f.attr("original-error", f.text()), f.html(b.msg).stop(!0).fadeIn(1e3), g.stop(!0).fadeOut(1e3), m.removeClass("btn--loading")) : (m.removeClass("btn--loading"), e = k.attr("data-success-redirect"), "undefined" != typeof e && e !== !1 && "" !== e ? c.location = e : (a.forms.resetForm(k), a.forms.showFormSuccess(g, f, 1e3, 5e3, 500)))
                            }
                        })
                    } catch (q) {
                        f.attr("original-error", f.text()), f.html(q.message), a.forms.showFormError(g, f, 1e3, 5e3, 500), m.removeClass("btn--loading")
                    }
                } else a.forms.showFormError(g, f, 1e3, 5e3, 500);
            else "undefined" != typeof o && o !== !1 && f.text(o), n = a.forms.validateFields(k), 1 === n ? a.forms.showFormError(g, f, 1e3, 5e3, 500) : (k.removeClass("attempted-submit"), f.fadeOut(200), m.addClass("btn--loading"), jQuery.ajax({
                type: "POST",
                url: "http://mailform.mediumra.re/stack/mail.php",
                data: k.serialize() + "&url=" + c.location.href + "&captcha=" + p,
                success: function(d) {
                    m.removeClass("btn--loading"), b.isNumeric(d) ? parseInt(d, 10) > 0 && (e = k.attr("data-success-redirect"), "undefined" != typeof e && e !== !1 && "" !== e && (c.location = e), a.forms.resetForm(k), a.forms.showFormSuccess(g, f, 1e3, 5e3, 500), a.forms.captcha.resetWidgets()) : (f.attr("original-error", f.text()), f.text(d).stop(!0).fadeIn(1e3), g.stop(!0).fadeOut(1e3))
                },
                error: function(a, b, c) {
                    f.attr("original-error", f.text()), f.text(c).stop(!0).fadeIn(1e3), g.stop(!0).fadeOut(1e3), m.removeClass("btn--loading")
                }
            }));
            return !1
        }, a.forms.validateFields = function(a) {
            var c, d, e = b(e),
                f = !1;
            if (a = b(a), a.find('.validate-required[type="checkbox"]').each(function() {
                    var a = b(this);
                    b('[name="' + b(this).attr("name") + '"]:checked').length || (f = 1, c = b(this).attr("data-name") || "check", a.parent().addClass("field-error"))
                }), a.find(".validate-required, .required, [required]").not('input[type="checkbox"]').each(function() {
                    "" === b(this).val() ? (b(this).addClass("field-error"), f = 1) : b(this).removeClass("field-error")
                }), a.find('.validate-email, .email, [name*="cm-"][type="email"]').each(function() {
                    /(.+)@(.+){2,}\.(.+){2,}/.test(b(this).val()) ? b(this).removeClass("field-error") : (b(this).addClass("field-error"), f = 1)
                }), a.find(".validate-number-dash").each(function() {
                    /^[0-9][0-9-]+[0-9]$/.test(b(this).val()) ? b(this).removeClass("field-error") : (b(this).addClass("field-error"), f = 1)
                }), a.find("div.recaptcha").length && "undefined" != typeof a.attr("data-recaptcha-sitekey") && (d = b(a.find("div.recaptcha")), "" !== grecaptcha.getResponse(a.data("recaptchaWidgetID")) ? d.removeClass("field-error") : (d.addClass("field-error"), f = 1)), a.find(".field-error").length) {
                var g = b(a).find(".field-error:first");
                g.length && b("html, body").stop(!0).animate({
                    scrollTop: g.offset().top - 100
                }, 1200, function() {
                    g.focus()
                })
            } else e.find(".form-error").fadeOut(1e3);
            return f
        }, a.forms.showFormSuccess = function(a, b, c, d, e) {
            a.stop(!0).fadeIn(c), b.stop(!0).fadeOut(c), setTimeout(function() {
                a.stop(!0).fadeOut(e)
            }, d)
        }, a.forms.showFormError = function(a, b, c, d, e) {
            b.stop(!0).fadeIn(c), a.stop(!0).fadeOut(c), setTimeout(function() {
                b.stop(!0).fadeOut(e)
            }, d)
        }, a.forms.resetForm = function(a) {
            a = b(a), a.get(0).reset(), a.find(".input-radio, .input-checkbox").removeClass("checked")
        }, c.mrFormsCaptchaInit = function() {
            a.forms.captcha.renderWidgets()
        }, a.forms.captcha.renderWidgets = function() {
            a.forms.captcha.widgets.forEach(function(b) {
                "" === b.element.innerHTML && (b.id = grecaptcha.render(b.element, {
                    sitekey: a.forms.captcha.sitekey,
                    theme: b.theme,
                    size: b.size,
                    callback: a.forms.captcha.setHuman
                }), b.parentForm.data("recaptchaWidgetID", b.id))
            })
        }, a.forms.captcha.resetWidgets = function() {
            a.forms.captcha.widgets.forEach(function(a) {
                grecaptcha.reset(a.id)
            })
        }, a.forms.captcha.setHuman = function() {
            jQuery("div.recaptcha.field-error").removeClass("field-error")
        }, a.components.documentReadyDeferred.push(e), a
    }(mr, jQuery, window, document), mr = function(a, b, c, d) {
        "use strict";
        var e = function(a) {
            a("[data-gradient-bg]").each(function(b, c) {
                var d, e, f, g = a(this),
                    h = "granim-" + b,
                    i = g.attr("data-gradient-bg"),
                    j = [],
                    k = [];
                if (g.prepend('<canvas id="' + h + '"></canvas>'), e = /^(#[0-9|a-f|A-F]{6}){1}([ ]*,[ ]*#[0-9|a-f|A-F]{6})*$/.test(i), e === !0)
                    for (i = i.replace(" ", ""), i = i.split(","), d = i.length, d % 2 !== 0 && i.push(i[d - 1]), f = 0; d / 2 > f; f++) k = [], k.push(i.shift()), k.push(i.shift()), j.push(k);
                a(this), new Granim({
                    element: "#" + h,
                    name: "basic-gradient",
                    direction: "left-right",
                    opacity: [1, 1],
                    isPausedWhenNotInView: !0,
                    states: {
                        "default-state": {
                            gradients: j
                        }
                    }
                })
            })
        };
        return a.granim = {
            documentReady: e
        }, a.components.documentReadyDeferred.push(e), a
    }(mr, jQuery, window, document), mr = function(a, b, c, d) {
        "use strict";
        var e = function(a) {
            if (a(".instafeed").length) {
                var b, c, d = "4079540202.b9b1d8a.1d13c245c68d4a17bfbff87919aaeb14",
                    e = "b9b1d8ae049d4153b24a6332f0088686";
                a(".instafeed[data-access-token][data-client-id]").length && (b = a(".instafeed[data-access-token][data-client-id]").first().attr("data-access-token"), c = a(".instafeed[data-access-token][data-client-id]").first().attr("data-client-id"), "" !== b && (d = b), "" !== c && (e = c)), jQuery.fn.spectragram.accessData = {
                    accessToken: d,
                    clientID: e
                }
            }
            a(".instafeed").each(function() {
                var b = a(this),
                    c = b.attr("data-user-name"),
                    d = 12;
                "undefined" != typeof b.attr("data-amount") && (d = parseInt(b.attr("data-amount"), 10)), b.append("<ul></ul>"), b.children("ul").spectragram("getUserFeed", {
                    query: c,
                    max: d
                })
            })
        };
        return a.instagram = {
            documentReady: e
        }, a.components.documentReadyDeferred.push(e), a
    }(mr, jQuery, window, document), mr = function(a, b, c, d) {
        "use strict";
        a.maps = {};
        var e = function(b) {
            b(".map-holder").on("click", function() {
                b(this).addClass("interact")
            }).removeClass("interact");
            var c = b(".map-container[data-maps-api-key]");
            c.length && (c.addClass("gmaps-active"), a.maps.initAPI(b), a.maps.init())
        };
        return a.maps.documentReady = e, a.maps.initAPI = function(a) {
            if (d.querySelector("[data-maps-api-key]") && !d.querySelector(".gMapsAPI") && a("[data-maps-api-key]").length) {
                var b = d.createElement("script"),
                    c = a("[data-maps-api-key]:first").attr("data-maps-api-key");
                c = "undefined" != typeof c ? c : "", "" !== c && (b.type = "text/javascript", b.src = "https://maps.googleapis.com/maps/api/js?key=" + c + "&callback=mr.maps.init", b.className = "gMapsAPI", d.body.appendChild(b))
            }
        }, a.maps.init = function() {
            "undefined" != typeof c.google && "undefined" != typeof c.google.maps && jQuery(".gmaps-active").each(function() {
                var a, b, e = this,
                    f = jQuery(this),
                    g = "undefined" != typeof f.attr("data-map-style") ? f.attr("data-map-style") : !1,
                    h = JSON.parse(g) || [{
                        featureType: "landscape",
                        stylers: [{
                            saturation: -100
                        }, {
                            lightness: 65
                        }, {
                            visibility: "on"
                        }]
                    }, {
                        featureType: "poi",
                        stylers: [{
                            saturation: -100
                        }, {
                            lightness: 51
                        }, {
                            visibility: "simplified"
                        }]
                    }, {
                        featureType: "road.highway",
                        stylers: [{
                            saturation: -100
                        }, {
                            visibility: "simplified"
                        }]
                    }, {
                        featureType: "road.arterial",
                        stylers: [{
                            saturation: -100
                        }, {
                            lightness: 30
                        }, {
                            visibility: "on"
                        }]
                    }, {
                        featureType: "road.local",
                        stylers: [{
                            saturation: -100
                        }, {
                            lightness: 40
                        }, {
                            visibility: "on"
                        }]
                    }, {
                        featureType: "transit",
                        stylers: [{
                            saturation: -100
                        }, {
                            visibility: "simplified"
                        }]
                    }, {
                        featureType: "administrative.province",
                        stylers: [{
                            visibility: "off"
                        }]
                    }, {
                        featureType: "water",
                        elementType: "labels",
                        stylers: [{
                            visibility: "on"
                        }, {
                            lightness: -25
                        }, {
                            saturation: -100
                        }]
                    }, {
                        featureType: "water",
                        elementType: "geometry",
                        stylers: [{
                            hue: "#ffff00"
                        }, {
                            lightness: -25
                        }, {
                            saturation: -97
                        }]
                    }],
                    i = "undefined" != typeof f.attr("data-map-zoom") && "" !== f.attr("data-map-zoom") ? 1 * f.attr("data-map-zoom") : 17,
                    j = "undefined" != typeof f.attr("data-latlong") ? f.attr("data-latlong") : !1,
                    k = j ? 1 * j.substr(0, j.indexOf(",")) : !1,
                    l = j ? 1 * j.substr(j.indexOf(",") + 1) : !1,
                    m = new google.maps.Geocoder,
                    n = "undefined" != typeof f.attr("data-address") ? f.attr("data-address").split(";") : [""],
                    o = "undefined" != typeof f.attr("data-marker-image") ? f.attr("data-marker-image") : "img/mapmarker.png",
                    p = "We Are Here",
                    q = jQuery(d).width() > 766 ? !0 : !1,
                    r = {
                        draggable: q,
                        scrollwheel: !1,
                        zoom: i,
                        disableDefaultUI: !0,
                        styles: h
                    };
                "undefined" != typeof f.attr("data-marker-title") && "" !== f.attr("data-marker-title") && (p = f.attr("data-marker-title")), void 0 !== n && "" !== n[0] ? m.geocode({
                    address: n[0].replace("[nomarker]", "")
                }, function(a, b) {
                    if (b === google.maps.GeocoderStatus.OK) {
                        var d = new google.maps.Map(e, r);
                        d.setCenter(a[0].geometry.location), n.forEach(function(a) {
                            var b;
                            if (o = {
                                    url: "undefined" == typeof c.mr_variant ? "object" != typeof o ? o : o.url : "../img/mapmarker.png",
                                    scaledSize: new google.maps.Size(50, 50)
                                }, /(\-?\d+(\.\d+)?),\s*(\-?\d+(\.\d+)?)/.test(a)) var e = a.split(","),
                                f = new google.maps.Marker({
                                    position: {
                                        lat: 1 * e[0],
                                        lng: 1 * e[1]
                                    },
                                    map: d,
                                    icon: o,
                                    title: p,
                                    optimised: !1
                                });
                            else a.indexOf("[nomarker]") < 0 && (b = new google.maps.Geocoder, b.geocode({
                                address: a.replace("[nomarker]", "")
                            }, function(a, b) {
                                b === google.maps.GeocoderStatus.OK && (f = new google.maps.Marker({
                                    map: d,
                                    icon: o,
                                    title: p,
                                    position: a[0].geometry.location,
                                    optimised: !1
                                }))
                            }))
                        })
                    }
                }) : "undefined" != typeof k && "" !== k && k !== !1 && "undefined" != typeof l && "" !== l && l !== !1 && (r.center = {
                    lat: k,
                    lng: l
                }, a = new google.maps.Map(f, r), b = new google.maps.Marker({
                    position: {
                        lat: k,
                        lng: l
                    },
                    map: a,
                    icon: o,
                    title: p
                }))
            })
        }, a.components.documentReady.push(e), a
    }(mr, jQuery, window, document), mr = function(a, b, c, d) {
        "use strict";
        var e = function(b) {
                a.masonry.updateFilters(), b(d).on("click touchstart", ".masonry__filters li", function() {
                    var a = b(this),
                        c = a.closest(".masonry").find(".masonry__container"),
                        d = "*";
                    "*" !== a.attr("data-masonry-filter") && (d = ".filter-" + a.attr("data-masonry-filter")), a.siblings("li").removeClass("active"), a.addClass("active"), c.removeClass("masonry--animate"), c.on("layoutComplete", function() {
                        b(this).addClass("masonry--active"), "undefined" != typeof mr_parallax && setTimeout(function() {
                            mr_parallax.profileParallaxElements()
                        }, 100)
                    }), c.isotope({
                        filter: d
                    })
                })
            },
            f = function() {
                b(".masonry").each(function() {
                    var a = b(this).find(".masonry__container"),
                        c = b(this),
                        d = "*";
                    c.is("[data-default-filter]") && (d = c.attr("data-default-filter").toLowerCase(), d = ".filter-" + d, c.find("li[data-masonry-filter]").removeClass("active"), c.find('li[data-masonry-filter="' + c.attr("data-default-filter").toLowerCase() + '"]').addClass("active")), a.on("layoutComplete", function() {
                        a.addClass("masonry--active"), "undefined" != typeof mr_parallax && setTimeout(function() {
                            mr_parallax.profileParallaxElements()
                        }, 100)
                    }), a.isotope({
                        itemSelector: ".masonry__item",
                        filter: d,
                        masonry: {
                            columnWidth: ".masonry__item"
                        }
                    })
                })
            };
        return a.masonry = {
            documentReady: e,
            windowLoad: f
        }, a.masonry.updateFilters = function(c) {
            c = "undefined" != typeof c ? c : ".masonry";
            var d = b(c);
            d.each(function() {
                var c, d = b(this),
                    e = d.find(".masonry__container"),
                    f = d.find(".masonry__filters"),
                    g = "undefined" != typeof f.attr("data-filter-all-text") ? f.attr("data-filter-all-text") : "All";
                d.is(".masonry") && e.find(".masonry__item[data-masonry-filter]").length && (c = f.find("> ul"), c.length || (c = f.append("<ul></ul>").find("> ul")), e.find(".masonry__item[data-masonry-filter]").each(function() {
                    var d = b(this),
                        e = d.attr("data-masonry-filter"),
                        f = [];
                    "undefined" != typeof e && "" !== e && (f = e.split(",")), jQuery(f).each(function(b, e) {
                        var f = a.util.slugify(e);
                        d.addClass("filter-" + f), c.find('[data-masonry-filter="' + f + '"]').length || c.append('<li data-masonry-filter="' + f + '">' + e + "</li>")
                    })
                }), a.util.sortChildrenByText(b(this).find(".masonry__filters ul")), c.find('[data-masonry-filter="*"]').length || c.prepend('<li class="active" data-masonry-filter="*">' + g + "</li>"))
            })
        }, a.masonry.updateLayout = function(a) {
            a = "undefined" != typeof a ? a : ".masonry";
            var c = b(a);
            c.each(function() {
                var a = b(this),
                    c = a.find(".masonry__item:not([style])"),
                    d = a.find(".masonry__container");
                a.is(".masonry") && (c.length && d.isotope("appended", c).isotope("layout"), d.isotope("layout"))
            })
        }, a.components.documentReady.push(e), a.components.windowLoad.push(f), a
    }(mr, jQuery, window, document), mr = function(a, b, c, d) {
        "use strict";
        a.modals = {};
        var e = function(b) {
            var e = '<div class="all-page-modals"></div>',
                f = b("div.main-container");
            if (f.length ? (jQuery(e).insertAfter(f), a.modals.allModalsContainer = b("div.all-page-modals")) : (jQuery("body").append(e), a.modals.allModalsContainer = jQuery("body div.all-page-modals")), b(".modal-container").each(function() {
                    var d = b(this),
                        e = (b(c), d.find(".modal-content"));
                    if (d.find(".modal-close").length || d.find(".modal-content").append('<div class="modal-close modal-close-cross"></div>'), void 0 !== e.attr("data-width")) {
                        var f = 1 * e.attr("data-width").substr(0, e.attr("data-width").indexOf("%"));
                        e.css("width", f + "%")
                    }
                    if (void 0 !== e.attr("data-height")) {
                        var g = 1 * e.attr("data-height").substr(0, e.attr("data-height").indexOf("%"));
                        e.css("height", g + "%")
                    }
                    a.util.idleSrc(d, "iframe")
                }), b(".modal-instance").each(function(c) {
                    var d = b(this),
                        e = d.find(".modal-container"),
                        f = (d.find(".modal-content"), d.find(".modal-trigger"));
                    f.attr("data-modal-index", c), e.attr("data-modal-index", c), "undefined" != typeof e.attr("data-modal-id") && f.attr("data-modal-id", e.attr("data-modal-id")), e = e.detach(), a.modals.allModalsContainer.append(e)
                }), b(".modal-trigger").on("click", function() {
                    var c, d, e = b(this);
                    return "undefined" != typeof e.attr("data-modal-id") ? (c = e.attr("data-modal-id"), d = a.modals.allModalsContainer.find('.modal-container[data-modal-id="' + c + '"]')) : (c = b(this).attr("data-modal-index"), d = a.modals.allModalsContainer.find('.modal-container[data-modal-index="' + c + '"]')), a.util.activateIdleSrc(d, "iframe"), a.modals.autoplayVideo(d), a.modals.showModal(d), !1
                }), jQuery(d).on("click", ".modal-close", a.modals.closeActiveModal), jQuery(d).keyup(function(b) {
                    27 === b.keyCode && a.modals.closeActiveModal()
                }), b(".modal-container").on("click", function(b) {
                    b.target === this && a.modals.closeActiveModal()
                }), b(".modal-container[data-autoshow]").each(function() {
                    var c = b(this),
                        d = 1 * c.attr("data-autoshow");
                    a.util.activateIdleSrc(c), a.modals.autoplayVideo(c), "undefined" != typeof c.attr("data-cookie") ? a.cookies.hasItem(c.attr("data-cookie")) || a.modals.showModal(c, d) : a.modals.showModal(c, d)
                }), b(".modal-container[data-show-on-exit]").each(function() {
                    var c = jQuery(this),
                        e = c.attr("data-show-on-exit"),
                        f = 0;
                    c.attr("data-delay") && (f = parseInt(c.attr("data-delay"), 10) || 0), b(e).length && (c.prepend(b('<i class="ti-close close-modal">')), jQuery(d).on("mouseleave", e, function() {
                        b(".modal-active").length || ("undefined" != typeof c.attr("data-cookie") ? a.cookies.hasItem(c.attr("data-cookie")) || a.modals.showModal(c, f) : a.modals.showModal(c, f))
                    }))
                }), 2 === c.location.href.split("#").length) {
                var g = c.location.href.split("#").pop();
                b('[data-modal-id="' + g + '"]').length && (a.modals.closeActiveModal(), a.modals.showModal(b('[data-modal-id="' + g + '"]')))
            }
            b(d).on("wheel mousewheel scroll", ".modal-content, .modal-content .scrollable", function(a) {
                a.preventDefault && a.preventDefault(), a.stopPropagation && a.stopPropagation(), this.scrollTop += a.originalEvent.deltaY
            })
        };
        return a.modals.documentReady = e, a.modals.showModal = function(a, c) {
            var d = "undefined" != typeof c ? 1 * c : 0;
            setTimeout(function() {
                b(a).addClass("modal-active")
            }, d)
        }, a.modals.closeActiveModal = function() {
            var b = jQuery("body div.modal-active");
            a.util.idleSrc(b, "iframe"), a.util.pauseVideo(b), "undefined" != typeof b.attr("data-cookie") && a.cookies.setItem(b.attr("data-cookie"), "true", 1 / 0, "/"), b.removeClass("modal-active")
        }, a.modals.autoplayVideo = function(a) {
            if (a.find("video[autoplay]").length) {
                var b = a.find("video").get(0);
                b.play()
            }
        }, a.components.documentReady.push(e), a
    }(mr, jQuery, window, document), mr = function(a, b, c, d) {
        "use strict";
        a.newsletters = {};
        var e = function(b) {
            var c, d, e, f, g, h;
            b('form[action*="createsend.com"]').each(function() {
                c = b(this), c.attr("novalidate", "novalidate"), c.is(".form--no-placeholders") ? c.find("input[placeholder]").removeAttr("placeholder") : c.find("input:not([checkbox]):not([radio])").each(function() {
                    var a = b(this);
                    "undefined" != typeof a.attr("placeholder") ? "" === a.attr("placeholder") && a.siblings("label").length && (a.attr("placeholder", a.siblings("label").first().text()), c.is(".form--no-labels") && a.siblings("label").first().remove()) : a.siblings("label").length && (a.attr("placeholder", a.siblings("label").first().text()), c.is(".form--no-labels") && a.siblings("label").first().remove()), a.parent().is("p") && a.unwrap()
                }), c.find("select").wrap('<div class="input-select"></div>'), c.find('input[type="radio"]').wrap('<div class="input-radio"></div>'), c.find('input[type="checkbox"]').each(function() {
                    d = b(this), f = d.attr("id"), e = c.find("label[for=" + f + "]"), e.length || (e = b('<label for="' + f + '"></label>')), d.before('<div class="input-checkbox" data-id="' + f + '"></div>'), b('.input-checkbox[data-id="' + f + '"]').prepend(d), b('.input-checkbox[data-id="' + f + '"]').prepend(e)
                }), c.find('button[type="submit"]').each(function() {
                    var a = b(this);
                    a.addClass("btn"), a.parent().is("p") && a.unwrap()
                }), c.find("[required]").attr("required", "required").addClass("validate-required"), c.addClass("form--active"), a.newsletters.prepareAjaxAction(c)
            }), b('form[action*="list-manage.com"]').each(function() {
                c = b(this), c.attr("novalidate", "novalidate"), c.is(".form--no-placeholders") ? c.find("input[placeholder]").removeAttr("placeholder") : c.find("input:not([checkbox]):not([radio])").each(function() {
                    var a = b(this);
                    "undefined" != typeof a.attr("placeholder") ? "" === a.attr("placeholder") && a.siblings("label").length && (a.attr("placeholder", a.siblings("label").first().text()), c.is(".form--no-labels") && a.siblings("label").first().remove()) : a.siblings("label").length && (a.attr("placeholder", a.siblings("label").first().text()),
                        c.is(".form--no-labels") && a.siblings("label").first().remove())
                }), c.is(".form--no-labels") && c.find("input:not([checkbox]):not([radio])").each(function() {
                    var a = b(this);
                    a.siblings("label").length && a.siblings("label").first().remove()
                }), c.find("select").wrap('<div class="input-select"></div>'), c.find('input[type="checkbox"]').each(function() {
                    d = b(this), g = d.parent(), e = g.find("label"), e.length || (e = b("<label></label>")), d.before('<div class="input-checkbox"></div>'), g.find(".input-checkbox").append(d), g.find(".input-checkbox").append(e)
                }), c.find('input[type="radio"]').each(function() {
                    h = b(this), g = h.closest("li"), e = g.find("label"), e.length || (e = b("<label></label>")), h.before('<div class="input-radio"></div>'), g.find(".input-radio").prepend(h), g.find(".input-radio").prepend(e)
                }), c.find('input[type="submit"]').each(function() {
                    var a = b(this),
                        c = jQuery("<button/>").attr("type", "submit").attr("class", a.attr("class")).addClass("btn").text(a.attr("value"));
                    a.parent().is("div.clear") && a.unwrap(), c.insertBefore(a), a.remove()
                }), c.find("input").each(function() {
                    var a = b(this);
                    a.hasClass("required") && a.removeClass("required").addClass("validate-required")
                }), c.find('input[type="email"]').removeClass("email").addClass("validate-email"), c.find("#mce-responses").remove(), c.find(".mc-field-group").each(function() {
                    b(this).children().first().unwrap()
                }), c.find("[required]").attr("required", "required").addClass("validate-required"), c.addClass("form--active"), a.newsletters.prepareAjaxAction(c)
            }), a.forms.documentReady(a.setContext("form.form--active"))
        };
        return a.newsletters.documentReady = e, a.newsletters.prepareAjaxAction = function(a) {
            var c = b(a).attr("action");
            /list-manage\.com/.test(c) && (c = c.replace("/post?", "/post-json?") + "&c=?", "//" === c.substr(0, 2) && (c = "http:" + c)), /createsend\.com/.test(c) && (c += "?callback=?"), b(a).attr("action", c)
        }, a.components.documentReady.push(e), a
    }(mr, jQuery, window, document), mr = function(a, b, c, d) {
        "use strict";
        a.notifications = {};
        var e = function(b) {
            b(".notification").each(function() {
                var a = b(this);
                a.find(".notification-close").length || a.append('<div class="notification-close-cross notification-close"></div>')
            }), b(".notification[data-autoshow]").each(function() {
                var c = b(this),
                    d = parseInt(c.attr("data-autoshow"), 10);
                "undefined" != typeof c.attr("data-cookie") ? a.cookies.hasItem(c.attr("data-cookie")) || a.notifications.showNotification(c, d) : a.notifications.showNotification(c, d)
            }), b("[data-notification-link]:not(.notification)").on("click", function() {
                var c = jQuery(this).attr("data-notification-link"),
                    d = b('.notification[data-notification-link="' + c + '"]');
                return jQuery(".notification--reveal").addClass("notification--dismissed"), d.removeClass("notification--dismissed"), a.notifications.showNotification(d, 0), !1
            }), b(".notification-close").on("click", function() {
                var b = jQuery(this);
                return a.notifications.closeNotification(b), "#" === b.attr("href") ? !1 : void 0
            }), b(".notification .inner-link").on("click", function() {
                var b = jQuery(this).closest(".notification").attr("data-notification-link");
                a.notifications.closeNotification(b)
            })
        };
        return a.notifications.documentReady = e, a.notifications.showNotification = function(b, c) {
            var d = "undefined" != typeof c ? 1 * c : 0;
            if (setTimeout(function() {
                    b.addClass("notification--reveal"), b.closest("nav").addClass("notification--reveal"), b.find("input").length && b.find("input").first().focus()
                }, d), b.is("[data-autohide]")) {
                var e = parseInt(b.attr("data-autohide"), 10);
                setTimeout(function() {
                    a.notifications.closeNotification(b)
                }, e + d)
            }
        }, a.notifications.closeNotification = function(c) {
            var d = jQuery(c);
            c = d.is(".notification") ? d : d.is(".notification-close") ? d.closest(".notification") : b('.notification[data-notification-link="' + c + '"]'), c.addClass("notification--dismissed"), c.closest("nav").removeClass("notification--reveal"), "undefined" != typeof c.attr("data-cookie") && a.cookies.setItem(c.attr("data-cookie"), "true", 1 / 0, "/")
        }, a.components.documentReady.push(e), a
    }(mr, jQuery, window, document), mr = function(a, b, c, d) {
        "use strict";
        var e = function(a) {
            var b = a(c),
                d = b.width(),
                e = b.height(),
                f = a("nav").outerHeight(!0);
            if (/Android|iPhone|iPad|iPod|BlackBerry|Windows Phone/i.test(navigator.userAgent || navigator.vendor || c.opera) && a("section").removeClass("parallax"), d > 768) {
                var g = a(".parallax:nth-of-type(1)"),
                    h = a(".parallax:nth-of-type(1) .background-image-holder");
                h.css("top", -f), g.outerHeight(!0) === e && h.css("height", e + f)
            }
        };
        return a.parallax = {
            documentReady: e
        }, a.components.documentReady.push(e), a
    }(mr, jQuery, window, document), mr = function(a, b, c, d) {
        "use strict";
        a.easypiecharts = {}, a.easypiecharts.pies = [];
        var e = function(b) {
            a.easypiecharts.init = function() {
                a.easypiecharts.pies = [], b(".radial").each(function() {
                    var b = {},
                        c = jQuery(this);
                    b.element = c, b.value = parseInt(c.attr("data-value"), 10), b.top = c.offset().top, b.height = c.height() / 2, b.active = !1, a.easypiecharts.pies.push(b)
                })
            }, a.easypiecharts.activate = function() {
                a.easypiecharts.pies.forEach(function(b) {
                    Math.round(a.scroll.y + a.window.height) >= Math.round(b.top + b.height) && b.active === !1 && (b.element.data("easyPieChart").enableAnimation(), b.element.data("easyPieChart").update(b.value), b.element.addClass("radial--active"), b.active = !0)
                })
            }, b(".radial").each(function() {
                var a = jQuery(this),
                    b = "#000000",
                    c = 2e3,
                    d = 110,
                    e = 3;
                "undefined" != typeof a.attr("data-timing") && (c = 1 * a.attr("data-timing")), "undefined" != typeof a.attr("data-color") && (b = a.attr("data-color")), "undefined" != typeof a.attr("data-size") && (d = a.attr("data-size")), "undefined" != typeof a.attr("data-bar-width") && (e = a.attr("data-bar-width")), a.css("height", d).css("width", d), a.easyPieChart({
                    animate: {
                        duration: c,
                        enabled: !0
                    },
                    barColor: b,
                    scaleColor: !1,
                    size: d,
                    lineWidth: e
                }), a.data("easyPieChart").update(0)
            }), b(".radial").length && (a.easypiecharts.init(), a.easypiecharts.activate(), a.scroll.listeners.push(a.easypiecharts.activate))
        };
        return a.easypiecharts.documentReady = e, a.components.documentReadyDeferred.push(e), a
    }(mr, jQuery, window, document), mr = function(a, b, c, d) {
        "use strict";
        a.sliders = {}, a.sliders.draggable = !0;
        var e = function(b) {
            b(".slider").each(function(c) {
                var d = b(this),
                    e = d.find("ul.slides");
                e.find(">li").addClass("slide");
                var f = e.find("li").length,
                    g = !1,
                    h = !1,
                    i = 7e3,
                    j = !0,
                    k = a.sliders.draggable;
                g = "true" === d.attr("data-arrows") ? !0 : !1, j = "false" === d.attr("data-autoplay") ? !1 : !0, h = "true" === d.attr("data-paging") && e.find("li").length > 1 ? !0 : !1, d.attr("data-timing") && (i = 1 * d.attr("data-timing")), d.attr("data-children", f), 2 > f && (k = !1), b(e).flickity({
                    cellSelector: ".slide",
                    cellAlign: "left",
                    wrapAround: !0,
                    pageDots: h,
                    prevNextButtons: g,
                    autoPlay: i,
                    draggable: k,
                    imagesLoaded: !0
                }), b(e).on("scroll.flickity", function(a, b) {
                    d.find(".is-selected").hasClass("controls--dark") ? d.addClass("controls--dark") : d.removeClass("controls--dark")
                })
            })
        };
        return a.sliders.documentReady = e, a.components.documentReadyDeferred.push(e), a
    }(mr, jQuery, window, document), mr = function(a, b, c, d) {
        "use strict";
        a.smoothscroll = {}, a.smoothscroll.sections = [], a.smoothscroll.init = function() {
            a.smoothscroll.sections = [], b("a.inner-link").each(function() {
                var c = {},
                    d = b(this),
                    e = d.attr("href"),
                    f = new RegExp("^#[^\r\n	\f#.]+$", "gm");
                f.test(e) && b("section" + e).length && (c.id = e, c.top = Math.round(b(e).offset().top), c.height = Math.round(b(e).outerHeight()), c.link = d.get(0), c.active = !1, a.smoothscroll.sections.push(c))
            }), a.smoothscroll.highlight()
        }, a.smoothscroll.highlight = function() {
            a.smoothscroll.sections.forEach(function(b) {
                a.scroll.y >= b.top && a.scroll.y < b.top + b.height ? b.active === !1 && (b.link.classList.add("inner-link--active"), b.active = !0) : (b.link.classList.remove("inner-link--active"), b.active = !1)
            })
        }, a.scroll.listeners.push(a.smoothscroll.highlight);
        var e = function(b) {
            var d = b("a.inner-link");
            if (d.length) {
                d.each(function(a) {
                    var c = b(this),
                        d = c.attr("href");
                    "#" !== d.charAt(0) && c.removeClass("inner-link")
                }), a.smoothscroll.init(), b(c).on("resize", a.smoothscroll.init);
                var e = 0;
                b("body[data-smooth-scroll-offset]").length && (e = b("body").attr("data-smooth-scroll-offset"), e = 1 * e), smoothScroll.init({
                    selector: ".inner-link",
                    selectorHeader: null,
                    speed: 750,
                    easing: "easeInOutCubic",
                    offset: e
                })
            }
        };
        return a.smoothscroll.documentReady = e, a.components.documentReady.push(e), a.components.windowLoad.push(a.smoothscroll.init), a
    }(mr, jQuery, window, document), mr = function(a, b, c, d) {
        "use strict";
        a.tabs = {};
        var e = function(b) {
            b(".tabs").each(function() {
                var a = b(this);
                a.after('<ul class="tabs-content">'), a.find("li").each(function() {
                    var a = b(this),
                        c = a.find(".tab__content").wrap("<li></li>").parent(),
                        d = c.clone(!0, !0);
                    c.remove(), a.closest(".tabs-container").find(".tabs-content").append(d)
                })
            }), b(".tabs > li").on("click", function() {
                var c, d = b(this);
                a.tabs.activateTab(d), d.is("[id]") && (c = "#" + d.attr("id"), history.pushState ? history.pushState(null, null, c) : location.hash = c)
            }), b(".tabs li.active").each(function() {
                a.tabs.activateTab(this)
            }), "" !== c.location.hash && a.tabs.activateTabById(c.location.hash), b('a[href^="#"]').on("click", function() {
                a.tabs.activateTabById(b(this).attr("href"))
            })
        };
        return a.tabs.activateTab = function(a) {
            var c, e = b(a),
                f = e.closest(".tabs-container"),
                g = 1 * e.index() + 1,
                h = f.find("> .tabs-content > li:nth-of-type(" + g + ")"),
                i = d.createEvent("Event");
            i.initEvent("tabOpened.tabs.mr", !0, !0), f.find("> .tabs > li").removeClass("active"), f.find("> .tabs-content > li").removeClass("active"), e.addClass("active").trigger("tabOpened.tabs.mr").get(0).dispatchEvent(i), h.addClass("active"), c = h.find("iframe"), c.length && c.attr("src", c.attr("src"))
        }, a.tabs.activateTabById = function(a) {
            "" !== a && "#" !== a && b(".tabs > li#" + a.replace("#", "")).click()
        }, a.tabs.documentReady = e, a.components.documentReady.push(e), a
    }(mr, jQuery, window, document), mr = function(a, b, c, d) {
        "use strict";
        var e = function(a) {
            a("[data-toggle-class]").each(function() {
                var b = a(this),
                    c = b.attr("data-toggle-class").split("|");
                a(c).each(function() {
                    var c = b,
                        d = [],
                        e = "",
                        f = "",
                        d = this.split(";");
                    2 === d.length && (f = d[0], e = d[1], a(c).on("click", function() {
                        return c.hasClass("toggled-class") ? c.removeClass("toggled-class") : c.toggleClass("toggled-class"), a(f).toggleClass(e), !1
                    }))
                })
            })
        };
        return a.toggleClass = {
            documentReady: e
        }, a.components.documentReady.push(e), a
    }(mr, jQuery, window, document), mr = function(a, b, c, d) {
        "use strict";
        var e = function(a) {
            a(".typed-text").each(function() {
                var b = a(this),
                    c = b.attr("data-typed-strings") ? b.attr("data-typed-strings").split(",") : [];
                a(b).typed({
                    strings: c,
                    typeSpeed: 100,
                    loop: !0,
                    showCursor: !1
                })
            })
        };
        return a.typed = {
            documentReady: e
        }, a.components.documentReady.push(e), a
    }(mr, jQuery, window, document), mr = function(a, b, c, d) {
        "use strict";
        var e = function(b) {
            b(".tweets-feed").each(function(a) {
                b(this).attr("id", "tweets-" + a)
            }).each(function(c) {
                function d(b) {
                    for (var c = b.length, d = 0, f = '<ul class="slides">'; c > d;) f += "<li>" + b[d] + "</li>", d++;
                    return f += "</ul>", e.html(f), e.closest(".slider").length ? (a.sliders.documentReady(a.setContext()), f) : void 0
                }
                var e = b("#tweets-" + c),
                    f = {
                        domId: "",
                        maxTweets: e.attr("data-amount"),
                        enableLinks: !0,
                        showUser: !0,
                        showTime: !0,
                        dateFunction: "",
                        showRetweet: !1,
                        customCallback: d
                    };
                "undefined" != typeof e.attr("data-widget-id") ? f.id = e.attr("data-widget-id") : "undefined" != typeof e.attr("data-feed-name") && "" !== e.attr("data-feed-name") ? f.profile = {
                    screenName: e.attr("data-feed-name").replace("@", "")
                } : f.profile = {
                    screenName: "twitter"
                }, e.closest(".twitter-feed--slider").length && e.addClass("slider"), twitterFetcher.fetch(f)
            })
        };
        return a.twitter = {
            documentReady: e
        }, a.components.documentReady.push(e), a
    }(mr, jQuery, window, document), mr = function(a, b, c, d) {
        "use strict";
        var e = function(a) {
            a(".youtube-background").length && a(".youtube-background").each(function() {
                var b = a(this),
                    c = a(this).attr("data-video-url"),
                    d = a(this).attr("data-start-at");
                b.attr("data-property", '{videoURL:"' + c + '",containment:"self",autoPlay:true, mute:true, startAt:' + d + ", opacity:1}"), b.closest(".videobg").append('<div class="loading-indicator"></div>'), b.YTPlayer(), b.on("YTPStart", function() {
                    b.closest(".videobg").addClass("video-active")
                })
            }), a(".videobg").find("video").length && a(".videobg").find("video").closest(".videobg").addClass("video-active"), a(".video-cover").each(function() {
                var b = a(this);
                b.find("iframe[src]").length && (b.find("iframe").attr("data-src", b.find("iframe").attr("src")), b.find("iframe").attr("src", ""))
            }), a(".video-cover .video-play-icon").on("click", function() {
                var b = a(this),
                    c = b.closest(".video-cover");
                if (c.find("video").length) {
                    var d = c.find("video").get(0);
                    return c.addClass("reveal-video"), d.play(), !1
                }
                if (c.find("iframe").length) {
                    var e = c.find("iframe");
                    return e.attr("src", e.attr("data-src")), c.addClass("reveal-video"), !1
                }
            })
        };
        return a.video = {
            documentReady: e
        }, a.components.documentReady.push(e), a
    }(mr, jQuery, window, document), mr = function(a, b, c, d) {
        "use strict";
        var e = function(a) {
            a(".wizard").each(function() {
                var a = jQuery(this);
                a.steps({
                    headerTag: "h5",
                    bodyTag: "section",
                    transitionEffect: "slideLeft",
                    autoFocus: !0
                }), a.addClass("active")
            })
        };
        return a.wizard = {
            documentReady: e
        }, a.components.documentReady.push(e), a
    }(mr, jQuery, window, document),
    function(a, b, c, d, e, f, g) {
        a.GoogleAnalyticsObject = e, a[e] = a[e] || function() {
            (a[e].q = a[e].q || []).push(arguments)
        }, a[e].l = 1 * new Date, f = b.createElement(c),
        g = b.getElementsByTagName(c)[0], f.async = 1, f.src = d, g.parentNode.insertBefore(f, g)
    }
    (window, document, "script", "https://www.google-analytics.com/analytics.js", "ga"), 
    ga("create", "UA-52115242-5", "auto"), ga("send", "pageview");
   
   
   
   
   
    
    