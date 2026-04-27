(function() {
  'use strict';

  console.log('[CT] Call Tracking Script gestartet');

  var config = window.apCallTracking || {};
  if (!config.searchNumbers || !config.searchNumbers.length) {
    console.warn('[CT] Abbruch: Keine searchNumbers konfiguriert');
    return;
  }

  console.log('[CT] Config geladen:', JSON.stringify(config));

  var COOKIE_NAME = 'ap_tracking_phone';
  var COOKIE_DATA_NAME = 'ap_tracking_data';

  // Attribute, in denen Telefonnummern potentiell stehen (Formular-Vorbefuellung,
  // aria-labels, title, data-*).
  var WATCHED_ATTRS = [
    'placeholder', 'value', 'aria-label', 'title', 'alt',
    'data-phone', 'data-tel', 'data-number', 'data-phone-number'
  ];

  function setCookie(name, value, days) {
    var d = parseInt(days, 10) || 30;
    var date = new Date();
    date.setTime(date.getTime() + (d * 24 * 60 * 60 * 1000));
    document.cookie = name + '=' + encodeURIComponent(value) + ';expires=' + date.toUTCString() + ';path=/;SameSite=Lax';
  }

  function getCookie(name) {
    var match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? decodeURIComponent(match[2]) : null;
  }

  function getUrlParam(name) {
    var params = new URLSearchParams(window.location.search);
    return params.get(name) || '';
  }

  /**
   * Formatiert eine Nummer wie +4915792521185 zu 01579 2521185
   */
  function formatPhoneDisplay(phone) {
    if (!phone) return phone;
    var digits = phone.replace(/[^\d]/g, '');
    if (digits.indexOf('49') === 0 && digits.length > 10) {
      digits = '0' + digits.substring(2);
    }
    if (digits.length >= 8) {
      return digits.substring(0, 5) + ' ' + digits.substring(5);
    }
    return phone;
  }

  /**
   * Baut ein Regex-Pattern das eine Telefonnummer findet, auch wenn
   * Leerzeichen, Bindestriche, Schraegstriche, Klammern oder Punkte
   * zwischen den Ziffern stehen.
   */
  function buildFlexiblePattern(number) {
    var chars = number.replace(/[^\d+]/g, '').split('');
    return chars.map(function(ch) {
      return ch === '+' ? '\\+' : ch;
    }).join('[\\s\\-\\/\\.\\(\\)]*');
  }

  function buildCombinedRegex() {
    var patterns = config.searchNumbers.map(buildFlexiblePattern);
    patterns.sort(function(a, b) { return b.length - a.length; });
    var regex = new RegExp('(' + patterns.join('|') + ')', 'g');
    console.log('[CT] Regex erstellt:', regex.source);
    return regex;
  }

  /**
   * Durchsucht alle Text-Nodes im DOM und ersetzt Telefonnummern.
   */
  function walkTextNodes(node, regex, replacement) {
    if (node.nodeType === 3) {
      regex.lastIndex = 0;
      if (regex.test(node.nodeValue)) {
        regex.lastIndex = 0;
        node.nodeValue = node.nodeValue.replace(regex, replacement);
      }
      return;
    }

    if (node.nodeName === 'SCRIPT' || node.nodeName === 'STYLE' || node.nodeName === 'NOSCRIPT') {
      return;
    }

    var children = node.childNodes;
    for (var i = 0; i < children.length; i++) {
      walkTextNodes(children[i], regex, replacement);
    }
  }

  /**
   * Ersetzt Telefonnummern in interessanten HTML-Attributen.
   */
  function replaceInAttributes(regex, replacement) {
    for (var a = 0; a < WATCHED_ATTRS.length; a++) {
      var attr = WATCHED_ATTRS[a];
      var nodes = document.querySelectorAll('[' + attr + ']');
      nodes.forEach(function(el) {
        var val = el.getAttribute(attr);
        if (!val) return;
        regex.lastIndex = 0;
        if (regex.test(val)) {
          regex.lastIndex = 0;
          el.setAttribute(attr, val.replace(regex, replacement));
        }
      });
    }
  }

  /**
   * Prueft rekursiv, ob irgendein Text-Node im Subtree zum Regex passt.
   * Wird gebraucht, damit der Split-Fallback NICHT triggert, wenn die Nummer
   * in einem tiefer verschachtelten Text-Node steckt (Elementor, Divi etc.)
   * und walkTextNodes sie bereits ersetzt hat.
   */
  function hasMatchingTextNodeDeep(node, regex) {
    if (node.nodeType === 3) {
      regex.lastIndex = 0;
      return regex.test(node.nodeValue);
    }
    if (node.nodeName === 'SCRIPT' || node.nodeName === 'STYLE' || node.nodeName === 'NOSCRIPT') {
      return false;
    }
    for (var i = 0; i < node.childNodes.length; i++) {
      if (hasMatchingTextNodeDeep(node.childNodes[i], regex)) return true;
    }
    return false;
  }

  /**
   * Setzt href + sichtbaren Text in tel:-Links. Wenn die Nummer wirklich ueber
   * mehrere Nodes gesplittet ist (keine zusammenhaengende Text-Stelle) und der
   * Link keine weiteren Kinder-Elemente (SVG-Icons etc.) hat, ersetzen wir den
   * gesamten textContent.
   */
  function replaceTelLinks(regex, trackingPhone, displayNumber) {
    var links = document.querySelectorAll('a[href^="tel:"]');
    console.log('[CT] tel:-Links gefunden:', links.length);
    var cleanNumber = trackingPhone.replace(/[\s\-]/g, '');

    links.forEach(function(link) {
      var href = link.getAttribute('href') || '';
      regex.lastIndex = 0;
      if (regex.test(href.replace(/^tel:/, ''))) {
        link.setAttribute('href', 'tel:' + cleanNumber);
      }

      regex.lastIndex = 0;
      var fullText = link.textContent || '';
      if (!regex.test(fullText)) return;
      if (hasMatchingTextNodeDeep(link, regex)) return;

      // Keine einzelne zusammenhaengende Text-Stelle enthaelt die Nummer —
      // sie ist ueber mehrere Nodes gesplittet. Nur ersetzen, wenn der Link
      // keine eigenstaendigen Element-Kinder (SVG, img, icon) hat, die wir
      // sonst wegwerfen wuerden.
      var hasOtherElements = false;
      for (var i = 0; i < link.childNodes.length; i++) {
        var n = link.childNodes[i];
        if (n.nodeType === 1 && n.nodeName !== 'SPAN' && n.nodeName !== 'B' && n.nodeName !== 'STRONG' && n.nodeName !== 'I' && n.nodeName !== 'EM') {
          hasOtherElements = true;
          break;
        }
      }
      if (!hasOtherElements) {
        link.textContent = displayNumber;
      }
    });
  }

  function replaceAllPhoneNumbers(trackingPhone, trackingPhoneDisplay) {
    var displayNumber = trackingPhoneDisplay || formatPhoneDisplay(trackingPhone);
    console.log('[CT] Ersetze Nummern mit:', trackingPhone, '(Anzeige:', displayNumber + ')');
    var regex = buildCombinedRegex();

    walkTextNodes(document.body, regex, displayNumber);
    replaceInAttributes(regex, displayNumber);
    replaceTelLinks(regex, trackingPhone, displayNumber);
    console.log('[CT] Ersetzung abgeschlossen');
  }

  function fetchTrackingNumber(gclid, source) {
    console.log('[CT] Hole Tracking-Nummer fuer gclid:', gclid, '(Quelle:', source + ')');

    var params = new URLSearchParams();
    params.set('gclid', gclid);

    var keyword = config.keyword || getUrlParam('keyword') || getUrlParam('utm_term') || '';
    var campaign = config.campaign || getUrlParam('campaign') || getUrlParam('utm_campaign') || '';

    if (keyword) params.set('keyword', keyword);
    if (campaign) params.set('campaign', campaign);
    params.set('landing_page', config.landingPage || window.location.href);
    params.set('quelle', source);
    params.set('firma_key', encodeURIComponent(config.firmaKey || ''));
    params.set('api_key', encodeURIComponent(config.apiKey || ''));

    var url = config.apiUrl + '?' + params.toString();
    console.log('[CT] API-URL:', url);

    fetch(url, { method: 'GET', mode: 'cors', headers: { 'Accept': 'application/json' } })
      .then(function(response) {
        console.log('[CT] API Response Status:', response.status);
        if (!response.ok) throw new Error('HTTP ' + response.status);
        return response.json();
      })
      .then(function(data) {
        console.log('[CT] API Response Data:', JSON.stringify(data));
        var nummer = data.nummer || (data.data && data.data.nummer);
        if (nummer) {
          setCookie(COOKIE_NAME, nummer, config.cookieDays || 30);

          var trackingData = {
            gclid: gclid,
            nummer: nummer,
            zuweisung_id: data.zuweisung_id || (data.data && data.data.zuweisung_id) || null,
            keyword: keyword,
            campaign: campaign,
            landing_page: window.location.href,
            zeitpunkt: new Date().toISOString(),
          };
          setCookie(COOKIE_DATA_NAME, JSON.stringify(trackingData), config.cookieDays || 30);

          replaceAllPhoneNumbers(nummer);
        } else {
          console.warn('[CT] API gab keine Nummer zurueck:', data);
        }
      })
      .catch(function(error) {
        console.error('[CT] API-Fehler:', error);
      });
  }

  function init() {
    console.log('[CT] init() gestartet, URL:', window.location.href);
    var gclid = config.gclid || '';
    var source = 'PHP';

    if (!gclid) {
      var capturedData = getCookie('ap_gclid_capture');
      if (capturedData) {
        try {
          var captured = JSON.parse(capturedData);
          if (captured && captured.gclid) {
            gclid = captured.gclid;
            source = 'Cookie (ap_gclid_capture)';
          }
        } catch(e) {}
      }
    }

    if (!gclid) {
      gclid = getUrlParam('gclid');
      source = 'URL';
    }

    console.log('[CT] gclid:', gclid || '(nicht vorhanden)', '(aus ' + source + ')');

    if (getCookie('ap_gclid_capture')) {
      document.cookie = 'ap_gclid_capture=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      console.log('[CT] ap_gclid_capture Cookie geloescht');
    }

    if (gclid) {
      var savedPhone = getCookie(COOKIE_NAME);
      var savedData = getCookie(COOKIE_DATA_NAME);
      if (savedPhone && savedData) {
        try {
          var parsed = JSON.parse(savedData);
          if (parsed.gclid === gclid) {
            console.log('[CT] Gleiche gclid bereits verarbeitet, verwende Cookie:', savedPhone);
            replaceAllPhoneNumbers(savedPhone);
            return;
          }
        } catch(e) {}
      }
      fetchTrackingNumber(gclid, source);
    } else {
      var savedPhone2 = getCookie(COOKIE_NAME);
      if (savedPhone2) {
        console.log('[CT] Cookie gefunden:', savedPhone2);
        replaceAllPhoneNumbers(savedPhone2);
      } else {
        console.log('[CT] Kein gclid, kein Cookie -> Standard-Nummern bleiben');
      }
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // MutationObserver: auch Attribut- und Text-Aenderungen beobachten, damit
  // Theme-Builder, Ajax-Nachladungen oder spaete Inputs erfasst werden.
  var observerTimeout = null;
  var observer = new MutationObserver(function(mutations) {
    var savedPhone = getCookie(COOKIE_NAME);
    if (!savedPhone) return;

    var relevant = mutations.some(function(m) {
      return m.addedNodes.length > 0
        || m.type === 'characterData'
        || (m.type === 'attributes' && WATCHED_ATTRS.indexOf(m.attributeName) !== -1)
        || (m.type === 'attributes' && m.attributeName === 'href');
    });
    if (!relevant) return;

    clearTimeout(observerTimeout);
    observerTimeout = setTimeout(function() {
      replaceAllPhoneNumbers(savedPhone);
    }, 200);
  });

  var observerOptions = {
    childList: true,
    subtree: true,
    characterData: true,
    attributes: true,
    attributeFilter: ['href'].concat(WATCHED_ATTRS),
  };

  if (document.body) {
    observer.observe(document.body, observerOptions);
  } else {
    document.addEventListener('DOMContentLoaded', function() {
      observer.observe(document.body, observerOptions);
    });
  }
})();
