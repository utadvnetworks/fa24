(function (e, t) {
  "object" == typeof exports && "undefined" != typeof module
    ? t(exports, require("fs"))
    : "function" == typeof define && define.amd
      ? define(["exports", "fs"], t)
      : t((e.dl = {}), e.fs);
})(this, function (e, t) {
  "use strict";
  function a(e, t) {
    (e.title = t.title),
      t.published &&
        (t.published instanceof Date
          ? (e.publishedDate = t.published)
          : t.published.constructor === String &&
            (e.publishedDate = new Date(t.published))),
      t.publishedDate &&
        (t.publishedDate instanceof Date
          ? (e.publishedDate = t.publishedDate)
          : t.publishedDate.constructor === String
            ? (e.publishedDate = new Date(t.publishedDate))
            : console.error(
                "Don't know what to do with published date: " + t.publishedDate,
              )),
      (e.description = t.description),
      (e.authors = t.authors.map((e) => new q(e))),
      (e.editors = t.editors.map((e) => new O(e))),
      (e.lecturers = t.lecturers.map((e) => new _(e))),
      (e.katex = t.katex),
      (e.password = t.password),
      t.doi && (e.doi = t.doi);
  }
  function i(e) {
    for (let t of e.authors) {
      const e = !!t.affiliation,
        a = !!t.affiliations;
      if (e)
        if (a)
          console.warn(
            `Author ${t.author} has both old-style ("affiliation" & "affiliationURL") and new style ("affiliations") affiliation information!`,
          );
        else {
          let e = { name: t.affiliation };
          t.affiliationURL && (e.url = t.affiliationURL),
            (t.affiliations = [e]);
        }
    }
    return e;
  }
  function l(e) {
    const t = e.firstElementChild;
    if (t) {
      const e = t.getAttribute("type");
      if ("json" == e.split("/")[1]) {
        const e = t.textContent,
          a = JSON.parse(e);
        return i(a);
      }
      console.error(
        "Distill only supports JSON frontmatter tags anymore; no more YAML.",
      );
    } else
      console.error(
        "You added a frontmatter tag but did not provide a script tag with front matter data in it. Please take a look at our templates.",
      );
    return {};
  }
  function n() {
    throw new Error(
      "Dynamic requires are not currently supported by rollup-plugin-commonjs",
    );
  }
  function r(e, t) {
    return (t = { exports: {} }), e(t, t.exports), t.exports;
  }
  function s(e) {
    return e
      .replace(/[\t\n ]+/g, " ")
      .replace(/{\\["^`.'acu~Hvs]( )?([a-zA-Z])}/g, (e, t, a) => a)
      .replace(/{\\([a-zA-Z])}/g, (e, t) => t);
  }
  function o(e) {
    const t = new Map(),
      a = B.toJSON(e);
    for (const i of a) {
      for (const [e, t] of Object.entries(i.entryTags))
        i.entryTags[e.toLowerCase()] = s(t);
      (i.entryTags.type = i.entryType), t.set(i.citationKey, i.entryTags);
    }
    return t;
  }
  function d(e) {
    return `@article{${e.slug},
  author = {${e.bibtexAuthors}},
  title = {${e.title}},
  journal = {${e.journal.title}},
  year = {${e.publishedYear}},
  note = {${e.url}},
  doi = {${e.doi}}
}`;
  }
  function u(e) {
    const t = e.firstElementChild;
    if (t && "SCRIPT" === t.tagName) {
      if ("text/bibtex" == t.type) {
        const t = e.firstElementChild.textContent;
        return o(t);
      }
      if ("text/json" == t.type) return new Map(JSON.parse(t.textContent));
      console.warn("Unsupported bibliography script tag type: " + t.type);
    } else console.warn("Bibliography did not have any script tag.");
  }
  function p(e = document) {
    const t = new Set(),
      a = e.querySelectorAll("d-cite");
    for (const i of a) {
      const e = i.getAttribute("key").split(",");
      for (const a of e) t.add(a);
    }
    return [...t];
  }
  function c(e, t, a, i) {
    if (null == e.author) return "";
    var l = e.author.split(" and ");
    let r = l.map((e) => {
      if (((e = e.trim()), -1 != e.indexOf(",")))
        var a = e.split(",")[0].trim(),
          i = e.split(",")[1];
      else if (-1 != e.indexOf(" "))
        var a = e.split(" ").slice(-1)[0].trim(),
          i = e.split(" ").slice(0, -1).join(" ");
      else var a = e.trim();
      var l = "";
      return (
        void 0 != i &&
          ((l = i
            .trim()
            .split(" ")
            .map((e) => e.trim()[0])),
          (l = l.join(".") + ".")),
        t.replace("${F}", i).replace("${L}", a).replace("${I}", l).trim()
      );
    });
    if (1 < l.length) {
      var n = r.slice(0, l.length - 1).join(a);
      return (n += (i || a) + r[l.length - 1]), n;
    }
    return r[0];
  }
  function m(e) {
    var t = e.journal || e.booktitle || "";
    if ("volume" in e) {
      var a = e.issue || e.number;
      (a = void 0 == a ? "" : "(" + a + ")"), (t += ", Vol " + e.volume + a);
    }
    return (
      "pages" in e && (t += ", pp. " + e.pages),
      "" != t && (t += ". "),
      "publisher" in e &&
        ((t += e.publisher), "." != t[t.length - 1] && (t += ".")),
      t
    );
  }
  function h(e) {
    if ("url" in e) {
      var t = e.url,
        a = /arxiv\.org\/abs\/([0-9\.]*)/.exec(t);
      if (
        (null != a && (t = `http://arxiv.org/pdf/${a[1]}.pdf`),
        ".pdf" == t.slice(-4))
      )
        var i = "PDF";
      else if (".html" == t.slice(-5)) var i = "HTML";
      return ` &ensp;<a href="${t}">[${i || "link"}]</a>`;
    }
    return "";
  }
  function g(e, t) {
    return "doi" in e
      ? `${t ? "<br>" : ""} <a href="https://doi.org/${e.doi}" style="text-decoration:inherit;">DOI: ${e.doi}</a>`
      : "";
  }
  function f(e) {
    return '<span class="title">' + e.title + "</span> ";
  }
  function y(e) {
    if (e) {
      var t = f(e);
      return (
        (t += h(e) + "<br>"),
        e.author &&
          ((t += c(e, "${L}, ${I}", ", ", " and ")),
          (e.year || e.date) && (t += ", ")),
        (t += e.year || e.date ? (e.year || e.date) + ". " : ". "),
        (t += m(e)),
        (t += g(e)),
        t
      );
    }
    return "?";
  }
  function b(e) {
    return `
  <div class="byline grid">
    <div>
      <h3>Lecturers</h3>
      ${e.lecturers
        .map(
          (e) => `
        <p class="lecturer">
          ${
            e.personalURL
              ? `
            <a class="name" href="${e.personalURL}" target="_blank">${e.name}</a>`
              : `
            <span class="name">${e.name}</span>`
          }
        </p>
      `,
        )
        .join("")}
    </div>
    <div>
      <h3>Authors</h3>
      ${e.authors
        .map(
          (e) => `
        <p class="author">
          ${
            e.personalURL
              ? `
            <a class="name" href="${e.personalURL}" target="_blank">${e.name}</a>`
              : `
            <span class="name">${e.name}</span>`
          }
        </p>
      `,
        )
        .join("")}
    </div>
    <div>
      <h3>Editors</h3>
      ${e.editors
        .map(
          (e) => `
        <p class="editor">
          ${
            e.personalURL
              ? `
            <a class="name" href="${e.personalURL}" target="_blank">${e.name}</a>`
              : `
            <span class="name">${e.name}</span>`
          }
        </p>
      `,
        )
        .join("")}
    </div>
    <div>
      <h3>Published</h3>
      ${
        e.publishedDate
          ? `
        <p>${e.publishedMonth} ${e.publishedDay}, ${e.publishedYear}</p> `
          : `
        <p><em>Not published yet.</em></p>`
      }
    </div>
  </div>
`;
  }
  function v(e, t) {
    e.innerHTML += t;
  }
  function x(e) {
    var t = `citation_title=${e.title};`;
    e.author &&
      "" !== e.author &&
      e.author.split(" and ").forEach((e) => {
        e = e.trim();
        let a, i;
        -1 == e.indexOf(",")
          ? ((a = e.split(" ").slice(-1)[0].trim()),
            (i = e.split(" ").slice(0, -1).join(" ")))
          : ((a = e.split(",")[0].trim()), (i = e.split(",")[1].trim())),
          (t += `citation_author=${i} ${a};`);
      }),
      "year" in e && (t += `citation_publication_date=${e.year};`);
    let a = /https?:\/\/arxiv\.org\/pdf\/([0-9]*\.[0-9]*)\.pdf/.exec(e.url);
    return ((a =
      a || /https?:\/\/arxiv\.org\/abs\/([0-9]*\.[0-9]*)/.exec(e.url)),
    (a = a || /arXiv preprint arXiv:([0-9]*\.[0-9]*)/.exec(e.journal)),
    a && a[1])
      ? ((t += `citation_arxiv_id=${a[1]};`), t)
      : ("journal" in e && (t += `citation_journal_title=${K(e.journal)};`),
        "volume" in e && (t += `citation_volume=${K(e.volume)};`),
        ("issue" in e || "number" in e) &&
          (t += `citation_number=${K(e.issue || e.number)};`),
        t);
  }
  function k(e, t) {
    let a = `
  <style>

  d-toc {
    contain: layout style;
    display: block;
  }

  d-toc ul {
    padding-left: 0;
  }

  d-toc ul > ul {
    padding-left: 24px;
  }

  d-toc a {
    border-bottom: none;
    text-decoration: none;
  }

  </style>
  <nav role="navigation" class="table-of-contents"></nav>
  <h2>Table of contents</h2>
  <ul>`;
    for (const i of t) {
      const e = "D-TITLE" == i.parentElement.tagName,
        t = i.getAttribute("no-toc");
      if (e || t) continue;
      const l = i.textContent,
        r = "#" + i.getAttribute("id");
      let n = '<li><a href="' + r + '">' + l + "</a></li>";
      "H3" == i.tagName ? (n = "<ul>" + n + "</ul>") : (n += "<br>"), (a += n);
    }
    (a += "</ul></nav>"), (e.innerHTML = a);
  }
  function w(e) {
    var t = e.parentElement,
      a =
        t &&
        t.getAttribute &&
        t.getAttribute("class") &&
        (t.getAttribute("class").includes("katex") ||
          t.getAttribute("class").includes("MathJax"));
    return (
      t &&
      "SCRIPT" !== t.nodeName &&
      "STYLE" !== t.nodeName &&
      "CODE" !== t.nodeName &&
      "PRE" !== t.nodeName &&
      "SPAN" !== t.nodeName &&
      "D-HEADER" !== t.nodeName &&
      "D-BYLINE" !== t.nodeName &&
      "D-MATH" !== t.nodeName &&
      "D-CODE" !== t.nodeName &&
      "D-BIBLIOGRAPHY" !== t.nodeName &&
      "D-FOOTER" !== t.nodeName &&
      "D-APPENDIX" !== t.nodeName &&
      "D-FRONTMATTER" !== t.nodeName &&
      "D-TOC" !== t.nodeName &&
      8 !== t.nodeType &&
      !a
    );
  }
  function M(e) {
    (e = e.replace(/--/g, "\u2014")),
      (e = e.replace(/\s*\u2014\s*/g, "\u2009\u2014\u2009")),
      (e = e.replace(/\.\.\./g, "\u2026"));
    var t = "\xA0",
      a = /([«¿¡]) /g,
      i = / ([!?:;.,‽»])/g;
    return (e = e.replace(a, "$1" + t)), (e = e.replace(i, t + "$1")), e;
  }
  function S(e) {
    return (
      (e = e
        .replace(/(\W|^)"([^\s!?:;.,‽»])/g, "$1\u201C$2")
        .replace(/(\u201c[^"]*)"([^"]*$|[^\u201c"]*\u201c)/g, "$1\u201D$2")
        .replace(/([^0-9])"/g, "$1\u201D")
        .replace(/(\W|^)'(\S)/g, "$1\u2018$2")
        .replace(/([a-z])'([a-z])/gi, "$1\u2019$2")
        .replace(/((\u2018[^']*)|[a-z])'([^0-9]|$)/gi, "$1\u2019$3")
        .replace(
          /(\u2018)([0-9]{2}[^\u2019]*)(\u2018([^0-9]|$)|$|\u2019[a-z])/gi,
          "\u2019$2$3",
        )
        .replace(
          /(\B|^)\u2018(?=([^\u2019]*\u2019\b)*([^\u2019\u2018]*\W[\u2019\u2018]\b|[^\u2019\u2018]*$))/gi,
          "$1\u2019",
        )
        .replace(/'''/g, "\u2034")
        .replace(/("|'')/g, "\u2033")
        .replace(/'/g, "\u2032")),
      (e = e.replace(/\\“/, '"')),
      (e = e.replace(/\\”/, '"')),
      (e = e.replace(/\\’/, "'")),
      (e = e.replace(/\\‘/, "'")),
      e
    );
  }
  function z(e, t, a = document) {
    if (0 < t.size) {
      e.style.display = "";
      let i = e.querySelector(".references");
      if (i) i.innerHTML = "";
      else {
        const t = a.createElement("style");
        (t.innerHTML = X), e.appendChild(t);
        const l = a.createElement("h3");
        (l.id = "references"),
          (l.textContent = "References"),
          e.appendChild(l),
          (i = a.createElement("ol")),
          (i.id = "references-list"),
          (i.className = "references"),
          e.appendChild(i);
      }
      for (const [e, l] of t) {
        const t = a.createElement("li");
        (t.id = e), (t.innerHTML = y(l)), i.appendChild(t);
      }
    } else e.style.display = "none";
  }
  function A(e) {
    let t = $;
    "undefined" != typeof e.githubUrl &&
      ((t += `
    <h3 id="updates-and-corrections">Updates and Corrections</h3>
    <p>`),
      e.githubCompareUpdatesUrl &&
        (t += `<a href="${e.githubCompareUpdatesUrl}">View all changes</a> to this article since it was first published.`),
      (t += `
    If you see mistakes or want to suggest changes, please <a href="${e.githubUrl + "/issues/new"}">create an issue on GitHub</a>. </p>
    `));
    const a = e.journal;
    return (
      "undefined" != typeof a &&
        "Distill" === a.title &&
        (t += `
    <h3 id="reuse">Reuse</h3>
    <p>Diagrams and text are licensed under Creative Commons Attribution <a href="https://creativecommons.org/licenses/by/4.0/">CC-BY 4.0</a> with the <a class="github" href="${e.githubUrl}">source available on GitHub</a>, unless noted otherwise. The figures that have been reused from other sources don’t fall under this license and can be recognized by a note in their caption: “Figure from …”.</p>
    `),
      "undefined" != typeof e.publishedDate &&
        (t += `
    <h3 id="citation">Citation</h3>
    <p>For attribution in academic contexts, please cite this work as</p>
    <pre class="citation short">${e.concatenatedAuthors}, "${e.title}", Distill, ${e.publishedYear}.</pre>
    <p>BibTeX citation</p>
    <pre class="citation long">${d(e)}</pre>
    `),
      t
    );
  }
  t = t && t.hasOwnProperty("default") ? t["default"] : t;
  const T = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ],
    C = [
      "Jan.",
      "Feb.",
      "March",
      "April",
      "May",
      "June",
      "July",
      "Aug.",
      "Sept.",
      "Oct.",
      "Nov.",
      "Dec.",
    ],
    N = (e) => (10 > e ? "0" + e : e),
    R = function (e) {
      const t = T[e.getDay()].substring(0, 3),
        a = N(e.getDate()),
        i = C[e.getMonth()].substring(0, 3),
        l = e.getFullYear().toString(),
        r = e.getUTCHours().toString(),
        n = e.getUTCMinutes().toString(),
        s = e.getUTCSeconds().toString();
      return `${t}, ${a} ${i} ${l} ${r}:${n}:${s} Z`;
    },
    L = function (e) {
      const t = Array.from(e).reduce(
        (e, [t, a]) => Object.assign(e, { [t]: a }),
        {},
      );
      return t;
    },
    E = function (e) {
      const t = new Map();
      for (var a in e) e.hasOwnProperty(a) && t.set(a, e[a]);
      return t;
    };
  class q {
    constructor(e) {
      (this.name = e.author),
        (this.personalURL = e.authorURL),
        (this.affiliation = e.affiliation),
        (this.affiliationURL = e.affiliationURL),
        (this.affiliations = e.affiliations || []);
    }
    get firstName() {
      const e = this.name.split(" ");
      return e.slice(0, e.length - 1).join(" ");
    }
    get lastName() {
      const e = this.name.split(" ");
      return e[e.length - 1];
    }
  }
  class O {
    constructor(e) {
      (this.name = e.editor),
        (this.personalURL = e.editorURL),
        (this.affiliation = e.affiliation),
        (this.affiliationURL = e.affiliationURL),
        (this.affiliations = e.affiliations || []);
    }
    get firstName() {
      const e = this.name.split(" ");
      return e.slice(0, e.length - 1).join(" ");
    }
    get lastName() {
      const e = this.name.split(" ");
      return e[e.length - 1];
    }
  }
  class _ {
    constructor(e) {
      (this.name = e.lecturer),
        (this.personalURL = e.lecturerURL),
        (this.affiliation = e.affiliation),
        (this.affiliationURL = e.affiliationURL),
        (this.affiliations = e.affiliations || []);
    }
    get firstName() {
      const e = this.name.split(" ");
      return e.slice(0, e.length - 1).join(" ");
    }
    get lastName() {
      const e = this.name.split(" ");
      return e[e.length - 1];
    }
  }
  class D {
    constructor() {
      (this.title = "unnamed article"),
        (this.description = ""),
        (this.authors = []),
        (this.editors = []),
        (this.lecturers = []),
        (this.bibliography = new Map()),
        (this.bibliographyParsed = !1),
        (this.citations = []),
        (this.citationsCollected = !1),
        (this.journal = {}),
        (this.katex = {}),
        (this.doi = void 0),
        (this.publishedDate = void 0);
    }
    set url(e) {
      this._url = e;
    }
    get url() {
      if (this._url) return this._url;
      return this.distillPath && this.journal.url
        ? this.journal.url + "/" + this.distillPath
        : this.journal.url
          ? this.journal.url
          : void 0;
    }
    get githubUrl() {
      return this.githubPath ? "https://github.com/" + this.githubPath : void 0;
    }
    set previewURL(e) {
      this._previewURL = e;
    }
    get previewURL() {
      return this._previewURL ? this._previewURL : this.url + "/thumbnail.jpg";
    }
    get publishedDateRFC() {
      return R(this.publishedDate);
    }
    get updatedDateRFC() {
      return R(this.updatedDate);
    }
    get publishedYear() {
      return this.publishedDate.getFullYear();
    }
    get publishedMonth() {
      return C[this.publishedDate.getMonth()];
    }
    get publishedDay() {
      return this.publishedDate.getDate();
    }
    get publishedMonthPadded() {
      return N(this.publishedDate.getMonth() + 1);
    }
    get publishedDayPadded() {
      return N(this.publishedDate.getDate());
    }
    get publishedISODateOnly() {
      return this.publishedDate.toISOString().split("T")[0];
    }
    get volume() {
      const e = this.publishedYear - 2015;
      if (1 > e)
        throw new Error(
          "Invalid publish date detected during computing volume",
        );
      return e;
    }
    get issue() {
      return this.publishedDate.getMonth() + 1;
    }
    get concatenatedAuthors() {
      if (2 < this.authors.length) return this.authors[0].lastName + ", et al.";
      return 2 === this.authors.length
        ? this.authors[0].lastName + " & " + this.authors[1].lastName
        : 1 === this.authors.length
          ? this.authors[0].lastName
          : void 0;
    }
    get bibtexAuthors() {
      return this.authors
        .map((e) => {
          return e.lastName + ", " + e.firstName;
        })
        .join(" and ");
    }
    get slug() {
      let e = "";
      return (
        this.authors.length &&
          ((e += this.authors[0].lastName.toLowerCase()),
          (e += this.publishedYear),
          (e += this.title.split(" ")[0].toLowerCase())),
        e || "Untitled"
      );
    }
    get bibliographyEntries() {
      return new Map(
        this.citations.map((e) => {
          const t = this.bibliography.get(e);
          return [e, t];
        }),
      );
    }
    set bibliography(e) {
      e instanceof Map
        ? (this._bibliography = e)
        : "object" == typeof e && (this._bibliography = E(e));
    }
    get bibliography() {
      return this._bibliography;
    }
    static fromObject(e) {
      const t = new D();
      return Object.assign(t, e), t;
    }
    assignToObject(e) {
      Object.assign(e, this),
        (e.bibliography = L(this.bibliographyEntries)),
        (e.url = this.url),
        (e.doi = this.doi),
        (e.githubUrl = this.githubUrl),
        (e.previewURL = this.previewURL),
        this.publishedDate &&
          ((e.volume = this.volume),
          (e.issue = this.issue),
          (e.publishedDateRFC = this.publishedDateRFC),
          (e.publishedYear = this.publishedYear),
          (e.publishedMonth = this.publishedMonth),
          (e.publishedDay = this.publishedDay),
          (e.publishedMonthPadded = this.publishedMonthPadded),
          (e.publishedDayPadded = this.publishedDayPadded)),
        this.updatedDate && (e.updatedDateRFC = this.updatedDateRFC),
        (e.concatenatedAuthors = this.concatenatedAuthors),
        (e.bibtexAuthors = this.bibtexAuthors),
        (e.slug = this.slug);
    }
  }
  var B = r(function (e, t) {
      (function (e) {
        function t() {
          (this.months = [
            "jan",
            "feb",
            "mar",
            "apr",
            "may",
            "jun",
            "jul",
            "aug",
            "sep",
            "oct",
            "nov",
            "dec",
          ]),
            (this.notKey = [",", "{", "}", " ", "="]),
            (this.pos = 0),
            (this.input = ""),
            (this.entries = []),
            (this.currentEntry = ""),
            (this.setInput = function (e) {
              this.input = e;
            }),
            (this.getEntries = function () {
              return this.entries;
            }),
            (this.isWhitespace = function (e) {
              return " " == e || "\r" == e || "\t" == e || "\n" == e;
            }),
            (this.match = function (e, t) {
              if (
                ((void 0 == t || null == t) && (t = !0),
                this.skipWhitespace(t),
                this.input.substring(this.pos, this.pos + e.length) == e)
              )
                this.pos += e.length;
              else
                throw (
                  "Token mismatch, expected " +
                  e +
                  ", found " +
                  this.input.substring(this.pos)
                );
              this.skipWhitespace(t);
            }),
            (this.tryMatch = function (e, t) {
              return (
                (void 0 == t || null == t) && (t = !0),
                this.skipWhitespace(t),
                this.input.substring(this.pos, this.pos + e.length) == e
              );
            }),
            (this.matchAt = function () {
              for (
                ;
                this.input.length > this.pos && "@" != this.input[this.pos];

              )
                this.pos++;
              return !("@" != this.input[this.pos]);
            }),
            (this.skipWhitespace = function (e) {
              for (; this.isWhitespace(this.input[this.pos]); ) this.pos++;
              if ("%" == this.input[this.pos] && !0 == e) {
                for (; "\n" != this.input[this.pos]; ) this.pos++;
                this.skipWhitespace(e);
              }
            }),
            (this.value_braces = function () {
              var e = 0;
              this.match("{", !1);
              for (var t = this.pos, a = !1; ; ) {
                if (!a)
                  if ("}" == this.input[this.pos]) {
                    if (0 < e) e--;
                    else {
                      var i = this.pos;
                      return this.match("}", !1), this.input.substring(t, i);
                    }
                  } else if ("{" == this.input[this.pos]) e++;
                  else if (this.pos >= this.input.length - 1)
                    throw "Unterminated value";
                (a = "\\" == this.input[this.pos] && !1 == a), this.pos++;
              }
            }),
            (this.value_comment = function () {
              for (var e = "", t = 0; !(this.tryMatch("}", !1) && 0 == t); ) {
                if (
                  ((e += this.input[this.pos]),
                  "{" == this.input[this.pos] && t++,
                  "}" == this.input[this.pos] && t--,
                  this.pos >= this.input.length - 1)
                )
                  throw "Unterminated value:" + this.input.substring(start);
                this.pos++;
              }
              return e;
            }),
            (this.value_quotes = function () {
              this.match('"', !1);
              for (var e = this.pos, t = !1; ; ) {
                if (!t) {
                  if ('"' == this.input[this.pos]) {
                    var a = this.pos;
                    return this.match('"', !1), this.input.substring(e, a);
                  }
                  if (this.pos >= this.input.length - 1)
                    throw "Unterminated value:" + this.input.substring(e);
                }
                (t = "\\" == this.input[this.pos] && !1 == t), this.pos++;
              }
            }),
            (this.single_value = function () {
              var e = this.pos;
              if (this.tryMatch("{")) return this.value_braces();
              if (this.tryMatch('"')) return this.value_quotes();
              var t = this.key();
              if (t.match("^[0-9]+$")) return t;
              if (0 <= this.months.indexOf(t.toLowerCase()))
                return t.toLowerCase();
              throw (
                "Value expected:" + this.input.substring(e) + " for key: " + t
              );
            }),
            (this.value = function () {
              for (var e = [this.single_value()]; this.tryMatch("#"); )
                this.match("#"), e.push(this.single_value());
              return e.join("");
            }),
            (this.key = function () {
              for (var e = this.pos; ; ) {
                if (this.pos >= this.input.length) throw "Runaway key";
                if (0 <= this.notKey.indexOf(this.input[this.pos]))
                  return this.input.substring(e, this.pos);
                this.pos++;
              }
            }),
            (this.key_equals_value = function () {
              var e = this.key();
              if (this.tryMatch("=")) {
                this.match("=");
                var t = this.value();
                return [e, t];
              }
              throw (
                "... = value expected, equals sign missing:" +
                this.input.substring(this.pos)
              );
            }),
            (this.key_value_list = function () {
              var e = this.key_equals_value();
              for (
                this.currentEntry.entryTags = {},
                  this.currentEntry.entryTags[e[0]] = e[1];
                this.tryMatch(",") && (this.match(","), !this.tryMatch("}"));

              )
                (e = this.key_equals_value()),
                  (this.currentEntry.entryTags[e[0]] = e[1]);
            }),
            (this.entry_body = function (e) {
              (this.currentEntry = {}),
                (this.currentEntry.citationKey = this.key()),
                (this.currentEntry.entryType = e.substring(1)),
                this.match(","),
                this.key_value_list(),
                this.entries.push(this.currentEntry);
            }),
            (this.directive = function () {
              return this.match("@"), "@" + this.key();
            }),
            (this.preamble = function () {
              (this.currentEntry = {}),
                (this.currentEntry.entryType = "PREAMBLE"),
                (this.currentEntry.entry = this.value_comment()),
                this.entries.push(this.currentEntry);
            }),
            (this.comment = function () {
              (this.currentEntry = {}),
                (this.currentEntry.entryType = "COMMENT"),
                (this.currentEntry.entry = this.value_comment()),
                this.entries.push(this.currentEntry);
            }),
            (this.entry = function (e) {
              this.entry_body(e);
            }),
            (this.bibtex = function () {
              for (; this.matchAt(); ) {
                var e = this.directive();
                this.match("{"),
                  "@STRING" == e
                    ? this.string()
                    : "@PREAMBLE" == e
                      ? this.preamble()
                      : "@COMMENT" == e
                        ? this.comment()
                        : this.entry(e),
                  this.match("}");
              }
            });
        }
        (e.toJSON = function (e) {
          var a = new t();
          return a.setInput(e), a.bibtex(), a.entries;
        }),
          (e.toBibtex = function (e) {
            var t = "";
            for (var a in e) {
              if (
                ((t += "@" + e[a].entryType),
                (t += "{"),
                e[a].citationKey && (t += e[a].citationKey + ", "),
                e[a].entry && (t += e[a].entry),
                e[a].entryTags)
              ) {
                var i = "";
                for (var l in e[a].entryTags)
                  0 != i.length && (i += ", "),
                    (i += l + "= {" + e[a].entryTags[l] + "}");
                t += i;
              }
              t += "}\n\n";
            }
            return t;
          });
      })(t);
    }),
    I = r(function (e) {
      (function (t) {
        e.exports = t();
      })(function () {
        var e = Math.min,
          t = Math.max,
          a = String.fromCharCode;
        return (function d(p, e, t) {
          function a(i, r) {
            if (!e[i]) {
              if (!p[i]) {
                var s = "function" == typeof n && n;
                if (!r && s) return s(i, !0);
                if (l) return l(i, !0);
                var o = new Error("Cannot find module '" + i + "'");
                throw ((o.code = "MODULE_NOT_FOUND"), o);
              }
              var c = (e[i] = { exports: {} });
              p[i][0].call(
                c.exports,
                function (t) {
                  var e = p[i][1][t];
                  return a(e ? e : t);
                },
                c,
                c.exports,
                d,
                p,
                e,
                t,
              );
            }
            return e[i].exports;
          }
          for (var l = "function" == typeof n && n, i = 0; i < t.length; i++)
            a(t[i]);
          return a;
        })(
          {
            1: [
              function (e, t) {
                function a(e) {
                  return e && e.__esModule ? e : { default: e };
                }
                var i = e("./src/ParseError"),
                  l = a(i),
                  r = e("./src/Settings"),
                  n = a(r),
                  s = e("./src/buildTree"),
                  o = a(s),
                  d = e("./src/parseTree"),
                  u = a(d),
                  p = e("./src/utils"),
                  c = a(p),
                  m = function (e, t, a) {
                    c.default.clearNode(t);
                    var i = new n.default(a),
                      l = (0, u.default)(e, i),
                      r = (0, o.default)(l, e, i).toNode();
                    t.appendChild(r);
                  };
                "undefined" != typeof document &&
                  "CSS1Compat" !== document.compatMode &&
                  ("undefined" != typeof console &&
                    console.warn(
                      "Warning: KaTeX doesn't work in quirks mode. Make sure your website has a suitable doctype.",
                    ),
                  (m = function () {
                    throw new l.default("KaTeX doesn't work in quirks mode.");
                  }));
                t.exports = {
                  render: m,
                  renderToString: function (e, t) {
                    var a = new n.default(t),
                      i = (0, u.default)(e, a);
                    return (0, o.default)(i, e, a).toMarkup();
                  },
                  __parse: function (e, t) {
                    var a = new n.default(t);
                    return (0, u.default)(e, a);
                  },
                  ParseError: l.default,
                };
              },
              {
                "./src/ParseError": 29,
                "./src/Settings": 32,
                "./src/buildTree": 37,
                "./src/parseTree": 46,
                "./src/utils": 51,
              },
            ],
            2: [
              function (e, t) {
                t.exports = {
                  default: e("core-js/library/fn/json/stringify"),
                  __esModule: !0,
                };
              },
              { "core-js/library/fn/json/stringify": 6 },
            ],
            3: [
              function (e, t) {
                t.exports = {
                  default: e("core-js/library/fn/object/define-property"),
                  __esModule: !0,
                };
              },
              { "core-js/library/fn/object/define-property": 7 },
            ],
            4: [
              function (e, t, a) {
                (a.__esModule = !0),
                  (a.default = function (e, t) {
                    if (!(e instanceof t))
                      throw new TypeError("Cannot call a class as a function");
                  });
              },
              {},
            ],
            5: [
              function (e, t, a) {
                a.__esModule = !0;
                var i = e("../core-js/object/define-property"),
                  l = (function (e) {
                    return e && e.__esModule ? e : { default: e };
                  })(i);
                a.default = (function () {
                  function e(e, t) {
                    for (var a = 0, i; a < t.length; a++)
                      (i = t[a]),
                        (i.enumerable = i.enumerable || !1),
                        (i.configurable = !0),
                        "value" in i && (i.writable = !0),
                        (0, l.default)(e, i.key, i);
                  }
                  return function (t, a, i) {
                    return a && e(t.prototype, a), i && e(t, i), t;
                  };
                })();
              },
              { "../core-js/object/define-property": 3 },
            ],
            6: [
              function (e, t) {
                var a = e("../../modules/_core"),
                  i = a.JSON || (a.JSON = { stringify: JSON.stringify });
                t.exports = function () {
                  return i.stringify.apply(i, arguments);
                };
              },
              { "../../modules/_core": 10 },
            ],
            7: [
              function (e, t) {
                e("../../modules/es6.object.define-property");
                var a = e("../../modules/_core").Object;
                t.exports = function (e, t, i) {
                  return a.defineProperty(e, t, i);
                };
              },
              {
                "../../modules/_core": 10,
                "../../modules/es6.object.define-property": 23,
              },
            ],
            8: [
              function (e, t) {
                t.exports = function (e) {
                  if ("function" != typeof e)
                    throw TypeError(e + " is not a function!");
                  return e;
                };
              },
              {},
            ],
            9: [
              function (e, t) {
                var a = e("./_is-object");
                t.exports = function (e) {
                  if (!a(e)) throw TypeError(e + " is not an object!");
                  return e;
                };
              },
              { "./_is-object": 19 },
            ],
            10: [
              function (e, t) {
                var a = (t.exports = { version: "2.4.0" });
                "number" == typeof __e && (__e = a);
              },
              {},
            ],
            11: [
              function (e, t) {
                var a = e("./_a-function");
                t.exports = function (e, t, i) {
                  return (a(e), void 0 === t)
                    ? e
                    : 1 === i
                      ? function (i) {
                          return e.call(t, i);
                        }
                      : 2 === i
                        ? function (i, a) {
                            return e.call(t, i, a);
                          }
                        : 3 === i
                          ? function (i, a, l) {
                              return e.call(t, i, a, l);
                            }
                          : function () {
                              return e.apply(t, arguments);
                            };
                };
              },
              { "./_a-function": 8 },
            ],
            12: [
              function (e, t) {
                t.exports = !e("./_fails")(function () {
                  return (
                    7 !=
                    Object.defineProperty({}, "a", {
                      get: function () {
                        return 7;
                      },
                    }).a
                  );
                });
              },
              { "./_fails": 15 },
            ],
            13: [
              function (e, t) {
                var a = e("./_is-object"),
                  i = e("./_global").document,
                  l = a(i) && a(i.createElement);
                t.exports = function (e) {
                  return l ? i.createElement(e) : {};
                };
              },
              { "./_global": 16, "./_is-object": 19 },
            ],
            14: [
              function (e, t) {
                var a = e("./_global"),
                  i = e("./_core"),
                  l = e("./_ctx"),
                  r = e("./_hide"),
                  n = "prototype",
                  s = function (e, t, o) {
                    var d = e & s.F,
                      u = e & s.G,
                      p = e & s.S,
                      c = e & s.P,
                      m = e & s.B,
                      h = e & s.W,
                      g = u ? i : i[t] || (i[t] = {}),
                      f = g[n],
                      y = u ? a : p ? a[t] : (a[t] || {})[n],
                      b,
                      v,
                      x;
                    for (b in (u && (o = t), o))
                      ((v = !d && y && void 0 !== y[b]), !(v && b in g)) &&
                        ((x = v ? y[b] : o[b]),
                        (g[b] =
                          u && "function" != typeof y[b]
                            ? o[b]
                            : m && v
                              ? l(x, a)
                              : h && y[b] == x
                                ? (function (e) {
                                    var t = function (t, a, i) {
                                      if (this instanceof e) {
                                        switch (arguments.length) {
                                          case 0:
                                            return new e();
                                          case 1:
                                            return new e(t);
                                          case 2:
                                            return new e(t, a);
                                        }
                                        return new e(t, a, i);
                                      }
                                      return e.apply(this, arguments);
                                    };
                                    return (t[n] = e[n]), t;
                                  })(x)
                                : c && "function" == typeof x
                                  ? l(Function.call, x)
                                  : x),
                        c &&
                          (((g.virtual || (g.virtual = {}))[b] = x),
                          e & s.R && f && !f[b] && r(f, b, x)));
                  };
                (s.F = 1),
                  (s.G = 2),
                  (s.S = 4),
                  (s.P = 8),
                  (s.B = 16),
                  (s.W = 32),
                  (s.U = 64),
                  (s.R = 128),
                  (t.exports = s);
              },
              { "./_core": 10, "./_ctx": 11, "./_global": 16, "./_hide": 17 },
            ],
            15: [
              function (e, t) {
                t.exports = function (e) {
                  try {
                    return !!e();
                  } catch (t) {
                    return !0;
                  }
                };
              },
              {},
            ],
            16: [
              function (e, t) {
                var a = (t.exports =
                  "undefined" != typeof window && window.Math == Math
                    ? window
                    : "undefined" != typeof self && self.Math == Math
                      ? self
                      : Function("return this")());
                "number" == typeof __g && (__g = a);
              },
              {},
            ],
            17: [
              function (e, t) {
                var a = e("./_object-dp"),
                  i = e("./_property-desc");
                t.exports = e("./_descriptors")
                  ? function (e, t, l) {
                      return a.f(e, t, i(1, l));
                    }
                  : function (e, t, a) {
                      return (e[t] = a), e;
                    };
              },
              {
                "./_descriptors": 12,
                "./_object-dp": 20,
                "./_property-desc": 21,
              },
            ],
            18: [
              function (e, t) {
                t.exports =
                  !e("./_descriptors") &&
                  !e("./_fails")(function () {
                    return (
                      7 !=
                      Object.defineProperty(e("./_dom-create")("div"), "a", {
                        get: function () {
                          return 7;
                        },
                      }).a
                    );
                  });
              },
              { "./_descriptors": 12, "./_dom-create": 13, "./_fails": 15 },
            ],
            19: [
              function (e, t) {
                t.exports = function (e) {
                  return "object" == typeof e
                    ? null !== e
                    : "function" == typeof e;
                };
              },
              {},
            ],
            20: [
              function (e, t, a) {
                var i = e("./_an-object"),
                  l = e("./_ie8-dom-define"),
                  r = e("./_to-primitive"),
                  n = Object.defineProperty;
                a.f = e("./_descriptors")
                  ? Object.defineProperty
                  : function (e, t, a) {
                      if ((i(e), (t = r(t, !0)), i(a), l))
                        try {
                          return n(e, t, a);
                        } catch (t) {}
                      if ("get" in a || "set" in a)
                        throw TypeError("Accessors not supported!");
                      return "value" in a && (e[t] = a.value), e;
                    };
              },
              {
                "./_an-object": 9,
                "./_descriptors": 12,
                "./_ie8-dom-define": 18,
                "./_to-primitive": 22,
              },
            ],
            21: [
              function (e, t) {
                t.exports = function (e, t) {
                  return {
                    enumerable: !(1 & e),
                    configurable: !(2 & e),
                    writable: !(4 & e),
                    value: t,
                  };
                };
              },
              {},
            ],
            22: [
              function (e, t) {
                var a = e("./_is-object");
                t.exports = function (e, t) {
                  if (!a(e)) return e;
                  var i, l;
                  if (
                    t &&
                    "function" == typeof (i = e.toString) &&
                    !a((l = i.call(e)))
                  )
                    return l;
                  if (
                    "function" == typeof (i = e.valueOf) &&
                    !a((l = i.call(e)))
                  )
                    return l;
                  if (
                    !t &&
                    "function" == typeof (i = e.toString) &&
                    !a((l = i.call(e)))
                  )
                    return l;
                  throw TypeError("Can't convert object to primitive value");
                };
              },
              { "./_is-object": 19 },
            ],
            23: [
              function (e) {
                var t = e("./_export");
                t(t.S + t.F * !e("./_descriptors"), "Object", {
                  defineProperty: e("./_object-dp").f,
                });
              },
              { "./_descriptors": 12, "./_export": 14, "./_object-dp": 20 },
            ],
            24: [
              function (e, t) {
                function a(e) {
                  if (!e.__matchAtRelocatable) {
                    var t = e.source + "|()",
                      a =
                        "g" +
                        (e.ignoreCase ? "i" : "") +
                        (e.multiline ? "m" : "") +
                        (e.unicode ? "u" : "");
                    e.__matchAtRelocatable = new RegExp(t, a);
                  }
                  return e.__matchAtRelocatable;
                }
                t.exports = function (e, t, i) {
                  if (e.global || e.sticky)
                    throw new Error(
                      "matchAt(...): Only non-global regexes are supported",
                    );
                  var l = a(e);
                  l.lastIndex = i;
                  var r = l.exec(t);
                  return null == r[r.length - 1] ? (--r.length, r) : null;
                };
              },
              {},
            ],
            25: [
              function (e, t) {
                function l(e) {
                  if (null === e || e === void 0)
                    throw new TypeError(
                      "Object.assign cannot be called with null or undefined",
                    );
                  return Object(e);
                }
                var i = Object.prototype.hasOwnProperty,
                  r = Object.prototype.propertyIsEnumerable;
                t.exports = (function () {
                  try {
                    if (!Object.assign) return !1;
                    var e = new String("abc");
                    if (
                      ((e[5] = "de"), "5" === Object.getOwnPropertyNames(e)[0])
                    )
                      return !1;
                    for (var t = {}, l = 0; 10 > l; l++) t["_" + a(l)] = l;
                    var i = Object.getOwnPropertyNames(t).map(function (e) {
                      return t[e];
                    });
                    if ("0123456789" !== i.join("")) return !1;
                    var r = {};
                    return (
                      [
                        "a",
                        "b",
                        "c",
                        "d",
                        "e",
                        "f",
                        "g",
                        "h",
                        "i",
                        "j",
                        "k",
                        "l",
                        "m",
                        "n",
                        "o",
                        "p",
                        "q",
                        "r",
                        "s",
                        "t",
                      ].forEach(function (e) {
                        r[e] = e;
                      }),
                      "abcdefghijklmnopqrst" ===
                        Object.keys(Object.assign({}, r)).join("")
                    );
                  } catch (t) {
                    return !1;
                  }
                })()
                  ? Object.assign
                  : function (e) {
                      for (
                        var t = l(e), a = 1, n, s;
                        a < arguments.length;
                        a++
                      ) {
                        for (var o in ((n = Object(arguments[a])), n))
                          i.call(n, o) && (t[o] = n[o]);
                        if (Object.getOwnPropertySymbols) {
                          s = Object.getOwnPropertySymbols(n);
                          for (var d = 0; d < s.length; d++)
                            r.call(n, s[d]) && (t[s[d]] = n[s[d]]);
                        }
                      }
                      return t;
                    };
              },
              {},
            ],
            26: [
              function (e, t) {
                function a(e) {
                  return e && e.__esModule ? e : { default: e };
                }
                var i = e("babel-runtime/helpers/classCallCheck"),
                  l = a(i),
                  r = e("babel-runtime/helpers/createClass"),
                  n = a(r),
                  s = e("match-at"),
                  o = a(s),
                  d = e("./ParseError"),
                  u = a(d),
                  p = (function () {
                    function e(t, a, i, r) {
                      (0, l.default)(this, e),
                        (this.text = t),
                        (this.start = a),
                        (this.end = i),
                        (this.lexer = r);
                    }
                    return (
                      (0, n.default)(e, [
                        {
                          key: "range",
                          value: function (t, a) {
                            return t.lexer === this.lexer
                              ? new e(a, this.start, t.end, this.lexer)
                              : new e(a);
                          },
                        },
                      ]),
                      e
                    );
                  })(),
                  c =
                    /([ \r\n	]+)|([!-\[\]-‧‪-퟿豈-￿]|[�-�][�-�]|\\(?:[a-zA-Z]+|[^�-�]))/,
                  m = (function () {
                    function e(t) {
                      (0, l.default)(this, e), (this.input = t), (this.pos = 0);
                    }
                    return (
                      (0, n.default)(e, [
                        {
                          key: "lex",
                          value: function () {
                            var e = this.input,
                              t = this.pos;
                            if (t === e.length) return new p("EOF", t, t, this);
                            var a = (0, o.default)(c, e, t);
                            if (null === a)
                              throw new u.default(
                                "Unexpected character: '" + e[t] + "'",
                                new p(e[t], t, t + 1, this),
                              );
                            var i = a[2] || " ",
                              l = this.pos;
                            this.pos += a[0].length;
                            var r = this.pos;
                            return new p(i, l, r, this);
                          },
                        },
                      ]),
                      e
                    );
                  })();
                t.exports = m;
              },
              {
                "./ParseError": 29,
                "babel-runtime/helpers/classCallCheck": 4,
                "babel-runtime/helpers/createClass": 5,
                "match-at": 24,
              },
            ],
            27: [
              function (e, t) {
                function a(e) {
                  return e && e.__esModule ? e : { default: e };
                }
                var i = e("babel-runtime/helpers/classCallCheck"),
                  l = a(i),
                  r = e("babel-runtime/helpers/createClass"),
                  n = a(r),
                  s = e("./Lexer"),
                  o = a(s),
                  d = e("./macros"),
                  u = a(d),
                  p = e("./ParseError"),
                  c = a(p),
                  m = e("object-assign"),
                  h = a(m),
                  g = (function () {
                    function e(t, a) {
                      (0, l.default)(this, e),
                        (this.lexer = new o.default(t)),
                        (this.macros = (0, h.default)({}, u.default, a)),
                        (this.stack = []),
                        (this.discardedWhiteSpace = []);
                    }
                    return (
                      (0, n.default)(e, [
                        {
                          key: "nextToken",
                          value: function () {
                            for (;;) {
                              0 === this.stack.length &&
                                this.stack.push(this.lexer.lex());
                              var e = this.stack.pop(),
                                t = e.text;
                              if (
                                !(
                                  "\\" === t.charAt(0) &&
                                  this.macros.hasOwnProperty(t)
                                )
                              )
                                return e;
                              var a = void 0,
                                l = this.macros[t];
                              if ("string" == typeof l) {
                                var r = 0;
                                if (-1 !== l.indexOf("#"))
                                  for (
                                    var n = l.replace(/##/g, "");
                                    -1 !== n.indexOf("#" + (r + 1));

                                  )
                                    ++r;
                                var s = new o.default(l);
                                for (l = [], a = s.lex(); "EOF" !== a.text; )
                                  l.push(a), (a = s.lex());
                                l.reverse(),
                                  (l.numArgs = r),
                                  (this.macros[t] = l);
                              }
                              if (l.numArgs) {
                                var d = [],
                                  u = void 0;
                                for (u = 0; u < l.numArgs; ++u) {
                                  var i = this.get(!0);
                                  if ("{" === i.text) {
                                    for (var p = [], m = 1; 0 != m; )
                                      if (
                                        ((a = this.get(!1)),
                                        p.push(a),
                                        "{" === a.text)
                                      )
                                        ++m;
                                      else if ("}" === a.text) --m;
                                      else if ("EOF" === a.text)
                                        throw new c.default(
                                          "End of input in macro argument",
                                          i,
                                        );
                                    p.pop(), p.reverse(), (d[u] = p);
                                  } else if ("EOF" === i.text)
                                    throw new c.default(
                                      "End of input expecting macro argument",
                                      e,
                                    );
                                  else d[u] = [i];
                                }
                                for (
                                  l = l.slice(), u = l.length - 1;
                                  0 <= u;
                                  --u
                                )
                                  if (((a = l[u]), "#" === a.text)) {
                                    if (0 === u)
                                      throw new c.default(
                                        "Incomplete placeholder at end of macro body",
                                        a,
                                      );
                                    if (((a = l[--u]), "#" === a.text))
                                      l.splice(u + 1, 1);
                                    else if (/^[1-9]$/.test(a.text))
                                      l.splice.apply(
                                        l,
                                        [u, 2].concat(d[a.text - 1]),
                                      );
                                    else
                                      throw new c.default(
                                        "Not a valid argument number",
                                        a,
                                      );
                                  }
                              }
                              this.stack = this.stack.concat(l);
                            }
                          },
                        },
                        {
                          key: "get",
                          value: function (e) {
                            this.discardedWhiteSpace = [];
                            var t = this.nextToken();
                            if (e)
                              for (; " " === t.text; )
                                this.discardedWhiteSpace.push(t),
                                  (t = this.nextToken());
                            return t;
                          },
                        },
                        {
                          key: "unget",
                          value: function (e) {
                            for (
                              this.stack.push(e);
                              0 !== this.discardedWhiteSpace.length;

                            )
                              this.stack.push(this.discardedWhiteSpace.pop());
                          },
                        },
                      ]),
                      e
                    );
                  })();
                t.exports = g;
              },
              {
                "./Lexer": 26,
                "./ParseError": 29,
                "./macros": 44,
                "babel-runtime/helpers/classCallCheck": 4,
                "babel-runtime/helpers/createClass": 5,
                "object-assign": 25,
              },
            ],
            28: [
              function (e, t) {
                function a(e) {
                  return e && e.__esModule ? e : { default: e };
                }
                var i = e("babel-runtime/helpers/classCallCheck"),
                  l = a(i),
                  r = e("babel-runtime/helpers/createClass"),
                  n = a(r),
                  s = e("./fontMetrics"),
                  o = a(s),
                  d = 6,
                  u = [
                    [1, 1, 1],
                    [2, 1, 1],
                    [3, 1, 1],
                    [4, 2, 1],
                    [5, 2, 1],
                    [6, 3, 1],
                    [7, 4, 2],
                    [8, 6, 3],
                    [9, 7, 6],
                    [10, 8, 7],
                    [11, 10, 9],
                  ],
                  p = [
                    0.5, 0.6, 0.7, 0.8, 0.9, 1, 1.2, 1.44, 1.728, 2.074, 2.488,
                  ],
                  c = function (e, t) {
                    return 2 > t.size ? e : u[e - 1][t.size - 1];
                  },
                  m = (function () {
                    function e(t) {
                      (0, l.default)(this, e),
                        (this.style = t.style),
                        (this.color = t.color),
                        (this.size = t.size || d),
                        (this.textSize = t.textSize || this.size),
                        (this.phantom = t.phantom),
                        (this.font = t.font),
                        (this.sizeMultiplier = p[this.size - 1]),
                        (this._fontMetrics = null);
                    }
                    return (
                      (0, n.default)(e, [
                        {
                          key: "extend",
                          value: function (t) {
                            var a = {
                              style: this.style,
                              size: this.size,
                              textSize: this.textSize,
                              color: this.color,
                              phantom: this.phantom,
                              font: this.font,
                            };
                            for (var i in t)
                              t.hasOwnProperty(i) && (a[i] = t[i]);
                            return new e(a);
                          },
                        },
                        {
                          key: "havingStyle",
                          value: function (e) {
                            return this.style === e
                              ? this
                              : this.extend({
                                  style: e,
                                  size: c(this.textSize, e),
                                });
                          },
                        },
                        {
                          key: "havingCrampedStyle",
                          value: function () {
                            return this.havingStyle(this.style.cramp());
                          },
                        },
                        {
                          key: "havingSize",
                          value: function (e) {
                            return this.size === e && this.textSize === e
                              ? this
                              : this.extend({
                                  style: this.style.text(),
                                  size: e,
                                  textSize: e,
                                });
                          },
                        },
                        {
                          key: "havingBaseStyle",
                          value: function (e) {
                            e = e || this.style.text();
                            var t = c(d, e);
                            return this.size === t &&
                              this.textSize === d &&
                              this.style === e
                              ? this
                              : this.extend({ style: e, size: t, baseSize: d });
                          },
                        },
                        {
                          key: "withColor",
                          value: function (e) {
                            return this.extend({ color: e });
                          },
                        },
                        {
                          key: "withPhantom",
                          value: function () {
                            return this.extend({ phantom: !0 });
                          },
                        },
                        {
                          key: "withFont",
                          value: function (e) {
                            return this.extend({ font: e || this.font });
                          },
                        },
                        {
                          key: "sizingClasses",
                          value: function (e) {
                            return e.size === this.size
                              ? []
                              : [
                                  "sizing",
                                  "reset-size" + e.size,
                                  "size" + this.size,
                                ];
                          },
                        },
                        {
                          key: "baseSizingClasses",
                          value: function () {
                            return this.size === d
                              ? []
                              : [
                                  "sizing",
                                  "reset-size" + this.size,
                                  "size" + d,
                                ];
                          },
                        },
                        {
                          key: "fontMetrics",
                          value: function () {
                            return (
                              this._fontMetrics ||
                                (this._fontMetrics = o.default.getFontMetrics(
                                  this.size,
                                )),
                              this._fontMetrics
                            );
                          },
                        },
                        {
                          key: "getColor",
                          value: function () {
                            return this.phantom
                              ? "transparent"
                              : e.colorMap[this.color] || this.color;
                          },
                        },
                      ]),
                      e
                    );
                  })();
                (m.colorMap = {
                  "katex-blue": "#6495ed",
                  "katex-orange": "#ffa500",
                  "katex-pink": "#ff00af",
                  "katex-red": "#df0030",
                  "katex-green": "#28ae7b",
                  "katex-gray": "gray",
                  "katex-purple": "#9d38bd",
                  "katex-blueA": "#ccfaff",
                  "katex-blueB": "#80f6ff",
                  "katex-blueC": "#63d9ea",
                  "katex-blueD": "#11accd",
                  "katex-blueE": "#0c7f99",
                  "katex-tealA": "#94fff5",
                  "katex-tealB": "#26edd5",
                  "katex-tealC": "#01d1c1",
                  "katex-tealD": "#01a995",
                  "katex-tealE": "#208170",
                  "katex-greenA": "#b6ffb0",
                  "katex-greenB": "#8af281",
                  "katex-greenC": "#74cf70",
                  "katex-greenD": "#1fab54",
                  "katex-greenE": "#0d923f",
                  "katex-goldA": "#ffd0a9",
                  "katex-goldB": "#ffbb71",
                  "katex-goldC": "#ff9c39",
                  "katex-goldD": "#e07d10",
                  "katex-goldE": "#a75a05",
                  "katex-redA": "#fca9a9",
                  "katex-redB": "#ff8482",
                  "katex-redC": "#f9685d",
                  "katex-redD": "#e84d39",
                  "katex-redE": "#bc2612",
                  "katex-maroonA": "#ffbde0",
                  "katex-maroonB": "#ff92c6",
                  "katex-maroonC": "#ed5fa6",
                  "katex-maroonD": "#ca337c",
                  "katex-maroonE": "#9e034e",
                  "katex-purpleA": "#ddd7ff",
                  "katex-purpleB": "#c6b9fc",
                  "katex-purpleC": "#aa87ff",
                  "katex-purpleD": "#7854ab",
                  "katex-purpleE": "#543b78",
                  "katex-mintA": "#f5f9e8",
                  "katex-mintB": "#edf2df",
                  "katex-mintC": "#e0e5cc",
                  "katex-grayA": "#f6f7f7",
                  "katex-grayB": "#f0f1f2",
                  "katex-grayC": "#e3e5e6",
                  "katex-grayD": "#d6d8da",
                  "katex-grayE": "#babec2",
                  "katex-grayF": "#888d93",
                  "katex-grayG": "#626569",
                  "katex-grayH": "#3b3e40",
                  "katex-grayI": "#21242c",
                  "katex-kaBlue": "#314453",
                  "katex-kaGreen": "#71B307",
                }),
                  (m.BASESIZE = d),
                  (t.exports = m);
              },
              {
                "./fontMetrics": 41,
                "babel-runtime/helpers/classCallCheck": 4,
                "babel-runtime/helpers/createClass": 5,
              },
            ],
            29: [
              function (e, t) {
                var a = e("babel-runtime/helpers/classCallCheck"),
                  i = (function (e) {
                    return e && e.__esModule ? e : { default: e };
                  })(a),
                  l = function e(t, a) {
                    (0, i.default)(this, e);
                    var l = "KaTeX parse error: " + t,
                      r,
                      n;
                    if (a && a.lexer && a.start <= a.end) {
                      var s = a.lexer.input;
                      (r = a.start),
                        (n = a.end),
                        (l +=
                          r === s.length
                            ? " at end of input: "
                            : " at position " + (r + 1) + ": ");
                      var o = s.slice(r, n).replace(/[^]/g, "$&\u0332"),
                        d;
                      d =
                        15 < r ? "\u2026" + s.slice(r - 15, r) : s.slice(0, r);
                      var u;
                      (u =
                        n + 15 < s.length
                          ? s.slice(n, n + 15) + "\u2026"
                          : s.slice(n)),
                        (l += d + o + u);
                    }
                    var p = new Error(l);
                    return (
                      (p.name = "ParseError"),
                      (p.__proto__ = e.prototype),
                      (p.position = r),
                      p
                    );
                  };
                (l.prototype.__proto__ = Error.prototype), (t.exports = l);
              },
              { "babel-runtime/helpers/classCallCheck": 4 },
            ],
            30: [
              function (e, t, a) {
                Object.defineProperty(a, "__esModule", { value: !0 });
                var i = e("babel-runtime/helpers/classCallCheck"),
                  l = (function (e) {
                    return e && e.__esModule ? e : { default: e };
                  })(i);
                a.default = function e(t, a, i, r, n) {
                  (0, l.default)(this, e),
                    (this.type = t),
                    (this.value = a),
                    (this.mode = i),
                    r &&
                      (!n || n.lexer === r.lexer) &&
                      ((this.lexer = r.lexer),
                      (this.start = r.start),
                      (this.end = (n || r).end));
                };
              },
              { "babel-runtime/helpers/classCallCheck": 4 },
            ],
            31: [
              function (e, t) {
                function a(e) {
                  return e && e.__esModule ? e : { default: e };
                }
                function l(e, t, a) {
                  (this.result = e), (this.isFunction = t), (this.token = a);
                }
                var i = e("babel-runtime/helpers/classCallCheck"),
                  r = a(i),
                  n = e("babel-runtime/helpers/createClass"),
                  s = a(n),
                  o = e("./functions"),
                  d = a(o),
                  u = e("./environments"),
                  p = a(u),
                  c = e("./MacroExpander"),
                  m = a(c),
                  h = e("./symbols"),
                  g = a(h),
                  f = e("./utils"),
                  y = a(f),
                  b = e("./units"),
                  v = a(b),
                  x = e("./unicodeRegexes"),
                  k = e("./ParseNode"),
                  w = a(k),
                  M = e("./ParseError"),
                  S = a(M),
                  z = (function () {
                    function e(t, a) {
                      (0, r.default)(this, e),
                        (this.gullet = new m.default(t, a.macros)),
                        a.colorIsTextColor &&
                          (this.gullet.macros["\\color"] = "\\textcolor"),
                        (this.settings = a),
                        (this.leftrightDepth = 0);
                    }
                    return (
                      (0, s.default)(e, [
                        {
                          key: "expect",
                          value: function (e, t) {
                            if (this.nextToken.text !== e)
                              throw new S.default(
                                "Expected '" +
                                  e +
                                  "', got '" +
                                  this.nextToken.text +
                                  "'",
                                this.nextToken,
                              );
                            !1 !== t && this.consume();
                          },
                        },
                        {
                          key: "consume",
                          value: function () {
                            this.nextToken = this.gullet.get(
                              "math" === this.mode,
                            );
                          },
                        },
                        {
                          key: "switchMode",
                          value: function (e) {
                            this.gullet.unget(this.nextToken),
                              (this.mode = e),
                              this.consume();
                          },
                        },
                        {
                          key: "parse",
                          value: function () {
                            (this.mode = "math"), this.consume();
                            var e = this.parseInput();
                            return e;
                          },
                        },
                        {
                          key: "parseInput",
                          value: function () {
                            var e = this.parseExpression(!1);
                            return this.expect("EOF", !1), e;
                          },
                        },
                        {
                          key: "parseExpression",
                          value: function (t, a) {
                            for (
                              var i = [], l;
                              ((l = this.nextToken),
                              -1 === e.endOfExpression.indexOf(l.text)) &&
                              !(a && l.text === a) &&
                              !(
                                t &&
                                d.default[l.text] &&
                                d.default[l.text].infix
                              );

                            ) {
                              var r = this.parseAtom();
                              if (!r) {
                                if (
                                  !this.settings.throwOnError &&
                                  "\\" === l.text[0]
                                ) {
                                  var n = this.handleUnsupportedCmd();
                                  i.push(n);
                                  continue;
                                }
                                break;
                              }
                              i.push(r);
                            }
                            return this.handleInfixNodes(i);
                          },
                        },
                        {
                          key: "handleInfixNodes",
                          value: function (e) {
                            for (
                              var t = -1, a = void 0, l = 0, i;
                              l < e.length;
                              l++
                            )
                              if (((i = e[l]), "infix" === i.type)) {
                                if (-1 != t)
                                  throw new S.default(
                                    "only one infix operator per group",
                                    i.value.token,
                                  );
                                (t = l), (a = i.value.replaceWith);
                              }
                            if (-1 !== t) {
                              var r = e.slice(0, t),
                                n = e.slice(t + 1),
                                s,
                                o;
                              (s =
                                1 === r.length && "ordgroup" === r[0].type
                                  ? r[0]
                                  : new w.default("ordgroup", r, this.mode)),
                                (o =
                                  1 === n.length && "ordgroup" === n[0].type
                                    ? n[0]
                                    : new w.default("ordgroup", n, this.mode));
                              var d = this.callFunction(a, [s, o], null);
                              return [new w.default(d.type, d, this.mode)];
                            }
                            return e;
                          },
                        },
                        {
                          key: "handleSupSubscript",
                          value: function (t) {
                            var a = this.nextToken,
                              i = a.text;
                            this.consume();
                            var l = this.parseGroup();
                            if (!l) {
                              if (
                                !this.settings.throwOnError &&
                                "\\" === this.nextToken.text[0]
                              )
                                return this.handleUnsupportedCmd();
                              throw new S.default(
                                "Expected group after '" + i + "'",
                                a,
                              );
                            } else if (l.isFunction) {
                              var r = d.default[l.result].greediness;
                              if (r > e.SUPSUB_GREEDINESS)
                                return this.parseFunction(l);
                              throw new S.default(
                                "Got function '" +
                                  l.result +
                                  "' with no arguments as " +
                                  t,
                                a,
                              );
                            } else return l.result;
                          },
                        },
                        {
                          key: "handleUnsupportedCmd",
                          value: function () {
                            for (
                              var e = this.nextToken.text, t = [], a = 0;
                              a < e.length;
                              a++
                            )
                              t.push(new w.default("textord", e[a], "text"));
                            var i = new w.default(
                                "text",
                                { body: t, type: "text" },
                                this.mode,
                              ),
                              l = new w.default(
                                "color",
                                {
                                  color: this.settings.errorColor,
                                  value: [i],
                                  type: "color",
                                },
                                this.mode,
                              );
                            return this.consume(), l;
                          },
                        },
                        {
                          key: "parseAtom",
                          value: function () {
                            var e = this.parseImplicitGroup();
                            if ("text" === this.mode) return e;
                            for (var t, a, i; ; )
                              if (
                                ((i = this.nextToken),
                                "\\limits" === i.text ||
                                  "\\nolimits" === i.text)
                              ) {
                                if (!e || "op" !== e.type)
                                  throw new S.default(
                                    "Limit controls must follow a math operator",
                                    i,
                                  );
                                else {
                                  var l = "\\limits" === i.text;
                                  (e.value.limits = l),
                                    (e.value.alwaysHandleSupSub = !0);
                                }
                                this.consume();
                              } else if ("^" === i.text) {
                                if (t)
                                  throw new S.default("Double superscript", i);
                                t = this.handleSupSubscript("superscript");
                              } else if ("_" === i.text) {
                                if (a)
                                  throw new S.default("Double subscript", i);
                                a = this.handleSupSubscript("subscript");
                              } else if ("'" === i.text) {
                                if (t)
                                  throw new S.default("Double superscript", i);
                                var r = new w.default(
                                    "textord",
                                    "\\prime",
                                    this.mode,
                                  ),
                                  n = [r];
                                for (
                                  this.consume();
                                  "'" === this.nextToken.text;

                                )
                                  n.push(r), this.consume();
                                "^" === this.nextToken.text &&
                                  n.push(
                                    this.handleSupSubscript("superscript"),
                                  ),
                                  (t = new w.default("ordgroup", n, this.mode));
                              } else break;
                            return t || a
                              ? new w.default(
                                  "supsub",
                                  { base: e, sup: t, sub: a },
                                  this.mode,
                                )
                              : e;
                          },
                        },
                        {
                          key: "parseImplicitGroup",
                          value: function () {
                            var t = this.parseSymbol();
                            if (null == t) return this.parseFunction();
                            var a = t.result;
                            if ("\\left" === a) {
                              var i = this.parseFunction(t);
                              ++this.leftrightDepth;
                              var l = this.parseExpression(!1);
                              --this.leftrightDepth, this.expect("\\right", !1);
                              var r = this.parseFunction();
                              return new w.default(
                                "leftright",
                                {
                                  body: l,
                                  left: i.value.value,
                                  right: r.value.value,
                                },
                                this.mode,
                              );
                            }
                            if ("\\begin" === a) {
                              var n = this.parseFunction(t),
                                s = n.value.name;
                              if (!p.default.hasOwnProperty(s))
                                throw new S.default(
                                  "No such environment: " + s,
                                  n.value.nameGroup,
                                );
                              var o = p.default[s],
                                d = this.parseArguments(
                                  "\\begin{" + s + "}",
                                  o,
                                ),
                                u = {
                                  mode: this.mode,
                                  envName: s,
                                  parser: this,
                                  positions: d.pop(),
                                },
                                c = o.handler(u, d);
                              this.expect("\\end", !1);
                              var m = this.nextToken,
                                h = this.parseFunction();
                              if (h.value.name !== s)
                                throw new S.default(
                                  "Mismatch: \\begin{" +
                                    s +
                                    "} matched by \\end{" +
                                    h.value.name +
                                    "}",
                                  m,
                                );
                              return (c.position = h.position), c;
                            }
                            if (y.default.contains(e.sizeFuncs, a)) {
                              this.consumeSpaces();
                              var g = this.parseExpression(!1);
                              return new w.default(
                                "sizing",
                                {
                                  size: y.default.indexOf(e.sizeFuncs, a) + 1,
                                  value: g,
                                },
                                this.mode,
                              );
                            }
                            if (y.default.contains(e.styleFuncs, a)) {
                              this.consumeSpaces();
                              var f = this.parseExpression(!0);
                              return new w.default(
                                "styling",
                                { style: a.slice(1, a.length - 5), value: f },
                                this.mode,
                              );
                            }
                            if (a in e.oldFontFuncs) {
                              var b = e.oldFontFuncs[a];
                              this.consumeSpaces();
                              var v = this.parseExpression(!0);
                              return "text" === b.slice(0, 4)
                                ? new w.default(
                                    "text",
                                    {
                                      style: b,
                                      body: new w.default(
                                        "ordgroup",
                                        v,
                                        this.mode,
                                      ),
                                    },
                                    this.mode,
                                  )
                                : new w.default(
                                    "font",
                                    {
                                      font: b,
                                      body: new w.default(
                                        "ordgroup",
                                        v,
                                        this.mode,
                                      ),
                                    },
                                    this.mode,
                                  );
                            }
                            if ("\\color" === a) {
                              var x = this.parseColorGroup(!1);
                              if (!x)
                                throw new S.default(
                                  "\\color not followed by color",
                                );
                              var k = this.parseExpression(!0);
                              return new w.default(
                                "color",
                                {
                                  type: "color",
                                  color: x.result.value,
                                  value: k,
                                },
                                this.mode,
                              );
                            }
                            if ("$" === a) {
                              if ("math" === this.mode)
                                throw new S.default("$ within math mode");
                              this.consume();
                              var M = this.mode;
                              this.switchMode("math");
                              var z = this.parseExpression(!1, "$");
                              return (
                                this.expect("$", !0),
                                this.switchMode(M),
                                new w.default(
                                  "styling",
                                  { style: "text", value: z },
                                  "math",
                                )
                              );
                            }
                            return this.parseFunction(t);
                          },
                        },
                        {
                          key: "parseFunction",
                          value: function (e) {
                            if ((e || (e = this.parseGroup()), e)) {
                              if (e.isFunction) {
                                var t = e.result,
                                  a = d.default[t];
                                if ("text" === this.mode && !a.allowedInText)
                                  throw new S.default(
                                    "Can't use function '" +
                                      t +
                                      "' in text mode",
                                    e.token,
                                  );
                                else if (
                                  "math" === this.mode &&
                                  !1 === a.allowedInMath
                                )
                                  throw new S.default(
                                    "Can't use function '" +
                                      t +
                                      "' in math mode",
                                    e.token,
                                  );
                                var i = this.parseArguments(t, a),
                                  l = e.token,
                                  r = this.callFunction(t, i, i.pop(), l);
                                return new w.default(r.type, r, this.mode);
                              }
                              return e.result;
                            }
                            return null;
                          },
                        },
                        {
                          key: "callFunction",
                          value: function (e, t, a, i) {
                            var l = {
                              funcName: e,
                              parser: this,
                              positions: a,
                              token: i,
                            };
                            return d.default[e].handler(l, t);
                          },
                        },
                        {
                          key: "parseArguments",
                          value: function (e, t) {
                            var a = t.numArgs + t.numOptionalArgs;
                            if (0 === a) return [[this.pos]];
                            for (
                              var r = t.greediness,
                                n = [this.pos],
                                s = [],
                                o = 0;
                              o < a;
                              o++
                            ) {
                              var i = this.nextToken,
                                u = t.argTypes && t.argTypes[o],
                                p = void 0;
                              if (o < t.numOptionalArgs) {
                                if (
                                  ((p = u
                                    ? this.parseGroupOfType(u, !0)
                                    : this.parseGroup(!0)),
                                  !p)
                                ) {
                                  s.push(null), n.push(this.pos);
                                  continue;
                                }
                              } else if (
                                ((p = u
                                  ? this.parseGroupOfType(u)
                                  : this.parseGroup()),
                                !p)
                              )
                                if (
                                  !this.settings.throwOnError &&
                                  "\\" === this.nextToken.text[0]
                                )
                                  p = new l(
                                    this.handleUnsupportedCmd(
                                      this.nextToken.text,
                                    ),
                                    !1,
                                  );
                                else
                                  throw new S.default(
                                    "Expected group after '" + e + "'",
                                    i,
                                  );
                              var c = void 0;
                              if (p.isFunction) {
                                var m = d.default[p.result].greediness;
                                if (m > r) c = this.parseFunction(p);
                                else
                                  throw new S.default(
                                    "Got function '" +
                                      p.result +
                                      "' as argument to '" +
                                      e +
                                      "'",
                                    i,
                                  );
                              } else c = p.result;
                              s.push(c), n.push(this.pos);
                            }
                            return s.push(n), s;
                          },
                        },
                        {
                          key: "parseGroupOfType",
                          value: function (e, t) {
                            var a = this.mode;
                            if (("original" === e && (e = a), "color" === e))
                              return this.parseColorGroup(t);
                            if ("size" === e) return this.parseSizeGroup(t);
                            this.switchMode(e),
                              "text" === e && this.consumeSpaces();
                            var i = this.parseGroup(t);
                            return this.switchMode(a), i;
                          },
                        },
                        {
                          key: "consumeSpaces",
                          value: function () {
                            for (; " " === this.nextToken.text; )
                              this.consume();
                          },
                        },
                        {
                          key: "parseStringGroup",
                          value: function (e, t) {
                            if (t && "[" !== this.nextToken.text) return null;
                            var a = this.mode;
                            (this.mode = "text"), this.expect(t ? "[" : "{");
                            for (
                              var i = "", l = this.nextToken, r = l;
                              this.nextToken.text !== (t ? "]" : "}");

                            ) {
                              if ("EOF" === this.nextToken.text)
                                throw new S.default(
                                  "Unexpected end of input in " + e,
                                  l.range(this.nextToken, i),
                                );
                              (r = this.nextToken),
                                (i += r.text),
                                this.consume();
                            }
                            return (
                              (this.mode = a),
                              this.expect(t ? "]" : "}"),
                              l.range(r, i)
                            );
                          },
                        },
                        {
                          key: "parseRegexGroup",
                          value: function (e, t) {
                            var a = this.mode;
                            this.mode = "text";
                            for (
                              var i = this.nextToken, l = i, r = "";
                              "EOF" !== this.nextToken.text &&
                              e.test(r + this.nextToken.text);

                            )
                              (l = this.nextToken),
                                (r += l.text),
                                this.consume();
                            if ("" === r)
                              throw new S.default(
                                "Invalid " + t + ": '" + i.text + "'",
                                i,
                              );
                            return (this.mode = a), i.range(l, r);
                          },
                        },
                        {
                          key: "parseColorGroup",
                          value: function (e) {
                            var t = this.parseStringGroup("color", e);
                            if (!t) return null;
                            var a = /^(#[a-z0-9]+|[a-z]+)$/i.exec(t.text);
                            if (!a)
                              throw new S.default(
                                "Invalid color: '" + t.text + "'",
                                t,
                              );
                            return new l(
                              new w.default("color", a[0], this.mode),
                              !1,
                            );
                          },
                        },
                        {
                          key: "parseSizeGroup",
                          value: function (e) {
                            var t;
                            if (
                              ((t =
                                e || "{" === this.nextToken.text
                                  ? this.parseStringGroup("size", e)
                                  : this.parseRegexGroup(
                                      /^[-+]? *(?:$|\d+|\d+\.\d*|\.\d*) *[a-z]{0,2} *$/,
                                      "size",
                                    )),
                              !t)
                            )
                              return null;
                            var a =
                              /([-+]?) *(\d+(?:\.\d*)?|\.\d+) *([a-z]{2})/.exec(
                                t.text,
                              );
                            if (!a)
                              throw new S.default(
                                "Invalid size: '" + t.text + "'",
                                t,
                              );
                            var i = { number: +(a[1] + a[2]), unit: a[3] };
                            if (!v.default.validUnit(i))
                              throw new S.default(
                                "Invalid unit: '" + i.unit + "'",
                                t,
                              );
                            return new l(
                              new w.default("size", i, this.mode),
                              !1,
                            );
                          },
                        },
                        {
                          key: "parseGroup",
                          value: function (e) {
                            var t = this.nextToken;
                            if (this.nextToken.text === (e ? "[" : "{")) {
                              this.consume();
                              var a = this.parseExpression(!1, e ? "]" : null),
                                i = this.nextToken;
                              return (
                                this.expect(e ? "]" : "}"),
                                "text" === this.mode && this.formLigatures(a),
                                new l(
                                  new w.default("ordgroup", a, this.mode, t, i),
                                  !1,
                                )
                              );
                            }
                            return e ? null : this.parseSymbol();
                          },
                        },
                        {
                          key: "formLigatures",
                          value: function (e) {
                            for (var t = e.length - 1, l = 0; l < t; ++l) {
                              var i = e[l],
                                a = i.value;
                              "-" === a &&
                                "-" === e[l + 1].value &&
                                (l + 1 < t && "-" === e[l + 2].value
                                  ? (e.splice(
                                      l,
                                      3,
                                      new w.default(
                                        "textord",
                                        "---",
                                        "text",
                                        i,
                                        e[l + 2],
                                      ),
                                    ),
                                    (t -= 2))
                                  : (e.splice(
                                      l,
                                      2,
                                      new w.default(
                                        "textord",
                                        "--",
                                        "text",
                                        i,
                                        e[l + 1],
                                      ),
                                    ),
                                    (t -= 1))),
                                ("'" === a || "`" === a) &&
                                  e[l + 1].value === a &&
                                  (e.splice(
                                    l,
                                    2,
                                    new w.default(
                                      "textord",
                                      a + a,
                                      "text",
                                      i,
                                      e[l + 1],
                                    ),
                                  ),
                                  (t -= 1));
                            }
                          },
                        },
                        {
                          key: "parseSymbol",
                          value: function () {
                            var e = this.nextToken;
                            return d.default[e.text]
                              ? (this.consume(), new l(e.text, !0, e))
                              : g.default[this.mode][e.text]
                                ? (this.consume(),
                                  new l(
                                    new w.default(
                                      g.default[this.mode][e.text].group,
                                      e.text,
                                      this.mode,
                                      e,
                                    ),
                                    !1,
                                    e,
                                  ))
                                : "text" === this.mode &&
                                    x.cjkRegex.test(e.text)
                                  ? (this.consume(),
                                    new l(
                                      new w.default(
                                        "textord",
                                        e.text,
                                        this.mode,
                                        e,
                                      ),
                                      !1,
                                      e,
                                    ))
                                  : "$" === e.text
                                    ? new l(e.text, !1, e)
                                    : null;
                          },
                        },
                      ]),
                      e
                    );
                  })();
                (z.endOfExpression = [
                  "}",
                  "\\end",
                  "\\right",
                  "&",
                  "\\\\",
                  "\\cr",
                ]),
                  (z.SUPSUB_GREEDINESS = 1),
                  (z.sizeFuncs = [
                    "\\tiny",
                    "\\sixptsize",
                    "\\scriptsize",
                    "\\footnotesize",
                    "\\small",
                    "\\normalsize",
                    "\\large",
                    "\\Large",
                    "\\LARGE",
                    "\\huge",
                    "\\Huge",
                  ]),
                  (z.styleFuncs = [
                    "\\displaystyle",
                    "\\textstyle",
                    "\\scriptstyle",
                    "\\scriptscriptstyle",
                  ]),
                  (z.oldFontFuncs = {
                    "\\rm": "mathrm",
                    "\\sf": "mathsf",
                    "\\tt": "mathtt",
                    "\\bf": "mathbf",
                    "\\it": "mathit",
                  }),
                  (z.prototype.ParseNode = w.default),
                  (t.exports = z);
              },
              {
                "./MacroExpander": 27,
                "./ParseError": 29,
                "./ParseNode": 30,
                "./environments": 40,
                "./functions": 43,
                "./symbols": 48,
                "./unicodeRegexes": 49,
                "./units": 50,
                "./utils": 51,
                "babel-runtime/helpers/classCallCheck": 4,
                "babel-runtime/helpers/createClass": 5,
              },
            ],
            32: [
              function (e, t) {
                function a(e) {
                  return e && e.__esModule ? e : { default: e };
                }
                var i = e("babel-runtime/helpers/classCallCheck"),
                  l = a(i),
                  r = e("./utils"),
                  n = a(r);
                t.exports = function e(t) {
                  (0, l.default)(this, e),
                    (t = t || {}),
                    (this.displayMode = n.default.deflt(t.displayMode, !1)),
                    (this.throwOnError = n.default.deflt(t.throwOnError, !0)),
                    (this.errorColor = n.default.deflt(
                      t.errorColor,
                      "#cc0000",
                    )),
                    (this.macros = t.macros || {}),
                    (this.colorIsTextColor = n.default.deflt(
                      t.colorIsTextColor,
                      !1,
                    ));
                };
              },
              { "./utils": 51, "babel-runtime/helpers/classCallCheck": 4 },
            ],
            33: [
              function (e, t) {
                function a(e) {
                  return e && e.__esModule ? e : { default: e };
                }
                var i = e("babel-runtime/helpers/classCallCheck"),
                  l = a(i),
                  r = e("babel-runtime/helpers/createClass"),
                  n = a(r),
                  s = (function () {
                    function e(t, a, i) {
                      (0, l.default)(this, e),
                        (this.id = t),
                        (this.size = a),
                        (this.cramped = i);
                    }
                    return (
                      (0, n.default)(e, [
                        {
                          key: "sup",
                          value: function () {
                            return f[y[this.id]];
                          },
                        },
                        {
                          key: "sub",
                          value: function () {
                            return f[b[this.id]];
                          },
                        },
                        {
                          key: "fracNum",
                          value: function () {
                            return f[v[this.id]];
                          },
                        },
                        {
                          key: "fracDen",
                          value: function () {
                            return f[x[this.id]];
                          },
                        },
                        {
                          key: "cramp",
                          value: function () {
                            return f[k[this.id]];
                          },
                        },
                        {
                          key: "text",
                          value: function () {
                            return f[w[this.id]];
                          },
                        },
                        {
                          key: "isTight",
                          value: function () {
                            return 2 <= this.size;
                          },
                        },
                      ]),
                      e
                    );
                  })(),
                  o = 0,
                  d = 1,
                  u = 2,
                  p = 3,
                  c = 4,
                  m = 5,
                  h = 6,
                  g = 7,
                  f = [
                    new s(o, 0, !1),
                    new s(d, 0, !0),
                    new s(u, 1, !1),
                    new s(p, 1, !0),
                    new s(c, 2, !1),
                    new s(m, 2, !0),
                    new s(h, 3, !1),
                    new s(g, 3, !0),
                  ],
                  y = [c, m, c, m, h, g, h, g],
                  b = [m, m, m, m, g, g, g, g],
                  v = [u, p, c, m, h, g, h, g],
                  x = [p, p, m, m, g, g, g, g],
                  k = [d, d, p, p, m, m, g, g],
                  w = [o, d, u, p, u, p, u, p];
                t.exports = {
                  DISPLAY: f[o],
                  TEXT: f[u],
                  SCRIPT: f[c],
                  SCRIPTSCRIPT: f[h],
                };
              },
              {
                "babel-runtime/helpers/classCallCheck": 4,
                "babel-runtime/helpers/createClass": 5,
              },
            ],
            34: [
              function (a, i) {
                function l(e) {
                  return e && e.__esModule ? e : { default: e };
                }
                var r = a("./domTree"),
                  n = l(r),
                  s = a("./fontMetrics"),
                  o = l(s),
                  d = a("./symbols"),
                  u = l(d),
                  p = a("./utils"),
                  c = l(p),
                  m = ["\\imath", "\\jmath", "\\pounds"],
                  h = function (e, t, a) {
                    return (
                      u.default[a][e] &&
                        u.default[a][e].replace &&
                        (e = u.default[a][e].replace),
                      { value: e, metrics: o.default.getCharacterMetrics(e, t) }
                    );
                  },
                  g = function (e, t, a, i, l) {
                    var r = h(e, t, a),
                      s = r.metrics;
                    e = r.value;
                    var o;
                    if (s) {
                      var d = s.italic;
                      "text" === a && (d = 0),
                        (o = new n.default.symbolNode(
                          e,
                          s.height,
                          s.depth,
                          d,
                          s.skew,
                          l,
                        ));
                    } else
                      "undefined" != typeof console &&
                        console.warn(
                          "No character metrics for '" +
                            e +
                            "' in style '" +
                            t +
                            "'",
                        ),
                        (o = new n.default.symbolNode(e, 0, 0, 0, 0, l));
                    return (
                      i &&
                        ((o.maxFontSize = i.sizeMultiplier),
                        i.style.isTight() && o.classes.push("mtight"),
                        i.getColor() && (o.style.color = i.getColor())),
                      o
                    );
                  },
                  f = function (e, t, a, i, l) {
                    if ("mathord" === l) {
                      var r = y(e, t, a, i);
                      return g(e, r.fontName, t, a, i.concat([r.fontClass]));
                    }
                    if ("textord" === l) {
                      var n = u.default[t][e] && u.default[t][e].font;
                      return "ams" === n
                        ? g(e, "AMS-Regular", t, a, i.concat(["amsrm"]))
                        : g(e, "Main-Regular", t, a, i.concat(["mathrm"]));
                    }
                    throw new Error(
                      "unexpected type: " + l + " in mathDefault",
                    );
                  },
                  y = function (e) {
                    return /[0-9]/.test(e.charAt(0)) || c.default.contains(m, e)
                      ? { fontName: "Main-Italic", fontClass: "mainit" }
                      : { fontName: "Math-Italic", fontClass: "mathit" };
                  },
                  b = function (e) {
                    var t = 0,
                      a = 0,
                      l = 0;
                    if (e.children)
                      for (var r = 0; r < e.children.length; r++)
                        e.children[r].height > t && (t = e.children[r].height),
                          e.children[r].depth > a && (a = e.children[r].depth),
                          e.children[r].maxFontSize > l &&
                            (l = e.children[r].maxFontSize);
                    (e.height = t), (e.depth = a), (e.maxFontSize = l);
                  },
                  v = function (e, t, a) {
                    var i = new n.default.span(e, t, a);
                    return b(i), i;
                  },
                  x = {
                    mathbf: { variant: "bold", fontName: "Main-Bold" },
                    mathrm: { variant: "normal", fontName: "Main-Regular" },
                    textit: { variant: "italic", fontName: "Main-Italic" },
                    mathbb: {
                      variant: "double-struck",
                      fontName: "AMS-Regular",
                    },
                    mathcal: {
                      variant: "script",
                      fontName: "Caligraphic-Regular",
                    },
                    mathfrak: {
                      variant: "fraktur",
                      fontName: "Fraktur-Regular",
                    },
                    mathscr: { variant: "script", fontName: "Script-Regular" },
                    mathsf: {
                      variant: "sans-serif",
                      fontName: "SansSerif-Regular",
                    },
                    mathtt: {
                      variant: "monospace",
                      fontName: "Typewriter-Regular",
                    },
                  };
                i.exports = {
                  fontMap: x,
                  makeSymbol: g,
                  mathsym: function (e, t, a, i) {
                    return "\\" === e || "main" === u.default[t][e].font
                      ? g(e, "Main-Regular", t, a, i)
                      : g(e, "AMS-Regular", t, a, i.concat(["amsrm"]));
                  },
                  makeSpan: v,
                  makeFragment: function (e) {
                    var t = new n.default.documentFragment(e);
                    return b(t), t;
                  },
                  makeVList: function (a, l, r) {
                    var s, o, d;
                    if ("individualShift" === l) {
                      var i = a;
                      for (
                        a = [i[0]],
                          s = -i[0].shift - i[0].elem.depth,
                          o = s,
                          d = 1;
                        d < i.length;
                        d++
                      ) {
                        var u = -i[d].shift - o - i[d].elem.depth,
                          p = u - (i[d - 1].elem.height + i[d - 1].elem.depth);
                        (o += u),
                          a.push({ type: "kern", size: p }),
                          a.push(i[d]);
                      }
                    } else if ("top" === l) {
                      var c = r;
                      for (d = 0; d < a.length; d++)
                        c -=
                          "kern" === a[d].type
                            ? a[d].size
                            : a[d].elem.height + a[d].elem.depth;
                      s = c;
                    } else
                      s =
                        "bottom" === l
                          ? -r
                          : "shift" === l
                            ? -a[0].elem.depth - r
                            : "firstBaseline" === l
                              ? -a[0].elem.depth
                              : 0;
                    var m = 0;
                    for (d = 0; d < a.length; d++)
                      if ("elem" === a[d].type) {
                        var h = a[d].elem;
                        m = t(m, h.maxFontSize, h.height);
                      }
                    m += 2;
                    var g = v(["pstrut"], []);
                    g.style.height = m + "em";
                    var f = [],
                      y = s,
                      b = s;
                    for (o = s, d = 0; d < a.length; d++) {
                      if ("kern" === a[d].type) o += a[d].size;
                      else {
                        var x = a[d].elem,
                          k = v([], [g, x]);
                        (k.style.top = -m - o - x.depth + "em"),
                          a[d].marginLeft &&
                            (k.style.marginLeft = a[d].marginLeft),
                          a[d].marginRight &&
                            (k.style.marginRight = a[d].marginRight),
                          f.push(k),
                          (o += x.height + x.depth);
                      }
                      (y = e(y, o)), (b = t(b, o));
                    }
                    var w = v(["vlist"], f);
                    w.style.height = b + "em";
                    var M;
                    if (0 > y) {
                      var S = v(["vlist"], []);
                      S.style.height = -y + "em";
                      var z = v(
                        ["vlist-s"],
                        [new n.default.symbolNode("\u200B")],
                      );
                      M = [v(["vlist-r"], [w, z]), v(["vlist-r"], [S])];
                    } else M = [v(["vlist-r"], [w])];
                    var A = v(["vlist-t"], M);
                    return (
                      2 === M.length && A.classes.push("vlist-t2"),
                      (A.height = b),
                      (A.depth = -y),
                      A
                    );
                  },
                  makeOrd: function (e, t, a) {
                    var i = e.mode,
                      l = e.value,
                      r = ["mord"],
                      n = t.font;
                    if (n) {
                      var s;
                      return (
                        (s =
                          "mathit" === n || c.default.contains(m, l)
                            ? y(l, i, t, r)
                            : x[n]),
                        h(l, s.fontName, i).metrics
                          ? g(l, s.fontName, i, t, r.concat([s.fontClass || n]))
                          : f(l, i, t, r, a)
                      );
                    }
                    return f(l, i, t, r, a);
                  },
                  prependChildren: function (e, t) {
                    (e.children = t.concat(e.children)), b(e);
                  },
                  spacingFunctions: {
                    "\\qquad": { size: "2em", className: "qquad" },
                    "\\quad": { size: "1em", className: "quad" },
                    "\\enspace": { size: "0.5em", className: "enspace" },
                    "\\;": { size: "0.277778em", className: "thickspace" },
                    "\\:": { size: "0.22222em", className: "mediumspace" },
                    "\\,": { size: "0.16667em", className: "thinspace" },
                    "\\!": {
                      size: "-0.16667em",
                      className: "negativethinspace",
                    },
                  },
                };
              },
              {
                "./domTree": 39,
                "./fontMetrics": 41,
                "./symbols": 48,
                "./utils": 51,
              },
            ],
            35: [
              function (a, i) {
                function l(e) {
                  return e && e.__esModule ? e : { default: e };
                }
                function r(e, t, a) {
                  for (
                    var l = N(e, t, !1),
                      r = t.sizeMultiplier / a.sizeMultiplier,
                      n = 0,
                      i;
                    n < l.length;
                    n++
                  )
                    (i = k.default.indexOf(l[n].classes, "sizing")),
                      0 > i
                        ? Array.prototype.push.apply(
                            l[n].classes,
                            t.sizingClasses(a),
                          )
                        : l[n].classes[i + 1] === "reset-size" + t.size &&
                          (l[n].classes[i + 1] = "reset-size" + a.size),
                      (l[n].height *= r),
                      (l[n].depth *= r);
                  return h.default.makeFragment(l);
                }
                var n = a("babel-runtime/core-js/json/stringify"),
                  s = l(n),
                  o = a("./ParseError"),
                  d = l(o),
                  u = a("./Style"),
                  p = l(u),
                  m = a("./buildCommon"),
                  h = l(m),
                  c = a("./delimiter"),
                  g = l(c),
                  f = a("./domTree"),
                  y = l(f),
                  b = a("./units"),
                  v = l(b),
                  x = a("./utils"),
                  k = l(x),
                  w = a("./stretchy"),
                  M = l(w),
                  S = function (e) {
                    return (
                      e instanceof y.default.span && "mspace" === e.classes[0]
                    );
                  },
                  z = function (e) {
                    return e && "mbin" === e.classes[0];
                  },
                  A = function (e, t) {
                    return e
                      ? k.default.contains(
                          ["mbin", "mopen", "mrel", "mop", "mpunct"],
                          e.classes[0],
                        )
                      : t;
                  },
                  T = function (e, t) {
                    return e
                      ? k.default.contains(
                          ["mrel", "mclose", "mpunct"],
                          e.classes[0],
                        )
                      : t;
                  },
                  C = function (e, t) {
                    for (var a = t; a < e.length && S(e[a]); ) a++;
                    return a === t ? null : e.splice(t, a - t);
                  },
                  N = function (e, t, a) {
                    for (var l = [], r = 0; r < e.length; r++) {
                      var i = e[r],
                        n = B(i, t);
                      n instanceof y.default.documentFragment
                        ? Array.prototype.push.apply(l, n.children)
                        : l.push(n);
                    }
                    for (var s = 0, o; s < l.length; s++)
                      if (((o = C(l, s)), o))
                        if (s < l.length)
                          l[s] instanceof y.default.symbolNode &&
                            (l[s] = (0, m.makeSpan)([].concat(l[s].classes), [
                              l[s],
                            ])),
                            h.default.prependChildren(l[s], o);
                        else {
                          Array.prototype.push.apply(l, o);
                          break;
                        }
                    for (var d = 0; d < l.length; d++)
                      z(l[d]) &&
                        (A(l[d - 1], a) || T(l[d + 1], a)) &&
                        (l[d].classes[0] = "mord");
                    for (var u = 0; u < l.length; u++)
                      if ("\u0338" === l[u].value && u + 1 < l.length) {
                        var p = l.slice(u, u + 2);
                        (p[0].classes = ["mainrm"]),
                          (p[0].style.position = "absolute"),
                          (p[0].style.right = "0");
                        var c = l[u + 1].classes,
                          g = (0, m.makeSpan)(c, p);
                        -1 !== c.indexOf("mord") &&
                          (g.style.paddingLeft = "0.277771em"),
                          (g.style.position = "relative"),
                          l.splice(u, 2, g);
                      }
                    return l;
                  },
                  R = function e(t) {
                    if (t instanceof y.default.documentFragment) {
                      if (t.children.length)
                        return e(t.children[t.children.length - 1]);
                    } else if (
                      k.default.contains(
                        [
                          "mord",
                          "mop",
                          "mbin",
                          "mrel",
                          "mopen",
                          "mclose",
                          "mpunct",
                          "minner",
                        ],
                        t.classes[0],
                      )
                    )
                      return t.classes[0];
                    return null;
                  },
                  L = function (e, t) {
                    if (!e.value.base) return !1;
                    var a = e.value.base;
                    if ("op" === a.type)
                      return (
                        a.value.limits &&
                        (t.style.size === p.default.DISPLAY.size ||
                          a.value.alwaysHandleSupSub)
                      );
                    if ("accent" === a.type) return q(a.value.base);
                    if ("horizBrace" === a.type) {
                      var i = !e.value.sub;
                      return i === a.value.isOver;
                    }
                    return null;
                  },
                  E = function e(t) {
                    return (
                      !!t &&
                      ("ordgroup" === t.type
                        ? 1 === t.value.length
                          ? e(t.value[0])
                          : t
                        : "color" === t.type
                          ? 1 === t.value.value.length
                            ? e(t.value.value[0])
                            : t
                          : "font" === t.type
                            ? e(t.value.body)
                            : t)
                    );
                  },
                  q = function (e) {
                    var t = E(e);
                    return (
                      "mathord" === t.type ||
                      "textord" === t.type ||
                      "bin" === t.type ||
                      "rel" === t.type ||
                      "inner" === t.type ||
                      "open" === t.type ||
                      "close" === t.type ||
                      "punct" === t.type
                    );
                  },
                  O = function (e, t) {
                    var a = ["nulldelimiter"].concat(e.baseSizingClasses());
                    return (0, m.makeSpan)(t.concat(a));
                  },
                  _ = {};
                (_.mathord = function (e, t) {
                  return h.default.makeOrd(e, t, "mathord");
                }),
                  (_.textord = function (e, t) {
                    return h.default.makeOrd(e, t, "textord");
                  }),
                  (_.bin = function (e, t) {
                    return h.default.mathsym(e.value, e.mode, t, ["mbin"]);
                  }),
                  (_.rel = function (e, t) {
                    return h.default.mathsym(e.value, e.mode, t, ["mrel"]);
                  }),
                  (_.open = function (e, t) {
                    return h.default.mathsym(e.value, e.mode, t, ["mopen"]);
                  }),
                  (_.close = function (e, t) {
                    return h.default.mathsym(e.value, e.mode, t, ["mclose"]);
                  }),
                  (_.inner = function (e, t) {
                    return h.default.mathsym(e.value, e.mode, t, ["minner"]);
                  }),
                  (_.punct = function (e, t) {
                    return h.default.mathsym(e.value, e.mode, t, ["mpunct"]);
                  }),
                  (_.ordgroup = function (e, t) {
                    return (0, m.makeSpan)(["mord"], N(e.value, t, !0), t);
                  }),
                  (_.text = function (e, t) {
                    for (
                      var a = t.withFont(e.value.style),
                        l = N(e.value.body, a, !0),
                        r = 0;
                      r < l.length - 1;
                      r++
                    )
                      l[r].tryCombine(l[r + 1]) && (l.splice(r + 1, 1), r--);
                    return (0, m.makeSpan)(["mord", "text"], l, a);
                  }),
                  (_.color = function (e, t) {
                    var a = N(e.value.value, t.withColor(e.value.color), !1);
                    return new h.default.makeFragment(a);
                  }),
                  (_.supsub = function (e, a) {
                    if (L(e, a)) return _[e.value.base.type](e, a);
                    var i = B(e.value.base, a),
                      l = a.fontMetrics(),
                      r = 0,
                      n = 0,
                      s,
                      o,
                      d;
                    e.value.sup &&
                      ((d = a.havingStyle(a.style.sup())),
                      (s = B(e.value.sup, d, a)),
                      !q(e.value.base) &&
                        (r =
                          i.height -
                          (d.fontMetrics().supDrop * d.sizeMultiplier) /
                            a.sizeMultiplier)),
                      e.value.sub &&
                        ((d = a.havingStyle(a.style.sub())),
                        (o = B(e.value.sub, d, a)),
                        !q(e.value.base) &&
                          (n =
                            i.depth +
                            (d.fontMetrics().subDrop * d.sizeMultiplier) /
                              a.sizeMultiplier));
                    var u =
                      a.style === p.default.DISPLAY
                        ? l.sup1
                        : a.style.cramped
                          ? l.sup3
                          : l.sup2;
                    var c = a.sizeMultiplier,
                      g = 0.5 / l.ptPerEm / c + "em",
                      f;
                    if (!e.value.sup) {
                      n = t(n, l.sub1, o.height - 0.8 * l.xHeight);
                      var b = [{ type: "elem", elem: o, marginRight: g }];
                      i instanceof y.default.symbolNode &&
                        (b[0].marginLeft = -i.italic + "em"),
                        (f = h.default.makeVList(b, "shift", n, a));
                    } else if (!e.value.sub)
                      (r = t(r, u, s.depth + 0.25 * l.xHeight)),
                        (f = h.default.makeVList(
                          [{ type: "elem", elem: s, marginRight: g }],
                          "shift",
                          -r,
                          a,
                        ));
                    else {
                      (r = t(r, u, s.depth + 0.25 * l.xHeight)),
                        (n = t(n, l.sub2));
                      var v = l.defaultRuleThickness;
                      if (r - s.depth - (o.height - n) < 4 * v) {
                        n = 4 * v - (r - s.depth) + o.height;
                        var x = 0.8 * l.xHeight - (r - s.depth);
                        0 < x && ((r += x), (n -= x));
                      }
                      var k = [
                        { type: "elem", elem: o, shift: n, marginRight: g },
                        { type: "elem", elem: s, shift: -r, marginRight: g },
                      ];
                      i instanceof y.default.symbolNode &&
                        (k[0].marginLeft = -i.italic + "em"),
                        (f = h.default.makeVList(
                          k,
                          "individualShift",
                          null,
                          a,
                        ));
                    }
                    var w = R(i) || "mord";
                    return (0, m.makeSpan)(
                      [w],
                      [i, (0, m.makeSpan)(["msupsub"], [f])],
                      a,
                    );
                  }),
                  (_.genfrac = function (e, t) {
                    var a = t.style;
                    "display" === e.value.size
                      ? (a = p.default.DISPLAY)
                      : "text" === e.value.size && (a = p.default.TEXT);
                    var i = a.fracNum(),
                      l = a.fracDen(),
                      r;
                    r = t.havingStyle(i);
                    var n = B(e.value.numer, r, t);
                    r = t.havingStyle(l);
                    var s = B(e.value.denom, r, t),
                      o,
                      d,
                      u;
                    e.value.hasBarLine
                      ? ((o = D("frac-line", t)),
                        (d = o.height),
                        (u = o.height))
                      : ((o = null),
                        (d = 0),
                        (u = t.fontMetrics().defaultRuleThickness));
                    var c, f, y;
                    a.size === p.default.DISPLAY.size
                      ? ((c = t.fontMetrics().num1),
                        (f = 0 < d ? 3 * u : 7 * u),
                        (y = t.fontMetrics().denom1))
                      : (0 < d
                          ? ((c = t.fontMetrics().num2), (f = u))
                          : ((c = t.fontMetrics().num3), (f = 3 * u)),
                        (y = t.fontMetrics().denom2));
                    var b;
                    if (0 === d) {
                      var v = c - n.depth - (s.height - y);
                      v < f && ((c += 0.5 * (f - v)), (y += 0.5 * (f - v))),
                        (b = h.default.makeVList(
                          [
                            { type: "elem", elem: s, shift: y },
                            { type: "elem", elem: n, shift: -c },
                          ],
                          "individualShift",
                          null,
                          t,
                        ));
                    } else {
                      var x = t.fontMetrics().axisHeight;
                      c - n.depth - (x + 0.5 * d) < f &&
                        (c += f - (c - n.depth - (x + 0.5 * d))),
                        x - 0.5 * d - (s.height - y) < f &&
                          (y += f - (x - 0.5 * d - (s.height - y)));
                      var k = -(x - 0.5 * d);
                      b = h.default.makeVList(
                        [
                          { type: "elem", elem: s, shift: y },
                          { type: "elem", elem: o, shift: k },
                          { type: "elem", elem: n, shift: -c },
                        ],
                        "individualShift",
                        null,
                        t,
                      );
                    }
                    (r = t.havingStyle(a)),
                      (b.height *= r.sizeMultiplier / t.sizeMultiplier),
                      (b.depth *= r.sizeMultiplier / t.sizeMultiplier);
                    var w =
                      a.size === p.default.DISPLAY.size
                        ? t.fontMetrics().delim1
                        : t.fontMetrics().delim2;
                    var M, S;
                    return (
                      (M =
                        null == e.value.leftDelim
                          ? O(t, ["mopen"])
                          : g.default.customSizedDelim(
                              e.value.leftDelim,
                              w,
                              !0,
                              t.havingStyle(a),
                              e.mode,
                              ["mopen"],
                            )),
                      (S =
                        null == e.value.rightDelim
                          ? O(t, ["mclose"])
                          : g.default.customSizedDelim(
                              e.value.rightDelim,
                              w,
                              !0,
                              t.havingStyle(a),
                              e.mode,
                              ["mclose"],
                            )),
                      (0, m.makeSpan)(
                        ["mord"].concat(r.sizingClasses(t)),
                        [M, (0, m.makeSpan)(["mfrac"], [b]), S],
                        t,
                      )
                    );
                  }),
                  (_.array = function (e, t) {
                    var a = e.value.body.length,
                      i = 0,
                      l = Array(a),
                      n = 1 / t.fontMetrics().ptPerEm,
                      s = 5 * n,
                      o = k.default.deflt(e.value.arraystretch, 1),
                      u = o * (12 * n),
                      p = 0.3 * u,
                      g = 0,
                      f,
                      r;
                    for (f = 0; f < e.value.body.length; ++f) {
                      var c = e.value.body[f],
                        y = 0.7 * u,
                        b = p;
                      i < c.length && (i = c.length);
                      var x = Array(c.length);
                      for (r = 0; r < c.length; ++r) {
                        var w = B(c[r], t);
                        b < w.depth && (b = w.depth),
                          y < w.height && (y = w.height),
                          (x[r] = w);
                      }
                      var M = 0;
                      e.value.rowGaps[f] &&
                        ((M = v.default.calculateSize(
                          e.value.rowGaps[f].value,
                          t,
                        )),
                        0 < M && ((M += p), b < M && (b = M), (M = 0))),
                        e.value.addJot && (b += 3 * n),
                        (x.height = y),
                        (x.depth = b),
                        (g += y),
                        (x.pos = g),
                        (g += b + M),
                        (l[f] = x);
                    }
                    var S = g / 2 + t.fontMetrics().axisHeight,
                      z = e.value.cols || [],
                      A = [],
                      T,
                      C;
                    for (r = 0, C = 0; r < i || C < z.length; ++r, ++C) {
                      for (
                        var N = z[C] || {}, R = !0;
                        "separator" === N.type;

                      ) {
                        if (
                          (R ||
                            ((T = (0, m.makeSpan)(["arraycolsep"], [])),
                            (T.style.width =
                              t.fontMetrics().doubleRuleSep + "em"),
                            A.push(T)),
                          "|" === N.separator)
                        ) {
                          var L = (0, m.makeSpan)(["vertical-separator"], []);
                          (L.style.height = g + "em"),
                            (L.style.verticalAlign = -(g - S) + "em"),
                            A.push(L);
                        } else
                          throw new d.default(
                            "Invalid separator type: " + N.separator,
                          );
                        C++, (N = z[C] || {}), (R = !1);
                      }
                      if (!(r >= i)) {
                        var E = void 0;
                        (0 < r || e.value.hskipBeforeAndAfter) &&
                          ((E = k.default.deflt(N.pregap, s)),
                          0 !== E &&
                            ((T = (0, m.makeSpan)(["arraycolsep"], [])),
                            (T.style.width = E + "em"),
                            A.push(T)));
                        var q = [];
                        for (f = 0; f < a; ++f) {
                          var O = l[f],
                            _ = O[r];
                          if (_) {
                            var D = O.pos - S;
                            (_.depth = O.depth),
                              (_.height = O.height),
                              q.push({ type: "elem", elem: _, shift: D });
                          }
                        }
                        (q = h.default.makeVList(
                          q,
                          "individualShift",
                          null,
                          t,
                        )),
                          (q = (0, m.makeSpan)(
                            ["col-align-" + (N.align || "c")],
                            [q],
                          )),
                          A.push(q),
                          (r < i - 1 || e.value.hskipBeforeAndAfter) &&
                            ((E = k.default.deflt(N.postgap, s)),
                            0 !== E &&
                              ((T = (0, m.makeSpan)(["arraycolsep"], [])),
                              (T.style.width = E + "em"),
                              A.push(T)));
                      }
                    }
                    return (
                      (l = (0, m.makeSpan)(["mtable"], A)),
                      (0, m.makeSpan)(["mord"], [l], t)
                    );
                  }),
                  (_.spacing = function (e, t) {
                    return "\\ " === e.value ||
                      "\\space" === e.value ||
                      " " === e.value ||
                      "~" === e.value
                      ? "text" === e.mode
                        ? h.default.makeOrd(e, t, "textord")
                        : (0, m.makeSpan)(
                            ["mspace"],
                            [h.default.mathsym(e.value, e.mode, t)],
                            t,
                          )
                      : (0, m.makeSpan)(
                          [
                            "mspace",
                            h.default.spacingFunctions[e.value].className,
                          ],
                          [],
                          t,
                        );
                  }),
                  (_.llap = function (e, t) {
                    var a = (0, m.makeSpan)(["inner"], [B(e.value.body, t)]),
                      i = (0, m.makeSpan)(["fix"], []);
                    return (0, m.makeSpan)(["mord", "llap"], [a, i], t);
                  }),
                  (_.rlap = function (e, t) {
                    var a = (0, m.makeSpan)(["inner"], [B(e.value.body, t)]),
                      i = (0, m.makeSpan)(["fix"], []);
                    return (0, m.makeSpan)(["mord", "rlap"], [a, i], t);
                  }),
                  (_.op = function (e, a) {
                    var l = !1,
                      r,
                      n;
                    "supsub" === e.type &&
                      ((r = e.value.sup),
                      (n = e.value.sub),
                      (e = e.value.base),
                      (l = !0));
                    var s = a.style,
                      o = !1;
                    s.size === p.default.DISPLAY.size &&
                      e.value.symbol &&
                      !k.default.contains(["\\smallint"], e.value.body) &&
                      (o = !0);
                    var d;
                    if (e.value.symbol) {
                      var u = o ? "Size2-Regular" : "Size1-Regular";
                      d = h.default.makeSymbol(e.value.body, u, "math", a, [
                        "mop",
                        "op-symbol",
                        o ? "large-op" : "small-op",
                      ]);
                    } else if (e.value.value) {
                      var c = N(e.value.value, a, !0);
                      1 === c.length && c[0] instanceof y.default.symbolNode
                        ? ((d = c[0]), (d.classes[0] = "mop"))
                        : (d = (0, m.makeSpan)(["mop"], c, a));
                    } else {
                      for (var g = [], f = 1; f < e.value.body.length; f++)
                        g.push(h.default.mathsym(e.value.body[f], e.mode));
                      d = (0, m.makeSpan)(["mop"], g, a);
                    }
                    var i = 0,
                      b = 0;
                    if (
                      (d instanceof y.default.symbolNode &&
                        ((i =
                          (d.height - d.depth) / 2 -
                          a.fontMetrics().axisHeight),
                        (b = d.italic)),
                      l)
                    ) {
                      d = (0, m.makeSpan)([], [d]);
                      var v, x, w, M, S;
                      r &&
                        ((S = a.havingStyle(s.sup())),
                        (v = B(r, S, a)),
                        (x = t(
                          a.fontMetrics().bigOpSpacing1,
                          a.fontMetrics().bigOpSpacing3 - v.depth,
                        ))),
                        n &&
                          ((S = a.havingStyle(s.sub())),
                          (w = B(n, S, a)),
                          (M = t(
                            a.fontMetrics().bigOpSpacing2,
                            a.fontMetrics().bigOpSpacing4 - w.height,
                          )));
                      var z, A, T;
                      if (!r)
                        (A = d.height - i),
                          (z = h.default.makeVList(
                            [
                              {
                                type: "kern",
                                size: a.fontMetrics().bigOpSpacing5,
                              },
                              { type: "elem", elem: w, marginLeft: -b + "em" },
                              { type: "kern", size: M },
                              { type: "elem", elem: d },
                            ],
                            "top",
                            A,
                            a,
                          ));
                      else if (!n)
                        (T = d.depth + i),
                          (z = h.default.makeVList(
                            [
                              { type: "elem", elem: d },
                              { type: "kern", size: x },
                              { type: "elem", elem: v, marginLeft: b + "em" },
                              {
                                type: "kern",
                                size: a.fontMetrics().bigOpSpacing5,
                              },
                            ],
                            "bottom",
                            T,
                            a,
                          ));
                      else {
                        if (!r && !n) return d;
                        (T =
                          a.fontMetrics().bigOpSpacing5 +
                          w.height +
                          w.depth +
                          M +
                          d.depth +
                          i),
                          (z = h.default.makeVList(
                            [
                              {
                                type: "kern",
                                size: a.fontMetrics().bigOpSpacing5,
                              },
                              { type: "elem", elem: w, marginLeft: -b + "em" },
                              { type: "kern", size: M },
                              { type: "elem", elem: d },
                              { type: "kern", size: x },
                              { type: "elem", elem: v, marginLeft: b + "em" },
                              {
                                type: "kern",
                                size: a.fontMetrics().bigOpSpacing5,
                              },
                            ],
                            "bottom",
                            T,
                            a,
                          ));
                      }
                      return (0, m.makeSpan)(["mop", "op-limits"], [z], a);
                    }
                    return (
                      i &&
                        ((d.style.position = "relative"),
                        (d.style.top = i + "em")),
                      d
                    );
                  }),
                  (_.mod = function (e, t) {
                    var a = [];
                    if (
                      ("bmod" === e.value.modType
                        ? (!t.style.isTight() &&
                            a.push(
                              (0, m.makeSpan)(
                                ["mspace", "negativemediumspace"],
                                [],
                                t,
                              ),
                            ),
                          a.push(
                            (0, m.makeSpan)(["mspace", "thickspace"], [], t),
                          ))
                        : t.style.size === p.default.DISPLAY.size
                          ? a.push((0, m.makeSpan)(["mspace", "quad"], [], t))
                          : "mod" === e.value.modType
                            ? a.push(
                                (0, m.makeSpan)(
                                  ["mspace", "twelvemuspace"],
                                  [],
                                  t,
                                ),
                              )
                            : a.push(
                                (0, m.makeSpan)(
                                  ["mspace", "eightmuspace"],
                                  [],
                                  t,
                                ),
                              ),
                      ("pod" === e.value.modType ||
                        "pmod" === e.value.modType) &&
                        a.push(h.default.mathsym("(", e.mode)),
                      "pod" !== e.value.modType)
                    ) {
                      var i = [
                        h.default.mathsym("m", e.mode),
                        h.default.mathsym("o", e.mode),
                        h.default.mathsym("d", e.mode),
                      ];
                      "bmod" === e.value.modType
                        ? (a.push((0, m.makeSpan)(["mbin"], i, t)),
                          a.push(
                            (0, m.makeSpan)(["mspace", "thickspace"], [], t),
                          ),
                          !t.style.isTight() &&
                            a.push(
                              (0, m.makeSpan)(
                                ["mspace", "negativemediumspace"],
                                [],
                                t,
                              ),
                            ))
                        : (Array.prototype.push.apply(a, i),
                          a.push(
                            (0, m.makeSpan)(["mspace", "sixmuspace"], [], t),
                          ));
                    }
                    return (
                      e.value.value &&
                        Array.prototype.push.apply(a, N(e.value.value, t, !1)),
                      ("pod" === e.value.modType ||
                        "pmod" === e.value.modType) &&
                        a.push(h.default.mathsym(")", e.mode)),
                      h.default.makeFragment(a)
                    );
                  }),
                  (_.katex = function (i, l) {
                    var r = (0, m.makeSpan)(
                        ["k"],
                        [h.default.mathsym("K", i.mode)],
                        l,
                      ),
                      n = (0, m.makeSpan)(
                        ["a"],
                        [h.default.mathsym("A", i.mode)],
                        l,
                      );
                    (n.height = 0.75 * (n.height + 0.2)),
                      (n.depth = 0.75 * (n.height - 0.2));
                    var a = (0, m.makeSpan)(
                        ["t"],
                        [h.default.mathsym("T", i.mode)],
                        l,
                      ),
                      t = (0, m.makeSpan)(
                        ["e"],
                        [h.default.mathsym("E", i.mode)],
                        l,
                      );
                    (t.height -= 0.2155), (t.depth += 0.2155);
                    var e = (0, m.makeSpan)(
                      ["x"],
                      [h.default.mathsym("X", i.mode)],
                      l,
                    );
                    return (0, m.makeSpan)(
                      ["mord", "katex-logo"],
                      [r, n, a, t, e],
                      l,
                    );
                  });
                var D = function (e, t, a) {
                  var i = (0, m.makeSpan)([e], [], t);
                  return (
                    (i.height = a || t.fontMetrics().defaultRuleThickness),
                    (i.style.borderBottomWidth = i.height + "em"),
                    (i.maxFontSize = 1),
                    i
                  );
                };
                (_.overline = function (e, t) {
                  var a = B(e.value.body, t.havingCrampedStyle()),
                    i = D("overline-line", t),
                    l = h.default.makeVList(
                      [
                        { type: "elem", elem: a },
                        { type: "kern", size: 3 * i.height },
                        { type: "elem", elem: i },
                        { type: "kern", size: i.height },
                      ],
                      "firstBaseline",
                      null,
                      t,
                    );
                  return (0, m.makeSpan)(["mord", "overline"], [l], t);
                }),
                  (_.underline = function (e, t) {
                    var a = B(e.value.body, t),
                      i = D("underline-line", t),
                      l = h.default.makeVList(
                        [
                          { type: "kern", size: i.height },
                          { type: "elem", elem: i },
                          { type: "kern", size: 3 * i.height },
                          { type: "elem", elem: a },
                        ],
                        "top",
                        a.height,
                        t,
                      );
                    return (0, m.makeSpan)(["mord", "underline"], [l], t);
                  }),
                  (_.sqrt = function (e, t) {
                    var a = B(e.value.body, t.havingCrampedStyle());
                    a instanceof y.default.documentFragment &&
                      (a = (0, m.makeSpan)([], [a], t));
                    var i = t.fontMetrics(),
                      l = i.defaultRuleThickness,
                      r = l;
                    t.style.id < p.default.TEXT.id &&
                      (r = t.fontMetrics().xHeight);
                    var n = l + r / 4,
                      s = (a.height + a.depth + n + l) * t.sizeMultiplier,
                      o = g.default.customSizedDelim(
                        "\\surd",
                        s,
                        !1,
                        t,
                        e.mode,
                      ),
                      d = t.fontMetrics().sqrtRuleThickness * o.sizeMultiplier,
                      u = o.height - d;
                    u > a.height + a.depth + n &&
                      (n = (n + u - a.height - a.depth) / 2);
                    var c = o.height - a.height - n - d,
                      f;
                    if (
                      (0 === a.height && 0 === a.depth
                        ? (f = (0, m.makeSpan)())
                        : ((a.style.paddingLeft = o.surdWidth + "em"),
                          (f = h.default.makeVList(
                            [
                              { type: "elem", elem: a },
                              { type: "kern", size: -(a.height + c) },
                              { type: "elem", elem: o },
                              { type: "kern", size: d },
                            ],
                            "firstBaseline",
                            null,
                            t,
                          )),
                          f.children[0].children[0].classes.push("svg-align")),
                      !e.value.index)
                    )
                      return (0, m.makeSpan)(["mord", "sqrt"], [f], t);
                    var b = t.havingStyle(p.default.SCRIPTSCRIPT),
                      v = B(e.value.index, b, t),
                      x = 0.6 * (f.height - f.depth),
                      k = h.default.makeVList(
                        [{ type: "elem", elem: v }],
                        "shift",
                        -x,
                        t,
                      ),
                      w = (0, m.makeSpan)(["root"], [k]);
                    return (0, m.makeSpan)(["mord", "sqrt"], [w, f], t);
                  }),
                  (_.sizing = function (e, t) {
                    var a = t.havingSize(e.value.size);
                    return r(e.value.value, a, t);
                  }),
                  (_.styling = function (e, t) {
                    var a = {
                        display: p.default.DISPLAY,
                        text: p.default.TEXT,
                        script: p.default.SCRIPT,
                        scriptscript: p.default.SCRIPTSCRIPT,
                      },
                      i = a[e.value.style],
                      l = t.havingStyle(i);
                    return r(e.value.value, l, t);
                  }),
                  (_.font = function (e, t) {
                    var a = e.value.font;
                    return B(e.value.body, t.withFont(a));
                  }),
                  (_.delimsizing = function (e, t) {
                    var a = e.value.value;
                    return "." === a
                      ? (0, m.makeSpan)([e.value.mclass])
                      : g.default.sizedDelim(a, e.value.size, t, e.mode, [
                          e.value.mclass,
                        ]);
                  }),
                  (_.leftright = function (e, a) {
                    for (
                      var l = N(e.value.body, a, !0),
                        r = 0,
                        n = 0,
                        s = !1,
                        o = 0;
                      o < l.length;
                      o++
                    )
                      l[o].isMiddle
                        ? (s = !0)
                        : ((r = t(l[o].height, r)), (n = t(l[o].depth, n)));
                    (r *= a.sizeMultiplier), (n *= a.sizeMultiplier);
                    var i;
                    if (
                      ((i =
                        "." === e.value.left
                          ? O(a, ["mopen"])
                          : g.default.leftRightDelim(
                              e.value.left,
                              r,
                              n,
                              a,
                              e.mode,
                              ["mopen"],
                            )),
                      l.unshift(i),
                      s)
                    )
                      for (var d = 1, u; d < l.length; d++)
                        if (((u = l[d]), u.isMiddle)) {
                          l[d] = g.default.leftRightDelim(
                            u.isMiddle.value,
                            r,
                            n,
                            u.isMiddle.options,
                            e.mode,
                            [],
                          );
                          var p = C(u.children, 0);
                          p && h.default.prependChildren(l[d], p);
                        }
                    var c;
                    return (
                      (c =
                        "." === e.value.right
                          ? O(a, ["mclose"])
                          : g.default.leftRightDelim(
                              e.value.right,
                              r,
                              n,
                              a,
                              e.mode,
                              ["mclose"],
                            )),
                      l.push(c),
                      (0, m.makeSpan)(["minner"], l, a)
                    );
                  }),
                  (_.middle = function (e, t) {
                    var a;
                    return (
                      "." === e.value.value
                        ? (a = O(t, []))
                        : ((a = g.default.sizedDelim(
                            e.value.value,
                            1,
                            t,
                            e.mode,
                            [],
                          )),
                          (a.isMiddle = { value: e.value.value, options: t })),
                      a
                    );
                  }),
                  (_.rule = function (e, t) {
                    var a = (0, m.makeSpan)(["mord", "rule"], [], t),
                      i = 0;
                    e.value.shift &&
                      (i = v.default.calculateSize(e.value.shift, t));
                    var l = v.default.calculateSize(e.value.width, t),
                      r = v.default.calculateSize(e.value.height, t);
                    return (
                      (a.style.borderRightWidth = l + "em"),
                      (a.style.borderTopWidth = r + "em"),
                      (a.style.bottom = i + "em"),
                      (a.width = l),
                      (a.height = r + i),
                      (a.depth = -i),
                      (a.maxFontSize = 1.125 * r * t.sizeMultiplier),
                      a
                    );
                  }),
                  (_.kern = function (e, t) {
                    var a = (0, m.makeSpan)(["mord", "rule"], [], t);
                    if (e.value.dimension) {
                      var i = v.default.calculateSize(e.value.dimension, t);
                      a.style.marginLeft = i + "em";
                    }
                    return a;
                  }),
                  (_.accent = function (a, i) {
                    var l = a.value.base,
                      r;
                    if ("supsub" === a.type) {
                      var n = a;
                      (a = n.value.base),
                        (l = a.value.base),
                        (n.value.base = l),
                        (r = B(n, i));
                    }
                    var s = B(l, i.havingCrampedStyle()),
                      o = a.value.isShifty && q(l),
                      d = 0;
                    if (o) {
                      var u = E(l),
                        p = B(u, i.havingCrampedStyle());
                      d = p.skew;
                    }
                    var c = e(s.height, i.fontMetrics().xHeight),
                      g;
                    if (!a.value.isStretchy) {
                      var f = h.default.makeSymbol(
                        a.value.label,
                        "Main-Regular",
                        a.mode,
                        i,
                      );
                      f.italic = 0;
                      var y = null;
                      "\\vec" === a.value.label
                        ? (y = "accent-vec")
                        : "\\H" === a.value.label && (y = "accent-hungarian"),
                        (g = (0, m.makeSpan)([], [f])),
                        (g = (0, m.makeSpan)(["accent-body", y], [g])),
                        (g.style.marginLeft = 2 * d + "em"),
                        (g = h.default.makeVList(
                          [
                            { type: "elem", elem: s },
                            { type: "kern", size: -c },
                            { type: "elem", elem: g },
                          ],
                          "firstBaseline",
                          null,
                          i,
                        ));
                    } else {
                      (g = M.default.svgSpan(a, i)),
                        (g = h.default.makeVList(
                          [
                            { type: "elem", elem: s },
                            { type: "elem", elem: g },
                          ],
                          "firstBaseline",
                          null,
                          i,
                        ));
                      var b = g.children[0].children[0].children[1];
                      b.classes.push("svg-align"),
                        0 < d &&
                          ((b.style.width = "calc(100% - " + 2 * d + "em)"),
                          (b.style.marginLeft = 2 * d + "em"));
                    }
                    var v = (0, m.makeSpan)(["mord", "accent"], [g], i);
                    return r
                      ? ((r.children[0] = v),
                        (r.height = t(v.height, r.height)),
                        (r.classes[0] = "mord"),
                        r)
                      : v;
                  }),
                  (_.horizBrace = function (e, t) {
                    var a = t.style,
                      i = "supsub" === e.type,
                      l,
                      r;
                    i &&
                      (e.value.sup
                        ? ((r = t.havingStyle(a.sup())),
                          (l = B(e.value.sup, r, t)))
                        : ((r = t.havingStyle(a.sub())),
                          (l = B(e.value.sub, r, t))),
                      (e = e.value.base));
                    var n = B(
                        e.value.base,
                        t.havingBaseStyle(p.default.DISPLAY),
                      ),
                      s = M.default.svgSpan(e, t),
                      o;
                    if (
                      (e.value.isOver
                        ? ((o = h.default.makeVList(
                            [
                              { type: "elem", elem: n },
                              { type: "kern", size: 0.1 },
                              { type: "elem", elem: s },
                            ],
                            "firstBaseline",
                            null,
                            t,
                          )),
                          o.children[0].children[0].children[1].classes.push(
                            "svg-align",
                          ))
                        : ((o = h.default.makeVList(
                            [
                              { type: "elem", elem: s },
                              { type: "kern", size: 0.1 },
                              { type: "elem", elem: n },
                            ],
                            "bottom",
                            n.depth + 0.1 + s.height,
                            t,
                          )),
                          o.children[0].children[0].children[0].classes.push(
                            "svg-align",
                          )),
                      i)
                    ) {
                      var d = (0, m.makeSpan)(
                        ["mord", e.value.isOver ? "mover" : "munder"],
                        [o],
                        t,
                      );
                      o = e.value.isOver
                        ? h.default.makeVList(
                            [
                              { type: "elem", elem: d },
                              { type: "kern", size: 0.2 },
                              { type: "elem", elem: l },
                            ],
                            "firstBaseline",
                            null,
                            t,
                          )
                        : h.default.makeVList(
                            [
                              { type: "elem", elem: l },
                              { type: "kern", size: 0.2 },
                              { type: "elem", elem: d },
                            ],
                            "bottom",
                            d.depth + 0.2 + l.height,
                            t,
                          );
                    }
                    return (0, m.makeSpan)(
                      ["mord", e.value.isOver ? "mover" : "munder"],
                      [o],
                      t,
                    );
                  }),
                  (_.accentUnder = function (e, t) {
                    var a = B(e.value.body, t),
                      i = M.default.svgSpan(e, t),
                      l = /tilde/.test(e.value.label) ? 0.12 : 0,
                      r = h.default.makeVList(
                        [
                          { type: "elem", elem: i },
                          { type: "kern", size: l },
                          { type: "elem", elem: a },
                        ],
                        "bottom",
                        i.height + l,
                        t,
                      );
                    return (
                      r.children[0].children[0].children[0].classes.push(
                        "svg-align",
                      ),
                      (0, m.makeSpan)(["mord", "accentunder"], [r], t)
                    );
                  }),
                  (_.enclose = function (e, t) {
                    var a = B(e.value.body, t),
                      i = e.value.label.substr(1),
                      l = t.sizeMultiplier,
                      r = 0,
                      n = 0,
                      s;
                    if ("sout" === i)
                      (s = (0, m.makeSpan)(["stretchy", "sout"])),
                        (s.height = t.fontMetrics().defaultRuleThickness / l),
                        (n = -0.5 * t.fontMetrics().xHeight);
                    else {
                      a.classes.push("fbox" === i ? "boxpad" : "cancel-pad");
                      var o = q(e.value.body);
                      (r = "fbox" === i ? 0.34 : o ? 0.2 : 0),
                        (n = a.depth + r),
                        (s = M.default.encloseSpan(a, i, r, t));
                    }
                    var d = h.default.makeVList(
                      [
                        { type: "elem", elem: a, shift: 0 },
                        { type: "elem", elem: s, shift: n },
                      ],
                      "individualShift",
                      null,
                      t,
                    );
                    return (
                      "fbox" !== i &&
                        d.children[0].children[0].children[1].classes.push(
                          "svg-align",
                        ),
                      /cancel/.test(i)
                        ? (0, m.makeSpan)(["mord", "cancel-lap"], [d], t)
                        : (0, m.makeSpan)(["mord"], [d], t)
                    );
                  }),
                  (_.xArrow = function (e, t) {
                    var a = t.style,
                      i = t.havingStyle(a.sup()),
                      l = B(e.value.body, i, t);
                    l.classes.push("x-arrow-pad");
                    var r;
                    e.value.below &&
                      ((i = t.havingStyle(a.sub())),
                      (r = B(e.value.below, i, t)),
                      r.classes.push("x-arrow-pad"));
                    var n = M.default.svgSpan(e, t),
                      s = -t.fontMetrics().axisHeight + n.depth,
                      o = -t.fontMetrics().axisHeight - n.height - 0.111,
                      d;
                    if (e.value.below) {
                      var u =
                        -t.fontMetrics().axisHeight +
                        r.height +
                        n.height +
                        0.111;
                      d = h.default.makeVList(
                        [
                          { type: "elem", elem: l, shift: o },
                          { type: "elem", elem: n, shift: s },
                          { type: "elem", elem: r, shift: u },
                        ],
                        "individualShift",
                        null,
                        t,
                      );
                    } else
                      d = h.default.makeVList(
                        [
                          { type: "elem", elem: l, shift: o },
                          { type: "elem", elem: n, shift: s },
                        ],
                        "individualShift",
                        null,
                        t,
                      );
                    return (
                      d.children[0].children[0].children[1].classes.push(
                        "svg-align",
                      ),
                      (0, m.makeSpan)(["mrel", "x-arrow"], [d], t)
                    );
                  }),
                  (_.phantom = function (e, t) {
                    var a = N(e.value.value, t.withPhantom(), !1);
                    return new h.default.makeFragment(a);
                  }),
                  (_.mclass = function (e, t) {
                    var a = N(e.value.value, t, !0);
                    return (0, m.makeSpan)([e.value.mclass], a, t);
                  });
                var B = function (e, t, a) {
                  if (!e) return (0, m.makeSpan)();
                  if (_[e.type]) {
                    var i = _[e.type](e, t);
                    if (a && t.size !== a.size) {
                      i = (0, m.makeSpan)(t.sizingClasses(a), [i], t);
                      var l = t.sizeMultiplier / a.sizeMultiplier;
                      (i.height *= l), (i.depth *= l);
                    }
                    return i;
                  }
                  throw new d.default(
                    "Got group of unknown type: '" + e.type + "'",
                  );
                };
                i.exports = function (e, t) {
                  e = JSON.parse((0, s.default)(e));
                  var a = N(e, t, !0),
                    i = (0, m.makeSpan)(["base"], a, t),
                    l = (0, m.makeSpan)(["strut"]),
                    r = (0, m.makeSpan)(["strut", "bottom"]);
                  (l.style.height = i.height + "em"),
                    (r.style.height = i.height + i.depth + "em"),
                    (r.style.verticalAlign = -i.depth + "em");
                  var n = (0, m.makeSpan)(["katex-html"], [l, r, i]);
                  return n.setAttribute("aria-hidden", "true"), n;
                };
              },
              {
                "./ParseError": 29,
                "./Style": 33,
                "./buildCommon": 34,
                "./delimiter": 38,
                "./domTree": 39,
                "./stretchy": 47,
                "./units": 50,
                "./utils": 51,
                "babel-runtime/core-js/json/stringify": 2,
              },
            ],
            36: [
              function (e, t) {
                function a(e) {
                  return e && e.__esModule ? e : { default: e };
                }
                var i = e("./buildCommon"),
                  l = a(i),
                  r = e("./fontMetrics"),
                  n = a(r),
                  s = e("./mathMLTree"),
                  o = a(s),
                  d = e("./ParseError"),
                  u = a(d),
                  p = e("./Style"),
                  c = a(p),
                  m = e("./symbols"),
                  h = a(m),
                  g = e("./utils"),
                  f = a(g),
                  y = e("./stretchy"),
                  b = a(y),
                  v = function (e, t) {
                    return (
                      h.default[t][e] &&
                        h.default[t][e].replace &&
                        (e = h.default[t][e].replace),
                      new o.default.TextNode(e)
                    );
                  },
                  x = function (e, t) {
                    var a = t.font;
                    if (!a) return null;
                    var l = e.mode;
                    if ("mathit" === a) return "italic";
                    var r = e.value;
                    if (f.default.contains(["\\imath", "\\jmath"], r))
                      return null;
                    h.default[l][r] &&
                      h.default[l][r].replace &&
                      (r = h.default[l][r].replace);
                    var s = i.fontMap[a].fontName;
                    return n.default.getCharacterMetrics(r, s)
                      ? i.fontMap[t.font].variant
                      : null;
                  },
                  k = {},
                  w = { mi: "italic", mn: "normal", mtext: "normal" };
                (k.mathord = function (e, t) {
                  var a = new o.default.MathNode("mi", [v(e.value, e.mode)]),
                    i = x(e, t) || "italic";
                  return i !== w[a.type] && a.setAttribute("mathvariant", i), a;
                }),
                  (k.textord = function (e, t) {
                    var a = v(e.value, e.mode),
                      i = x(e, t) || "normal",
                      l;
                    return (
                      (l =
                        "text" === e.mode
                          ? new o.default.MathNode("mtext", [a])
                          : /[0-9]/.test(e.value)
                            ? new o.default.MathNode("mn", [a])
                            : "\\prime" === e.value
                              ? new o.default.MathNode("mo", [a])
                              : new o.default.MathNode("mi", [a])),
                      i !== w[l.type] && l.setAttribute("mathvariant", i),
                      l
                    );
                  }),
                  (k.bin = function (e) {
                    var t = new o.default.MathNode("mo", [v(e.value, e.mode)]);
                    return t;
                  }),
                  (k.rel = function (e) {
                    var t = new o.default.MathNode("mo", [v(e.value, e.mode)]);
                    return t;
                  }),
                  (k.open = function (e) {
                    var t = new o.default.MathNode("mo", [v(e.value, e.mode)]);
                    return t;
                  }),
                  (k.close = function (e) {
                    var t = new o.default.MathNode("mo", [v(e.value, e.mode)]);
                    return t;
                  }),
                  (k.inner = function (e) {
                    var t = new o.default.MathNode("mo", [v(e.value, e.mode)]);
                    return t;
                  }),
                  (k.punct = function (e) {
                    var t = new o.default.MathNode("mo", [v(e.value, e.mode)]);
                    return t.setAttribute("separator", "true"), t;
                  }),
                  (k.ordgroup = function (e, t) {
                    var a = M(e.value, t),
                      i = new o.default.MathNode("mrow", a);
                    return i;
                  }),
                  (k.text = function (e, t) {
                    for (
                      var a = e.value.body, l = [], r = null, n = 0, i;
                      n < a.length;
                      n++
                    )
                      (i = S(a[n], t)),
                        "mtext" === i.type && null != r
                          ? Array.prototype.push.apply(r.children, i.children)
                          : (l.push(i), "mtext" === i.type && (r = i));
                    return 1 === l.length
                      ? l[0]
                      : new o.default.MathNode("mrow", l);
                  }),
                  (k.color = function (e, t) {
                    var a = M(e.value.value, t),
                      i = new o.default.MathNode("mstyle", a);
                    return i.setAttribute("mathcolor", e.value.color), i;
                  }),
                  (k.supsub = function (e, t) {
                    var a = !1,
                      i,
                      l;
                    e.value.base &&
                      "horizBrace" === e.value.base.value.type &&
                      ((l = !!e.value.sup),
                      l === e.value.base.value.isOver &&
                        ((a = !0), (i = e.value.base.value.isOver)));
                    var r = !0,
                      n = [S(e.value.base, t, r)];
                    e.value.sub && n.push(S(e.value.sub, t, r)),
                      e.value.sup && n.push(S(e.value.sup, t, r));
                    var s;
                    if (a) s = i ? "mover" : "munder";
                    else if (!e.value.sub) s = "msup";
                    else if (!e.value.sup) s = "msub";
                    else {
                      var d = e.value.base;
                      s =
                        d && d.value.limits && t.style === c.default.DISPLAY
                          ? "munderover"
                          : "msubsup";
                    }
                    var u = new o.default.MathNode(s, n);
                    return u;
                  }),
                  (k.genfrac = function (e, t) {
                    var a = new o.default.MathNode("mfrac", [
                      S(e.value.numer, t),
                      S(e.value.denom, t),
                    ]);
                    if (
                      (e.value.hasBarLine ||
                        a.setAttribute("linethickness", "0px"),
                      null != e.value.leftDelim || null != e.value.rightDelim)
                    ) {
                      var i = [];
                      if (null != e.value.leftDelim) {
                        var l = new o.default.MathNode("mo", [
                          new o.default.TextNode(e.value.leftDelim),
                        ]);
                        l.setAttribute("fence", "true"), i.push(l);
                      }
                      if ((i.push(a), null != e.value.rightDelim)) {
                        var r = new o.default.MathNode("mo", [
                          new o.default.TextNode(e.value.rightDelim),
                        ]);
                        r.setAttribute("fence", "true"), i.push(r);
                      }
                      var n = new o.default.MathNode("mrow", i);
                      return n;
                    }
                    return a;
                  }),
                  (k.array = function (e, t) {
                    return new o.default.MathNode(
                      "mtable",
                      e.value.body.map(function (e) {
                        return new o.default.MathNode(
                          "mtr",
                          e.map(function (e) {
                            return new o.default.MathNode("mtd", [S(e, t)]);
                          }),
                        );
                      }),
                    );
                  }),
                  (k.sqrt = function (e, t) {
                    var a;
                    return (
                      (a = e.value.index
                        ? new o.default.MathNode("mroot", [
                            S(e.value.body, t),
                            S(e.value.index, t),
                          ])
                        : new o.default.MathNode("msqrt", [
                            S(e.value.body, t),
                          ])),
                      a
                    );
                  }),
                  (k.leftright = function (e, t) {
                    var a = M(e.value.body, t);
                    if ("." !== e.value.left) {
                      var i = new o.default.MathNode("mo", [
                        v(e.value.left, e.mode),
                      ]);
                      i.setAttribute("fence", "true"), a.unshift(i);
                    }
                    if ("." !== e.value.right) {
                      var l = new o.default.MathNode("mo", [
                        v(e.value.right, e.mode),
                      ]);
                      l.setAttribute("fence", "true"), a.push(l);
                    }
                    var r = new o.default.MathNode("mrow", a);
                    return r;
                  }),
                  (k.middle = function (e) {
                    var t = new o.default.MathNode("mo", [
                      v(e.value.middle, e.mode),
                    ]);
                    return t.setAttribute("fence", "true"), t;
                  }),
                  (k.accent = function (e, t) {
                    var a = e.value.isStretchy
                      ? b.default.mathMLnode(e.value.label)
                      : new o.default.MathNode("mo", [
                          v(e.value.label, e.mode),
                        ]);
                    var i = new o.default.MathNode("mover", [
                      S(e.value.base, t),
                      a,
                    ]);
                    return i.setAttribute("accent", "true"), i;
                  }),
                  (k.spacing = function (e) {
                    var t;
                    return (
                      "\\ " === e.value ||
                      "\\space" === e.value ||
                      " " === e.value ||
                      "~" === e.value
                        ? (t = new o.default.MathNode("mtext", [
                            new o.default.TextNode("\xA0"),
                          ]))
                        : ((t = new o.default.MathNode("mspace")),
                          t.setAttribute(
                            "width",
                            l.default.spacingFunctions[e.value].size,
                          )),
                      t
                    );
                  }),
                  (k.op = function (e, t) {
                    var a;
                    return (
                      (a = e.value.symbol
                        ? new o.default.MathNode("mo", [
                            v(e.value.body, e.mode),
                          ])
                        : e.value.value
                          ? new o.default.MathNode("mo", M(e.value.value, t))
                          : new o.default.MathNode("mi", [
                              new o.default.TextNode(e.value.body.slice(1)),
                            ])),
                      a
                    );
                  }),
                  (k.mod = function (e, t) {
                    var a = [];
                    if (
                      (("pod" === e.value.modType ||
                        "pmod" === e.value.modType) &&
                        a.push(new o.default.MathNode("mo", [v("(", e.mode)])),
                      "pod" !== e.value.modType &&
                        a.push(
                          new o.default.MathNode("mo", [v("mod", e.mode)]),
                        ),
                      e.value.value)
                    ) {
                      var i = new o.default.MathNode("mspace");
                      i.setAttribute("width", "0.333333em"),
                        a.push(i),
                        (a = a.concat(M(e.value.value, t)));
                    }
                    return (
                      ("pod" === e.value.modType ||
                        "pmod" === e.value.modType) &&
                        a.push(new o.default.MathNode("mo", [v(")", e.mode)])),
                      new o.default.MathNode("mo", a)
                    );
                  }),
                  (k.katex = function () {
                    var e = new o.default.MathNode("mtext", [
                      new o.default.TextNode("KaTeX"),
                    ]);
                    return e;
                  }),
                  (k.font = function (e, t) {
                    var a = e.value.font;
                    return S(e.value.body, t.withFont(a));
                  }),
                  (k.delimsizing = function (e) {
                    var t = [];
                    "." !== e.value.value && t.push(v(e.value.value, e.mode));
                    var a = new o.default.MathNode("mo", t);
                    return (
                      "mopen" === e.value.mclass || "mclose" === e.value.mclass
                        ? a.setAttribute("fence", "true")
                        : a.setAttribute("fence", "false"),
                      a
                    );
                  }),
                  (k.styling = function (e, t) {
                    var a = {
                        display: c.default.DISPLAY,
                        text: c.default.TEXT,
                        script: c.default.SCRIPT,
                        scriptscript: c.default.SCRIPTSCRIPT,
                      },
                      i = a[e.value.style],
                      l = t.havingStyle(i),
                      r = M(e.value.value, l),
                      n = new o.default.MathNode("mstyle", r),
                      s = {
                        display: ["0", "true"],
                        text: ["0", "false"],
                        script: ["1", "false"],
                        scriptscript: ["2", "false"],
                      }[e.value.style];
                    return (
                      n.setAttribute("scriptlevel", s[0]),
                      n.setAttribute("displaystyle", s[1]),
                      n
                    );
                  }),
                  (k.sizing = function (e, t) {
                    var a = t.havingSize(e.value.size),
                      i = M(e.value.value, a),
                      l = new o.default.MathNode("mstyle", i);
                    return (
                      l.setAttribute("mathsize", a.sizeMultiplier + "em"), l
                    );
                  }),
                  (k.overline = function (e, t) {
                    var a = new o.default.MathNode("mo", [
                      new o.default.TextNode("\u203E"),
                    ]);
                    a.setAttribute("stretchy", "true");
                    var i = new o.default.MathNode("mover", [
                      S(e.value.body, t),
                      a,
                    ]);
                    return i.setAttribute("accent", "true"), i;
                  }),
                  (k.underline = function (e, t) {
                    var a = new o.default.MathNode("mo", [
                      new o.default.TextNode("\u203E"),
                    ]);
                    a.setAttribute("stretchy", "true");
                    var i = new o.default.MathNode("munder", [
                      S(e.value.body, t),
                      a,
                    ]);
                    return i.setAttribute("accentunder", "true"), i;
                  }),
                  (k.accentUnder = function (e, t) {
                    var a = b.default.mathMLnode(e.value.label),
                      i = new o.default.MathNode("munder", [
                        S(e.value.body, t),
                        a,
                      ]);
                    return i.setAttribute("accentunder", "true"), i;
                  }),
                  (k.enclose = function (e, t) {
                    var a = new o.default.MathNode("menclose", [
                        S(e.value.body, t),
                      ]),
                      i = "";
                    switch (e.value.label) {
                      case "\\bcancel":
                        i = "downdiagonalstrike";
                        break;
                      case "\\sout":
                        i = "horizontalstrike";
                        break;
                      case "\\fbox":
                        i = "box";
                        break;
                      default:
                        i = "updiagonalstrike";
                    }
                    return a.setAttribute("notation", i), a;
                  }),
                  (k.horizBrace = function (e, t) {
                    var a = b.default.mathMLnode(e.value.label);
                    return new o.default.MathNode(
                      e.value.isOver ? "mover" : "munder",
                      [S(e.value.base, t), a],
                    );
                  }),
                  (k.xArrow = function (e, t) {
                    var a = b.default.mathMLnode(e.value.label),
                      i,
                      l;
                    if (e.value.body) {
                      var r = S(e.value.body, t);
                      e.value.below
                        ? ((l = S(e.value.below, t)),
                          (i = new o.default.MathNode("munderover", [a, l, r])))
                        : (i = new o.default.MathNode("mover", [a, r]));
                    } else
                      e.value.below
                        ? ((l = S(e.value.below, t)),
                          (i = new o.default.MathNode("munder", [a, l])))
                        : (i = new o.default.MathNode("mover", [a]));
                    return i;
                  }),
                  (k.rule = function () {
                    var e = new o.default.MathNode("mrow");
                    return e;
                  }),
                  (k.kern = function () {
                    var e = new o.default.MathNode("mrow");
                    return e;
                  }),
                  (k.llap = function (e, t) {
                    var a = new o.default.MathNode("mpadded", [
                      S(e.value.body, t),
                    ]);
                    return (
                      a.setAttribute("lspace", "-1width"),
                      a.setAttribute("width", "0px"),
                      a
                    );
                  }),
                  (k.rlap = function (e, t) {
                    var a = new o.default.MathNode("mpadded", [
                      S(e.value.body, t),
                    ]);
                    return a.setAttribute("width", "0px"), a;
                  }),
                  (k.phantom = function (e, t) {
                    var a = M(e.value.value, t);
                    return new o.default.MathNode("mphantom", a);
                  }),
                  (k.mclass = function (e, t) {
                    var a = M(e.value.value, t);
                    return new o.default.MathNode("mstyle", a);
                  });
                var M = function (e, t) {
                    for (var a = [], l = 0, i; l < e.length; l++)
                      (i = e[l]), a.push(S(i, t));
                    return a;
                  },
                  S = function (e, t) {
                    var a =
                      2 < arguments.length &&
                      arguments[2] !== void 0 &&
                      arguments[2];
                    if (!e) return new o.default.MathNode("mrow");
                    if (k[e.type]) {
                      var i = k[e.type](e, t);
                      return a && "mrow" === i.type && 1 === i.children.length
                        ? i.children[0]
                        : i;
                    }
                    throw new u.default(
                      "Got group of unknown type: '" + e.type + "'",
                    );
                  };
                t.exports = function (e, t, a) {
                  var l = M(e, a),
                    r = new o.default.MathNode("mrow", l),
                    n = new o.default.MathNode("annotation", [
                      new o.default.TextNode(t),
                    ]);
                  n.setAttribute("encoding", "application/x-tex");
                  var s = new o.default.MathNode("semantics", [r, n]),
                    d = new o.default.MathNode("math", [s]);
                  return (0, i.makeSpan)(["katex-mathml"], [d]);
                };
              },
              {
                "./ParseError": 29,
                "./Style": 33,
                "./buildCommon": 34,
                "./fontMetrics": 41,
                "./mathMLTree": 45,
                "./stretchy": 47,
                "./symbols": 48,
                "./utils": 51,
              },
            ],
            37: [
              function (e, t) {
                function a(e) {
                  return e && e.__esModule ? e : { default: e };
                }
                var i = e("./buildHTML"),
                  l = a(i),
                  r = e("./buildMathML"),
                  n = a(r),
                  s = e("./buildCommon"),
                  o = e("./Options"),
                  d = a(o),
                  u = e("./Settings"),
                  p = a(u),
                  c = e("./Style"),
                  m = a(c);
                t.exports = function (e, t, a) {
                  a = a || new p.default({});
                  var i = m.default.TEXT;
                  a.displayMode && (i = m.default.DISPLAY);
                  var r = new d.default({ style: i }),
                    o = (0, n.default)(e, t, r),
                    u = (0, l.default)(e, r),
                    c = (0, s.makeSpan)(["katex"], [o, u]);
                  return a.displayMode
                    ? (0, s.makeSpan)(["katex-display"], [c])
                    : c;
                };
              },
              {
                "./Options": 28,
                "./Settings": 32,
                "./Style": 33,
                "./buildCommon": 34,
                "./buildHTML": 35,
                "./buildMathML": 36,
              },
            ],
            38: [
              function (a, i) {
                function l(e) {
                  return e && e.__esModule ? e : { default: e };
                }
                var r = a("./ParseError"),
                  n = l(r),
                  s = a("./Style"),
                  o = l(s),
                  d = a("./buildCommon"),
                  u = l(d),
                  p = a("./fontMetrics"),
                  c = l(p),
                  m = a("./symbols"),
                  h = l(m),
                  g = a("./utils"),
                  f = l(g),
                  y = function (e, t) {
                    return h.default.math[e] && h.default.math[e].replace
                      ? c.default.getCharacterMetrics(
                          h.default.math[e].replace,
                          t,
                        )
                      : c.default.getCharacterMetrics(e, t);
                  },
                  b = function (e, t, a, i) {
                    var l = a.havingBaseStyle(t),
                      r = (0, d.makeSpan)(
                        (i || []).concat(l.sizingClasses(a)),
                        [e],
                        a,
                      );
                    return (
                      (r.delimSizeMultiplier =
                        l.sizeMultiplier / a.sizeMultiplier),
                      (r.height *= r.delimSizeMultiplier),
                      (r.depth *= r.delimSizeMultiplier),
                      (r.maxFontSize = l.sizeMultiplier),
                      r
                    );
                  },
                  v = function (e, t, a) {
                    var i = t.havingBaseStyle(a),
                      l =
                        (1 - t.sizeMultiplier / i.sizeMultiplier) *
                        t.fontMetrics().axisHeight;
                    e.classes.push("delimcenter"),
                      (e.style.top = l + "em"),
                      (e.height -= l),
                      (e.depth += l);
                  },
                  x = function (e, t, a, i, l, r) {
                    var n = u.default.makeSymbol(e, "Main-Regular", l, i),
                      s = b(n, t, i, r);
                    return a && v(s, i, t), s;
                  },
                  k = function (e, t, a, i) {
                    return u.default.makeSymbol(
                      e,
                      "Size" + t + "-Regular",
                      a,
                      i,
                    );
                  },
                  w = function (e, t, a, i, l, r) {
                    var n = k(e, t, l, i),
                      s = b(
                        (0, d.makeSpan)(["delimsizing", "size" + t], [n], i),
                        o.default.TEXT,
                        i,
                        r,
                      );
                    return a && v(s, i, o.default.TEXT), s;
                  },
                  M = function (e, t, a) {
                    var i;
                    "Size1-Regular" === t
                      ? (i = "delim-size1")
                      : "Size4-Regular" === t && (i = "delim-size4");
                    var l = (0, d.makeSpan)(
                      ["delimsizinginner", i],
                      [(0, d.makeSpan)([], [u.default.makeSymbol(e, t, a)])],
                    );
                    return { type: "elem", elem: l };
                  },
                  S = function (e, t, a, l, r, n) {
                    var s, p, c, m;
                    (s = c = m = e), (p = null);
                    var h = "Size1-Regular";
                    "\\uparrow" === e
                      ? (c = m = "\u23D0")
                      : "\\Uparrow" === e
                        ? (c = m = "\u2016")
                        : "\\downarrow" === e
                          ? (s = c = "\u23D0")
                          : "\\Downarrow" === e
                            ? (s = c = "\u2016")
                            : "\\updownarrow" === e
                              ? ((s = "\\uparrow"),
                                (c = "\u23D0"),
                                (m = "\\downarrow"))
                              : "\\Updownarrow" === e
                                ? ((s = "\\Uparrow"),
                                  (c = "\u2016"),
                                  (m = "\\Downarrow"))
                                : "[" === e || "\\lbrack" === e
                                  ? ((s = "\u23A1"),
                                    (c = "\u23A2"),
                                    (m = "\u23A3"),
                                    (h = "Size4-Regular"))
                                  : "]" === e || "\\rbrack" === e
                                    ? ((s = "\u23A4"),
                                      (c = "\u23A5"),
                                      (m = "\u23A6"),
                                      (h = "Size4-Regular"))
                                    : "\\lfloor" === e
                                      ? ((c = s = "\u23A2"),
                                        (m = "\u23A3"),
                                        (h = "Size4-Regular"))
                                      : "\\lceil" === e
                                        ? ((s = "\u23A1"),
                                          (c = m = "\u23A2"),
                                          (h = "Size4-Regular"))
                                        : "\\rfloor" === e
                                          ? ((c = s = "\u23A5"),
                                            (m = "\u23A6"),
                                            (h = "Size4-Regular"))
                                          : "\\rceil" === e
                                            ? ((s = "\u23A4"),
                                              (c = m = "\u23A5"),
                                              (h = "Size4-Regular"))
                                            : "(" === e
                                              ? ((s = "\u239B"),
                                                (c = "\u239C"),
                                                (m = "\u239D"),
                                                (h = "Size4-Regular"))
                                              : ")" === e
                                                ? ((s = "\u239E"),
                                                  (c = "\u239F"),
                                                  (m = "\u23A0"),
                                                  (h = "Size4-Regular"))
                                                : "\\{" === e ||
                                                    "\\lbrace" === e
                                                  ? ((s = "\u23A7"),
                                                    (p = "\u23A8"),
                                                    (m = "\u23A9"),
                                                    (c = "\u23AA"),
                                                    (h = "Size4-Regular"))
                                                  : "\\}" === e ||
                                                      "\\rbrace" === e
                                                    ? ((s = "\u23AB"),
                                                      (p = "\u23AC"),
                                                      (m = "\u23AD"),
                                                      (c = "\u23AA"),
                                                      (h = "Size4-Regular"))
                                                    : "\\lgroup" === e
                                                      ? ((s = "\u23A7"),
                                                        (m = "\u23A9"),
                                                        (c = "\u23AA"),
                                                        (h = "Size4-Regular"))
                                                      : "\\rgroup" === e
                                                        ? ((s = "\u23AB"),
                                                          (m = "\u23AD"),
                                                          (c = "\u23AA"),
                                                          (h = "Size4-Regular"))
                                                        : "\\lmoustache" === e
                                                          ? ((s = "\u23A7"),
                                                            (m = "\u23AD"),
                                                            (c = "\u23AA"),
                                                            (h =
                                                              "Size4-Regular"))
                                                          : "\\rmoustache" ===
                                                              e &&
                                                            ((s = "\u23AB"),
                                                            (m = "\u23A9"),
                                                            (c = "\u23AA"),
                                                            (h =
                                                              "Size4-Regular"));
                    var g = y(s, h),
                      f = g.height + g.depth,
                      v = y(c, h),
                      x = v.height + v.depth,
                      k = y(m, h),
                      w = k.height + k.depth,
                      S = 0,
                      z = 1;
                    if (null !== p) {
                      var A = y(p, h);
                      (S = A.height + A.depth), (z = 2);
                    }
                    var T = f + w + S,
                      C = Math.ceil((t - T) / (z * x)),
                      N = T + C * z * x,
                      R = l.fontMetrics().axisHeight;
                    a && (R *= l.sizeMultiplier);
                    var L = N / 2 - R,
                      E = [];
                    if ((E.push(M(m, h, r)), null === p))
                      for (var q = 0; q < C; q++) E.push(M(c, h, r));
                    else {
                      for (var i = 0; i < C; i++) E.push(M(c, h, r));
                      E.push(M(p, h, r));
                      for (var O = 0; O < C; O++) E.push(M(c, h, r));
                    }
                    E.push(M(s, h, r));
                    var _ = l.havingBaseStyle(o.default.TEXT),
                      D = u.default.makeVList(E, "bottom", L, _);
                    return b(
                      (0, d.makeSpan)(["delimsizing", "mult"], [D], _),
                      o.default.TEXT,
                      l,
                      n,
                    );
                  },
                  z = {
                    main: "<svg viewBox='0 0 400000 1000' preserveAspectRatio='xMinYMin\nslice'><path d='M95 622c-2.667 0-7.167-2.667-13.5\n-8S72 604 72 600c0-2 .333-3.333 1-4 1.333-2.667 23.833-20.667 67.5-54s\n65.833-50.333 66.5-51c1.333-1.333 3-2 5-2 4.667 0 8.667 3.333 12 10l173\n378c.667 0 35.333-71 104-213s137.5-285 206.5-429S812 17.333 812 14c5.333\n-9.333 12-14 20-14h399166v40H845.272L620 507 385 993c-2.667 4.667-9 7-19\n7-6 0-10-1-12-3L160 575l-65 47zM834 0h399166v40H845z'/></svg>",
                    1: "<svg viewBox='0 0 400000 1200' preserveAspectRatio='xMinYMin\nslice'><path d='M263 601c.667 0 18 39.667 52 119s68.167\n 158.667 102.5 238 51.833 119.333 52.5 120C810 373.333 980.667 17.667 982 11\nc4.667-7.333 11-11 19-11h398999v40H1012.333L741 607c-38.667 80.667-84 175-136\n 283s-89.167 185.333-111.5 232-33.833 70.333-34.5 71c-4.667 4.667-12.333 7-23\n 7l-12-1-109-253c-72.667-168-109.333-252-110-252-10.667 8-22 16.667-34 26-22\n 17.333-33.333 26-34 26l-26-26 76-59 76-60zM1001 0h398999v40H1012z'/></svg>",
                    2: "<svg viewBox='0 0 400000 1800' preserveAspectRatio='xMinYMin\nslice'><path d='M1001 0h398999v40H1013.084S929.667 308 749\n 880s-277 876.333-289 913c-4.667 4.667-12.667 7-24 7h-12c-1.333-3.333-3.667\n-11.667-7-25-35.333-125.333-106.667-373.333-214-744-10 12-21 25-33 39l-32 39\nc-6-5.333-15-14-27-26l25-30c26.667-32.667 52-63 76-91l52-60 208 722c56-175.333\n 126.333-397.333 211-666s153.833-488.167 207.5-658.5C944.167 129.167 975 32.667\n 983 10c4-6.667 10-10 18-10zm0 0h398999v40H1013z'/></svg>",
                    3: "<svg viewBox='0 0 400000 2400' preserveAspectRatio='xMinYMin\nslice'><path d='M424 2398c-1.333-.667-38.5-172-111.5-514\nS202.667 1370.667 202 1370c0-2-10.667 14.333-32 49-4.667 7.333-9.833 15.667\n-15.5 25s-9.833 16-12.5 20l-5 7c-4-3.333-8.333-7.667-13-13l-13-13 76-122 77-121\n 209 968c0-2 84.667-361.667 254-1079C896.333 373.667 981.667 13.333 983 10\nc4-6.667 10-10 18-10h398999v40H1014.622S927.332 418.667 742 1206c-185.333\n 787.333-279.333 1182.333-282 1185-2 6-10 9-24 9-8 0-12-.667-12-2z\nM1001 0h398999v40H1014z'/></svg>",
                    4: "<svg viewBox='0 0 400000 3000' preserveAspectRatio='xMinYMin\nslice'><path d='M473 2713C812.333 913.667 982.333 13 983 11\nc3.333-7.333 9.333-11 18-11h399110v40H1017.698S927.168 518 741.5 1506C555.833\n 2494 462 2989 460 2991c-2 6-10 9-24 9-8 0-12-.667-12-2s-5.333-32-16-92c-50.667\n-293.333-119.667-693.333-207-1200 0-1.333-5.333 8.667-16 30l-32 64-16 33-26-26\n 76-153 77-151c.667.667 35.667 202 105 604 67.333 400.667 102 602.667 104 606z\nM1001 0h398999v40H1017z'/></svg>",
                    tall: "l-4 4-4 4c-.667.667-2 1.5-4 2.5s-4.167 1.833-6.5 2.5-5.5 1-9.5 1h\n-12l-28-84c-16.667-52-96.667 -294.333-240-727l-212 -643 -85 170c-4-3.333-8.333\n-7.667-13 -13l-13-13l77-155 77-156c66 199.333 139 419.667 219 661 l218 661z\nM702 0H400000v40H742z'/></svg>",
                  },
                  A = function (e, t, a) {
                    var i = u.default.makeSpan([], [], a),
                      l = a.sizeMultiplier;
                    if ("small" === t.type) {
                      var r = a.havingBaseStyle(t.style);
                      (l = r.sizeMultiplier / a.sizeMultiplier),
                        (i.height = 1 * l),
                        (i.style.height = i.height + "em"),
                        (i.surdWidth = 0.833 * l),
                        (i.innerHTML =
                          "<svg width='100%' height='" +
                          i.height +
                          "em'>\n            " +
                          z.main +
                          "</svg>");
                    } else if ("large" === t.type)
                      (i.height = R[t.size] / l),
                        (i.style.height = i.height + "em"),
                        (i.surdWidth = 1 / l),
                        (i.innerHTML =
                          '<svg width="100%" height="' +
                          i.height +
                          'em">\n            ' +
                          z[t.size] +
                          "</svg>");
                    else {
                      (i.height = e / l),
                        (i.style.height = i.height + "em"),
                        (i.surdWidth = 1.056 / l);
                      var n = Math.floor(1e3 * i.height);
                      i.innerHTML =
                        "<svg width='100%' height='" +
                        i.height +
                        "em'>\n            <svg viewBox='0 0 400000 " +
                        n +
                        "'\n            preserveAspectRatio='xMinYMax slice'>\n            <path d='M702 0H400000v40H742v" +
                        (n - 54) +
                        "\n            " +
                        z.tall +
                        "</svg>";
                    }
                    return (i.sizeMultiplier = l), i;
                  },
                  T = [
                    "(",
                    ")",
                    "[",
                    "\\lbrack",
                    "]",
                    "\\rbrack",
                    "\\{",
                    "\\lbrace",
                    "\\}",
                    "\\rbrace",
                    "\\lfloor",
                    "\\rfloor",
                    "\\lceil",
                    "\\rceil",
                    "\\surd",
                  ],
                  C = [
                    "\\uparrow",
                    "\\downarrow",
                    "\\updownarrow",
                    "\\Uparrow",
                    "\\Downarrow",
                    "\\Updownarrow",
                    "|",
                    "\\|",
                    "\\vert",
                    "\\Vert",
                    "\\lvert",
                    "\\rvert",
                    "\\lVert",
                    "\\rVert",
                    "\\lgroup",
                    "\\rgroup",
                    "\\lmoustache",
                    "\\rmoustache",
                  ],
                  N = [
                    "<",
                    ">",
                    "\\langle",
                    "\\rangle",
                    "/",
                    "\\backslash",
                    "\\lt",
                    "\\gt",
                  ],
                  R = [0, 1.2, 1.8, 2.4, 3],
                  L = [
                    { type: "small", style: o.default.SCRIPTSCRIPT },
                    { type: "small", style: o.default.SCRIPT },
                    { type: "small", style: o.default.TEXT },
                    { type: "large", size: 1 },
                    { type: "large", size: 2 },
                    { type: "large", size: 3 },
                    { type: "large", size: 4 },
                  ],
                  E = [
                    { type: "small", style: o.default.SCRIPTSCRIPT },
                    { type: "small", style: o.default.SCRIPT },
                    { type: "small", style: o.default.TEXT },
                    { type: "stack" },
                  ],
                  q = [
                    { type: "small", style: o.default.SCRIPTSCRIPT },
                    { type: "small", style: o.default.SCRIPT },
                    { type: "small", style: o.default.TEXT },
                    { type: "large", size: 1 },
                    { type: "large", size: 2 },
                    { type: "large", size: 3 },
                    { type: "large", size: 4 },
                    { type: "stack" },
                  ],
                  O = function (e) {
                    if ("small" === e.type) return "Main-Regular";
                    return "large" === e.type
                      ? "Size" + e.size + "-Regular"
                      : "stack" === e.type
                        ? "Size4-Regular"
                        : void 0;
                  },
                  _ = function (t, a, l, r) {
                    for (
                      var n = e(2, 3 - r.style.size), s = n;
                      s < l.length && !("stack" === l[s].type);
                      s++
                    ) {
                      var i = y(t, O(l[s])),
                        o = i.height + i.depth;
                      if ("small" === l[s].type) {
                        var d = r.havingBaseStyle(l[s].style);
                        o *= d.sizeMultiplier;
                      }
                      if (o > a) return l[s];
                    }
                    return l[l.length - 1];
                  },
                  D = function (e, t, a, i, l, r) {
                    "<" === e || "\\lt" === e
                      ? (e = "\\langle")
                      : (">" === e || "\\gt" === e) && (e = "\\rangle");
                    var n = f.default.contains(N, e)
                      ? L
                      : f.default.contains(T, e)
                        ? q
                        : E;
                    var s = _(e, t, n, i);
                    if ("\\surd" === e) return A(t, s, i);
                    return "small" === s.type
                      ? x(e, s.style, a, i, l, r)
                      : "large" === s.type
                        ? w(e, s.size, a, i, l, r)
                        : "stack" === s.type
                          ? S(e, t, a, i, l, r)
                          : void 0;
                  };
                i.exports = {
                  sizedDelim: function (e, t, a, i, l) {
                    if (
                      ("<" === e || "\\lt" === e
                        ? (e = "\\langle")
                        : (">" === e || "\\gt" === e) && (e = "\\rangle"),
                      f.default.contains(T, e) || f.default.contains(N, e))
                    )
                      return w(e, t, !1, a, i, l);
                    if (f.default.contains(C, e))
                      return S(e, R[t], !1, a, i, l);
                    throw new n.default("Illegal delimiter: '" + e + "'");
                  },
                  customSizedDelim: D,
                  leftRightDelim: function (e, a, i, l, r, n) {
                    var s = l.fontMetrics().axisHeight * l.sizeMultiplier,
                      o = 5 / l.fontMetrics().ptPerEm,
                      d = t(a - s, i + s),
                      u = t((d / 500) * 901, 2 * d - o);
                    return D(e, u, !0, l, r, n);
                  },
                };
              },
              {
                "./ParseError": 29,
                "./Style": 33,
                "./buildCommon": 34,
                "./fontMetrics": 41,
                "./symbols": 48,
                "./utils": 51,
              },
            ],
            39: [
              function (e, a) {
                function i(e) {
                  return e && e.__esModule ? e : { default: e };
                }
                var l = e("babel-runtime/helpers/classCallCheck"),
                  r = i(l),
                  n = e("babel-runtime/helpers/createClass"),
                  s = i(n),
                  o = e("./unicodeRegexes"),
                  d = i(o),
                  u = e("./utils"),
                  p = i(u),
                  c = function (e) {
                    e = e.slice();
                    for (var t = e.length - 1; 0 <= t; t--)
                      e[t] || e.splice(t, 1);
                    return e.join(" ");
                  },
                  m = (function () {
                    function e(t, a, i) {
                      (0, r.default)(this, e),
                        (this.classes = t || []),
                        (this.children = a || []),
                        (this.height = 0),
                        (this.depth = 0),
                        (this.maxFontSize = 0),
                        (this.style = {}),
                        (this.attributes = {}),
                        this.innerHTML,
                        i &&
                          (i.style.isTight() && this.classes.push("mtight"),
                          i.getColor() && (this.style.color = i.getColor()));
                    }
                    return (
                      (0, s.default)(e, [
                        {
                          key: "setAttribute",
                          value: function (e, t) {
                            this.attributes[e] = t;
                          },
                        },
                        {
                          key: "tryCombine",
                          value: function () {
                            return !1;
                          },
                        },
                        {
                          key: "toNode",
                          value: function () {
                            var e = document.createElement("span");
                            for (var t in ((e.className = c(this.classes)),
                            this.style))
                              Object.prototype.hasOwnProperty.call(
                                this.style,
                                t,
                              ) && (e.style[t] = this.style[t]);
                            for (var a in this.attributes)
                              Object.prototype.hasOwnProperty.call(
                                this.attributes,
                                a,
                              ) && e.setAttribute(a, this.attributes[a]);
                            this.innerHTML && (e.innerHTML = this.innerHTML);
                            for (var l = 0; l < this.children.length; l++)
                              e.appendChild(this.children[l].toNode());
                            return e;
                          },
                        },
                        {
                          key: "toMarkup",
                          value: function () {
                            var e = "<span";
                            this.classes.length &&
                              ((e += ' class="'),
                              (e += p.default.escape(c(this.classes))),
                              (e += '"'));
                            var t = "";
                            for (var a in this.style)
                              this.style.hasOwnProperty(a) &&
                                (t +=
                                  p.default.hyphenate(a) +
                                  ":" +
                                  this.style[a] +
                                  ";");
                            for (var l in (t &&
                              (e += ' style="' + p.default.escape(t) + '"'),
                            this.attributes))
                              Object.prototype.hasOwnProperty.call(
                                this.attributes,
                                l,
                              ) &&
                                ((e += " " + l + '="'),
                                (e += p.default.escape(this.attributes[l])),
                                (e += '"'));
                            (e += ">"), this.innerHTML && (e += this.innerHTML);
                            for (var r = 0; r < this.children.length; r++)
                              e += this.children[r].toMarkup();
                            return (e += "</span>"), e;
                          },
                        },
                      ]),
                      e
                    );
                  })(),
                  h = (function () {
                    function e(t) {
                      (0, r.default)(this, e),
                        (this.children = t || []),
                        (this.height = 0),
                        (this.depth = 0),
                        (this.maxFontSize = 0);
                    }
                    return (
                      (0, s.default)(e, [
                        {
                          key: "toNode",
                          value: function () {
                            for (
                              var e = document.createDocumentFragment(), t = 0;
                              t < this.children.length;
                              t++
                            )
                              e.appendChild(this.children[t].toNode());
                            return e;
                          },
                        },
                        {
                          key: "toMarkup",
                          value: function () {
                            for (
                              var e = "", t = 0;
                              t < this.children.length;
                              t++
                            )
                              e += this.children[t].toMarkup();
                            return e;
                          },
                        },
                      ]),
                      e
                    );
                  })(),
                  g = {
                    î: "\u0131\u0302",
                    ï: "\u0131\u0308",
                    í: "\u0131\u0301",
                    ì: "\u0131\u0300",
                  },
                  f = (function () {
                    function e(t, a, i, l, n, s, o) {
                      (0, r.default)(this, e),
                        (this.value = t || ""),
                        (this.height = a || 0),
                        (this.depth = i || 0),
                        (this.italic = l || 0),
                        (this.skew = n || 0),
                        (this.classes = s || []),
                        (this.style = o || {}),
                        (this.maxFontSize = 0),
                        d.default.cjkRegex.test(t) &&
                          (d.default.hangulRegex.test(t)
                            ? this.classes.push("hangul_fallback")
                            : this.classes.push("cjk_fallback")),
                        /[îïíì]/.test(this.value) &&
                          (this.value = g[this.value]);
                    }
                    return (
                      (0, s.default)(e, [
                        {
                          key: "tryCombine",
                          value: function (a) {
                            if (
                              !a ||
                              !(a instanceof e) ||
                              0 < this.italic ||
                              c(this.classes) !== c(a.classes) ||
                              this.skew !== a.skew ||
                              this.maxFontSize !== a.maxFontSize
                            )
                              return !1;
                            for (var i in this.style)
                              if (
                                this.style.hasOwnProperty(i) &&
                                this.style[i] !== a.style[i]
                              )
                                return !1;
                            for (var l in a.style)
                              if (
                                a.style.hasOwnProperty(l) &&
                                this.style[l] !== a.style[l]
                              )
                                return !1;
                            return (
                              (this.value += a.value),
                              (this.height = t(this.height, a.height)),
                              (this.depth = t(this.depth, a.depth)),
                              (this.italic = a.italic),
                              !0
                            );
                          },
                        },
                        {
                          key: "toNode",
                          value: function () {
                            var e = document.createTextNode(this.value),
                              t = null;
                            for (var a in (0 < this.italic &&
                              ((t = document.createElement("span")),
                              (t.style.marginRight = this.italic + "em")),
                            0 < this.classes.length &&
                              ((t = t || document.createElement("span")),
                              (t.className = c(this.classes))),
                            this.style))
                              this.style.hasOwnProperty(a) &&
                                ((t = t || document.createElement("span")),
                                (t.style[a] = this.style[a]));
                            return t ? (t.appendChild(e), t) : e;
                          },
                        },
                        {
                          key: "toMarkup",
                          value: function () {
                            var e = !1,
                              t = "<span";
                            this.classes.length &&
                              ((e = !0),
                              (t += ' class="'),
                              (t += p.default.escape(c(this.classes))),
                              (t += '"'));
                            var a = "";
                            for (var i in (0 < this.italic &&
                              (a += "margin-right:" + this.italic + "em;"),
                            this.style))
                              this.style.hasOwnProperty(i) &&
                                (a +=
                                  p.default.hyphenate(i) +
                                  ":" +
                                  this.style[i] +
                                  ";");
                            a &&
                              ((e = !0),
                              (t += ' style="' + p.default.escape(a) + '"'));
                            var l = p.default.escape(this.value);
                            return e
                              ? ((t += ">"), (t += l), (t += "</span>"), t)
                              : l;
                          },
                        },
                      ]),
                      e
                    );
                  })();
                a.exports = { span: m, documentFragment: h, symbolNode: f };
              },
              {
                "./unicodeRegexes": 49,
                "./utils": 51,
                "babel-runtime/helpers/classCallCheck": 4,
                "babel-runtime/helpers/createClass": 5,
              },
            ],
            40: [
              function (e, t) {
                function a(e) {
                  return e && e.__esModule ? e : { default: e };
                }
                function l(e, t, a) {
                  for (var i = [], l = [i], r = [], n; ; ) {
                    (n = e.parseExpression(!1, null)),
                      (n = new s.default("ordgroup", n, e.mode)),
                      a &&
                        (n = new s.default(
                          "styling",
                          { style: a, value: [n] },
                          e.mode,
                        )),
                      i.push(n);
                    var o = e.nextToken.text;
                    if ("&" === o) e.consume();
                    else if ("\\end" === o) break;
                    else if ("\\\\" === o || "\\cr" === o) {
                      var u = e.parseFunction();
                      r.push(u.value.size), (i = []), l.push(i);
                    } else
                      throw new d.default(
                        "Expected & or \\\\ or \\end",
                        e.nextToken,
                      );
                  }
                  return (
                    (t.body = l),
                    (t.rowGaps = r),
                    new s.default(t.type, t, e.mode)
                  );
                }
                function i(e, a, l) {
                  "string" == typeof e && (e = [e]),
                    "number" == typeof a && (a = { numArgs: a });
                  for (
                    var r = {
                        numArgs: a.numArgs || 0,
                        argTypes: a.argTypes,
                        greediness: 1,
                        allowedInText: !!a.allowedInText,
                        numOptionalArgs: a.numOptionalArgs || 0,
                        handler: l,
                      },
                      n = 0;
                    n < e.length;
                    ++n
                  )
                    t.exports[e[n]] = r;
                }
                function r(e) {
                  return "d" === e.substr(0, 1) ? "display" : "text";
                }
                var n = e("./ParseNode"),
                  s = a(n),
                  o = e("./ParseError"),
                  d = a(o);
                i(["array", "darray"], { numArgs: 1 }, function (e, t) {
                  var a = t[0];
                  a = a.value.map ? a.value : [a];
                  var i = a.map(function (e) {
                      var t = e.value;
                      if (-1 !== "lcr".indexOf(t))
                        return { type: "align", align: t };
                      if ("|" === t)
                        return { type: "separator", separator: "|" };
                      throw new d.default(
                        "Unknown column alignment: " + e.value,
                        e,
                      );
                    }),
                    n = { type: "array", cols: i, hskipBeforeAndAfter: !0 };
                  return (n = l(e.parser, n, r(e.envName))), n;
                }),
                  i(
                    [
                      "matrix",
                      "pmatrix",
                      "bmatrix",
                      "Bmatrix",
                      "vmatrix",
                      "Vmatrix",
                    ],
                    {},
                    function (e) {
                      var t = {
                          matrix: null,
                          pmatrix: ["(", ")"],
                          bmatrix: ["[", "]"],
                          Bmatrix: ["\\{", "\\}"],
                          vmatrix: ["|", "|"],
                          Vmatrix: ["\\Vert", "\\Vert"],
                        }[e.envName],
                        a = { type: "array", hskipBeforeAndAfter: !1 };
                      return (
                        (a = l(e.parser, a, r(e.envName))),
                        t &&
                          (a = new s.default(
                            "leftright",
                            { body: [a], left: t[0], right: t[1] },
                            e.mode,
                          )),
                        a
                      );
                    },
                  ),
                  i(["cases", "dcases"], {}, function (e) {
                    var t = {
                      type: "array",
                      arraystretch: 1.2,
                      cols: [
                        { type: "align", align: "l", pregap: 0, postgap: 1 },
                        { type: "align", align: "l", pregap: 0, postgap: 0 },
                      ],
                    };
                    return (
                      (t = l(e.parser, t, r(e.envName))),
                      (t = new s.default(
                        "leftright",
                        { body: [t], left: "\\{", right: "." },
                        e.mode,
                      )),
                      t
                    );
                  }),
                  i("aligned", {}, function (e) {
                    var t = { type: "array", cols: [], addJot: !0 };
                    t = l(e.parser, t, "display");
                    var a = new s.default("ordgroup", [], e.mode),
                      r = 0;
                    t.value.body.forEach(function (e) {
                      for (var t = 1, i; t < e.length; t += 2)
                        (i = e[t].value.value[0]), i.value.unshift(a);
                      r < e.length && (r = e.length);
                    });
                    for (var n = 0; n < r; ++n) {
                      var i = "r",
                        o = 0;
                      1 == n % 2 ? (i = "l") : 0 < n && (o = 2),
                        (t.value.cols[n] = {
                          type: "align",
                          align: i,
                          pregap: o,
                          postgap: 0,
                        });
                    }
                    return t;
                  }),
                  i("gathered", {}, function (e) {
                    var t = {
                      type: "array",
                      cols: [{ type: "align", align: "c" }],
                      addJot: !0,
                    };
                    return (t = l(e.parser, t, "display")), t;
                  });
              },
              { "./ParseError": 29, "./ParseNode": 30 },
            ],
            41: [
              function (e, t) {
                var a = e("./unicodeRegexes"),
                  i = e("./fontMetricsData"),
                  l = (function (e) {
                    return e && e.__esModule ? e : { default: e };
                  })(i),
                  r = {
                    slant: [0.25, 0.25, 0.25],
                    space: [0, 0, 0],
                    stretch: [0, 0, 0],
                    shrink: [0, 0, 0],
                    xHeight: [0.431, 0.431, 0.431],
                    quad: [1, 1.171, 1.472],
                    extraSpace: [0, 0, 0],
                    num1: [0.677, 0.732, 0.925],
                    num2: [0.394, 0.384, 0.387],
                    num3: [0.444, 0.471, 0.504],
                    denom1: [0.686, 0.752, 1.025],
                    denom2: [0.345, 0.344, 0.532],
                    sup1: [0.413, 0.503, 0.504],
                    sup2: [0.363, 0.431, 0.404],
                    sup3: [0.289, 0.286, 0.294],
                    sub1: [0.15, 0.143, 0.2],
                    sub2: [0.247, 0.286, 0.4],
                    supDrop: [0.386, 0.353, 0.494],
                    subDrop: [0.05, 0.071, 0.1],
                    delim1: [2.39, 1.7, 1.98],
                    delim2: [1.01, 1.157, 1.42],
                    axisHeight: [0.25, 0.25, 0.25],
                    defaultRuleThickness: [0.04, 0.049, 0.049],
                    bigOpSpacing1: [0.111, 0.111, 0.111],
                    bigOpSpacing2: [0.166, 0.166, 0.166],
                    bigOpSpacing3: [0.2, 0.2, 0.2],
                    bigOpSpacing4: [0.6, 0.611, 0.611],
                    bigOpSpacing5: [0.1, 0.143, 0.143],
                    sqrtRuleThickness: [0.04, 0.04, 0.04],
                    ptPerEm: [10, 10, 10],
                    doubleRuleSep: [0.2, 0.2, 0.2],
                  },
                  n = {
                    À: "A",
                    Á: "A",
                    Â: "A",
                    Ã: "A",
                    Ä: "A",
                    Å: "A",
                    Æ: "A",
                    Ç: "C",
                    È: "E",
                    É: "E",
                    Ê: "E",
                    Ë: "E",
                    Ì: "I",
                    Í: "I",
                    Î: "I",
                    Ï: "I",
                    Ð: "D",
                    Ñ: "N",
                    Ò: "O",
                    Ó: "O",
                    Ô: "O",
                    Õ: "O",
                    Ö: "O",
                    Ø: "O",
                    Ù: "U",
                    Ú: "U",
                    Û: "U",
                    Ü: "U",
                    Ý: "Y",
                    Þ: "o",
                    ß: "B",
                    à: "a",
                    á: "a",
                    â: "a",
                    ã: "a",
                    ä: "a",
                    å: "a",
                    æ: "a",
                    ç: "c",
                    è: "e",
                    é: "e",
                    ê: "e",
                    ë: "e",
                    ì: "i",
                    í: "i",
                    î: "i",
                    ï: "i",
                    ð: "d",
                    ñ: "n",
                    ò: "o",
                    ó: "o",
                    ô: "o",
                    õ: "o",
                    ö: "o",
                    ø: "o",
                    ù: "u",
                    ú: "u",
                    û: "u",
                    ü: "u",
                    ý: "y",
                    þ: "o",
                    ÿ: "y",
                    А: "A",
                    Б: "B",
                    В: "B",
                    Г: "F",
                    Д: "A",
                    Е: "E",
                    Ж: "K",
                    З: "3",
                    И: "N",
                    Й: "N",
                    К: "K",
                    Л: "N",
                    М: "M",
                    Н: "H",
                    О: "O",
                    П: "N",
                    Р: "P",
                    С: "C",
                    Т: "T",
                    У: "y",
                    Ф: "O",
                    Х: "X",
                    Ц: "U",
                    Ч: "h",
                    Ш: "W",
                    Щ: "W",
                    Ъ: "B",
                    Ы: "X",
                    Ь: "B",
                    Э: "3",
                    Ю: "X",
                    Я: "R",
                    а: "a",
                    б: "b",
                    в: "a",
                    г: "r",
                    д: "y",
                    е: "e",
                    ж: "m",
                    з: "e",
                    и: "n",
                    й: "n",
                    к: "n",
                    л: "n",
                    м: "m",
                    н: "n",
                    о: "o",
                    п: "n",
                    р: "p",
                    с: "c",
                    т: "o",
                    у: "y",
                    ф: "b",
                    х: "x",
                    ц: "n",
                    ч: "n",
                    ш: "w",
                    щ: "w",
                    ъ: "a",
                    ы: "m",
                    ь: "a",
                    э: "e",
                    ю: "m",
                    я: "r",
                  },
                  s = {};
                t.exports = {
                  getFontMetrics: function (e) {
                    var t;
                    if (((t = 5 <= e ? 0 : 3 <= e ? 1 : 2), !s[t])) {
                      var a = (s[t] = {});
                      for (var i in r) r.hasOwnProperty(i) && (a[i] = r[i][t]);
                      a.cssEmPerMu = a.quad / 18;
                    }
                    return s[t];
                  },
                  getCharacterMetrics: function (e, t) {
                    var i = e.charCodeAt(0);
                    e[0] in n
                      ? (i = n[e[0]].charCodeAt(0))
                      : a.cjkRegex.test(e[0]) && (i = 77);
                    var r = l.default[t][i];
                    if (r)
                      return {
                        depth: r[0],
                        height: r[1],
                        italic: r[2],
                        skew: r[3],
                        width: r[4],
                      };
                  },
                };
              },
              { "./fontMetricsData": 42, "./unicodeRegexes": 49 },
            ],
            42: [
              function (e, t) {
                t.exports = {
                  "AMS-Regular": {
                    65: [0, 0.68889, 0, 0],
                    66: [0, 0.68889, 0, 0],
                    67: [0, 0.68889, 0, 0],
                    68: [0, 0.68889, 0, 0],
                    69: [0, 0.68889, 0, 0],
                    70: [0, 0.68889, 0, 0],
                    71: [0, 0.68889, 0, 0],
                    72: [0, 0.68889, 0, 0],
                    73: [0, 0.68889, 0, 0],
                    74: [0.16667, 0.68889, 0, 0],
                    75: [0, 0.68889, 0, 0],
                    76: [0, 0.68889, 0, 0],
                    77: [0, 0.68889, 0, 0],
                    78: [0, 0.68889, 0, 0],
                    79: [0.16667, 0.68889, 0, 0],
                    80: [0, 0.68889, 0, 0],
                    81: [0.16667, 0.68889, 0, 0],
                    82: [0, 0.68889, 0, 0],
                    83: [0, 0.68889, 0, 0],
                    84: [0, 0.68889, 0, 0],
                    85: [0, 0.68889, 0, 0],
                    86: [0, 0.68889, 0, 0],
                    87: [0, 0.68889, 0, 0],
                    88: [0, 0.68889, 0, 0],
                    89: [0, 0.68889, 0, 0],
                    90: [0, 0.68889, 0, 0],
                    107: [0, 0.68889, 0, 0],
                    165: [0, 0.675, 0.025, 0],
                    174: [0.15559, 0.69224, 0, 0],
                    240: [0, 0.68889, 0, 0],
                    295: [0, 0.68889, 0, 0],
                    710: [0, 0.825, 0, 0],
                    732: [0, 0.9, 0, 0],
                    770: [0, 0.825, 0, 0],
                    771: [0, 0.9, 0, 0],
                    989: [0.08167, 0.58167, 0, 0],
                    1008: [0, 0.43056, 0.04028, 0],
                    8245: [0, 0.54986, 0, 0],
                    8463: [0, 0.68889, 0, 0],
                    8487: [0, 0.68889, 0, 0],
                    8498: [0, 0.68889, 0, 0],
                    8502: [0, 0.68889, 0, 0],
                    8503: [0, 0.68889, 0, 0],
                    8504: [0, 0.68889, 0, 0],
                    8513: [0, 0.68889, 0, 0],
                    8592: [-0.03598, 0.46402, 0, 0],
                    8594: [-0.03598, 0.46402, 0, 0],
                    8602: [-0.13313, 0.36687, 0, 0],
                    8603: [-0.13313, 0.36687, 0, 0],
                    8606: [0.01354, 0.52239, 0, 0],
                    8608: [0.01354, 0.52239, 0, 0],
                    8610: [0.01354, 0.52239, 0, 0],
                    8611: [0.01354, 0.52239, 0, 0],
                    8619: [0, 0.54986, 0, 0],
                    8620: [0, 0.54986, 0, 0],
                    8621: [-0.13313, 0.37788, 0, 0],
                    8622: [-0.13313, 0.36687, 0, 0],
                    8624: [0, 0.69224, 0, 0],
                    8625: [0, 0.69224, 0, 0],
                    8630: [0, 0.43056, 0, 0],
                    8631: [0, 0.43056, 0, 0],
                    8634: [0.08198, 0.58198, 0, 0],
                    8635: [0.08198, 0.58198, 0, 0],
                    8638: [0.19444, 0.69224, 0, 0],
                    8639: [0.19444, 0.69224, 0, 0],
                    8642: [0.19444, 0.69224, 0, 0],
                    8643: [0.19444, 0.69224, 0, 0],
                    8644: [0.1808, 0.675, 0, 0],
                    8646: [0.1808, 0.675, 0, 0],
                    8647: [0.1808, 0.675, 0, 0],
                    8648: [0.19444, 0.69224, 0, 0],
                    8649: [0.1808, 0.675, 0, 0],
                    8650: [0.19444, 0.69224, 0, 0],
                    8651: [0.01354, 0.52239, 0, 0],
                    8652: [0.01354, 0.52239, 0, 0],
                    8653: [-0.13313, 0.36687, 0, 0],
                    8654: [-0.13313, 0.36687, 0, 0],
                    8655: [-0.13313, 0.36687, 0, 0],
                    8666: [0.13667, 0.63667, 0, 0],
                    8667: [0.13667, 0.63667, 0, 0],
                    8669: [-0.13313, 0.37788, 0, 0],
                    8672: [-0.064, 0.437, 0, 0],
                    8674: [-0.064, 0.437, 0, 0],
                    8705: [0, 0.825, 0, 0],
                    8708: [0, 0.68889, 0, 0],
                    8709: [0.08167, 0.58167, 0, 0],
                    8717: [0, 0.43056, 0, 0],
                    8722: [-0.03598, 0.46402, 0, 0],
                    8724: [0.08198, 0.69224, 0, 0],
                    8726: [0.08167, 0.58167, 0, 0],
                    8733: [0, 0.69224, 0, 0],
                    8736: [0, 0.69224, 0, 0],
                    8737: [0, 0.69224, 0, 0],
                    8738: [0.03517, 0.52239, 0, 0],
                    8739: [0.08167, 0.58167, 0, 0],
                    8740: [0.25142, 0.74111, 0, 0],
                    8741: [0.08167, 0.58167, 0, 0],
                    8742: [0.25142, 0.74111, 0, 0],
                    8756: [0, 0.69224, 0, 0],
                    8757: [0, 0.69224, 0, 0],
                    8764: [-0.13313, 0.36687, 0, 0],
                    8765: [-0.13313, 0.37788, 0, 0],
                    8769: [-0.13313, 0.36687, 0, 0],
                    8770: [-0.03625, 0.46375, 0, 0],
                    8774: [0.30274, 0.79383, 0, 0],
                    8776: [-0.01688, 0.48312, 0, 0],
                    8778: [0.08167, 0.58167, 0, 0],
                    8782: [0.06062, 0.54986, 0, 0],
                    8783: [0.06062, 0.54986, 0, 0],
                    8785: [0.08198, 0.58198, 0, 0],
                    8786: [0.08198, 0.58198, 0, 0],
                    8787: [0.08198, 0.58198, 0, 0],
                    8790: [0, 0.69224, 0, 0],
                    8791: [0.22958, 0.72958, 0, 0],
                    8796: [0.08198, 0.91667, 0, 0],
                    8806: [0.25583, 0.75583, 0, 0],
                    8807: [0.25583, 0.75583, 0, 0],
                    8808: [0.25142, 0.75726, 0, 0],
                    8809: [0.25142, 0.75726, 0, 0],
                    8812: [0.25583, 0.75583, 0, 0],
                    8814: [0.20576, 0.70576, 0, 0],
                    8815: [0.20576, 0.70576, 0, 0],
                    8816: [0.30274, 0.79383, 0, 0],
                    8817: [0.30274, 0.79383, 0, 0],
                    8818: [0.22958, 0.72958, 0, 0],
                    8819: [0.22958, 0.72958, 0, 0],
                    8822: [0.1808, 0.675, 0, 0],
                    8823: [0.1808, 0.675, 0, 0],
                    8828: [0.13667, 0.63667, 0, 0],
                    8829: [0.13667, 0.63667, 0, 0],
                    8830: [0.22958, 0.72958, 0, 0],
                    8831: [0.22958, 0.72958, 0, 0],
                    8832: [0.20576, 0.70576, 0, 0],
                    8833: [0.20576, 0.70576, 0, 0],
                    8840: [0.30274, 0.79383, 0, 0],
                    8841: [0.30274, 0.79383, 0, 0],
                    8842: [0.13597, 0.63597, 0, 0],
                    8843: [0.13597, 0.63597, 0, 0],
                    8847: [0.03517, 0.54986, 0, 0],
                    8848: [0.03517, 0.54986, 0, 0],
                    8858: [0.08198, 0.58198, 0, 0],
                    8859: [0.08198, 0.58198, 0, 0],
                    8861: [0.08198, 0.58198, 0, 0],
                    8862: [0, 0.675, 0, 0],
                    8863: [0, 0.675, 0, 0],
                    8864: [0, 0.675, 0, 0],
                    8865: [0, 0.675, 0, 0],
                    8872: [0, 0.69224, 0, 0],
                    8873: [0, 0.69224, 0, 0],
                    8874: [0, 0.69224, 0, 0],
                    8876: [0, 0.68889, 0, 0],
                    8877: [0, 0.68889, 0, 0],
                    8878: [0, 0.68889, 0, 0],
                    8879: [0, 0.68889, 0, 0],
                    8882: [0.03517, 0.54986, 0, 0],
                    8883: [0.03517, 0.54986, 0, 0],
                    8884: [0.13667, 0.63667, 0, 0],
                    8885: [0.13667, 0.63667, 0, 0],
                    8888: [0, 0.54986, 0, 0],
                    8890: [0.19444, 0.43056, 0, 0],
                    8891: [0.19444, 0.69224, 0, 0],
                    8892: [0.19444, 0.69224, 0, 0],
                    8901: [0, 0.54986, 0, 0],
                    8903: [0.08167, 0.58167, 0, 0],
                    8905: [0.08167, 0.58167, 0, 0],
                    8906: [0.08167, 0.58167, 0, 0],
                    8907: [0, 0.69224, 0, 0],
                    8908: [0, 0.69224, 0, 0],
                    8909: [-0.03598, 0.46402, 0, 0],
                    8910: [0, 0.54986, 0, 0],
                    8911: [0, 0.54986, 0, 0],
                    8912: [0.03517, 0.54986, 0, 0],
                    8913: [0.03517, 0.54986, 0, 0],
                    8914: [0, 0.54986, 0, 0],
                    8915: [0, 0.54986, 0, 0],
                    8916: [0, 0.69224, 0, 0],
                    8918: [0.0391, 0.5391, 0, 0],
                    8919: [0.0391, 0.5391, 0, 0],
                    8920: [0.03517, 0.54986, 0, 0],
                    8921: [0.03517, 0.54986, 0, 0],
                    8922: [0.38569, 0.88569, 0, 0],
                    8923: [0.38569, 0.88569, 0, 0],
                    8926: [0.13667, 0.63667, 0, 0],
                    8927: [0.13667, 0.63667, 0, 0],
                    8928: [0.30274, 0.79383, 0, 0],
                    8929: [0.30274, 0.79383, 0, 0],
                    8934: [0.23222, 0.74111, 0, 0],
                    8935: [0.23222, 0.74111, 0, 0],
                    8936: [0.23222, 0.74111, 0, 0],
                    8937: [0.23222, 0.74111, 0, 0],
                    8938: [0.20576, 0.70576, 0, 0],
                    8939: [0.20576, 0.70576, 0, 0],
                    8940: [0.30274, 0.79383, 0, 0],
                    8941: [0.30274, 0.79383, 0, 0],
                    8994: [0.19444, 0.69224, 0, 0],
                    8995: [0.19444, 0.69224, 0, 0],
                    9416: [0.15559, 0.69224, 0, 0],
                    9484: [0, 0.69224, 0, 0],
                    9488: [0, 0.69224, 0, 0],
                    9492: [0, 0.37788, 0, 0],
                    9496: [0, 0.37788, 0, 0],
                    9585: [0.19444, 0.68889, 0, 0],
                    9586: [0.19444, 0.74111, 0, 0],
                    9632: [0, 0.675, 0, 0],
                    9633: [0, 0.675, 0, 0],
                    9650: [0, 0.54986, 0, 0],
                    9651: [0, 0.54986, 0, 0],
                    9654: [0.03517, 0.54986, 0, 0],
                    9660: [0, 0.54986, 0, 0],
                    9661: [0, 0.54986, 0, 0],
                    9664: [0.03517, 0.54986, 0, 0],
                    9674: [0.11111, 0.69224, 0, 0],
                    9733: [0.19444, 0.69224, 0, 0],
                    10003: [0, 0.69224, 0, 0],
                    10016: [0, 0.69224, 0, 0],
                    10731: [0.11111, 0.69224, 0, 0],
                    10846: [0.19444, 0.75583, 0, 0],
                    10877: [0.13667, 0.63667, 0, 0],
                    10878: [0.13667, 0.63667, 0, 0],
                    10885: [0.25583, 0.75583, 0, 0],
                    10886: [0.25583, 0.75583, 0, 0],
                    10887: [0.13597, 0.63597, 0, 0],
                    10888: [0.13597, 0.63597, 0, 0],
                    10889: [0.26167, 0.75726, 0, 0],
                    10890: [0.26167, 0.75726, 0, 0],
                    10891: [0.48256, 0.98256, 0, 0],
                    10892: [0.48256, 0.98256, 0, 0],
                    10901: [0.13667, 0.63667, 0, 0],
                    10902: [0.13667, 0.63667, 0, 0],
                    10933: [0.25142, 0.75726, 0, 0],
                    10934: [0.25142, 0.75726, 0, 0],
                    10935: [0.26167, 0.75726, 0, 0],
                    10936: [0.26167, 0.75726, 0, 0],
                    10937: [0.26167, 0.75726, 0, 0],
                    10938: [0.26167, 0.75726, 0, 0],
                    10949: [0.25583, 0.75583, 0, 0],
                    10950: [0.25583, 0.75583, 0, 0],
                    10955: [0.28481, 0.79383, 0, 0],
                    10956: [0.28481, 0.79383, 0, 0],
                    57350: [0.08167, 0.58167, 0, 0],
                    57351: [0.08167, 0.58167, 0, 0],
                    57352: [0.08167, 0.58167, 0, 0],
                    57353: [0, 0.43056, 0.04028, 0],
                    57356: [0.25142, 0.75726, 0, 0],
                    57357: [0.25142, 0.75726, 0, 0],
                    57358: [0.41951, 0.91951, 0, 0],
                    57359: [0.30274, 0.79383, 0, 0],
                    57360: [0.30274, 0.79383, 0, 0],
                    57361: [0.41951, 0.91951, 0, 0],
                    57366: [0.25142, 0.75726, 0, 0],
                    57367: [0.25142, 0.75726, 0, 0],
                    57368: [0.25142, 0.75726, 0, 0],
                    57369: [0.25142, 0.75726, 0, 0],
                    57370: [0.13597, 0.63597, 0, 0],
                    57371: [0.13597, 0.63597, 0, 0],
                  },
                  "Caligraphic-Regular": {
                    48: [0, 0.43056, 0, 0],
                    49: [0, 0.43056, 0, 0],
                    50: [0, 0.43056, 0, 0],
                    51: [0.19444, 0.43056, 0, 0],
                    52: [0.19444, 0.43056, 0, 0],
                    53: [0.19444, 0.43056, 0, 0],
                    54: [0, 0.64444, 0, 0],
                    55: [0.19444, 0.43056, 0, 0],
                    56: [0, 0.64444, 0, 0],
                    57: [0.19444, 0.43056, 0, 0],
                    65: [0, 0.68333, 0, 0.19445],
                    66: [0, 0.68333, 0.03041, 0.13889],
                    67: [0, 0.68333, 0.05834, 0.13889],
                    68: [0, 0.68333, 0.02778, 0.08334],
                    69: [0, 0.68333, 0.08944, 0.11111],
                    70: [0, 0.68333, 0.09931, 0.11111],
                    71: [0.09722, 0.68333, 0.0593, 0.11111],
                    72: [0, 0.68333, 0.00965, 0.11111],
                    73: [0, 0.68333, 0.07382, 0],
                    74: [0.09722, 0.68333, 0.18472, 0.16667],
                    75: [0, 0.68333, 0.01445, 0.05556],
                    76: [0, 0.68333, 0, 0.13889],
                    77: [0, 0.68333, 0, 0.13889],
                    78: [0, 0.68333, 0.14736, 0.08334],
                    79: [0, 0.68333, 0.02778, 0.11111],
                    80: [0, 0.68333, 0.08222, 0.08334],
                    81: [0.09722, 0.68333, 0, 0.11111],
                    82: [0, 0.68333, 0, 0.08334],
                    83: [0, 0.68333, 0.075, 0.13889],
                    84: [0, 0.68333, 0.25417, 0],
                    85: [0, 0.68333, 0.09931, 0.08334],
                    86: [0, 0.68333, 0.08222, 0],
                    87: [0, 0.68333, 0.08222, 0.08334],
                    88: [0, 0.68333, 0.14643, 0.13889],
                    89: [0.09722, 0.68333, 0.08222, 0.08334],
                    90: [0, 0.68333, 0.07944, 0.13889],
                  },
                  "Fraktur-Regular": {
                    33: [0, 0.69141, 0, 0],
                    34: [0, 0.69141, 0, 0],
                    38: [0, 0.69141, 0, 0],
                    39: [0, 0.69141, 0, 0],
                    40: [0.24982, 0.74947, 0, 0],
                    41: [0.24982, 0.74947, 0, 0],
                    42: [0, 0.62119, 0, 0],
                    43: [0.08319, 0.58283, 0, 0],
                    44: [0, 0.10803, 0, 0],
                    45: [0.08319, 0.58283, 0, 0],
                    46: [0, 0.10803, 0, 0],
                    47: [0.24982, 0.74947, 0, 0],
                    48: [0, 0.47534, 0, 0],
                    49: [0, 0.47534, 0, 0],
                    50: [0, 0.47534, 0, 0],
                    51: [0.18906, 0.47534, 0, 0],
                    52: [0.18906, 0.47534, 0, 0],
                    53: [0.18906, 0.47534, 0, 0],
                    54: [0, 0.69141, 0, 0],
                    55: [0.18906, 0.47534, 0, 0],
                    56: [0, 0.69141, 0, 0],
                    57: [0.18906, 0.47534, 0, 0],
                    58: [0, 0.47534, 0, 0],
                    59: [0.12604, 0.47534, 0, 0],
                    61: [-0.13099, 0.36866, 0, 0],
                    63: [0, 0.69141, 0, 0],
                    65: [0, 0.69141, 0, 0],
                    66: [0, 0.69141, 0, 0],
                    67: [0, 0.69141, 0, 0],
                    68: [0, 0.69141, 0, 0],
                    69: [0, 0.69141, 0, 0],
                    70: [0.12604, 0.69141, 0, 0],
                    71: [0, 0.69141, 0, 0],
                    72: [0.06302, 0.69141, 0, 0],
                    73: [0, 0.69141, 0, 0],
                    74: [0.12604, 0.69141, 0, 0],
                    75: [0, 0.69141, 0, 0],
                    76: [0, 0.69141, 0, 0],
                    77: [0, 0.69141, 0, 0],
                    78: [0, 0.69141, 0, 0],
                    79: [0, 0.69141, 0, 0],
                    80: [0.18906, 0.69141, 0, 0],
                    81: [0.03781, 0.69141, 0, 0],
                    82: [0, 0.69141, 0, 0],
                    83: [0, 0.69141, 0, 0],
                    84: [0, 0.69141, 0, 0],
                    85: [0, 0.69141, 0, 0],
                    86: [0, 0.69141, 0, 0],
                    87: [0, 0.69141, 0, 0],
                    88: [0, 0.69141, 0, 0],
                    89: [0.18906, 0.69141, 0, 0],
                    90: [0.12604, 0.69141, 0, 0],
                    91: [0.24982, 0.74947, 0, 0],
                    93: [0.24982, 0.74947, 0, 0],
                    94: [0, 0.69141, 0, 0],
                    97: [0, 0.47534, 0, 0],
                    98: [0, 0.69141, 0, 0],
                    99: [0, 0.47534, 0, 0],
                    100: [0, 0.62119, 0, 0],
                    101: [0, 0.47534, 0, 0],
                    102: [0.18906, 0.69141, 0, 0],
                    103: [0.18906, 0.47534, 0, 0],
                    104: [0.18906, 0.69141, 0, 0],
                    105: [0, 0.69141, 0, 0],
                    106: [0, 0.69141, 0, 0],
                    107: [0, 0.69141, 0, 0],
                    108: [0, 0.69141, 0, 0],
                    109: [0, 0.47534, 0, 0],
                    110: [0, 0.47534, 0, 0],
                    111: [0, 0.47534, 0, 0],
                    112: [0.18906, 0.52396, 0, 0],
                    113: [0.18906, 0.47534, 0, 0],
                    114: [0, 0.47534, 0, 0],
                    115: [0, 0.47534, 0, 0],
                    116: [0, 0.62119, 0, 0],
                    117: [0, 0.47534, 0, 0],
                    118: [0, 0.52396, 0, 0],
                    119: [0, 0.52396, 0, 0],
                    120: [0.18906, 0.47534, 0, 0],
                    121: [0.18906, 0.47534, 0, 0],
                    122: [0.18906, 0.47534, 0, 0],
                    8216: [0, 0.69141, 0, 0],
                    8217: [0, 0.69141, 0, 0],
                    58112: [0, 0.62119, 0, 0],
                    58113: [0, 0.62119, 0, 0],
                    58114: [0.18906, 0.69141, 0, 0],
                    58115: [0.18906, 0.69141, 0, 0],
                    58116: [0.18906, 0.47534, 0, 0],
                    58117: [0, 0.69141, 0, 0],
                    58118: [0, 0.62119, 0, 0],
                    58119: [0, 0.47534, 0, 0],
                  },
                  "Main-Bold": {
                    33: [0, 0.69444, 0, 0],
                    34: [0, 0.69444, 0, 0],
                    35: [0.19444, 0.69444, 0, 0],
                    36: [0.05556, 0.75, 0, 0],
                    37: [0.05556, 0.75, 0, 0],
                    38: [0, 0.69444, 0, 0],
                    39: [0, 0.69444, 0, 0],
                    40: [0.25, 0.75, 0, 0],
                    41: [0.25, 0.75, 0, 0],
                    42: [0, 0.75, 0, 0],
                    43: [0.13333, 0.63333, 0, 0],
                    44: [0.19444, 0.15556, 0, 0],
                    45: [0, 0.44444, 0, 0],
                    46: [0, 0.15556, 0, 0],
                    47: [0.25, 0.75, 0, 0],
                    48: [0, 0.64444, 0, 0],
                    49: [0, 0.64444, 0, 0],
                    50: [0, 0.64444, 0, 0],
                    51: [0, 0.64444, 0, 0],
                    52: [0, 0.64444, 0, 0],
                    53: [0, 0.64444, 0, 0],
                    54: [0, 0.64444, 0, 0],
                    55: [0, 0.64444, 0, 0],
                    56: [0, 0.64444, 0, 0],
                    57: [0, 0.64444, 0, 0],
                    58: [0, 0.44444, 0, 0],
                    59: [0.19444, 0.44444, 0, 0],
                    60: [0.08556, 0.58556, 0, 0],
                    61: [-0.10889, 0.39111, 0, 0],
                    62: [0.08556, 0.58556, 0, 0],
                    63: [0, 0.69444, 0, 0],
                    64: [0, 0.69444, 0, 0],
                    65: [0, 0.68611, 0, 0],
                    66: [0, 0.68611, 0, 0],
                    67: [0, 0.68611, 0, 0],
                    68: [0, 0.68611, 0, 0],
                    69: [0, 0.68611, 0, 0],
                    70: [0, 0.68611, 0, 0],
                    71: [0, 0.68611, 0, 0],
                    72: [0, 0.68611, 0, 0],
                    73: [0, 0.68611, 0, 0],
                    74: [0, 0.68611, 0, 0],
                    75: [0, 0.68611, 0, 0],
                    76: [0, 0.68611, 0, 0],
                    77: [0, 0.68611, 0, 0],
                    78: [0, 0.68611, 0, 0],
                    79: [0, 0.68611, 0, 0],
                    80: [0, 0.68611, 0, 0],
                    81: [0.19444, 0.68611, 0, 0],
                    82: [0, 0.68611, 0, 0],
                    83: [0, 0.68611, 0, 0],
                    84: [0, 0.68611, 0, 0],
                    85: [0, 0.68611, 0, 0],
                    86: [0, 0.68611, 0.01597, 0],
                    87: [0, 0.68611, 0.01597, 0],
                    88: [0, 0.68611, 0, 0],
                    89: [0, 0.68611, 0.02875, 0],
                    90: [0, 0.68611, 0, 0],
                    91: [0.25, 0.75, 0, 0],
                    92: [0.25, 0.75, 0, 0],
                    93: [0.25, 0.75, 0, 0],
                    94: [0, 0.69444, 0, 0],
                    95: [0.31, 0.13444, 0.03194, 0],
                    96: [0, 0.69444, 0, 0],
                    97: [0, 0.44444, 0, 0],
                    98: [0, 0.69444, 0, 0],
                    99: [0, 0.44444, 0, 0],
                    100: [0, 0.69444, 0, 0],
                    101: [0, 0.44444, 0, 0],
                    102: [0, 0.69444, 0.10903, 0],
                    103: [0.19444, 0.44444, 0.01597, 0],
                    104: [0, 0.69444, 0, 0],
                    105: [0, 0.69444, 0, 0],
                    106: [0.19444, 0.69444, 0, 0],
                    107: [0, 0.69444, 0, 0],
                    108: [0, 0.69444, 0, 0],
                    109: [0, 0.44444, 0, 0],
                    110: [0, 0.44444, 0, 0],
                    111: [0, 0.44444, 0, 0],
                    112: [0.19444, 0.44444, 0, 0],
                    113: [0.19444, 0.44444, 0, 0],
                    114: [0, 0.44444, 0, 0],
                    115: [0, 0.44444, 0, 0],
                    116: [0, 0.63492, 0, 0],
                    117: [0, 0.44444, 0, 0],
                    118: [0, 0.44444, 0.01597, 0],
                    119: [0, 0.44444, 0.01597, 0],
                    120: [0, 0.44444, 0, 0],
                    121: [0.19444, 0.44444, 0.01597, 0],
                    122: [0, 0.44444, 0, 0],
                    123: [0.25, 0.75, 0, 0],
                    124: [0.25, 0.75, 0, 0],
                    125: [0.25, 0.75, 0, 0],
                    126: [0.35, 0.34444, 0, 0],
                    168: [0, 0.69444, 0, 0],
                    172: [0, 0.44444, 0, 0],
                    175: [0, 0.59611, 0, 0],
                    176: [0, 0.69444, 0, 0],
                    177: [0.13333, 0.63333, 0, 0],
                    180: [0, 0.69444, 0, 0],
                    215: [0.13333, 0.63333, 0, 0],
                    247: [0.13333, 0.63333, 0, 0],
                    305: [0, 0.44444, 0, 0],
                    567: [0.19444, 0.44444, 0, 0],
                    710: [0, 0.69444, 0, 0],
                    711: [0, 0.63194, 0, 0],
                    713: [0, 0.59611, 0, 0],
                    714: [0, 0.69444, 0, 0],
                    715: [0, 0.69444, 0, 0],
                    728: [0, 0.69444, 0, 0],
                    729: [0, 0.69444, 0, 0],
                    730: [0, 0.69444, 0, 0],
                    732: [0, 0.69444, 0, 0],
                    768: [0, 0.69444, 0, 0],
                    769: [0, 0.69444, 0, 0],
                    770: [0, 0.69444, 0, 0],
                    771: [0, 0.69444, 0, 0],
                    772: [0, 0.59611, 0, 0],
                    774: [0, 0.69444, 0, 0],
                    775: [0, 0.69444, 0, 0],
                    776: [0, 0.69444, 0, 0],
                    778: [0, 0.69444, 0, 0],
                    779: [0, 0.69444, 0, 0],
                    780: [0, 0.63194, 0, 0],
                    824: [0.19444, 0.69444, 0, 0],
                    915: [0, 0.68611, 0, 0],
                    916: [0, 0.68611, 0, 0],
                    920: [0, 0.68611, 0, 0],
                    923: [0, 0.68611, 0, 0],
                    926: [0, 0.68611, 0, 0],
                    928: [0, 0.68611, 0, 0],
                    931: [0, 0.68611, 0, 0],
                    933: [0, 0.68611, 0, 0],
                    934: [0, 0.68611, 0, 0],
                    936: [0, 0.68611, 0, 0],
                    937: [0, 0.68611, 0, 0],
                    8211: [0, 0.44444, 0.03194, 0],
                    8212: [0, 0.44444, 0.03194, 0],
                    8216: [0, 0.69444, 0, 0],
                    8217: [0, 0.69444, 0, 0],
                    8220: [0, 0.69444, 0, 0],
                    8221: [0, 0.69444, 0, 0],
                    8224: [0.19444, 0.69444, 0, 0],
                    8225: [0.19444, 0.69444, 0, 0],
                    8242: [0, 0.55556, 0, 0],
                    8407: [0, 0.72444, 0.15486, 0],
                    8463: [0, 0.69444, 0, 0],
                    8465: [0, 0.69444, 0, 0],
                    8467: [0, 0.69444, 0, 0],
                    8472: [0.19444, 0.44444, 0, 0],
                    8476: [0, 0.69444, 0, 0],
                    8501: [0, 0.69444, 0, 0],
                    8592: [-0.10889, 0.39111, 0, 0],
                    8593: [0.19444, 0.69444, 0, 0],
                    8594: [-0.10889, 0.39111, 0, 0],
                    8595: [0.19444, 0.69444, 0, 0],
                    8596: [-0.10889, 0.39111, 0, 0],
                    8597: [0.25, 0.75, 0, 0],
                    8598: [0.19444, 0.69444, 0, 0],
                    8599: [0.19444, 0.69444, 0, 0],
                    8600: [0.19444, 0.69444, 0, 0],
                    8601: [0.19444, 0.69444, 0, 0],
                    8636: [-0.10889, 0.39111, 0, 0],
                    8637: [-0.10889, 0.39111, 0, 0],
                    8640: [-0.10889, 0.39111, 0, 0],
                    8641: [-0.10889, 0.39111, 0, 0],
                    8656: [-0.10889, 0.39111, 0, 0],
                    8657: [0.19444, 0.69444, 0, 0],
                    8658: [-0.10889, 0.39111, 0, 0],
                    8659: [0.19444, 0.69444, 0, 0],
                    8660: [-0.10889, 0.39111, 0, 0],
                    8661: [0.25, 0.75, 0, 0],
                    8704: [0, 0.69444, 0, 0],
                    8706: [0, 0.69444, 0.06389, 0],
                    8707: [0, 0.69444, 0, 0],
                    8709: [0.05556, 0.75, 0, 0],
                    8711: [0, 0.68611, 0, 0],
                    8712: [0.08556, 0.58556, 0, 0],
                    8715: [0.08556, 0.58556, 0, 0],
                    8722: [0.13333, 0.63333, 0, 0],
                    8723: [0.13333, 0.63333, 0, 0],
                    8725: [0.25, 0.75, 0, 0],
                    8726: [0.25, 0.75, 0, 0],
                    8727: [-0.02778, 0.47222, 0, 0],
                    8728: [-0.02639, 0.47361, 0, 0],
                    8729: [-0.02639, 0.47361, 0, 0],
                    8730: [0.18, 0.82, 0, 0],
                    8733: [0, 0.44444, 0, 0],
                    8734: [0, 0.44444, 0, 0],
                    8736: [0, 0.69224, 0, 0],
                    8739: [0.25, 0.75, 0, 0],
                    8741: [0.25, 0.75, 0, 0],
                    8743: [0, 0.55556, 0, 0],
                    8744: [0, 0.55556, 0, 0],
                    8745: [0, 0.55556, 0, 0],
                    8746: [0, 0.55556, 0, 0],
                    8747: [0.19444, 0.69444, 0.12778, 0],
                    8764: [-0.10889, 0.39111, 0, 0],
                    8768: [0.19444, 0.69444, 0, 0],
                    8771: [0.00222, 0.50222, 0, 0],
                    8776: [0.02444, 0.52444, 0, 0],
                    8781: [0.00222, 0.50222, 0, 0],
                    8801: [0.00222, 0.50222, 0, 0],
                    8804: [0.19667, 0.69667, 0, 0],
                    8805: [0.19667, 0.69667, 0, 0],
                    8810: [0.08556, 0.58556, 0, 0],
                    8811: [0.08556, 0.58556, 0, 0],
                    8826: [0.08556, 0.58556, 0, 0],
                    8827: [0.08556, 0.58556, 0, 0],
                    8834: [0.08556, 0.58556, 0, 0],
                    8835: [0.08556, 0.58556, 0, 0],
                    8838: [0.19667, 0.69667, 0, 0],
                    8839: [0.19667, 0.69667, 0, 0],
                    8846: [0, 0.55556, 0, 0],
                    8849: [0.19667, 0.69667, 0, 0],
                    8850: [0.19667, 0.69667, 0, 0],
                    8851: [0, 0.55556, 0, 0],
                    8852: [0, 0.55556, 0, 0],
                    8853: [0.13333, 0.63333, 0, 0],
                    8854: [0.13333, 0.63333, 0, 0],
                    8855: [0.13333, 0.63333, 0, 0],
                    8856: [0.13333, 0.63333, 0, 0],
                    8857: [0.13333, 0.63333, 0, 0],
                    8866: [0, 0.69444, 0, 0],
                    8867: [0, 0.69444, 0, 0],
                    8868: [0, 0.69444, 0, 0],
                    8869: [0, 0.69444, 0, 0],
                    8900: [-0.02639, 0.47361, 0, 0],
                    8901: [-0.02639, 0.47361, 0, 0],
                    8902: [-0.02778, 0.47222, 0, 0],
                    8968: [0.25, 0.75, 0, 0],
                    8969: [0.25, 0.75, 0, 0],
                    8970: [0.25, 0.75, 0, 0],
                    8971: [0.25, 0.75, 0, 0],
                    8994: [-0.13889, 0.36111, 0, 0],
                    8995: [-0.13889, 0.36111, 0, 0],
                    9651: [0.19444, 0.69444, 0, 0],
                    9657: [-0.02778, 0.47222, 0, 0],
                    9661: [0.19444, 0.69444, 0, 0],
                    9667: [-0.02778, 0.47222, 0, 0],
                    9711: [0.19444, 0.69444, 0, 0],
                    9824: [0.12963, 0.69444, 0, 0],
                    9825: [0.12963, 0.69444, 0, 0],
                    9826: [0.12963, 0.69444, 0, 0],
                    9827: [0.12963, 0.69444, 0, 0],
                    9837: [0, 0.75, 0, 0],
                    9838: [0.19444, 0.69444, 0, 0],
                    9839: [0.19444, 0.69444, 0, 0],
                    10216: [0.25, 0.75, 0, 0],
                    10217: [0.25, 0.75, 0, 0],
                    10815: [0, 0.68611, 0, 0],
                    10927: [0.19667, 0.69667, 0, 0],
                    10928: [0.19667, 0.69667, 0, 0],
                  },
                  "Main-Italic": {
                    33: [0, 0.69444, 0.12417, 0],
                    34: [0, 0.69444, 0.06961, 0],
                    35: [0.19444, 0.69444, 0.06616, 0],
                    37: [0.05556, 0.75, 0.13639, 0],
                    38: [0, 0.69444, 0.09694, 0],
                    39: [0, 0.69444, 0.12417, 0],
                    40: [0.25, 0.75, 0.16194, 0],
                    41: [0.25, 0.75, 0.03694, 0],
                    42: [0, 0.75, 0.14917, 0],
                    43: [0.05667, 0.56167, 0.03694, 0],
                    44: [0.19444, 0.10556, 0, 0],
                    45: [0, 0.43056, 0.02826, 0],
                    46: [0, 0.10556, 0, 0],
                    47: [0.25, 0.75, 0.16194, 0],
                    48: [0, 0.64444, 0.13556, 0],
                    49: [0, 0.64444, 0.13556, 0],
                    50: [0, 0.64444, 0.13556, 0],
                    51: [0, 0.64444, 0.13556, 0],
                    52: [0.19444, 0.64444, 0.13556, 0],
                    53: [0, 0.64444, 0.13556, 0],
                    54: [0, 0.64444, 0.13556, 0],
                    55: [0.19444, 0.64444, 0.13556, 0],
                    56: [0, 0.64444, 0.13556, 0],
                    57: [0, 0.64444, 0.13556, 0],
                    58: [0, 0.43056, 0.0582, 0],
                    59: [0.19444, 0.43056, 0.0582, 0],
                    61: [-0.13313, 0.36687, 0.06616, 0],
                    63: [0, 0.69444, 0.1225, 0],
                    64: [0, 0.69444, 0.09597, 0],
                    65: [0, 0.68333, 0, 0],
                    66: [0, 0.68333, 0.10257, 0],
                    67: [0, 0.68333, 0.14528, 0],
                    68: [0, 0.68333, 0.09403, 0],
                    69: [0, 0.68333, 0.12028, 0],
                    70: [0, 0.68333, 0.13305, 0],
                    71: [0, 0.68333, 0.08722, 0],
                    72: [0, 0.68333, 0.16389, 0],
                    73: [0, 0.68333, 0.15806, 0],
                    74: [0, 0.68333, 0.14028, 0],
                    75: [0, 0.68333, 0.14528, 0],
                    76: [0, 0.68333, 0, 0],
                    77: [0, 0.68333, 0.16389, 0],
                    78: [0, 0.68333, 0.16389, 0],
                    79: [0, 0.68333, 0.09403, 0],
                    80: [0, 0.68333, 0.10257, 0],
                    81: [0.19444, 0.68333, 0.09403, 0],
                    82: [0, 0.68333, 0.03868, 0],
                    83: [0, 0.68333, 0.11972, 0],
                    84: [0, 0.68333, 0.13305, 0],
                    85: [0, 0.68333, 0.16389, 0],
                    86: [0, 0.68333, 0.18361, 0],
                    87: [0, 0.68333, 0.18361, 0],
                    88: [0, 0.68333, 0.15806, 0],
                    89: [0, 0.68333, 0.19383, 0],
                    90: [0, 0.68333, 0.14528, 0],
                    91: [0.25, 0.75, 0.1875, 0],
                    93: [0.25, 0.75, 0.10528, 0],
                    94: [0, 0.69444, 0.06646, 0],
                    95: [0.31, 0.12056, 0.09208, 0],
                    97: [0, 0.43056, 0.07671, 0],
                    98: [0, 0.69444, 0.06312, 0],
                    99: [0, 0.43056, 0.05653, 0],
                    100: [0, 0.69444, 0.10333, 0],
                    101: [0, 0.43056, 0.07514, 0],
                    102: [0.19444, 0.69444, 0.21194, 0],
                    103: [0.19444, 0.43056, 0.08847, 0],
                    104: [0, 0.69444, 0.07671, 0],
                    105: [0, 0.65536, 0.1019, 0],
                    106: [0.19444, 0.65536, 0.14467, 0],
                    107: [0, 0.69444, 0.10764, 0],
                    108: [0, 0.69444, 0.10333, 0],
                    109: [0, 0.43056, 0.07671, 0],
                    110: [0, 0.43056, 0.07671, 0],
                    111: [0, 0.43056, 0.06312, 0],
                    112: [0.19444, 0.43056, 0.06312, 0],
                    113: [0.19444, 0.43056, 0.08847, 0],
                    114: [0, 0.43056, 0.10764, 0],
                    115: [0, 0.43056, 0.08208, 0],
                    116: [0, 0.61508, 0.09486, 0],
                    117: [0, 0.43056, 0.07671, 0],
                    118: [0, 0.43056, 0.10764, 0],
                    119: [0, 0.43056, 0.10764, 0],
                    120: [0, 0.43056, 0.12042, 0],
                    121: [0.19444, 0.43056, 0.08847, 0],
                    122: [0, 0.43056, 0.12292, 0],
                    126: [0.35, 0.31786, 0.11585, 0],
                    163: [0, 0.69444, 0, 0],
                    305: [0, 0.43056, 0, 0.02778],
                    567: [0.19444, 0.43056, 0, 0.08334],
                    768: [0, 0.69444, 0, 0],
                    769: [0, 0.69444, 0.09694, 0],
                    770: [0, 0.69444, 0.06646, 0],
                    771: [0, 0.66786, 0.11585, 0],
                    772: [0, 0.56167, 0.10333, 0],
                    774: [0, 0.69444, 0.10806, 0],
                    775: [0, 0.66786, 0.11752, 0],
                    776: [0, 0.66786, 0.10474, 0],
                    778: [0, 0.69444, 0, 0],
                    779: [0, 0.69444, 0.1225, 0],
                    780: [0, 0.62847, 0.08295, 0],
                    915: [0, 0.68333, 0.13305, 0],
                    916: [0, 0.68333, 0, 0],
                    920: [0, 0.68333, 0.09403, 0],
                    923: [0, 0.68333, 0, 0],
                    926: [0, 0.68333, 0.15294, 0],
                    928: [0, 0.68333, 0.16389, 0],
                    931: [0, 0.68333, 0.12028, 0],
                    933: [0, 0.68333, 0.11111, 0],
                    934: [0, 0.68333, 0.05986, 0],
                    936: [0, 0.68333, 0.11111, 0],
                    937: [0, 0.68333, 0.10257, 0],
                    8211: [0, 0.43056, 0.09208, 0],
                    8212: [0, 0.43056, 0.09208, 0],
                    8216: [0, 0.69444, 0.12417, 0],
                    8217: [0, 0.69444, 0.12417, 0],
                    8220: [0, 0.69444, 0.1685, 0],
                    8221: [0, 0.69444, 0.06961, 0],
                    8463: [0, 0.68889, 0, 0],
                  },
                  "Main-Regular": {
                    32: [0, 0, 0, 0],
                    33: [0, 0.69444, 0, 0],
                    34: [0, 0.69444, 0, 0],
                    35: [0.19444, 0.69444, 0, 0],
                    36: [0.05556, 0.75, 0, 0],
                    37: [0.05556, 0.75, 0, 0],
                    38: [0, 0.69444, 0, 0],
                    39: [0, 0.69444, 0, 0],
                    40: [0.25, 0.75, 0, 0],
                    41: [0.25, 0.75, 0, 0],
                    42: [0, 0.75, 0, 0],
                    43: [0.08333, 0.58333, 0, 0],
                    44: [0.19444, 0.10556, 0, 0],
                    45: [0, 0.43056, 0, 0],
                    46: [0, 0.10556, 0, 0],
                    47: [0.25, 0.75, 0, 0],
                    48: [0, 0.64444, 0, 0],
                    49: [0, 0.64444, 0, 0],
                    50: [0, 0.64444, 0, 0],
                    51: [0, 0.64444, 0, 0],
                    52: [0, 0.64444, 0, 0],
                    53: [0, 0.64444, 0, 0],
                    54: [0, 0.64444, 0, 0],
                    55: [0, 0.64444, 0, 0],
                    56: [0, 0.64444, 0, 0],
                    57: [0, 0.64444, 0, 0],
                    58: [0, 0.43056, 0, 0],
                    59: [0.19444, 0.43056, 0, 0],
                    60: [0.0391, 0.5391, 0, 0],
                    61: [-0.13313, 0.36687, 0, 0],
                    62: [0.0391, 0.5391, 0, 0],
                    63: [0, 0.69444, 0, 0],
                    64: [0, 0.69444, 0, 0],
                    65: [0, 0.68333, 0, 0],
                    66: [0, 0.68333, 0, 0],
                    67: [0, 0.68333, 0, 0],
                    68: [0, 0.68333, 0, 0],
                    69: [0, 0.68333, 0, 0],
                    70: [0, 0.68333, 0, 0],
                    71: [0, 0.68333, 0, 0],
                    72: [0, 0.68333, 0, 0],
                    73: [0, 0.68333, 0, 0],
                    74: [0, 0.68333, 0, 0],
                    75: [0, 0.68333, 0, 0],
                    76: [0, 0.68333, 0, 0],
                    77: [0, 0.68333, 0, 0],
                    78: [0, 0.68333, 0, 0],
                    79: [0, 0.68333, 0, 0],
                    80: [0, 0.68333, 0, 0],
                    81: [0.19444, 0.68333, 0, 0],
                    82: [0, 0.68333, 0, 0],
                    83: [0, 0.68333, 0, 0],
                    84: [0, 0.68333, 0, 0],
                    85: [0, 0.68333, 0, 0],
                    86: [0, 0.68333, 0.01389, 0],
                    87: [0, 0.68333, 0.01389, 0],
                    88: [0, 0.68333, 0, 0],
                    89: [0, 0.68333, 0.025, 0],
                    90: [0, 0.68333, 0, 0],
                    91: [0.25, 0.75, 0, 0],
                    92: [0.25, 0.75, 0, 0],
                    93: [0.25, 0.75, 0, 0],
                    94: [0, 0.69444, 0, 0],
                    95: [0.31, 0.12056, 0.02778, 0],
                    96: [0, 0.69444, 0, 0],
                    97: [0, 0.43056, 0, 0],
                    98: [0, 0.69444, 0, 0],
                    99: [0, 0.43056, 0, 0],
                    100: [0, 0.69444, 0, 0],
                    101: [0, 0.43056, 0, 0],
                    102: [0, 0.69444, 0.07778, 0],
                    103: [0.19444, 0.43056, 0.01389, 0],
                    104: [0, 0.69444, 0, 0],
                    105: [0, 0.66786, 0, 0],
                    106: [0.19444, 0.66786, 0, 0],
                    107: [0, 0.69444, 0, 0],
                    108: [0, 0.69444, 0, 0],
                    109: [0, 0.43056, 0, 0],
                    110: [0, 0.43056, 0, 0],
                    111: [0, 0.43056, 0, 0],
                    112: [0.19444, 0.43056, 0, 0],
                    113: [0.19444, 0.43056, 0, 0],
                    114: [0, 0.43056, 0, 0],
                    115: [0, 0.43056, 0, 0],
                    116: [0, 0.61508, 0, 0],
                    117: [0, 0.43056, 0, 0],
                    118: [0, 0.43056, 0.01389, 0],
                    119: [0, 0.43056, 0.01389, 0],
                    120: [0, 0.43056, 0, 0],
                    121: [0.19444, 0.43056, 0.01389, 0],
                    122: [0, 0.43056, 0, 0],
                    123: [0.25, 0.75, 0, 0],
                    124: [0.25, 0.75, 0, 0],
                    125: [0.25, 0.75, 0, 0],
                    126: [0.35, 0.31786, 0, 0],
                    160: [0, 0, 0, 0],
                    168: [0, 0.66786, 0, 0],
                    172: [0, 0.43056, 0, 0],
                    175: [0, 0.56778, 0, 0],
                    176: [0, 0.69444, 0, 0],
                    177: [0.08333, 0.58333, 0, 0],
                    180: [0, 0.69444, 0, 0],
                    215: [0.08333, 0.58333, 0, 0],
                    247: [0.08333, 0.58333, 0, 0],
                    305: [0, 0.43056, 0, 0],
                    567: [0.19444, 0.43056, 0, 0],
                    710: [0, 0.69444, 0, 0],
                    711: [0, 0.62847, 0, 0],
                    713: [0, 0.56778, 0, 0],
                    714: [0, 0.69444, 0, 0],
                    715: [0, 0.69444, 0, 0],
                    728: [0, 0.69444, 0, 0],
                    729: [0, 0.66786, 0, 0],
                    730: [0, 0.69444, 0, 0],
                    732: [0, 0.66786, 0, 0],
                    768: [0, 0.69444, 0, 0],
                    769: [0, 0.69444, 0, 0],
                    770: [0, 0.69444, 0, 0],
                    771: [0, 0.66786, 0, 0],
                    772: [0, 0.56778, 0, 0],
                    774: [0, 0.69444, 0, 0],
                    775: [0, 0.66786, 0, 0],
                    776: [0, 0.66786, 0, 0],
                    778: [0, 0.69444, 0, 0],
                    779: [0, 0.69444, 0, 0],
                    780: [0, 0.62847, 0, 0],
                    824: [0.19444, 0.69444, 0, 0],
                    915: [0, 0.68333, 0, 0],
                    916: [0, 0.68333, 0, 0],
                    920: [0, 0.68333, 0, 0],
                    923: [0, 0.68333, 0, 0],
                    926: [0, 0.68333, 0, 0],
                    928: [0, 0.68333, 0, 0],
                    931: [0, 0.68333, 0, 0],
                    933: [0, 0.68333, 0, 0],
                    934: [0, 0.68333, 0, 0],
                    936: [0, 0.68333, 0, 0],
                    937: [0, 0.68333, 0, 0],
                    8211: [0, 0.43056, 0.02778, 0],
                    8212: [0, 0.43056, 0.02778, 0],
                    8216: [0, 0.69444, 0, 0],
                    8217: [0, 0.69444, 0, 0],
                    8220: [0, 0.69444, 0, 0],
                    8221: [0, 0.69444, 0, 0],
                    8224: [0.19444, 0.69444, 0, 0],
                    8225: [0.19444, 0.69444, 0, 0],
                    8230: [0, 0.12, 0, 0],
                    8242: [0, 0.55556, 0, 0],
                    8407: [0, 0.71444, 0.15382, 0],
                    8463: [0, 0.68889, 0, 0],
                    8465: [0, 0.69444, 0, 0],
                    8467: [0, 0.69444, 0, 0.11111],
                    8472: [0.19444, 0.43056, 0, 0.11111],
                    8476: [0, 0.69444, 0, 0],
                    8501: [0, 0.69444, 0, 0],
                    8592: [-0.13313, 0.36687, 0, 0],
                    8593: [0.19444, 0.69444, 0, 0],
                    8594: [-0.13313, 0.36687, 0, 0],
                    8595: [0.19444, 0.69444, 0, 0],
                    8596: [-0.13313, 0.36687, 0, 0],
                    8597: [0.25, 0.75, 0, 0],
                    8598: [0.19444, 0.69444, 0, 0],
                    8599: [0.19444, 0.69444, 0, 0],
                    8600: [0.19444, 0.69444, 0, 0],
                    8601: [0.19444, 0.69444, 0, 0],
                    8614: [0.011, 0.511, 0, 0],
                    8617: [0.011, 0.511, 0, 0],
                    8618: [0.011, 0.511, 0, 0],
                    8636: [-0.13313, 0.36687, 0, 0],
                    8637: [-0.13313, 0.36687, 0, 0],
                    8640: [-0.13313, 0.36687, 0, 0],
                    8641: [-0.13313, 0.36687, 0, 0],
                    8652: [0.011, 0.671, 0, 0],
                    8656: [-0.13313, 0.36687, 0, 0],
                    8657: [0.19444, 0.69444, 0, 0],
                    8658: [-0.13313, 0.36687, 0, 0],
                    8659: [0.19444, 0.69444, 0, 0],
                    8660: [-0.13313, 0.36687, 0, 0],
                    8661: [0.25, 0.75, 0, 0],
                    8704: [0, 0.69444, 0, 0],
                    8706: [0, 0.69444, 0.05556, 0.08334],
                    8707: [0, 0.69444, 0, 0],
                    8709: [0.05556, 0.75, 0, 0],
                    8711: [0, 0.68333, 0, 0],
                    8712: [0.0391, 0.5391, 0, 0],
                    8715: [0.0391, 0.5391, 0, 0],
                    8722: [0.08333, 0.58333, 0, 0],
                    8723: [0.08333, 0.58333, 0, 0],
                    8725: [0.25, 0.75, 0, 0],
                    8726: [0.25, 0.75, 0, 0],
                    8727: [-0.03472, 0.46528, 0, 0],
                    8728: [-0.05555, 0.44445, 0, 0],
                    8729: [-0.05555, 0.44445, 0, 0],
                    8730: [0.2, 0.8, 0, 0],
                    8733: [0, 0.43056, 0, 0],
                    8734: [0, 0.43056, 0, 0],
                    8736: [0, 0.69224, 0, 0],
                    8739: [0.25, 0.75, 0, 0],
                    8741: [0.25, 0.75, 0, 0],
                    8743: [0, 0.55556, 0, 0],
                    8744: [0, 0.55556, 0, 0],
                    8745: [0, 0.55556, 0, 0],
                    8746: [0, 0.55556, 0, 0],
                    8747: [0.19444, 0.69444, 0.11111, 0],
                    8764: [-0.13313, 0.36687, 0, 0],
                    8768: [0.19444, 0.69444, 0, 0],
                    8771: [-0.03625, 0.46375, 0, 0],
                    8773: [-0.022, 0.589, 0, 0],
                    8776: [-0.01688, 0.48312, 0, 0],
                    8781: [-0.03625, 0.46375, 0, 0],
                    8784: [-0.133, 0.67, 0, 0],
                    8800: [0.215, 0.716, 0, 0],
                    8801: [-0.03625, 0.46375, 0, 0],
                    8804: [0.13597, 0.63597, 0, 0],
                    8805: [0.13597, 0.63597, 0, 0],
                    8810: [0.0391, 0.5391, 0, 0],
                    8811: [0.0391, 0.5391, 0, 0],
                    8826: [0.0391, 0.5391, 0, 0],
                    8827: [0.0391, 0.5391, 0, 0],
                    8834: [0.0391, 0.5391, 0, 0],
                    8835: [0.0391, 0.5391, 0, 0],
                    8838: [0.13597, 0.63597, 0, 0],
                    8839: [0.13597, 0.63597, 0, 0],
                    8846: [0, 0.55556, 0, 0],
                    8849: [0.13597, 0.63597, 0, 0],
                    8850: [0.13597, 0.63597, 0, 0],
                    8851: [0, 0.55556, 0, 0],
                    8852: [0, 0.55556, 0, 0],
                    8853: [0.08333, 0.58333, 0, 0],
                    8854: [0.08333, 0.58333, 0, 0],
                    8855: [0.08333, 0.58333, 0, 0],
                    8856: [0.08333, 0.58333, 0, 0],
                    8857: [0.08333, 0.58333, 0, 0],
                    8866: [0, 0.69444, 0, 0],
                    8867: [0, 0.69444, 0, 0],
                    8868: [0, 0.69444, 0, 0],
                    8869: [0, 0.69444, 0, 0],
                    8872: [0.249, 0.75, 0, 0],
                    8900: [-0.05555, 0.44445, 0, 0],
                    8901: [-0.05555, 0.44445, 0, 0],
                    8902: [-0.03472, 0.46528, 0, 0],
                    8904: [0.005, 0.505, 0, 0],
                    8942: [0.03, 0.9, 0, 0],
                    8943: [-0.19, 0.31, 0, 0],
                    8945: [-0.1, 0.82, 0, 0],
                    8968: [0.25, 0.75, 0, 0],
                    8969: [0.25, 0.75, 0, 0],
                    8970: [0.25, 0.75, 0, 0],
                    8971: [0.25, 0.75, 0, 0],
                    8994: [-0.14236, 0.35764, 0, 0],
                    8995: [-0.14236, 0.35764, 0, 0],
                    9136: [0.244, 0.744, 0, 0],
                    9137: [0.244, 0.744, 0, 0],
                    9651: [0.19444, 0.69444, 0, 0],
                    9657: [-0.03472, 0.46528, 0, 0],
                    9661: [0.19444, 0.69444, 0, 0],
                    9667: [-0.03472, 0.46528, 0, 0],
                    9711: [0.19444, 0.69444, 0, 0],
                    9824: [0.12963, 0.69444, 0, 0],
                    9825: [0.12963, 0.69444, 0, 0],
                    9826: [0.12963, 0.69444, 0, 0],
                    9827: [0.12963, 0.69444, 0, 0],
                    9837: [0, 0.75, 0, 0],
                    9838: [0.19444, 0.69444, 0, 0],
                    9839: [0.19444, 0.69444, 0, 0],
                    10216: [0.25, 0.75, 0, 0],
                    10217: [0.25, 0.75, 0, 0],
                    10222: [0.244, 0.744, 0, 0],
                    10223: [0.244, 0.744, 0, 0],
                    10229: [0.011, 0.511, 0, 0],
                    10230: [0.011, 0.511, 0, 0],
                    10231: [0.011, 0.511, 0, 0],
                    10232: [0.024, 0.525, 0, 0],
                    10233: [0.024, 0.525, 0, 0],
                    10234: [0.024, 0.525, 0, 0],
                    10236: [0.011, 0.511, 0, 0],
                    10815: [0, 0.68333, 0, 0],
                    10927: [0.13597, 0.63597, 0, 0],
                    10928: [0.13597, 0.63597, 0, 0],
                  },
                  "Math-BoldItalic": {
                    47: [0.19444, 0.69444, 0, 0],
                    65: [0, 0.68611, 0, 0],
                    66: [0, 0.68611, 0.04835, 0],
                    67: [0, 0.68611, 0.06979, 0],
                    68: [0, 0.68611, 0.03194, 0],
                    69: [0, 0.68611, 0.05451, 0],
                    70: [0, 0.68611, 0.15972, 0],
                    71: [0, 0.68611, 0, 0],
                    72: [0, 0.68611, 0.08229, 0],
                    73: [0, 0.68611, 0.07778, 0],
                    74: [0, 0.68611, 0.10069, 0],
                    75: [0, 0.68611, 0.06979, 0],
                    76: [0, 0.68611, 0, 0],
                    77: [0, 0.68611, 0.11424, 0],
                    78: [0, 0.68611, 0.11424, 0],
                    79: [0, 0.68611, 0.03194, 0],
                    80: [0, 0.68611, 0.15972, 0],
                    81: [0.19444, 0.68611, 0, 0],
                    82: [0, 0.68611, 0.00421, 0],
                    83: [0, 0.68611, 0.05382, 0],
                    84: [0, 0.68611, 0.15972, 0],
                    85: [0, 0.68611, 0.11424, 0],
                    86: [0, 0.68611, 0.25555, 0],
                    87: [0, 0.68611, 0.15972, 0],
                    88: [0, 0.68611, 0.07778, 0],
                    89: [0, 0.68611, 0.25555, 0],
                    90: [0, 0.68611, 0.06979, 0],
                    97: [0, 0.44444, 0, 0],
                    98: [0, 0.69444, 0, 0],
                    99: [0, 0.44444, 0, 0],
                    100: [0, 0.69444, 0, 0],
                    101: [0, 0.44444, 0, 0],
                    102: [0.19444, 0.69444, 0.11042, 0],
                    103: [0.19444, 0.44444, 0.03704, 0],
                    104: [0, 0.69444, 0, 0],
                    105: [0, 0.69326, 0, 0],
                    106: [0.19444, 0.69326, 0.0622, 0],
                    107: [0, 0.69444, 0.01852, 0],
                    108: [0, 0.69444, 0.0088, 0],
                    109: [0, 0.44444, 0, 0],
                    110: [0, 0.44444, 0, 0],
                    111: [0, 0.44444, 0, 0],
                    112: [0.19444, 0.44444, 0, 0],
                    113: [0.19444, 0.44444, 0.03704, 0],
                    114: [0, 0.44444, 0.03194, 0],
                    115: [0, 0.44444, 0, 0],
                    116: [0, 0.63492, 0, 0],
                    117: [0, 0.44444, 0, 0],
                    118: [0, 0.44444, 0.03704, 0],
                    119: [0, 0.44444, 0.02778, 0],
                    120: [0, 0.44444, 0, 0],
                    121: [0.19444, 0.44444, 0.03704, 0],
                    122: [0, 0.44444, 0.04213, 0],
                    915: [0, 0.68611, 0.15972, 0],
                    916: [0, 0.68611, 0, 0],
                    920: [0, 0.68611, 0.03194, 0],
                    923: [0, 0.68611, 0, 0],
                    926: [0, 0.68611, 0.07458, 0],
                    928: [0, 0.68611, 0.08229, 0],
                    931: [0, 0.68611, 0.05451, 0],
                    933: [0, 0.68611, 0.15972, 0],
                    934: [0, 0.68611, 0, 0],
                    936: [0, 0.68611, 0.11653, 0],
                    937: [0, 0.68611, 0.04835, 0],
                    945: [0, 0.44444, 0, 0],
                    946: [0.19444, 0.69444, 0.03403, 0],
                    947: [0.19444, 0.44444, 0.06389, 0],
                    948: [0, 0.69444, 0.03819, 0],
                    949: [0, 0.44444, 0, 0],
                    950: [0.19444, 0.69444, 0.06215, 0],
                    951: [0.19444, 0.44444, 0.03704, 0],
                    952: [0, 0.69444, 0.03194, 0],
                    953: [0, 0.44444, 0, 0],
                    954: [0, 0.44444, 0, 0],
                    955: [0, 0.69444, 0, 0],
                    956: [0.19444, 0.44444, 0, 0],
                    957: [0, 0.44444, 0.06898, 0],
                    958: [0.19444, 0.69444, 0.03021, 0],
                    959: [0, 0.44444, 0, 0],
                    960: [0, 0.44444, 0.03704, 0],
                    961: [0.19444, 0.44444, 0, 0],
                    962: [0.09722, 0.44444, 0.07917, 0],
                    963: [0, 0.44444, 0.03704, 0],
                    964: [0, 0.44444, 0.13472, 0],
                    965: [0, 0.44444, 0.03704, 0],
                    966: [0.19444, 0.44444, 0, 0],
                    967: [0.19444, 0.44444, 0, 0],
                    968: [0.19444, 0.69444, 0.03704, 0],
                    969: [0, 0.44444, 0.03704, 0],
                    977: [0, 0.69444, 0, 0],
                    981: [0.19444, 0.69444, 0, 0],
                    982: [0, 0.44444, 0.03194, 0],
                    1009: [0.19444, 0.44444, 0, 0],
                    1013: [0, 0.44444, 0, 0],
                  },
                  "Math-Italic": {
                    47: [0.19444, 0.69444, 0, 0],
                    65: [0, 0.68333, 0, 0.13889],
                    66: [0, 0.68333, 0.05017, 0.08334],
                    67: [0, 0.68333, 0.07153, 0.08334],
                    68: [0, 0.68333, 0.02778, 0.05556],
                    69: [0, 0.68333, 0.05764, 0.08334],
                    70: [0, 0.68333, 0.13889, 0.08334],
                    71: [0, 0.68333, 0, 0.08334],
                    72: [0, 0.68333, 0.08125, 0.05556],
                    73: [0, 0.68333, 0.07847, 0.11111],
                    74: [0, 0.68333, 0.09618, 0.16667],
                    75: [0, 0.68333, 0.07153, 0.05556],
                    76: [0, 0.68333, 0, 0.02778],
                    77: [0, 0.68333, 0.10903, 0.08334],
                    78: [0, 0.68333, 0.10903, 0.08334],
                    79: [0, 0.68333, 0.02778, 0.08334],
                    80: [0, 0.68333, 0.13889, 0.08334],
                    81: [0.19444, 0.68333, 0, 0.08334],
                    82: [0, 0.68333, 0.00773, 0.08334],
                    83: [0, 0.68333, 0.05764, 0.08334],
                    84: [0, 0.68333, 0.13889, 0.08334],
                    85: [0, 0.68333, 0.10903, 0.02778],
                    86: [0, 0.68333, 0.22222, 0],
                    87: [0, 0.68333, 0.13889, 0],
                    88: [0, 0.68333, 0.07847, 0.08334],
                    89: [0, 0.68333, 0.22222, 0],
                    90: [0, 0.68333, 0.07153, 0.08334],
                    97: [0, 0.43056, 0, 0],
                    98: [0, 0.69444, 0, 0],
                    99: [0, 0.43056, 0, 0.05556],
                    100: [0, 0.69444, 0, 0.16667],
                    101: [0, 0.43056, 0, 0.05556],
                    102: [0.19444, 0.69444, 0.10764, 0.16667],
                    103: [0.19444, 0.43056, 0.03588, 0.02778],
                    104: [0, 0.69444, 0, 0],
                    105: [0, 0.65952, 0, 0],
                    106: [0.19444, 0.65952, 0.05724, 0],
                    107: [0, 0.69444, 0.03148, 0],
                    108: [0, 0.69444, 0.01968, 0.08334],
                    109: [0, 0.43056, 0, 0],
                    110: [0, 0.43056, 0, 0],
                    111: [0, 0.43056, 0, 0.05556],
                    112: [0.19444, 0.43056, 0, 0.08334],
                    113: [0.19444, 0.43056, 0.03588, 0.08334],
                    114: [0, 0.43056, 0.02778, 0.05556],
                    115: [0, 0.43056, 0, 0.05556],
                    116: [0, 0.61508, 0, 0.08334],
                    117: [0, 0.43056, 0, 0.02778],
                    118: [0, 0.43056, 0.03588, 0.02778],
                    119: [0, 0.43056, 0.02691, 0.08334],
                    120: [0, 0.43056, 0, 0.02778],
                    121: [0.19444, 0.43056, 0.03588, 0.05556],
                    122: [0, 0.43056, 0.04398, 0.05556],
                    915: [0, 0.68333, 0.13889, 0.08334],
                    916: [0, 0.68333, 0, 0.16667],
                    920: [0, 0.68333, 0.02778, 0.08334],
                    923: [0, 0.68333, 0, 0.16667],
                    926: [0, 0.68333, 0.07569, 0.08334],
                    928: [0, 0.68333, 0.08125, 0.05556],
                    931: [0, 0.68333, 0.05764, 0.08334],
                    933: [0, 0.68333, 0.13889, 0.05556],
                    934: [0, 0.68333, 0, 0.08334],
                    936: [0, 0.68333, 0.11, 0.05556],
                    937: [0, 0.68333, 0.05017, 0.08334],
                    945: [0, 0.43056, 0.0037, 0.02778],
                    946: [0.19444, 0.69444, 0.05278, 0.08334],
                    947: [0.19444, 0.43056, 0.05556, 0],
                    948: [0, 0.69444, 0.03785, 0.05556],
                    949: [0, 0.43056, 0, 0.08334],
                    950: [0.19444, 0.69444, 0.07378, 0.08334],
                    951: [0.19444, 0.43056, 0.03588, 0.05556],
                    952: [0, 0.69444, 0.02778, 0.08334],
                    953: [0, 0.43056, 0, 0.05556],
                    954: [0, 0.43056, 0, 0],
                    955: [0, 0.69444, 0, 0],
                    956: [0.19444, 0.43056, 0, 0.02778],
                    957: [0, 0.43056, 0.06366, 0.02778],
                    958: [0.19444, 0.69444, 0.04601, 0.11111],
                    959: [0, 0.43056, 0, 0.05556],
                    960: [0, 0.43056, 0.03588, 0],
                    961: [0.19444, 0.43056, 0, 0.08334],
                    962: [0.09722, 0.43056, 0.07986, 0.08334],
                    963: [0, 0.43056, 0.03588, 0],
                    964: [0, 0.43056, 0.1132, 0.02778],
                    965: [0, 0.43056, 0.03588, 0.02778],
                    966: [0.19444, 0.43056, 0, 0.08334],
                    967: [0.19444, 0.43056, 0, 0.05556],
                    968: [0.19444, 0.69444, 0.03588, 0.11111],
                    969: [0, 0.43056, 0.03588, 0],
                    977: [0, 0.69444, 0, 0.08334],
                    981: [0.19444, 0.69444, 0, 0.08334],
                    982: [0, 0.43056, 0.02778, 0],
                    1009: [0.19444, 0.43056, 0, 0.08334],
                    1013: [0, 0.43056, 0, 0.05556],
                  },
                  "Math-Regular": {
                    65: [0, 0.68333, 0, 0.13889],
                    66: [0, 0.68333, 0.05017, 0.08334],
                    67: [0, 0.68333, 0.07153, 0.08334],
                    68: [0, 0.68333, 0.02778, 0.05556],
                    69: [0, 0.68333, 0.05764, 0.08334],
                    70: [0, 0.68333, 0.13889, 0.08334],
                    71: [0, 0.68333, 0, 0.08334],
                    72: [0, 0.68333, 0.08125, 0.05556],
                    73: [0, 0.68333, 0.07847, 0.11111],
                    74: [0, 0.68333, 0.09618, 0.16667],
                    75: [0, 0.68333, 0.07153, 0.05556],
                    76: [0, 0.68333, 0, 0.02778],
                    77: [0, 0.68333, 0.10903, 0.08334],
                    78: [0, 0.68333, 0.10903, 0.08334],
                    79: [0, 0.68333, 0.02778, 0.08334],
                    80: [0, 0.68333, 0.13889, 0.08334],
                    81: [0.19444, 0.68333, 0, 0.08334],
                    82: [0, 0.68333, 0.00773, 0.08334],
                    83: [0, 0.68333, 0.05764, 0.08334],
                    84: [0, 0.68333, 0.13889, 0.08334],
                    85: [0, 0.68333, 0.10903, 0.02778],
                    86: [0, 0.68333, 0.22222, 0],
                    87: [0, 0.68333, 0.13889, 0],
                    88: [0, 0.68333, 0.07847, 0.08334],
                    89: [0, 0.68333, 0.22222, 0],
                    90: [0, 0.68333, 0.07153, 0.08334],
                    97: [0, 0.43056, 0, 0],
                    98: [0, 0.69444, 0, 0],
                    99: [0, 0.43056, 0, 0.05556],
                    100: [0, 0.69444, 0, 0.16667],
                    101: [0, 0.43056, 0, 0.05556],
                    102: [0.19444, 0.69444, 0.10764, 0.16667],
                    103: [0.19444, 0.43056, 0.03588, 0.02778],
                    104: [0, 0.69444, 0, 0],
                    105: [0, 0.65952, 0, 0],
                    106: [0.19444, 0.65952, 0.05724, 0],
                    107: [0, 0.69444, 0.03148, 0],
                    108: [0, 0.69444, 0.01968, 0.08334],
                    109: [0, 0.43056, 0, 0],
                    110: [0, 0.43056, 0, 0],
                    111: [0, 0.43056, 0, 0.05556],
                    112: [0.19444, 0.43056, 0, 0.08334],
                    113: [0.19444, 0.43056, 0.03588, 0.08334],
                    114: [0, 0.43056, 0.02778, 0.05556],
                    115: [0, 0.43056, 0, 0.05556],
                    116: [0, 0.61508, 0, 0.08334],
                    117: [0, 0.43056, 0, 0.02778],
                    118: [0, 0.43056, 0.03588, 0.02778],
                    119: [0, 0.43056, 0.02691, 0.08334],
                    120: [0, 0.43056, 0, 0.02778],
                    121: [0.19444, 0.43056, 0.03588, 0.05556],
                    122: [0, 0.43056, 0.04398, 0.05556],
                    915: [0, 0.68333, 0.13889, 0.08334],
                    916: [0, 0.68333, 0, 0.16667],
                    920: [0, 0.68333, 0.02778, 0.08334],
                    923: [0, 0.68333, 0, 0.16667],
                    926: [0, 0.68333, 0.07569, 0.08334],
                    928: [0, 0.68333, 0.08125, 0.05556],
                    931: [0, 0.68333, 0.05764, 0.08334],
                    933: [0, 0.68333, 0.13889, 0.05556],
                    934: [0, 0.68333, 0, 0.08334],
                    936: [0, 0.68333, 0.11, 0.05556],
                    937: [0, 0.68333, 0.05017, 0.08334],
                    945: [0, 0.43056, 0.0037, 0.02778],
                    946: [0.19444, 0.69444, 0.05278, 0.08334],
                    947: [0.19444, 0.43056, 0.05556, 0],
                    948: [0, 0.69444, 0.03785, 0.05556],
                    949: [0, 0.43056, 0, 0.08334],
                    950: [0.19444, 0.69444, 0.07378, 0.08334],
                    951: [0.19444, 0.43056, 0.03588, 0.05556],
                    952: [0, 0.69444, 0.02778, 0.08334],
                    953: [0, 0.43056, 0, 0.05556],
                    954: [0, 0.43056, 0, 0],
                    955: [0, 0.69444, 0, 0],
                    956: [0.19444, 0.43056, 0, 0.02778],
                    957: [0, 0.43056, 0.06366, 0.02778],
                    958: [0.19444, 0.69444, 0.04601, 0.11111],
                    959: [0, 0.43056, 0, 0.05556],
                    960: [0, 0.43056, 0.03588, 0],
                    961: [0.19444, 0.43056, 0, 0.08334],
                    962: [0.09722, 0.43056, 0.07986, 0.08334],
                    963: [0, 0.43056, 0.03588, 0],
                    964: [0, 0.43056, 0.1132, 0.02778],
                    965: [0, 0.43056, 0.03588, 0.02778],
                    966: [0.19444, 0.43056, 0, 0.08334],
                    967: [0.19444, 0.43056, 0, 0.05556],
                    968: [0.19444, 0.69444, 0.03588, 0.11111],
                    969: [0, 0.43056, 0.03588, 0],
                    977: [0, 0.69444, 0, 0.08334],
                    981: [0.19444, 0.69444, 0, 0.08334],
                    982: [0, 0.43056, 0.02778, 0],
                    1009: [0.19444, 0.43056, 0, 0.08334],
                    1013: [0, 0.43056, 0, 0.05556],
                  },
                  "SansSerif-Regular": {
                    33: [0, 0.69444, 0, 0],
                    34: [0, 0.69444, 0, 0],
                    35: [0.19444, 0.69444, 0, 0],
                    36: [0.05556, 0.75, 0, 0],
                    37: [0.05556, 0.75, 0, 0],
                    38: [0, 0.69444, 0, 0],
                    39: [0, 0.69444, 0, 0],
                    40: [0.25, 0.75, 0, 0],
                    41: [0.25, 0.75, 0, 0],
                    42: [0, 0.75, 0, 0],
                    43: [0.08333, 0.58333, 0, 0],
                    44: [0.125, 0.08333, 0, 0],
                    45: [0, 0.44444, 0, 0],
                    46: [0, 0.08333, 0, 0],
                    47: [0.25, 0.75, 0, 0],
                    48: [0, 0.65556, 0, 0],
                    49: [0, 0.65556, 0, 0],
                    50: [0, 0.65556, 0, 0],
                    51: [0, 0.65556, 0, 0],
                    52: [0, 0.65556, 0, 0],
                    53: [0, 0.65556, 0, 0],
                    54: [0, 0.65556, 0, 0],
                    55: [0, 0.65556, 0, 0],
                    56: [0, 0.65556, 0, 0],
                    57: [0, 0.65556, 0, 0],
                    58: [0, 0.44444, 0, 0],
                    59: [0.125, 0.44444, 0, 0],
                    61: [-0.13, 0.37, 0, 0],
                    63: [0, 0.69444, 0, 0],
                    64: [0, 0.69444, 0, 0],
                    65: [0, 0.69444, 0, 0],
                    66: [0, 0.69444, 0, 0],
                    67: [0, 0.69444, 0, 0],
                    68: [0, 0.69444, 0, 0],
                    69: [0, 0.69444, 0, 0],
                    70: [0, 0.69444, 0, 0],
                    71: [0, 0.69444, 0, 0],
                    72: [0, 0.69444, 0, 0],
                    73: [0, 0.69444, 0, 0],
                    74: [0, 0.69444, 0, 0],
                    75: [0, 0.69444, 0, 0],
                    76: [0, 0.69444, 0, 0],
                    77: [0, 0.69444, 0, 0],
                    78: [0, 0.69444, 0, 0],
                    79: [0, 0.69444, 0, 0],
                    80: [0, 0.69444, 0, 0],
                    81: [0.125, 0.69444, 0, 0],
                    82: [0, 0.69444, 0, 0],
                    83: [0, 0.69444, 0, 0],
                    84: [0, 0.69444, 0, 0],
                    85: [0, 0.69444, 0, 0],
                    86: [0, 0.69444, 0.01389, 0],
                    87: [0, 0.69444, 0.01389, 0],
                    88: [0, 0.69444, 0, 0],
                    89: [0, 0.69444, 0.025, 0],
                    90: [0, 0.69444, 0, 0],
                    91: [0.25, 0.75, 0, 0],
                    93: [0.25, 0.75, 0, 0],
                    94: [0, 0.69444, 0, 0],
                    95: [0.35, 0.09444, 0.02778, 0],
                    97: [0, 0.44444, 0, 0],
                    98: [0, 0.69444, 0, 0],
                    99: [0, 0.44444, 0, 0],
                    100: [0, 0.69444, 0, 0],
                    101: [0, 0.44444, 0, 0],
                    102: [0, 0.69444, 0.06944, 0],
                    103: [0.19444, 0.44444, 0.01389, 0],
                    104: [0, 0.69444, 0, 0],
                    105: [0, 0.67937, 0, 0],
                    106: [0.19444, 0.67937, 0, 0],
                    107: [0, 0.69444, 0, 0],
                    108: [0, 0.69444, 0, 0],
                    109: [0, 0.44444, 0, 0],
                    110: [0, 0.44444, 0, 0],
                    111: [0, 0.44444, 0, 0],
                    112: [0.19444, 0.44444, 0, 0],
                    113: [0.19444, 0.44444, 0, 0],
                    114: [0, 0.44444, 0.01389, 0],
                    115: [0, 0.44444, 0, 0],
                    116: [0, 0.57143, 0, 0],
                    117: [0, 0.44444, 0, 0],
                    118: [0, 0.44444, 0.01389, 0],
                    119: [0, 0.44444, 0.01389, 0],
                    120: [0, 0.44444, 0, 0],
                    121: [0.19444, 0.44444, 0.01389, 0],
                    122: [0, 0.44444, 0, 0],
                    126: [0.35, 0.32659, 0, 0],
                    305: [0, 0.44444, 0, 0],
                    567: [0.19444, 0.44444, 0, 0],
                    768: [0, 0.69444, 0, 0],
                    769: [0, 0.69444, 0, 0],
                    770: [0, 0.69444, 0, 0],
                    771: [0, 0.67659, 0, 0],
                    772: [0, 0.60889, 0, 0],
                    774: [0, 0.69444, 0, 0],
                    775: [0, 0.67937, 0, 0],
                    776: [0, 0.67937, 0, 0],
                    778: [0, 0.69444, 0, 0],
                    779: [0, 0.69444, 0, 0],
                    780: [0, 0.63194, 0, 0],
                    915: [0, 0.69444, 0, 0],
                    916: [0, 0.69444, 0, 0],
                    920: [0, 0.69444, 0, 0],
                    923: [0, 0.69444, 0, 0],
                    926: [0, 0.69444, 0, 0],
                    928: [0, 0.69444, 0, 0],
                    931: [0, 0.69444, 0, 0],
                    933: [0, 0.69444, 0, 0],
                    934: [0, 0.69444, 0, 0],
                    936: [0, 0.69444, 0, 0],
                    937: [0, 0.69444, 0, 0],
                    8211: [0, 0.44444, 0.02778, 0],
                    8212: [0, 0.44444, 0.02778, 0],
                    8216: [0, 0.69444, 0, 0],
                    8217: [0, 0.69444, 0, 0],
                    8220: [0, 0.69444, 0, 0],
                    8221: [0, 0.69444, 0, 0],
                  },
                  "Script-Regular": {
                    65: [0, 0.7, 0.22925, 0],
                    66: [0, 0.7, 0.04087, 0],
                    67: [0, 0.7, 0.1689, 0],
                    68: [0, 0.7, 0.09371, 0],
                    69: [0, 0.7, 0.18583, 0],
                    70: [0, 0.7, 0.13634, 0],
                    71: [0, 0.7, 0.17322, 0],
                    72: [0, 0.7, 0.29694, 0],
                    73: [0, 0.7, 0.19189, 0],
                    74: [0.27778, 0.7, 0.19189, 0],
                    75: [0, 0.7, 0.31259, 0],
                    76: [0, 0.7, 0.19189, 0],
                    77: [0, 0.7, 0.15981, 0],
                    78: [0, 0.7, 0.3525, 0],
                    79: [0, 0.7, 0.08078, 0],
                    80: [0, 0.7, 0.08078, 0],
                    81: [0, 0.7, 0.03305, 0],
                    82: [0, 0.7, 0.06259, 0],
                    83: [0, 0.7, 0.19189, 0],
                    84: [0, 0.7, 0.29087, 0],
                    85: [0, 0.7, 0.25815, 0],
                    86: [0, 0.7, 0.27523, 0],
                    87: [0, 0.7, 0.27523, 0],
                    88: [0, 0.7, 0.26006, 0],
                    89: [0, 0.7, 0.2939, 0],
                    90: [0, 0.7, 0.24037, 0],
                  },
                  "Size1-Regular": {
                    40: [0.35001, 0.85, 0, 0],
                    41: [0.35001, 0.85, 0, 0],
                    47: [0.35001, 0.85, 0, 0],
                    91: [0.35001, 0.85, 0, 0],
                    92: [0.35001, 0.85, 0, 0],
                    93: [0.35001, 0.85, 0, 0],
                    123: [0.35001, 0.85, 0, 0],
                    125: [0.35001, 0.85, 0, 0],
                    710: [0, 0.72222, 0, 0],
                    732: [0, 0.72222, 0, 0],
                    770: [0, 0.72222, 0, 0],
                    771: [0, 0.72222, 0, 0],
                    8214: [-0.00099, 0.601, 0, 0],
                    8593: [0.00001, 0.6, 0, 0],
                    8595: [0.00001, 0.6, 0, 0],
                    8657: [0.00001, 0.6, 0, 0],
                    8659: [0.00001, 0.6, 0, 0],
                    8719: [0.25001, 0.75, 0, 0],
                    8720: [0.25001, 0.75, 0, 0],
                    8721: [0.25001, 0.75, 0, 0],
                    8730: [0.35001, 0.85, 0, 0],
                    8739: [-0.00599, 0.606, 0, 0],
                    8741: [-0.00599, 0.606, 0, 0],
                    8747: [0.30612, 0.805, 0.19445, 0],
                    8748: [0.306, 0.805, 0.19445, 0],
                    8749: [0.306, 0.805, 0.19445, 0],
                    8750: [0.30612, 0.805, 0.19445, 0],
                    8896: [0.25001, 0.75, 0, 0],
                    8897: [0.25001, 0.75, 0, 0],
                    8898: [0.25001, 0.75, 0, 0],
                    8899: [0.25001, 0.75, 0, 0],
                    8968: [0.35001, 0.85, 0, 0],
                    8969: [0.35001, 0.85, 0, 0],
                    8970: [0.35001, 0.85, 0, 0],
                    8971: [0.35001, 0.85, 0, 0],
                    9168: [-0.00099, 0.601, 0, 0],
                    10216: [0.35001, 0.85, 0, 0],
                    10217: [0.35001, 0.85, 0, 0],
                    10752: [0.25001, 0.75, 0, 0],
                    10753: [0.25001, 0.75, 0, 0],
                    10754: [0.25001, 0.75, 0, 0],
                    10756: [0.25001, 0.75, 0, 0],
                    10758: [0.25001, 0.75, 0, 0],
                  },
                  "Size2-Regular": {
                    40: [0.65002, 1.15, 0, 0],
                    41: [0.65002, 1.15, 0, 0],
                    47: [0.65002, 1.15, 0, 0],
                    91: [0.65002, 1.15, 0, 0],
                    92: [0.65002, 1.15, 0, 0],
                    93: [0.65002, 1.15, 0, 0],
                    123: [0.65002, 1.15, 0, 0],
                    125: [0.65002, 1.15, 0, 0],
                    710: [0, 0.75, 0, 0],
                    732: [0, 0.75, 0, 0],
                    770: [0, 0.75, 0, 0],
                    771: [0, 0.75, 0, 0],
                    8719: [0.55001, 1.05, 0, 0],
                    8720: [0.55001, 1.05, 0, 0],
                    8721: [0.55001, 1.05, 0, 0],
                    8730: [0.65002, 1.15, 0, 0],
                    8747: [0.86225, 1.36, 0.44445, 0],
                    8748: [0.862, 1.36, 0.44445, 0],
                    8749: [0.862, 1.36, 0.44445, 0],
                    8750: [0.86225, 1.36, 0.44445, 0],
                    8896: [0.55001, 1.05, 0, 0],
                    8897: [0.55001, 1.05, 0, 0],
                    8898: [0.55001, 1.05, 0, 0],
                    8899: [0.55001, 1.05, 0, 0],
                    8968: [0.65002, 1.15, 0, 0],
                    8969: [0.65002, 1.15, 0, 0],
                    8970: [0.65002, 1.15, 0, 0],
                    8971: [0.65002, 1.15, 0, 0],
                    10216: [0.65002, 1.15, 0, 0],
                    10217: [0.65002, 1.15, 0, 0],
                    10752: [0.55001, 1.05, 0, 0],
                    10753: [0.55001, 1.05, 0, 0],
                    10754: [0.55001, 1.05, 0, 0],
                    10756: [0.55001, 1.05, 0, 0],
                    10758: [0.55001, 1.05, 0, 0],
                  },
                  "Size3-Regular": {
                    40: [0.95003, 1.45, 0, 0],
                    41: [0.95003, 1.45, 0, 0],
                    47: [0.95003, 1.45, 0, 0],
                    91: [0.95003, 1.45, 0, 0],
                    92: [0.95003, 1.45, 0, 0],
                    93: [0.95003, 1.45, 0, 0],
                    123: [0.95003, 1.45, 0, 0],
                    125: [0.95003, 1.45, 0, 0],
                    710: [0, 0.75, 0, 0],
                    732: [0, 0.75, 0, 0],
                    770: [0, 0.75, 0, 0],
                    771: [0, 0.75, 0, 0],
                    8730: [0.95003, 1.45, 0, 0],
                    8968: [0.95003, 1.45, 0, 0],
                    8969: [0.95003, 1.45, 0, 0],
                    8970: [0.95003, 1.45, 0, 0],
                    8971: [0.95003, 1.45, 0, 0],
                    10216: [0.95003, 1.45, 0, 0],
                    10217: [0.95003, 1.45, 0, 0],
                  },
                  "Size4-Regular": {
                    40: [1.25003, 1.75, 0, 0],
                    41: [1.25003, 1.75, 0, 0],
                    47: [1.25003, 1.75, 0, 0],
                    91: [1.25003, 1.75, 0, 0],
                    92: [1.25003, 1.75, 0, 0],
                    93: [1.25003, 1.75, 0, 0],
                    123: [1.25003, 1.75, 0, 0],
                    125: [1.25003, 1.75, 0, 0],
                    710: [0, 0.825, 0, 0],
                    732: [0, 0.825, 0, 0],
                    770: [0, 0.825, 0, 0],
                    771: [0, 0.825, 0, 0],
                    8730: [1.25003, 1.75, 0, 0],
                    8968: [1.25003, 1.75, 0, 0],
                    8969: [1.25003, 1.75, 0, 0],
                    8970: [1.25003, 1.75, 0, 0],
                    8971: [1.25003, 1.75, 0, 0],
                    9115: [0.64502, 1.155, 0, 0],
                    9116: [0.00001, 0.6, 0, 0],
                    9117: [0.64502, 1.155, 0, 0],
                    9118: [0.64502, 1.155, 0, 0],
                    9119: [0.00001, 0.6, 0, 0],
                    9120: [0.64502, 1.155, 0, 0],
                    9121: [0.64502, 1.155, 0, 0],
                    9122: [-0.00099, 0.601, 0, 0],
                    9123: [0.64502, 1.155, 0, 0],
                    9124: [0.64502, 1.155, 0, 0],
                    9125: [-0.00099, 0.601, 0, 0],
                    9126: [0.64502, 1.155, 0, 0],
                    9127: [0.00001, 0.9, 0, 0],
                    9128: [0.65002, 1.15, 0, 0],
                    9129: [0.90001, 0, 0, 0],
                    9130: [0, 0.3, 0, 0],
                    9131: [0.00001, 0.9, 0, 0],
                    9132: [0.65002, 1.15, 0, 0],
                    9133: [0.90001, 0, 0, 0],
                    9143: [0.88502, 0.915, 0, 0],
                    10216: [1.25003, 1.75, 0, 0],
                    10217: [1.25003, 1.75, 0, 0],
                    57344: [-0.00499, 0.605, 0, 0],
                    57345: [-0.00499, 0.605, 0, 0],
                    57680: [0, 0.12, 0, 0],
                    57681: [0, 0.12, 0, 0],
                    57682: [0, 0.12, 0, 0],
                    57683: [0, 0.12, 0, 0],
                  },
                  "Typewriter-Regular": {
                    33: [0, 0.61111, 0, 0],
                    34: [0, 0.61111, 0, 0],
                    35: [0, 0.61111, 0, 0],
                    36: [0.08333, 0.69444, 0, 0],
                    37: [0.08333, 0.69444, 0, 0],
                    38: [0, 0.61111, 0, 0],
                    39: [0, 0.61111, 0, 0],
                    40: [0.08333, 0.69444, 0, 0],
                    41: [0.08333, 0.69444, 0, 0],
                    42: [0, 0.52083, 0, 0],
                    43: [-0.08056, 0.53055, 0, 0],
                    44: [0.13889, 0.125, 0, 0],
                    45: [-0.08056, 0.53055, 0, 0],
                    46: [0, 0.125, 0, 0],
                    47: [0.08333, 0.69444, 0, 0],
                    48: [0, 0.61111, 0, 0],
                    49: [0, 0.61111, 0, 0],
                    50: [0, 0.61111, 0, 0],
                    51: [0, 0.61111, 0, 0],
                    52: [0, 0.61111, 0, 0],
                    53: [0, 0.61111, 0, 0],
                    54: [0, 0.61111, 0, 0],
                    55: [0, 0.61111, 0, 0],
                    56: [0, 0.61111, 0, 0],
                    57: [0, 0.61111, 0, 0],
                    58: [0, 0.43056, 0, 0],
                    59: [0.13889, 0.43056, 0, 0],
                    60: [-0.05556, 0.55556, 0, 0],
                    61: [-0.19549, 0.41562, 0, 0],
                    62: [-0.05556, 0.55556, 0, 0],
                    63: [0, 0.61111, 0, 0],
                    64: [0, 0.61111, 0, 0],
                    65: [0, 0.61111, 0, 0],
                    66: [0, 0.61111, 0, 0],
                    67: [0, 0.61111, 0, 0],
                    68: [0, 0.61111, 0, 0],
                    69: [0, 0.61111, 0, 0],
                    70: [0, 0.61111, 0, 0],
                    71: [0, 0.61111, 0, 0],
                    72: [0, 0.61111, 0, 0],
                    73: [0, 0.61111, 0, 0],
                    74: [0, 0.61111, 0, 0],
                    75: [0, 0.61111, 0, 0],
                    76: [0, 0.61111, 0, 0],
                    77: [0, 0.61111, 0, 0],
                    78: [0, 0.61111, 0, 0],
                    79: [0, 0.61111, 0, 0],
                    80: [0, 0.61111, 0, 0],
                    81: [0.13889, 0.61111, 0, 0],
                    82: [0, 0.61111, 0, 0],
                    83: [0, 0.61111, 0, 0],
                    84: [0, 0.61111, 0, 0],
                    85: [0, 0.61111, 0, 0],
                    86: [0, 0.61111, 0, 0],
                    87: [0, 0.61111, 0, 0],
                    88: [0, 0.61111, 0, 0],
                    89: [0, 0.61111, 0, 0],
                    90: [0, 0.61111, 0, 0],
                    91: [0.08333, 0.69444, 0, 0],
                    92: [0.08333, 0.69444, 0, 0],
                    93: [0.08333, 0.69444, 0, 0],
                    94: [0, 0.61111, 0, 0],
                    95: [0.09514, 0, 0, 0],
                    96: [0, 0.61111, 0, 0],
                    97: [0, 0.43056, 0, 0],
                    98: [0, 0.61111, 0, 0],
                    99: [0, 0.43056, 0, 0],
                    100: [0, 0.61111, 0, 0],
                    101: [0, 0.43056, 0, 0],
                    102: [0, 0.61111, 0, 0],
                    103: [0.22222, 0.43056, 0, 0],
                    104: [0, 0.61111, 0, 0],
                    105: [0, 0.61111, 0, 0],
                    106: [0.22222, 0.61111, 0, 0],
                    107: [0, 0.61111, 0, 0],
                    108: [0, 0.61111, 0, 0],
                    109: [0, 0.43056, 0, 0],
                    110: [0, 0.43056, 0, 0],
                    111: [0, 0.43056, 0, 0],
                    112: [0.22222, 0.43056, 0, 0],
                    113: [0.22222, 0.43056, 0, 0],
                    114: [0, 0.43056, 0, 0],
                    115: [0, 0.43056, 0, 0],
                    116: [0, 0.55358, 0, 0],
                    117: [0, 0.43056, 0, 0],
                    118: [0, 0.43056, 0, 0],
                    119: [0, 0.43056, 0, 0],
                    120: [0, 0.43056, 0, 0],
                    121: [0.22222, 0.43056, 0, 0],
                    122: [0, 0.43056, 0, 0],
                    123: [0.08333, 0.69444, 0, 0],
                    124: [0.08333, 0.69444, 0, 0],
                    125: [0.08333, 0.69444, 0, 0],
                    126: [0, 0.61111, 0, 0],
                    127: [0, 0.61111, 0, 0],
                    305: [0, 0.43056, 0, 0],
                    567: [0.22222, 0.43056, 0, 0],
                    768: [0, 0.61111, 0, 0],
                    769: [0, 0.61111, 0, 0],
                    770: [0, 0.61111, 0, 0],
                    771: [0, 0.61111, 0, 0],
                    772: [0, 0.56555, 0, 0],
                    774: [0, 0.61111, 0, 0],
                    776: [0, 0.61111, 0, 0],
                    778: [0, 0.61111, 0, 0],
                    780: [0, 0.56597, 0, 0],
                    915: [0, 0.61111, 0, 0],
                    916: [0, 0.61111, 0, 0],
                    920: [0, 0.61111, 0, 0],
                    923: [0, 0.61111, 0, 0],
                    926: [0, 0.61111, 0, 0],
                    928: [0, 0.61111, 0, 0],
                    931: [0, 0.61111, 0, 0],
                    933: [0, 0.61111, 0, 0],
                    934: [0, 0.61111, 0, 0],
                    936: [0, 0.61111, 0, 0],
                    937: [0, 0.61111, 0, 0],
                    2018: [0, 0.61111, 0, 0],
                    2019: [0, 0.61111, 0, 0],
                    8242: [0, 0.61111, 0, 0],
                  },
                };
              },
              {},
            ],
            43: [
              function (e, t) {
                function a(e) {
                  return e && e.__esModule ? e : { default: e };
                }
                function i(e, a, l) {
                  "string" == typeof e && (e = [e]),
                    "number" == typeof a && (a = { numArgs: a });
                  for (
                    var r = {
                        numArgs: a.numArgs,
                        argTypes: a.argTypes,
                        greediness: a.greediness === void 0 ? 1 : a.greediness,
                        allowedInText: !!a.allowedInText,
                        allowedInMath: a.allowedInMath,
                        numOptionalArgs: a.numOptionalArgs || 0,
                        infix: !!a.infix,
                        handler: l,
                      },
                      n = 0;
                    n < e.length;
                    ++n
                  )
                    t.exports[e[n]] = r;
                }
                var l = e("./utils"),
                  r = a(l),
                  n = e("./ParseError"),
                  s = a(n),
                  o = e("./ParseNode"),
                  d = a(o),
                  u = function (e) {
                    return "ordgroup" === e.type ? e.value : [e];
                  };
                i(
                  "\\sqrt",
                  { numArgs: 1, numOptionalArgs: 1 },
                  function (e, t) {
                    var a = t[0],
                      i = t[1];
                    return { type: "sqrt", body: i, index: a };
                  },
                );
                var p = {
                  "\\text": void 0,
                  "\\textrm": "mathrm",
                  "\\textsf": "mathsf",
                  "\\texttt": "mathtt",
                  "\\textnormal": "mathrm",
                  "\\textbf": "mathbf",
                  "\\textit": "textit",
                };
                i(
                  [
                    "\\text",
                    "\\textrm",
                    "\\textsf",
                    "\\texttt",
                    "\\textnormal",
                    "\\textbf",
                    "\\textit",
                  ],
                  {
                    numArgs: 1,
                    argTypes: ["text"],
                    greediness: 2,
                    allowedInText: !0,
                  },
                  function (e, t) {
                    var a = t[0];
                    return { type: "text", body: u(a), style: p[e.funcName] };
                  },
                ),
                  i(
                    "\\textcolor",
                    {
                      numArgs: 2,
                      allowedInText: !0,
                      greediness: 3,
                      argTypes: ["color", "original"],
                    },
                    function (e, t) {
                      var a = t[0],
                        i = t[1];
                      return { type: "color", color: a.value, value: u(i) };
                    },
                  ),
                  i(
                    "\\color",
                    {
                      numArgs: 1,
                      allowedInText: !0,
                      greediness: 3,
                      argTypes: ["color"],
                    },
                    null,
                  ),
                  i("\\overline", { numArgs: 1 }, function (e, t) {
                    var a = t[0];
                    return { type: "overline", body: a };
                  }),
                  i("\\underline", { numArgs: 1 }, function (e, t) {
                    var a = t[0];
                    return { type: "underline", body: a };
                  }),
                  i(
                    "\\rule",
                    {
                      numArgs: 2,
                      numOptionalArgs: 1,
                      argTypes: ["size", "size", "size"],
                    },
                    function (e, t) {
                      var a = t[0],
                        i = t[1],
                        l = t[2];
                      return {
                        type: "rule",
                        shift: a && a.value,
                        width: i.value,
                        height: l.value,
                      };
                    },
                  ),
                  i(
                    ["\\kern", "\\mkern"],
                    { numArgs: 1, argTypes: ["size"] },
                    function (e, t) {
                      return { type: "kern", dimension: t[0].value };
                    },
                  ),
                  i("\\KaTeX", { numArgs: 0 }, function () {
                    return { type: "katex" };
                  }),
                  i("\\phantom", { numArgs: 1 }, function (e, t) {
                    var a = t[0];
                    return { type: "phantom", value: u(a) };
                  }),
                  i(
                    [
                      "\\mathord",
                      "\\mathbin",
                      "\\mathrel",
                      "\\mathopen",
                      "\\mathclose",
                      "\\mathpunct",
                      "\\mathinner",
                    ],
                    { numArgs: 1 },
                    function (e, t) {
                      var a = t[0];
                      return {
                        type: "mclass",
                        mclass: "m" + e.funcName.substr(5),
                        value: u(a),
                      };
                    },
                  ),
                  i("\\stackrel", { numArgs: 2 }, function (e, t) {
                    var a = t[0],
                      i = t[1],
                      l = new d.default(
                        "op",
                        {
                          type: "op",
                          limits: !0,
                          alwaysHandleSupSub: !0,
                          symbol: !1,
                          value: u(i),
                        },
                        i.mode,
                      ),
                      r = new d.default(
                        "supsub",
                        { base: l, sup: a, sub: null },
                        a.mode,
                      );
                    return { type: "mclass", mclass: "mrel", value: [r] };
                  }),
                  i("\\bmod", { numArgs: 0 }, function () {
                    return { type: "mod", modType: "bmod", value: null };
                  }),
                  i(
                    ["\\pod", "\\pmod", "\\mod"],
                    { numArgs: 1 },
                    function (e, t) {
                      var a = t[0];
                      return {
                        type: "mod",
                        modType: e.funcName.substr(1),
                        value: u(a),
                      };
                    },
                  );
                var c = {
                    "\\bigl": { mclass: "mopen", size: 1 },
                    "\\Bigl": { mclass: "mopen", size: 2 },
                    "\\biggl": { mclass: "mopen", size: 3 },
                    "\\Biggl": { mclass: "mopen", size: 4 },
                    "\\bigr": { mclass: "mclose", size: 1 },
                    "\\Bigr": { mclass: "mclose", size: 2 },
                    "\\biggr": { mclass: "mclose", size: 3 },
                    "\\Biggr": { mclass: "mclose", size: 4 },
                    "\\bigm": { mclass: "mrel", size: 1 },
                    "\\Bigm": { mclass: "mrel", size: 2 },
                    "\\biggm": { mclass: "mrel", size: 3 },
                    "\\Biggm": { mclass: "mrel", size: 4 },
                    "\\big": { mclass: "mord", size: 1 },
                    "\\Big": { mclass: "mord", size: 2 },
                    "\\bigg": { mclass: "mord", size: 3 },
                    "\\Bigg": { mclass: "mord", size: 4 },
                  },
                  m = [
                    "(",
                    ")",
                    "[",
                    "\\lbrack",
                    "]",
                    "\\rbrack",
                    "\\{",
                    "\\lbrace",
                    "\\}",
                    "\\rbrace",
                    "\\lfloor",
                    "\\rfloor",
                    "\\lceil",
                    "\\rceil",
                    "<",
                    ">",
                    "\\langle",
                    "\\rangle",
                    "\\lt",
                    "\\gt",
                    "\\lvert",
                    "\\rvert",
                    "\\lVert",
                    "\\rVert",
                    "\\lgroup",
                    "\\rgroup",
                    "\\lmoustache",
                    "\\rmoustache",
                    "/",
                    "\\backslash",
                    "|",
                    "\\vert",
                    "\\|",
                    "\\Vert",
                    "\\uparrow",
                    "\\Uparrow",
                    "\\downarrow",
                    "\\Downarrow",
                    "\\updownarrow",
                    "\\Updownarrow",
                    ".",
                  ],
                  h = {
                    "\\Bbb": "\\mathbb",
                    "\\bold": "\\mathbf",
                    "\\frak": "\\mathfrak",
                  };
                i(
                  [
                    "\\blue",
                    "\\orange",
                    "\\pink",
                    "\\red",
                    "\\green",
                    "\\gray",
                    "\\purple",
                    "\\blueA",
                    "\\blueB",
                    "\\blueC",
                    "\\blueD",
                    "\\blueE",
                    "\\tealA",
                    "\\tealB",
                    "\\tealC",
                    "\\tealD",
                    "\\tealE",
                    "\\greenA",
                    "\\greenB",
                    "\\greenC",
                    "\\greenD",
                    "\\greenE",
                    "\\goldA",
                    "\\goldB",
                    "\\goldC",
                    "\\goldD",
                    "\\goldE",
                    "\\redA",
                    "\\redB",
                    "\\redC",
                    "\\redD",
                    "\\redE",
                    "\\maroonA",
                    "\\maroonB",
                    "\\maroonC",
                    "\\maroonD",
                    "\\maroonE",
                    "\\purpleA",
                    "\\purpleB",
                    "\\purpleC",
                    "\\purpleD",
                    "\\purpleE",
                    "\\mintA",
                    "\\mintB",
                    "\\mintC",
                    "\\grayA",
                    "\\grayB",
                    "\\grayC",
                    "\\grayD",
                    "\\grayE",
                    "\\grayF",
                    "\\grayG",
                    "\\grayH",
                    "\\grayI",
                    "\\kaBlue",
                    "\\kaGreen",
                  ],
                  { numArgs: 1, allowedInText: !0, greediness: 3 },
                  function (e, t) {
                    var a = t[0];
                    return {
                      type: "color",
                      color: "katex-" + e.funcName.slice(1),
                      value: u(a),
                    };
                  },
                ),
                  i(
                    [
                      "\\arcsin",
                      "\\arccos",
                      "\\arctan",
                      "\\arctg",
                      "\\arcctg",
                      "\\arg",
                      "\\ch",
                      "\\cos",
                      "\\cosec",
                      "\\cosh",
                      "\\cot",
                      "\\cotg",
                      "\\coth",
                      "\\csc",
                      "\\ctg",
                      "\\cth",
                      "\\deg",
                      "\\dim",
                      "\\exp",
                      "\\hom",
                      "\\ker",
                      "\\lg",
                      "\\ln",
                      "\\log",
                      "\\sec",
                      "\\sin",
                      "\\sinh",
                      "\\sh",
                      "\\tan",
                      "\\tanh",
                      "\\tg",
                      "\\th",
                    ],
                    { numArgs: 0 },
                    function (e) {
                      return {
                        type: "op",
                        limits: !1,
                        symbol: !1,
                        body: e.funcName,
                      };
                    },
                  ),
                  i(
                    [
                      "\\det",
                      "\\gcd",
                      "\\inf",
                      "\\lim",
                      "\\liminf",
                      "\\limsup",
                      "\\max",
                      "\\min",
                      "\\Pr",
                      "\\sup",
                    ],
                    { numArgs: 0 },
                    function (e) {
                      return {
                        type: "op",
                        limits: !0,
                        symbol: !1,
                        body: e.funcName,
                      };
                    },
                  ),
                  i(
                    ["\\int", "\\iint", "\\iiint", "\\oint"],
                    { numArgs: 0 },
                    function (e) {
                      return {
                        type: "op",
                        limits: !1,
                        symbol: !0,
                        body: e.funcName,
                      };
                    },
                  ),
                  i(
                    [
                      "\\coprod",
                      "\\bigvee",
                      "\\bigwedge",
                      "\\biguplus",
                      "\\bigcap",
                      "\\bigcup",
                      "\\intop",
                      "\\prod",
                      "\\sum",
                      "\\bigotimes",
                      "\\bigoplus",
                      "\\bigodot",
                      "\\bigsqcup",
                      "\\smallint",
                    ],
                    { numArgs: 0 },
                    function (e) {
                      return {
                        type: "op",
                        limits: !0,
                        symbol: !0,
                        body: e.funcName,
                      };
                    },
                  ),
                  i("\\mathop", { numArgs: 1 }, function (e, t) {
                    var a = t[0];
                    return { type: "op", limits: !1, symbol: !1, value: u(a) };
                  }),
                  i(
                    [
                      "\\dfrac",
                      "\\frac",
                      "\\tfrac",
                      "\\dbinom",
                      "\\binom",
                      "\\tbinom",
                      "\\\\atopfrac",
                    ],
                    { numArgs: 2, greediness: 2 },
                    function (e, t) {
                      var a = t[0],
                        i = t[1],
                        l = null,
                        r = null,
                        n = "auto",
                        s;
                      switch (e.funcName) {
                        case "\\dfrac":
                        case "\\frac":
                        case "\\tfrac":
                          s = !0;
                          break;
                        case "\\\\atopfrac":
                          s = !1;
                          break;
                        case "\\dbinom":
                        case "\\binom":
                        case "\\tbinom":
                          (s = !1), (l = "("), (r = ")");
                          break;
                        default:
                          throw new Error("Unrecognized genfrac command");
                      }
                      switch (e.funcName) {
                        case "\\dfrac":
                        case "\\dbinom":
                          n = "display";
                          break;
                        case "\\tfrac":
                        case "\\tbinom":
                          n = "text";
                      }
                      return {
                        type: "genfrac",
                        numer: a,
                        denom: i,
                        hasBarLine: s,
                        leftDelim: l,
                        rightDelim: r,
                        size: n,
                      };
                    },
                  ),
                  i(
                    ["\\llap", "\\rlap"],
                    { numArgs: 1, allowedInText: !0 },
                    function (e, t) {
                      var a = t[0];
                      return { type: e.funcName.slice(1), body: a };
                    },
                  );
                var g = function (e, t) {
                  if (r.default.contains(m, e.value)) return e;
                  throw new s.default(
                    "Invalid delimiter: '" +
                      e.value +
                      "' after '" +
                      t.funcName +
                      "'",
                    e,
                  );
                };
                i(
                  [
                    "\\bigl",
                    "\\Bigl",
                    "\\biggl",
                    "\\Biggl",
                    "\\bigr",
                    "\\Bigr",
                    "\\biggr",
                    "\\Biggr",
                    "\\bigm",
                    "\\Bigm",
                    "\\biggm",
                    "\\Biggm",
                    "\\big",
                    "\\Big",
                    "\\bigg",
                    "\\Bigg",
                  ],
                  { numArgs: 1 },
                  function (e, t) {
                    var a = g(t[0], e);
                    return {
                      type: "delimsizing",
                      size: c[e.funcName].size,
                      mclass: c[e.funcName].mclass,
                      value: a.value,
                    };
                  },
                ),
                  i(["\\left", "\\right"], { numArgs: 1 }, function (e, t) {
                    var a = g(t[0], e);
                    return { type: "leftright", value: a.value };
                  }),
                  i("\\middle", { numArgs: 1 }, function (e, t) {
                    var a = g(t[0], e);
                    if (!e.parser.leftrightDepth)
                      throw new s.default(
                        "\\middle without preceding \\left",
                        a,
                      );
                    return { type: "middle", value: a.value };
                  }),
                  i(
                    [
                      "\\tiny",
                      "\\scriptsize",
                      "\\footnotesize",
                      "\\small",
                      "\\normalsize",
                      "\\large",
                      "\\Large",
                      "\\LARGE",
                      "\\huge",
                      "\\Huge",
                    ],
                    0,
                    null,
                  ),
                  i(
                    [
                      "\\displaystyle",
                      "\\textstyle",
                      "\\scriptstyle",
                      "\\scriptscriptstyle",
                    ],
                    0,
                    null,
                  ),
                  i(["\\rm", "\\sf", "\\tt", "\\bf", "\\it"], 0, null),
                  i(
                    [
                      "\\mathrm",
                      "\\mathit",
                      "\\mathbf",
                      "\\mathbb",
                      "\\mathcal",
                      "\\mathfrak",
                      "\\mathscr",
                      "\\mathsf",
                      "\\mathtt",
                      "\\Bbb",
                      "\\bold",
                      "\\frak",
                    ],
                    { numArgs: 1, greediness: 2 },
                    function (e, t) {
                      var a = t[0],
                        i = e.funcName;
                      return (
                        i in h && (i = h[i]),
                        { type: "font", font: i.slice(1), body: a }
                      );
                    },
                  ),
                  i(
                    [
                      "\\acute",
                      "\\grave",
                      "\\ddot",
                      "\\tilde",
                      "\\bar",
                      "\\breve",
                      "\\check",
                      "\\hat",
                      "\\vec",
                      "\\dot",
                      "\\widehat",
                      "\\widetilde",
                      "\\overrightarrow",
                      "\\overleftarrow",
                      "\\Overrightarrow",
                      "\\overleftrightarrow",
                      "\\overgroup",
                      "\\overlinesegment",
                      "\\overleftharpoon",
                      "\\overrightharpoon",
                    ],
                    { numArgs: 1 },
                    function (e, t) {
                      var a = t[0],
                        i = !r.default.contains(
                          [
                            "\\acute",
                            "\\grave",
                            "\\ddot",
                            "\\tilde",
                            "\\bar",
                            "\\breve",
                            "\\check",
                            "\\hat",
                            "\\vec",
                            "\\dot",
                          ],
                          e.funcName,
                        ),
                        l =
                          !i ||
                          r.default.contains(
                            ["\\widehat", "\\widetilde"],
                            e.funcName,
                          );
                      return {
                        type: "accent",
                        label: e.funcName,
                        isStretchy: i,
                        isShifty: l,
                        value: u(a),
                        base: a,
                      };
                    },
                  ),
                  i(
                    [
                      "\\'",
                      "\\`",
                      "\\^",
                      "\\~",
                      "\\=",
                      "\\u",
                      "\\.",
                      '\\"',
                      "\\r",
                      "\\H",
                      "\\v",
                    ],
                    { numArgs: 1, allowedInText: !0, allowedInMath: !1 },
                    function (e, t) {
                      var a = t[0];
                      return {
                        type: "accent",
                        label: e.funcName,
                        isStretchy: !1,
                        isShifty: !0,
                        value: u(a),
                        base: a,
                      };
                    },
                  ),
                  i(
                    ["\\overbrace", "\\underbrace"],
                    { numArgs: 1 },
                    function (e, t) {
                      var a = t[0];
                      return {
                        type: "horizBrace",
                        label: e.funcName,
                        isOver: /^\\over/.test(e.funcName),
                        base: a,
                      };
                    },
                  ),
                  i(
                    [
                      "\\underleftarrow",
                      "\\underrightarrow",
                      "\\underleftrightarrow",
                      "\\undergroup",
                      "\\underlinesegment",
                      "\\undertilde",
                    ],
                    { numArgs: 1 },
                    function (e, t) {
                      var a = t[0];
                      return {
                        type: "accentUnder",
                        label: e.funcName,
                        value: u(a),
                        body: a,
                      };
                    },
                  ),
                  i(
                    [
                      "\\xleftarrow",
                      "\\xrightarrow",
                      "\\xLeftarrow",
                      "\\xRightarrow",
                      "\\xleftrightarrow",
                      "\\xLeftrightarrow",
                      "\\xhookleftarrow",
                      "\\xhookrightarrow",
                      "\\xmapsto",
                      "\\xrightharpoondown",
                      "\\xrightharpoonup",
                      "\\xleftharpoondown",
                      "\\xleftharpoonup",
                      "\\xrightleftharpoons",
                      "\\xleftrightharpoons",
                      "\\xLongequal",
                      "\\xtwoheadrightarrow",
                      "\\xtwoheadleftarrow",
                      "\\xLongequal",
                      "\\xtofrom",
                    ],
                    { numArgs: 1, numOptionalArgs: 1 },
                    function (e, t) {
                      var a = t[0],
                        i = t[1];
                      return {
                        type: "xArrow",
                        label: e.funcName,
                        body: i,
                        below: a,
                      };
                    },
                  ),
                  i(
                    ["\\cancel", "\\bcancel", "\\xcancel", "\\sout", "\\fbox"],
                    { numArgs: 1 },
                    function (e, t) {
                      var a = t[0];
                      return { type: "enclose", label: e.funcName, body: a };
                    },
                  ),
                  i(
                    ["\\over", "\\choose", "\\atop"],
                    { numArgs: 0, infix: !0 },
                    function (e) {
                      var t;
                      switch (e.funcName) {
                        case "\\over":
                          t = "\\frac";
                          break;
                        case "\\choose":
                          t = "\\binom";
                          break;
                        case "\\atop":
                          t = "\\\\atopfrac";
                          break;
                        default:
                          throw new Error("Unrecognized infix genfrac command");
                      }
                      return { type: "infix", replaceWith: t, token: e.token };
                    },
                  ),
                  i(
                    ["\\\\", "\\cr"],
                    { numArgs: 0, numOptionalArgs: 1, argTypes: ["size"] },
                    function (e, t) {
                      var a = t[0];
                      return { type: "cr", size: a };
                    },
                  ),
                  i(
                    ["\\begin", "\\end"],
                    { numArgs: 1, argTypes: ["text"] },
                    function (e, t) {
                      var a = t[0];
                      if ("ordgroup" !== a.type)
                        throw new s.default("Invalid environment name", a);
                      for (var l = "", r = 0; r < a.value.length; ++r)
                        l += a.value[r].value;
                      return { type: "environment", name: l, nameGroup: a };
                    },
                  );
              },
              { "./ParseError": 29, "./ParseNode": 30, "./utils": 51 },
            ],
            44: [
              function (e, t) {
                function a(e, a) {
                  t.exports[e] = a;
                }
                a("\\bgroup", "{"),
                  a("\\egroup", "}"),
                  a("\\begingroup", "{"),
                  a("\\endgroup", "}"),
                  a("\\mkern", "\\kern"),
                  a("\\overset", "\\mathop{#2}\\limits^{#1}"),
                  a("\\underset", "\\mathop{#2}\\limits_{#1}"),
                  a("\\boxed", "\\fbox{\\displaystyle{#1}}"),
                  a("\\iff", "\\;\\Longleftrightarrow\\;"),
                  a("\\implies", "\\;\\Longrightarrow\\;"),
                  a("\\impliedby", "\\;\\Longleftarrow\\;"),
                  a("\\ordinarycolon", ":"),
                  a("\\vcentcolon", "\\mathrel{\\mathop\\ordinarycolon}"),
                  a(
                    "\\dblcolon",
                    "\\vcentcolon\\mathrel{\\mkern-.9mu}\\vcentcolon",
                  ),
                  a("\\coloneqq", "\\vcentcolon\\mathrel{\\mkern-1.2mu}="),
                  a("\\Coloneqq", "\\dblcolon\\mathrel{\\mkern-1.2mu}="),
                  a(
                    "\\coloneq",
                    "\\vcentcolon\\mathrel{\\mkern-1.2mu}\\mathrel{-}",
                  ),
                  a(
                    "\\Coloneq",
                    "\\dblcolon\\mathrel{\\mkern-1.2mu}\\mathrel{-}",
                  ),
                  a("\\eqqcolon", "=\\mathrel{\\mkern-1.2mu}\\vcentcolon"),
                  a("\\Eqqcolon", "=\\mathrel{\\mkern-1.2mu}\\dblcolon"),
                  a(
                    "\\eqcolon",
                    "\\mathrel{-}\\mathrel{\\mkern-1.2mu}\\vcentcolon",
                  ),
                  a(
                    "\\Eqcolon",
                    "\\mathrel{-}\\mathrel{\\mkern-1.2mu}\\dblcolon",
                  ),
                  a(
                    "\\colonapprox",
                    "\\vcentcolon\\mathrel{\\mkern-1.2mu}\\approx",
                  ),
                  a(
                    "\\Colonapprox",
                    "\\dblcolon\\mathrel{\\mkern-1.2mu}\\approx",
                  ),
                  a("\\colonsim", "\\vcentcolon\\mathrel{\\mkern-1.2mu}\\sim"),
                  a("\\Colonsim", "\\dblcolon\\mathrel{\\mkern-1.2mu}\\sim"),
                  a("\\ratio", "\\vcentcolon"),
                  a("\\coloncolon", "\\dblcolon"),
                  a("\\colonequals", "\\coloneqq"),
                  a("\\coloncolonequals", "\\Coloneqq"),
                  a("\\equalscolon", "\\eqqcolon"),
                  a("\\equalscoloncolon", "\\Eqqcolon"),
                  a("\\colonminus", "\\coloneq"),
                  a("\\coloncolonminus", "\\Coloneq"),
                  a("\\minuscolon", "\\eqcolon"),
                  a("\\minuscoloncolon", "\\Eqcolon"),
                  a("\\coloncolonapprox", "\\Colonapprox"),
                  a("\\coloncolonsim", "\\Colonsim"),
                  a("\\simcolon", "\\sim\\mathrel{\\mkern-1.2mu}\\vcentcolon"),
                  a(
                    "\\simcoloncolon",
                    "\\sim\\mathrel{\\mkern-1.2mu}\\dblcolon",
                  ),
                  a(
                    "\\approxcolon",
                    "\\approx\\mathrel{\\mkern-1.2mu}\\vcentcolon",
                  ),
                  a(
                    "\\approxcoloncolon",
                    "\\approx\\mathrel{\\mkern-1.2mu}\\dblcolon",
                  );
              },
              {},
            ],
            45: [
              function (e, t) {
                function a(e) {
                  return e && e.__esModule ? e : { default: e };
                }
                var i = e("babel-runtime/helpers/classCallCheck"),
                  l = a(i),
                  r = e("babel-runtime/helpers/createClass"),
                  n = a(r),
                  s = e("./utils"),
                  o = a(s),
                  d = (function () {
                    function e(t, a) {
                      (0, l.default)(this, e),
                        (this.type = t),
                        (this.attributes = {}),
                        (this.children = a || []);
                    }
                    return (
                      (0, n.default)(e, [
                        {
                          key: "setAttribute",
                          value: function (e, t) {
                            this.attributes[e] = t;
                          },
                        },
                        {
                          key: "toNode",
                          value: function () {
                            var e = document.createElementNS(
                              "http://www.w3.org/1998/Math/MathML",
                              this.type,
                            );
                            for (var t in this.attributes)
                              Object.prototype.hasOwnProperty.call(
                                this.attributes,
                                t,
                              ) && e.setAttribute(t, this.attributes[t]);
                            for (var a = 0; a < this.children.length; a++)
                              e.appendChild(this.children[a].toNode());
                            return e;
                          },
                        },
                        {
                          key: "toMarkup",
                          value: function () {
                            var e = "<" + this.type;
                            for (var t in this.attributes)
                              Object.prototype.hasOwnProperty.call(
                                this.attributes,
                                t,
                              ) &&
                                ((e += " " + t + '="'),
                                (e += o.default.escape(this.attributes[t])),
                                (e += '"'));
                            e += ">";
                            for (var a = 0; a < this.children.length; a++)
                              e += this.children[a].toMarkup();
                            return (e += "</" + this.type + ">"), e;
                          },
                        },
                      ]),
                      e
                    );
                  })(),
                  u = (function () {
                    function e(t) {
                      (0, l.default)(this, e), (this.text = t);
                    }
                    return (
                      (0, n.default)(e, [
                        {
                          key: "toNode",
                          value: function () {
                            return document.createTextNode(this.text);
                          },
                        },
                        {
                          key: "toMarkup",
                          value: function () {
                            return o.default.escape(this.text);
                          },
                        },
                      ]),
                      e
                    );
                  })();
                t.exports = { MathNode: d, TextNode: u };
              },
              {
                "./utils": 51,
                "babel-runtime/helpers/classCallCheck": 4,
                "babel-runtime/helpers/createClass": 5,
              },
            ],
            46: [
              function (e, t) {
                var a = e("./Parser"),
                  i = (function (e) {
                    return e && e.__esModule ? e : { default: e };
                  })(a);
                t.exports = function (e, t) {
                  if (!("string" == typeof e || e instanceof String))
                    throw new TypeError(
                      "KaTeX can only parse string typed expression",
                    );
                  var a = new i.default(e, t);
                  return a.parse();
                };
              },
              { "./Parser": 31 },
            ],
            47: [
              function (e, t) {
                var a = e("./buildCommon"),
                  i = e("./mathMLTree"),
                  l = e("./utils"),
                  r = {
                    widehat: "^",
                    widetilde: "~",
                    undertilde: "~",
                    overleftarrow: "\u2190",
                    underleftarrow: "\u2190",
                    xleftarrow: "\u2190",
                    overrightarrow: "\u2192",
                    underrightarrow: "\u2192",
                    xrightarrow: "\u2192",
                    underbrace: "\u23B5",
                    overbrace: "\u23DE",
                    overleftrightarrow: "\u2194",
                    underleftrightarrow: "\u2194",
                    xleftrightarrow: "\u2194",
                    Overrightarrow: "\u21D2",
                    xRightarrow: "\u21D2",
                    overleftharpoon: "\u21BC",
                    xleftharpoonup: "\u21BC",
                    overrightharpoon: "\u21C0",
                    xrightharpoonup: "\u21C0",
                    xLeftarrow: "\u21D0",
                    xLeftrightarrow: "\u21D4",
                    xhookleftarrow: "\u21A9",
                    xhookrightarrow: "\u21AA",
                    xmapsto: "\u21A6",
                    xrightharpoondown: "\u21C1",
                    xleftharpoondown: "\u21BD",
                    xrightleftharpoons: "\u21CC",
                    xleftrightharpoons: "\u21CB",
                    xtwoheadleftarrow: "\u219E",
                    xtwoheadrightarrow: "\u21A0",
                    xLongequal: "=",
                    xtofrom: "\u21C4",
                  },
                  n = {
                    overleftarrow: [0.522, 0, "leftarrow", 0.5],
                    underleftarrow: [0.522, 0, "leftarrow", 0.5],
                    xleftarrow: [0.261, 0.261, "leftarrow", 0.783],
                    overrightarrow: [0.522, 0, "rightarrow", 0.5],
                    underrightarrow: [0.522, 0, "rightarrow", 0.5],
                    xrightarrow: [0.261, 0.261, "rightarrow", 0.783],
                    overbrace: [0.548, 0, "overbrace", 1.6],
                    underbrace: [0.548, 0, "underbrace", 1.6],
                    overleftrightarrow: [0.522, 0, "leftrightarrow", 0.5],
                    underleftrightarrow: [0.522, 0, "leftrightarrow", 0.5],
                    xleftrightarrow: [0.261, 0.261, "leftrightarrow", 0.783],
                    Overrightarrow: [0.56, 0, "doublerightarrow", 0.5],
                    xLeftarrow: [0.28, 0.28, "doubleleftarrow", 0.783],
                    xRightarrow: [0.28, 0.28, "doublerightarrow", 0.783],
                    xLeftrightarrow: [
                      0.28,
                      0.28,
                      "doubleleftrightarrow",
                      0.955,
                    ],
                    overleftharpoon: [0.522, 0, "leftharpoon", 0.5],
                    overrightharpoon: [0.522, 0, "rightharpoon", 0.5],
                    xleftharpoonup: [0.261, 0.261, "leftharpoon", 0.783],
                    xrightharpoonup: [0.261, 0.261, "rightharpoon", 0.783],
                    xhookleftarrow: [0.261, 0.261, "hookleftarrow", 0.87],
                    xhookrightarrow: [0.261, 0.261, "hookrightarrow", 0.87],
                    overlinesegment: [0.414, 0, "linesegment", 0.5],
                    underlinesegment: [0.414, 0, "linesegment", 0.5],
                    xmapsto: [0.261, 0.261, "mapsto", 0.783],
                    xrightharpoondown: [
                      0.261,
                      0.261,
                      "rightharpoondown",
                      0.783,
                    ],
                    xleftharpoondown: [0.261, 0.261, "leftharpoondown", 0.783],
                    xrightleftharpoons: [
                      0.358,
                      0.358,
                      "rightleftharpoons",
                      0.716,
                    ],
                    xleftrightharpoons: [
                      0.358,
                      0.358,
                      "leftrightharpoons",
                      0.716,
                    ],
                    overgroup: [0.342, 0, "overgroup", 0.87],
                    undergroup: [0.342, 0, "undergroup", 0.87],
                    xtwoheadleftarrow: [0.167, 0.167, "twoheadleftarrow", 0.86],
                    xtwoheadrightarrow: [
                      0.167,
                      0.167,
                      "twoheadrightarrow",
                      0.86,
                    ],
                    xLongequal: [0.167, 0.167, "longequal", 0.5],
                    xtofrom: [0.264, 0.264, "tofrom", 0.86],
                  },
                  s = {
                    doubleleftarrow:
                      "<path d='M262 157\nl10-10c34-36 62.7-77 86-123 3.3-8 5-13.3 5-16 0-5.3-6.7-8-20-8-7.3\n 0-12.2.5-14.5 1.5-2.3 1-4.8 4.5-7.5 10.5-49.3 97.3-121.7 169.3-217 216-28\n 14-57.3 25-88 33-6.7 2-11 3.8-13 5.5-2 1.7-3 4.2-3 7.5s1 5.8 3 7.5\nc2 1.7 6.3 3.5 13 5.5 68 17.3 128.2 47.8 180.5 91.5 52.3 43.7 93.8 96.2 124.5\n 157.5 9.3 8 15.3 12.3 18 13h6c12-.7 18-4 18-10 0-2-1.7-7-5-15-23.3-46-52-87\n-86-123l-10-10h399738v-40H218c328 0 0 0 0 0l-10-8c-26.7-20-65.7-43-117-69 2.7\n-2 6-3.7 10-5 36.7-16 72.3-37.3 107-64l10-8h399782v-40z\nm8 0v40h399730v-40zm0 194v40h399730v-40z'/>",
                    doublerightarrow:
                      "<path d='M399738 392l\n-10 10c-34 36-62.7 77-86 123-3.3 8-5 13.3-5 16 0 5.3 6.7 8 20 8 7.3 0 12.2-.5\n 14.5-1.5 2.3-1 4.8-4.5 7.5-10.5 49.3-97.3 121.7-169.3 217-216 28-14 57.3-25 88\n-33 6.7-2 11-3.8 13-5.5 2-1.7 3-4.2 3-7.5s-1-5.8-3-7.5c-2-1.7-6.3-3.5-13-5.5-68\n-17.3-128.2-47.8-180.5-91.5-52.3-43.7-93.8-96.2-124.5-157.5-9.3-8-15.3-12.3-18\n-13h-6c-12 .7-18 4-18 10 0 2 1.7 7 5 15 23.3 46 52 87 86 123l10 10H0v40h399782\nc-328 0 0 0 0 0l10 8c26.7 20 65.7 43 117 69-2.7 2-6 3.7-10 5-36.7 16-72.3 37.3\n-107 64l-10 8H0v40zM0 157v40h399730v-40zm0 194v40h399730v-40z'/>",
                    leftarrow:
                      "<path d='M400000 241H110l3-3c68.7-52.7 113.7-120\n 135-202 4-14.7 6-23 6-25 0-7.3-7-11-21-11-8 0-13.2.8-15.5 2.5-2.3 1.7-4.2 5.8\n-5.5 12.5-1.3 4.7-2.7 10.3-4 17-12 48.7-34.8 92-68.5 130S65.3 228.3 18 247\nc-10 4-16 7.7-18 11 0 8.7 6 14.3 18 17 47.3 18.7 87.8 47 121.5 85S196 441.3 208\n 490c.7 2 1.3 5 2 9s1.2 6.7 1.5 8c.3 1.3 1 3.3 2 6s2.2 4.5 3.5 5.5c1.3 1 3.3\n 1.8 6 2.5s6 1 10 1c14 0 21-3.7 21-11 0-2-2-10.3-6-25-20-79.3-65-146.7-135-202\n l-3-3h399890zM100 241v40h399900v-40z'/>",
                    rightarrow:
                      "<path d='M0 241v40h399891c-47.3 35.3-84 78-110 128\n-16.7 32-27.7 63.7-33 95 0 1.3-.2 2.7-.5 4-.3 1.3-.5 2.3-.5 3 0 7.3 6.7 11 20\n 11 8 0 13.2-.8 15.5-2.5 2.3-1.7 4.2-5.5 5.5-11.5 2-13.3 5.7-27 11-41 14.7-44.7\n 39-84.5 73-119.5s73.7-60.2 119-75.5c6-2 9-5.7 9-11s-3-9-9-11c-45.3-15.3-85\n-40.5-119-75.5s-58.3-74.8-73-119.5c-4.7-14-8.3-27.3-11-40-1.3-6.7-3.2-10.8-5.5\n-12.5-2.3-1.7-7.5-2.5-15.5-2.5-14 0-21 3.7-21 11 0 2 2 10.3 6 25 20.7 83.3 67\n 151.7 139 205zm0 0v40h399900v-40z'/>",
                  },
                  o = {
                    bcancel:
                      "<line x1='0' y1='0' x2='100%' y2='100%' stroke-width='0.046em'/>",
                    cancel:
                      "<line x1='0' y1='100%' x2='100%' y2='0' stroke-width='0.046em'/>",
                    doubleleftarrow:
                      "><svg viewBox='0 0 400000 549'\npreserveAspectRatio='xMinYMin slice'>" +
                      s.doubleleftarrow +
                      "</svg>",
                    doubleleftrightarrow:
                      "><svg width='50.1%' viewBox='0 0 400000 549'\npreserveAspectRatio='xMinYMin slice'>" +
                      s.doubleleftarrow +
                      "</svg>\n<svg x='50%' width='50%' viewBox='0 0 400000 549' preserveAspectRatio='xMaxYMin\n slice'>" +
                      s.doublerightarrow +
                      "</svg>",
                    doublerightarrow:
                      "><svg viewBox='0 0 400000 549'\npreserveAspectRatio='xMaxYMin slice'>" +
                      s.doublerightarrow +
                      "</svg>",
                    hookleftarrow:
                      "><svg width='50.1%' viewBox='0 0 400000 522'\npreserveAspectRatio='xMinYMin slice'>" +
                      s.leftarrow +
                      "</svg>\n<svg x='50%' width='50%' viewBox='0 0 400000 522' preserveAspectRatio='xMaxYMin\n slice'><path d='M399859 241c-764 0 0 0 0 0 40-3.3 68.7\n -15.7 86-37 10-12 15-25.3 15-40 0-22.7-9.8-40.7-29.5-54-19.7-13.3-43.5-21-71.5\n -23-17.3-1.3-26-8-26-20 0-13.3 8.7-20 26-20 38 0 71 11.2 99 33.5 0 0 7 5.6 21\n 16.7 14 11.2 21 33.5 21 66.8s-14 61.2-42 83.5c-28 22.3-61 33.5-99 33.5L0 241z\n M0 281v-40h399859v40z'/></svg>",
                    hookrightarrow:
                      "><svg width='50.1%' viewBox='0 0 400000 522'\npreserveAspectRatio='xMinYMin slice'><path d='M400000 281\nH103s-33-11.2-61-33.5S0 197.3 0 164s14.2-61.2 42.5-83.5C70.8 58.2 104 47 142 47\nc16.7 0 25 6.7 25 20 0 12-8.7 18.7-26 20-40 3.3-68.7 15.7-86 37-10 12-15 25.3\n-15 40 0 22.7 9.8 40.7 29.5 54 19.7 13.3 43.5 21 71.5 23h399859zM103 281v-40\nh399897v40z'/></svg><svg x='50%' width='50%' viewBox='0 0 400000 522'\npreserveAspectRatio='xMaxYMin slice'>" +
                      s.rightarrow +
                      "</svg>",
                    leftarrow:
                      "><svg viewBox='0 0 400000 522' preserveAspectRatio='xMinYMin\n slice'>" +
                      s.leftarrow +
                      "</svg>",
                    leftharpoon:
                      "><svg viewBox='0 0 400000 522' preserveAspectRatio='xMinYMin\n slice'><path d='M0 267c.7 5.3 3 10 7 14h399993v-40H93c3.3\n-3.3 10.2-9.5 20.5-18.5s17.8-15.8 22.5-20.5c50.7-52 88-110.3 112-175 4-11.3 5\n-18.3 3-21-1.3-4-7.3-6-18-6-8 0-13 .7-15 2s-4.7 6.7-8 16c-42 98.7-107.3 174.7\n-196 228-6.7 4.7-10.7 8-12 10-1.3 2-2 5.7-2 11zm100-26v40h399900v-40z'/></svg>",
                    leftharpoondown:
                      "><svg viewBox='0 0 400000 522'\npreserveAspectRatio='xMinYMin slice'><path d=\"M7 241c-4 4-6.333 8.667-7 14\n 0 5.333.667 9 2 11s5.333 5.333 12 10c90.667 54 156 130 196 228 3.333 10.667\n 6.333 16.333 9 17 2 .667 5 1 9 1h5c10.667 0 16.667-2 18-6 2-2.667 1-9.667-3-21\n -32-87.333-82.667-157.667-152-211l-3-3h399907v-40z\nM93 281 H400000 v-40L7 241z\"/></svg>",
                    leftrightarrow:
                      "><svg width='50.1%' viewBox='0 0 400000 522'\npreserveAspectRatio='xMinYMin slice'>" +
                      s.leftarrow +
                      "</svg>\n<svg x='50%' width='50%' viewBox='0 0 400000 522' preserveAspectRatio='xMaxYMin\n slice'>" +
                      s.rightarrow +
                      "</svg>",
                    leftrightharpoons:
                      "><svg width='50.1%' viewBox='0 0 400000 716'\npreserveAspectRatio='xMinYMin slice'><path d='M0 267c.7 5.3\n 3 10 7 14h399993v-40H93c3.3-3.3 10.2-9.5 20.5-18.5s17.8-15.8 22.5-20.5c50.7-52\n 88-110.3 112-175 4-11.3 5-18.3 3-21-1.3-4-7.3-6-18-6-8 0-13 .7-15 2s-4.7 6.7-8\n 16c-42 98.7-107.3 174.7-196 228-6.7 4.7-10.7 8-12 10-1.3 2-2 5.7-2 11zm100-26\nv40h399900v-40zM0 435v40h400000v-40zm0 0v40h400000v-40z'/></svg>\n<svg x='50%' width='50%' viewBox='0 0 400000 716' preserveAspectRatio='xMaxYMin\n slice'><path d='M399747 705c0 7.3 6.7 11 20 11 8 0 13-.8\n 15-2.5s4.7-6.8 8-15.5c40-94 99.3-166.3 178-217 13.3-8 20.3-12.3 21-13 5.3-3.3\n 8.5-5.8 9.5-7.5 1-1.7 1.5-5.2 1.5-10.5s-2.3-10.3-7-15H0v40h399908c-34 25.3\n-64.7 57-92 95-27.3 38-48.7 77.7-64 119-3.3 8.7-5 14-5 16zM0 435v40h399900v-40z\nm0-194v40h400000v-40zm0 0v40h400000v-40z'/></svg>",
                    linesegment:
                      "><svg width='50.1%' viewBox='0 0 400000 414'\npreserveAspectRatio='xMinYMin slice'><path d='M40 187V40H0\nv334h40V227h399960v-40zm0 0V40H0v334h40V227h399960v-40z'/></svg><svg x='50%'\nwidth='50%' viewBox='0 0 400000 414' preserveAspectRatio='xMaxYMin slice'>\n<path d='M0 187v40h399960v147h40V40h-40v147zm0\n 0v40h399960v147h40V40h-40v147z'/></svg>",
                    longequal:
                      " viewBox='0 0 100 334' preserveAspectRatio='none'>\n<path d='M0 50h100v40H0zm0 194h100v40H0z'/>",
                    mapsto:
                      "><svg width='50.1%' viewBox='0 0 400000 522'\npreserveAspectRatio='xMinYMin slice'><path d='M40 241c740\n 0 0 0 0 0v-75c0-40.7-.2-64.3-.5-71-.3-6.7-2.2-11.7-5.5-15-4-4-8.7-6-14-6-5.3 0\n-10 2-14 6C2.7 83.3.8 91.3.5 104 .2 116.7 0 169 0 261c0 114 .7 172.3 2 175 4 8\n 10 12 18 12 5.3 0 10-2 14-6 3.3-3.3 5.2-8.3 5.5-15 .3-6.7.5-30.3.5-71v-75\nh399960zm0 0v40h399960v-40z'/></svg><svg x='50%' width='50%' viewBox='0 0\n 400000 522' preserveAspectRatio='xMaxYMin slice'>" +
                      s.rightarrow +
                      "</svg>",
                    overbrace:
                      "><svg width='25.5%' viewBox='0 0 400000 548'\npreserveAspectRatio='xMinYMin slice'><path d='M6 548l-6-6\nv-35l6-11c56-104 135.3-181.3 238-232 57.3-28.7 117-45 179-50h399577v120H403\nc-43.3 7-81 15-113 26-100.7 33-179.7 91-237 174-2.7 5-6 9-10 13-.7 1-7.3 1-20 1\nH6z'/></svg><svg x='25%' width='50%' viewBox='0 0 400000 548'\npreserveAspectRatio='xMidYMin slice'><path d='M200428 334\nc-100.7-8.3-195.3-44-280-108-55.3-42-101.7-93-139-153l-9-14c-2.7 4-5.7 8.7-9 14\n-53.3 86.7-123.7 153-211 199-66.7 36-137.3 56.3-212 62H0V214h199568c178.3-11.7\n 311.7-78.3 403-201 6-8 9.7-12 11-12 .7-.7 6.7-1 18-1s17.3.3 18 1c1.3 0 5 4 11\n 12 44.7 59.3 101.3 106.3 170 141s145.3 54.3 229 60h199572v120z'/></svg>\n<svg x='74.9%' width='24.1%' viewBox='0 0 400000 548'\npreserveAspectRatio='xMaxYMin slice'><path d='M400000 542l\n-6 6h-17c-12.7 0-19.3-.3-20-1-4-4-7.3-8.3-10-13-35.3-51.3-80.8-93.8-136.5-127.5\ns-117.2-55.8-184.5-66.5c-.7 0-2-.3-4-1-18.7-2.7-76-4.3-172-5H0V214h399571l6 1\nc124.7 8 235 61.7 331 161 31.3 33.3 59.7 72.7 85 118l7 13v35z'/></svg>",
                    overgroup:
                      "><svg width='50.1%' viewBox='0 0 400000 342'\npreserveAspectRatio='xMinYMin slice'><path d='M400000 80\nH435C64 80 168.3 229.4 21 260c-5.9 1.2-18 0-18 0-2 0-3-1-3-3v-38C76 61 257 0\n 435 0h399565z'/></svg><svg x='50%' width='50%' viewBox='0 0 400000 342'\npreserveAspectRatio='xMaxYMin slice'><path d='M0 80h399565\nc371 0 266.7 149.4 414 180 5.9 1.2 18 0 18 0 2 0 3-1 3-3v-38\nc-76-158-257-219-435-219H0z'/></svg>",
                    rightarrow:
                      "><svg viewBox='0 0 400000 522' preserveAspectRatio='xMaxYMin\n slice'>" +
                      s.rightarrow +
                      "</svg>",
                    rightharpoon:
                      "><svg viewBox='0 0 400000 522' preserveAspectRatio='xMaxYMin\n slice'><path d='M0 241v40h399993c4.7-4.7 7-9.3 7-14 0-9.3\n-3.7-15.3-11-18-92.7-56.7-159-133.7-199-231-3.3-9.3-6-14.7-8-16-2-1.3-7-2-15-2\n-10.7 0-16.7 2-18 6-2 2.7-1 9.7 3 21 15.3 42 36.7 81.8 64 119.5 27.3 37.7 58\n 69.2 92 94.5zm0 0v40h399900v-40z'/></svg>",
                    rightharpoondown:
                      "><svg viewBox='0 0 400000 522'\npreserveAspectRatio='xMaxYMin slice'><path d='M399747 511\nc0 7.3 6.7 11 20 11 8 0 13-.8 15-2.5s4.7-6.8 8-15.5c40-94 99.3-166.3 178-217\n 13.3-8 20.3-12.3 21-13 5.3-3.3 8.5-5.8 9.5-7.5 1-1.7 1.5-5.2 1.5-10.5s-2.3\n -10.3-7-15H0v40h399908c-34 25.3-64.7 57-92 95-27.3 38-48.7 77.7-64 119-3.3\n 8.7-5 14-5 16zM0 241v40h399900v-40z'/></svg>",
                    rightleftharpoons:
                      "><svg width='50%' viewBox='0 0 400000 716'\npreserveAspectRatio='xMinYMin slice'><path d='M7 435c-4 4\n-6.3 8.7-7 14 0 5.3.7 9 2 11s5.3 5.3 12 10c90.7 54 156 130 196 228 3.3 10.7 6.3\n 16.3 9 17 2 .7 5 1 9 1h5c10.7 0 16.7-2 18-6 2-2.7 1-9.7-3-21-32-87.3-82.7\n-157.7-152-211l-3-3h399907v-40H7zm93 0v40h399900v-40zM0 241v40h399900v-40z\nm0 0v40h399900v-40z'/></svg><svg x='50%' width='50%' viewBox='0 0 400000 716'\npreserveAspectRatio='xMaxYMin slice'><path d='M0 241v40\nh399993c4.7-4.7 7-9.3 7-14 0-9.3-3.7-15.3-11-18-92.7-56.7-159-133.7-199-231-3.3\n-9.3-6-14.7-8-16-2-1.3-7-2-15-2-10.7 0-16.7 2-18 6-2 2.7-1 9.7 3 21 15.3 42\n 36.7 81.8 64 119.5 27.3 37.7 58 69.2 92 94.5zm0 0v40h399900v-40z\n m100 194v40h399900v-40zm0 0v40h399900v-40z'/></svg>",
                    tilde1:
                      " viewBox='0 0 600 260' preserveAspectRatio='none'>\n<path d='M200 55.538c-77 0-168 73.953-177 73.953-3 0-7\n-2.175-9-5.437L2 97c-1-2-2-4-2-6 0-4 2-7 5-9l20-12C116 12 171 0 207 0c86 0\n 114 68 191 68 78 0 168-68 177-68 4 0 7 2 9 5l12 19c1 2.175 2 4.35 2 6.525 0\n 4.35-2 7.613-5 9.788l-19 13.05c-92 63.077-116.937 75.308-183 76.128\n-68.267.847-113-73.952-191-73.952z'/>",
                    tilde2:
                      " viewBox='0 0 1033 286' preserveAspectRatio='none'>\n<path d='M344 55.266c-142 0-300.638 81.316-311.5 86.418\n-8.01 3.762-22.5 10.91-23.5 5.562L1 120c-1-2-1-3-1-4 0-5 3-9 8-10l18.4-9C160.9\n 31.9 283 0 358 0c148 0 188 122 331 122s314-97 326-97c4 0 8 2 10 7l7 21.114\nc1 2.14 1 3.21 1 4.28 0 5.347-3 9.626-7 10.696l-22.3 12.622C852.6 158.372 751\n 181.476 676 181.476c-149 0-189-126.21-332-126.21z'/>",
                    tilde3:
                      " viewBox='0 0 2339 306' preserveAspectRatio='none'>\n<path d='M786 59C457 59 32 175.242 13 175.242c-6 0-10-3.457\n-11-10.37L.15 138c-1-7 3-12 10-13l19.2-6.4C378.4 40.7 634.3 0 804.3 0c337 0\n 411.8 157 746.8 157 328 0 754-112 773-112 5 0 10 3 11 9l1 14.075c1 8.066-.697\n 16.595-6.697 17.492l-21.052 7.31c-367.9 98.146-609.15 122.696-778.15 122.696\n -338 0-409-156.573-744-156.573z'/>",
                    tilde4:
                      " viewBox='0 0 2340 312' preserveAspectRatio='none'>\n<path d='M786 58C457 58 32 177.487 13 177.487c-6 0-10-3.345\n-11-10.035L.15 143c-1-7 3-12 10-13l22-6.7C381.2 35 637.15 0 807.15 0c337 0 409\n 177 744 177 328 0 754-127 773-127 5 0 10 3 11 9l1 14.794c1 7.805-3 13.38-9\n 14.495l-20.7 5.574c-366.85 99.79-607.3 139.372-776.3 139.372-338 0-409\n -175.236-744-175.236z'/>",
                    tofrom:
                      "><svg width='50.1%' viewBox='0 0 400000 528'\npreserveAspectRatio='xMinYMin slice'><path d='M0 147h400000\nv40H0zm0 214c68 40 115.7 95.7 143 167h22c15.3 0 23-.3 23-1 0-1.3-5.3-13.7-16-37\n-18-35.3-41.3-69-70-101l-7-8h399905v-40H95l7-8c28.7-32 52-65.7 70-101 10.7-23.3\n 16-35.7 16-37 0-.7-7.7-1-23-1h-22C115.7 265.3 68 321 0 361zm0-174v-40h399900\nv40zm100 154v40h399900v-40z'/></svg><svg x='50%' width='50%' viewBox='0 0\n 400000 528' preserveAspectRatio='xMaxYMin slice'><path\nd='M400000 167c-70.7-42-118-97.7-142-167h-23c-15.3 0-23 .3-23 1 0 1.3 5.3 13.7\n 16 37 18 35.3 41.3 69 70 101l7 8H0v40h399905l-7 8c-28.7 32-52 65.7-70 101-10.7\n 23.3-16 35.7-16 37 0 .7 7.7 1 23 1h23c24-69.3 71.3-125 142-167z\n M100 147v40h399900v-40zM0 341v40h399900v-40z'/></svg>",
                    twoheadleftarrow:
                      "><svg viewBox='0 0 400000 334'\npreserveAspectRatio='xMinYMin slice'><path d='M0 167c68 40\n 115.7 95.7 143 167h22c15.3 0 23-.3 23-1 0-1.3-5.3-13.7-16-37-18-35.3-41.3-69\n-70-101l-7-8h125l9 7c50.7 39.3 85 86 103 140h46c0-4.7-6.3-18.7-19-42-18-35.3\n-40-67.3-66-96l-9-9h399716v-40H284l9-9c26-28.7 48-60.7 66-96 12.7-23.333 19\n-37.333 19-42h-46c-18 54-52.3 100.7-103 140l-9 7H95l7-8c28.7-32 52-65.7 70-101\n 10.7-23.333 16-35.7 16-37 0-.7-7.7-1-23-1h-22C115.7 71.3 68 127 0 167z'/>\n</svg>",
                    twoheadrightarrow:
                      "><svg viewBox='0 0 400000 334'\npreserveAspectRatio='xMaxYMin slice'><path d='M400000 167\nc-68-40-115.7-95.7-143-167h-22c-15.3 0-23 .3-23 1 0 1.3 5.3 13.7 16 37 18 35.3\n 41.3 69 70 101l7 8h-125l-9-7c-50.7-39.3-85-86-103-140h-46c0 4.7 6.3 18.7 19 42\n 18 35.3 40 67.3 66 96l9 9H0v40h399716l-9 9c-26 28.7-48 60.7-66 96-12.7 23.333\n-19 37.333-19 42h46c18-54 52.3-100.7 103-140l9-7h125l-7 8c-28.7 32-52 65.7-70\n 101-10.7 23.333-16 35.7-16 37 0 .7 7.7 1 23 1h22c27.3-71.3 75-127 143-167z'/>\n</svg>",
                    underbrace:
                      "><svg width='25.1%' viewBox='0 0 400000 548'\npreserveAspectRatio='xMinYMin slice'><path d='M0 6l6-6h17\nc12.688 0 19.313.3 20 1 4 4 7.313 8.3 10 13 35.313 51.3 80.813 93.8 136.5 127.5\n 55.688 33.7 117.188 55.8 184.5 66.5.688 0 2 .3 4 1 18.688 2.7 76 4.3 172 5\nh399450v120H429l-6-1c-124.688-8-235-61.7-331-161C60.687 138.7 32.312 99.3 7 54\nL0 41V6z'/></svg><svg x='25%' width='50%' viewBox='0 0 400000 548'\npreserveAspectRatio='xMidYMin slice'><path d='M199572 214\nc100.7 8.3 195.3 44 280 108 55.3 42 101.7 93 139 153l9 14c2.7-4 5.7-8.7 9-14\n 53.3-86.7 123.7-153 211-199 66.7-36 137.3-56.3 212-62h199568v120H200432c-178.3\n 11.7-311.7 78.3-403 201-6 8-9.7 12-11 12-.7.7-6.7 1-18 1s-17.3-.3-18-1c-1.3 0\n-5-4-11-12-44.7-59.3-101.3-106.3-170-141s-145.3-54.3-229-60H0V214z'/></svg>\n<svg x='74.9%' width='25.1%' viewBox='0 0 400000 548'\npreserveAspectRatio='xMaxYMin slice'><path d='M399994 0l6 6\nv35l-6 11c-56 104-135.3 181.3-238 232-57.3 28.7-117 45-179 50H-300V214h399897\nc43.3-7 81-15 113-26 100.7-33 179.7-91 237-174 2.7-5 6-9 10-13 .7-1 7.3-1 20-1\nh17z'/></svg>",
                    undergroup:
                      "><svg width='50.1%' viewBox='0 0 400000 342'\npreserveAspectRatio='xMinYMin slice'><path d='M400000 262\nH435C64 262 168.3 112.6 21 82c-5.9-1.2-18 0-18 0-2 0-3 1-3 3v38c76 158 257 219\n 435 219h399565z'/></svg><svg x='50%' width='50%' viewBox='0 0 400000 342'\npreserveAspectRatio='xMaxYMin slice'><path d='M0 262h399565\nc371 0 266.7-149.4 414-180 5.9-1.2 18 0 18 0 2 0 3 1 3 3v38c-76 158-257\n 219-435 219H0z'/></svg>",
                    widehat1:
                      " viewBox='0 0 1062 239' preserveAspectRatio='none'>\n<path d='M529 0h5l519 115c5 1 9 5 9 10 0 1-1 2-1 3l-4 22\nc-1 5-5 9-11 9h-2L532 67 19 159h-2c-5 0-9-4-11-9l-5-22c-1-6 2-12 8-13z'/>",
                    widehat2:
                      " viewBox='0 0 2364 300' preserveAspectRatio='none'>\n<path d='M1181 0h2l1171 176c6 0 10 5 10 11l-2 23c-1 6-5 10\n-11 10h-1L1182 67 15 220h-1c-6 0-10-4-11-10l-2-23c-1-6 4-11 10-11z'/>",
                    widehat3:
                      " viewBox='0 0 2364 360' preserveAspectRatio='none'>\n<path d='M1181 0h2l1171 236c6 0 10 5 10 11l-2 23c-1 6-5 10\n-11 10h-1L1182 67 15 280h-1c-6 0-10-4-11-10l-2-23c-1-6 4-11 10-11z'/>",
                    widehat4:
                      " viewBox='0 0 2364 420' preserveAspectRatio='none'>\n<path d='M1181 0h2l1171 296c6 0 10 5 10 11l-2 23c-1 6-5 10\n-11 10h-1L1182 67 15 340h-1c-6 0-10-4-11-10l-2-23c-1-6 4-11 10-11z'/>",
                    xcancel:
                      "<line x1='0' y1='0' x2='100%' y2='100%' stroke-width='0.046em'/>\n<line x1='0' y1='100%' x2='100%' y2='0' stroke-width='0.046em'/>",
                  };
                t.exports = {
                  encloseSpan: function (e, t, i, l) {
                    var r = e.height + e.depth + 2 * i,
                      n;
                    return (
                      "fbox" === t
                        ? ((n = a.makeSpan(["stretchy", t], [], l)),
                          l.color && (n.style.borderColor = l.getColor()))
                        : ((n = a.makeSpan([], [], l)),
                          (n.innerHTML =
                            "<svg width='100%' height='" +
                            r +
                            "em'>" +
                            o[t] +
                            "</svg>")),
                      (n.height = r),
                      (n.style.height = r + "em"),
                      n
                    );
                  },
                  mathMLnode: function (e) {
                    var t = new i.MathNode("mo", [
                      new i.TextNode(r[e.substr(1)]),
                    ]);
                    return t.setAttribute("stretchy", "true"), t;
                  },
                  svgSpan: function (e, t) {
                    var i = e.value.label.substr(1),
                      r = 0,
                      s = 0,
                      d = "",
                      u = 0;
                    if (l.contains(["widehat", "widetilde", "undertilde"], i)) {
                      var p = e.value.value.length;
                      if (5 < p)
                        (r = 0.312),
                          (d = ("widehat" === i ? "widehat" : "tilde") + "4");
                      else {
                        var c = [1, 1, 2, 2, 3, 3][p];
                        "widehat" === i
                          ? ((r = [0, 0.24, 0.3, 0.3, 0.36, 0.36][p]),
                            (d = "widehat" + c))
                          : ((r = [0, 0.26, 0.3, 0.3, 0.34, 0.34][p]),
                            (d = "tilde" + c));
                      }
                    } else {
                      var m = n[i];
                      (r = m[0]), (s = m[1]), (d = m[2]), (u = m[3]);
                    }
                    var h = a.makeSpan([], [], t);
                    (h.height = r), (h.depth = s);
                    var g = r + s;
                    return (
                      (h.style.height = g + "em"),
                      0 < u && (h.style.minWidth = u + "em"),
                      (h.innerHTML =
                        "<svg width='100%' height='" +
                        g +
                        "em'" +
                        o[d] +
                        "</svg>"),
                      h
                    );
                  },
                };
              },
              { "./buildCommon": 34, "./mathMLTree": 45, "./utils": 51 },
            ],
            48: [
              function (e, t) {
                function l(e, a, i, l, r, n) {
                  (t.exports[e][r] = { font: a, group: i, replace: l }),
                    n && (t.exports[e][l] = t.exports[e][r]);
                }
                t.exports = { math: {}, text: {} };
                var r = "math",
                  n = "text",
                  s = "main",
                  o = "ams",
                  d = "accent",
                  u = "bin",
                  p = "close",
                  c = "inner",
                  m = "mathord",
                  h = "op",
                  g = "open",
                  f = "punct",
                  y = "rel",
                  b = "spacing",
                  v = "textord";
                l(r, s, y, "\u2261", "\\equiv"),
                  l(r, s, y, "\u227A", "\\prec"),
                  l(r, s, y, "\u227B", "\\succ"),
                  l(r, s, y, "\u223C", "\\sim"),
                  l(r, s, y, "\u22A5", "\\perp"),
                  l(r, s, y, "\u2AAF", "\\preceq"),
                  l(r, s, y, "\u2AB0", "\\succeq"),
                  l(r, s, y, "\u2243", "\\simeq"),
                  l(r, s, y, "\u2223", "\\mid"),
                  l(r, s, y, "\u226A", "\\ll"),
                  l(r, s, y, "\u226B", "\\gg"),
                  l(r, s, y, "\u224D", "\\asymp"),
                  l(r, s, y, "\u2225", "\\parallel"),
                  l(r, s, y, "\u22C8", "\\bowtie"),
                  l(r, s, y, "\u2323", "\\smile"),
                  l(r, s, y, "\u2291", "\\sqsubseteq"),
                  l(r, s, y, "\u2292", "\\sqsupseteq"),
                  l(r, s, y, "\u2250", "\\doteq"),
                  l(r, s, y, "\u2322", "\\frown"),
                  l(r, s, y, "\u220B", "\\ni"),
                  l(r, s, y, "\u221D", "\\propto"),
                  l(r, s, y, "\u22A2", "\\vdash"),
                  l(r, s, y, "\u22A3", "\\dashv"),
                  l(r, s, y, "\u220B", "\\owns"),
                  l(r, s, f, ".", "\\ldotp"),
                  l(r, s, f, "\u22C5", "\\cdotp"),
                  l(r, s, v, "#", "\\#"),
                  l(n, s, v, "#", "\\#"),
                  l(r, s, v, "&", "\\&"),
                  l(n, s, v, "&", "\\&"),
                  l(r, s, v, "\u2135", "\\aleph"),
                  l(r, s, v, "\u2200", "\\forall"),
                  l(r, s, v, "\u210F", "\\hbar"),
                  l(r, s, v, "\u2203", "\\exists"),
                  l(r, s, v, "\u2207", "\\nabla"),
                  l(r, s, v, "\u266D", "\\flat"),
                  l(r, s, v, "\u2113", "\\ell"),
                  l(r, s, v, "\u266E", "\\natural"),
                  l(r, s, v, "\u2663", "\\clubsuit"),
                  l(r, s, v, "\u2118", "\\wp"),
                  l(r, s, v, "\u266F", "\\sharp"),
                  l(r, s, v, "\u2662", "\\diamondsuit"),
                  l(r, s, v, "\u211C", "\\Re"),
                  l(r, s, v, "\u2661", "\\heartsuit"),
                  l(r, s, v, "\u2111", "\\Im"),
                  l(r, s, v, "\u2660", "\\spadesuit"),
                  l(r, s, v, "\u2020", "\\dag"),
                  l(n, s, v, "\u2020", "\\dag"),
                  l(n, s, v, "\u2020", "\\textdagger"),
                  l(r, s, v, "\u2021", "\\ddag"),
                  l(n, s, v, "\u2021", "\\ddag"),
                  l(n, s, v, "\u2020", "\\textdaggerdbl"),
                  l(r, s, p, "\u23B1", "\\rmoustache"),
                  l(r, s, g, "\u23B0", "\\lmoustache"),
                  l(r, s, p, "\u27EF", "\\rgroup"),
                  l(r, s, g, "\u27EE", "\\lgroup"),
                  l(r, s, u, "\u2213", "\\mp"),
                  l(r, s, u, "\u2296", "\\ominus"),
                  l(r, s, u, "\u228E", "\\uplus"),
                  l(r, s, u, "\u2293", "\\sqcap"),
                  l(r, s, u, "\u2217", "\\ast"),
                  l(r, s, u, "\u2294", "\\sqcup"),
                  l(r, s, u, "\u25EF", "\\bigcirc"),
                  l(r, s, u, "\u2219", "\\bullet"),
                  l(r, s, u, "\u2021", "\\ddagger"),
                  l(r, s, u, "\u2240", "\\wr"),
                  l(r, s, u, "\u2A3F", "\\amalg"),
                  l(r, s, y, "\u27F5", "\\longleftarrow"),
                  l(r, s, y, "\u21D0", "\\Leftarrow"),
                  l(r, s, y, "\u27F8", "\\Longleftarrow"),
                  l(r, s, y, "\u27F6", "\\longrightarrow"),
                  l(r, s, y, "\u21D2", "\\Rightarrow"),
                  l(r, s, y, "\u27F9", "\\Longrightarrow"),
                  l(r, s, y, "\u2194", "\\leftrightarrow"),
                  l(r, s, y, "\u27F7", "\\longleftrightarrow"),
                  l(r, s, y, "\u21D4", "\\Leftrightarrow"),
                  l(r, s, y, "\u27FA", "\\Longleftrightarrow"),
                  l(r, s, y, "\u21A6", "\\mapsto"),
                  l(r, s, y, "\u27FC", "\\longmapsto"),
                  l(r, s, y, "\u2197", "\\nearrow"),
                  l(r, s, y, "\u21A9", "\\hookleftarrow"),
                  l(r, s, y, "\u21AA", "\\hookrightarrow"),
                  l(r, s, y, "\u2198", "\\searrow"),
                  l(r, s, y, "\u21BC", "\\leftharpoonup"),
                  l(r, s, y, "\u21C0", "\\rightharpoonup"),
                  l(r, s, y, "\u2199", "\\swarrow"),
                  l(r, s, y, "\u21BD", "\\leftharpoondown"),
                  l(r, s, y, "\u21C1", "\\rightharpoondown"),
                  l(r, s, y, "\u2196", "\\nwarrow"),
                  l(r, s, y, "\u21CC", "\\rightleftharpoons"),
                  l(r, o, y, "\u226E", "\\nless"),
                  l(r, o, y, "\uE010", "\\nleqslant"),
                  l(r, o, y, "\uE011", "\\nleqq"),
                  l(r, o, y, "\u2A87", "\\lneq"),
                  l(r, o, y, "\u2268", "\\lneqq"),
                  l(r, o, y, "\uE00C", "\\lvertneqq"),
                  l(r, o, y, "\u22E6", "\\lnsim"),
                  l(r, o, y, "\u2A89", "\\lnapprox"),
                  l(r, o, y, "\u2280", "\\nprec"),
                  l(r, o, y, "\u22E0", "\\npreceq"),
                  l(r, o, y, "\u22E8", "\\precnsim"),
                  l(r, o, y, "\u2AB9", "\\precnapprox"),
                  l(r, o, y, "\u2241", "\\nsim"),
                  l(r, o, y, "\uE006", "\\nshortmid"),
                  l(r, o, y, "\u2224", "\\nmid"),
                  l(r, o, y, "\u22AC", "\\nvdash"),
                  l(r, o, y, "\u22AD", "\\nvDash"),
                  l(r, o, y, "\u22EA", "\\ntriangleleft"),
                  l(r, o, y, "\u22EC", "\\ntrianglelefteq"),
                  l(r, o, y, "\u228A", "\\subsetneq"),
                  l(r, o, y, "\uE01A", "\\varsubsetneq"),
                  l(r, o, y, "\u2ACB", "\\subsetneqq"),
                  l(r, o, y, "\uE017", "\\varsubsetneqq"),
                  l(r, o, y, "\u226F", "\\ngtr"),
                  l(r, o, y, "\uE00F", "\\ngeqslant"),
                  l(r, o, y, "\uE00E", "\\ngeqq"),
                  l(r, o, y, "\u2A88", "\\gneq"),
                  l(r, o, y, "\u2269", "\\gneqq"),
                  l(r, o, y, "\uE00D", "\\gvertneqq"),
                  l(r, o, y, "\u22E7", "\\gnsim"),
                  l(r, o, y, "\u2A8A", "\\gnapprox"),
                  l(r, o, y, "\u2281", "\\nsucc"),
                  l(r, o, y, "\u22E1", "\\nsucceq"),
                  l(r, o, y, "\u22E9", "\\succnsim"),
                  l(r, o, y, "\u2ABA", "\\succnapprox"),
                  l(r, o, y, "\u2246", "\\ncong"),
                  l(r, o, y, "\uE007", "\\nshortparallel"),
                  l(r, o, y, "\u2226", "\\nparallel"),
                  l(r, o, y, "\u22AF", "\\nVDash"),
                  l(r, o, y, "\u22EB", "\\ntriangleright"),
                  l(r, o, y, "\u22ED", "\\ntrianglerighteq"),
                  l(r, o, y, "\uE018", "\\nsupseteqq"),
                  l(r, o, y, "\u228B", "\\supsetneq"),
                  l(r, o, y, "\uE01B", "\\varsupsetneq"),
                  l(r, o, y, "\u2ACC", "\\supsetneqq"),
                  l(r, o, y, "\uE019", "\\varsupsetneqq"),
                  l(r, o, y, "\u22AE", "\\nVdash"),
                  l(r, o, y, "\u2AB5", "\\precneqq"),
                  l(r, o, y, "\u2AB6", "\\succneqq"),
                  l(r, o, y, "\uE016", "\\nsubseteqq"),
                  l(r, o, u, "\u22B4", "\\unlhd"),
                  l(r, o, u, "\u22B5", "\\unrhd"),
                  l(r, o, y, "\u219A", "\\nleftarrow"),
                  l(r, o, y, "\u219B", "\\nrightarrow"),
                  l(r, o, y, "\u21CD", "\\nLeftarrow"),
                  l(r, o, y, "\u21CF", "\\nRightarrow"),
                  l(r, o, y, "\u21AE", "\\nleftrightarrow"),
                  l(r, o, y, "\u21CE", "\\nLeftrightarrow"),
                  l(r, o, y, "\u25B3", "\\vartriangle"),
                  l(r, o, v, "\u210F", "\\hslash"),
                  l(r, o, v, "\u25BD", "\\triangledown"),
                  l(r, o, v, "\u25CA", "\\lozenge"),
                  l(r, o, v, "\u24C8", "\\circledS"),
                  l(r, o, v, "\xAE", "\\circledR"),
                  l(n, o, v, "\xAE", "\\circledR"),
                  l(r, o, v, "\u2221", "\\measuredangle"),
                  l(r, o, v, "\u2204", "\\nexists"),
                  l(r, o, v, "\u2127", "\\mho"),
                  l(r, o, v, "\u2132", "\\Finv"),
                  l(r, o, v, "\u2141", "\\Game"),
                  l(r, o, v, "k", "\\Bbbk"),
                  l(r, o, v, "\u2035", "\\backprime"),
                  l(r, o, v, "\u25B2", "\\blacktriangle"),
                  l(r, o, v, "\u25BC", "\\blacktriangledown"),
                  l(r, o, v, "\u25A0", "\\blacksquare"),
                  l(r, o, v, "\u29EB", "\\blacklozenge"),
                  l(r, o, v, "\u2605", "\\bigstar"),
                  l(r, o, v, "\u2222", "\\sphericalangle"),
                  l(r, o, v, "\u2201", "\\complement"),
                  l(r, o, v, "\xF0", "\\eth"),
                  l(r, o, v, "\u2571", "\\diagup"),
                  l(r, o, v, "\u2572", "\\diagdown"),
                  l(r, o, v, "\u25A1", "\\square"),
                  l(r, o, v, "\u25A1", "\\Box"),
                  l(r, o, v, "\u25CA", "\\Diamond"),
                  l(r, o, v, "\xA5", "\\yen"),
                  l(r, o, v, "\u2713", "\\checkmark"),
                  l(n, o, v, "\u2713", "\\checkmark"),
                  l(r, o, v, "\u2136", "\\beth"),
                  l(r, o, v, "\u2138", "\\daleth"),
                  l(r, o, v, "\u2137", "\\gimel"),
                  l(r, o, v, "\u03DD", "\\digamma"),
                  l(r, o, v, "\u03F0", "\\varkappa"),
                  l(r, o, g, "\u250C", "\\ulcorner"),
                  l(r, o, p, "\u2510", "\\urcorner"),
                  l(r, o, g, "\u2514", "\\llcorner"),
                  l(r, o, p, "\u2518", "\\lrcorner"),
                  l(r, o, y, "\u2266", "\\leqq"),
                  l(r, o, y, "\u2A7D", "\\leqslant"),
                  l(r, o, y, "\u2A95", "\\eqslantless"),
                  l(r, o, y, "\u2272", "\\lesssim"),
                  l(r, o, y, "\u2A85", "\\lessapprox"),
                  l(r, o, y, "\u224A", "\\approxeq"),
                  l(r, o, u, "\u22D6", "\\lessdot"),
                  l(r, o, y, "\u22D8", "\\lll"),
                  l(r, o, y, "\u2276", "\\lessgtr"),
                  l(r, o, y, "\u22DA", "\\lesseqgtr"),
                  l(r, o, y, "\u2A8B", "\\lesseqqgtr"),
                  l(r, o, y, "\u2251", "\\doteqdot"),
                  l(r, o, y, "\u2253", "\\risingdotseq"),
                  l(r, o, y, "\u2252", "\\fallingdotseq"),
                  l(r, o, y, "\u223D", "\\backsim"),
                  l(r, o, y, "\u22CD", "\\backsimeq"),
                  l(r, o, y, "\u2AC5", "\\subseteqq"),
                  l(r, o, y, "\u22D0", "\\Subset"),
                  l(r, o, y, "\u228F", "\\sqsubset"),
                  l(r, o, y, "\u227C", "\\preccurlyeq"),
                  l(r, o, y, "\u22DE", "\\curlyeqprec"),
                  l(r, o, y, "\u227E", "\\precsim"),
                  l(r, o, y, "\u2AB7", "\\precapprox"),
                  l(r, o, y, "\u22B2", "\\vartriangleleft"),
                  l(r, o, y, "\u22B4", "\\trianglelefteq"),
                  l(r, o, y, "\u22A8", "\\vDash"),
                  l(r, o, y, "\u22AA", "\\Vvdash"),
                  l(r, o, y, "\u2323", "\\smallsmile"),
                  l(r, o, y, "\u2322", "\\smallfrown"),
                  l(r, o, y, "\u224F", "\\bumpeq"),
                  l(r, o, y, "\u224E", "\\Bumpeq"),
                  l(r, o, y, "\u2267", "\\geqq"),
                  l(r, o, y, "\u2A7E", "\\geqslant"),
                  l(r, o, y, "\u2A96", "\\eqslantgtr"),
                  l(r, o, y, "\u2273", "\\gtrsim"),
                  l(r, o, y, "\u2A86", "\\gtrapprox"),
                  l(r, o, u, "\u22D7", "\\gtrdot"),
                  l(r, o, y, "\u22D9", "\\ggg"),
                  l(r, o, y, "\u2277", "\\gtrless"),
                  l(r, o, y, "\u22DB", "\\gtreqless"),
                  l(r, o, y, "\u2A8C", "\\gtreqqless"),
                  l(r, o, y, "\u2256", "\\eqcirc"),
                  l(r, o, y, "\u2257", "\\circeq"),
                  l(r, o, y, "\u225C", "\\triangleq"),
                  l(r, o, y, "\u223C", "\\thicksim"),
                  l(r, o, y, "\u2248", "\\thickapprox"),
                  l(r, o, y, "\u2AC6", "\\supseteqq"),
                  l(r, o, y, "\u22D1", "\\Supset"),
                  l(r, o, y, "\u2290", "\\sqsupset"),
                  l(r, o, y, "\u227D", "\\succcurlyeq"),
                  l(r, o, y, "\u22DF", "\\curlyeqsucc"),
                  l(r, o, y, "\u227F", "\\succsim"),
                  l(r, o, y, "\u2AB8", "\\succapprox"),
                  l(r, o, y, "\u22B3", "\\vartriangleright"),
                  l(r, o, y, "\u22B5", "\\trianglerighteq"),
                  l(r, o, y, "\u22A9", "\\Vdash"),
                  l(r, o, y, "\u2223", "\\shortmid"),
                  l(r, o, y, "\u2225", "\\shortparallel"),
                  l(r, o, y, "\u226C", "\\between"),
                  l(r, o, y, "\u22D4", "\\pitchfork"),
                  l(r, o, y, "\u221D", "\\varpropto"),
                  l(r, o, y, "\u25C0", "\\blacktriangleleft"),
                  l(r, o, y, "\u2234", "\\therefore"),
                  l(r, o, y, "\u220D", "\\backepsilon"),
                  l(r, o, y, "\u25B6", "\\blacktriangleright"),
                  l(r, o, y, "\u2235", "\\because"),
                  l(r, o, y, "\u22D8", "\\llless"),
                  l(r, o, y, "\u22D9", "\\gggtr"),
                  l(r, o, u, "\u22B2", "\\lhd"),
                  l(r, o, u, "\u22B3", "\\rhd"),
                  l(r, o, y, "\u2242", "\\eqsim"),
                  l(r, s, y, "\u22C8", "\\Join"),
                  l(r, o, y, "\u2251", "\\Doteq"),
                  l(r, o, u, "\u2214", "\\dotplus"),
                  l(r, o, u, "\u2216", "\\smallsetminus"),
                  l(r, o, u, "\u22D2", "\\Cap"),
                  l(r, o, u, "\u22D3", "\\Cup"),
                  l(r, o, u, "\u2A5E", "\\doublebarwedge"),
                  l(r, o, u, "\u229F", "\\boxminus"),
                  l(r, o, u, "\u229E", "\\boxplus"),
                  l(r, o, u, "\u22C7", "\\divideontimes"),
                  l(r, o, u, "\u22C9", "\\ltimes"),
                  l(r, o, u, "\u22CA", "\\rtimes"),
                  l(r, o, u, "\u22CB", "\\leftthreetimes"),
                  l(r, o, u, "\u22CC", "\\rightthreetimes"),
                  l(r, o, u, "\u22CF", "\\curlywedge"),
                  l(r, o, u, "\u22CE", "\\curlyvee"),
                  l(r, o, u, "\u229D", "\\circleddash"),
                  l(r, o, u, "\u229B", "\\circledast"),
                  l(r, o, u, "\u22C5", "\\centerdot"),
                  l(r, o, u, "\u22BA", "\\intercal"),
                  l(r, o, u, "\u22D2", "\\doublecap"),
                  l(r, o, u, "\u22D3", "\\doublecup"),
                  l(r, o, u, "\u22A0", "\\boxtimes"),
                  l(r, o, y, "\u21E2", "\\dashrightarrow"),
                  l(r, o, y, "\u21E0", "\\dashleftarrow"),
                  l(r, o, y, "\u21C7", "\\leftleftarrows"),
                  l(r, o, y, "\u21C6", "\\leftrightarrows"),
                  l(r, o, y, "\u21DA", "\\Lleftarrow"),
                  l(r, o, y, "\u219E", "\\twoheadleftarrow"),
                  l(r, o, y, "\u21A2", "\\leftarrowtail"),
                  l(r, o, y, "\u21AB", "\\looparrowleft"),
                  l(r, o, y, "\u21CB", "\\leftrightharpoons"),
                  l(r, o, y, "\u21B6", "\\curvearrowleft"),
                  l(r, o, y, "\u21BA", "\\circlearrowleft"),
                  l(r, o, y, "\u21B0", "\\Lsh"),
                  l(r, o, y, "\u21C8", "\\upuparrows"),
                  l(r, o, y, "\u21BF", "\\upharpoonleft"),
                  l(r, o, y, "\u21C3", "\\downharpoonleft"),
                  l(r, o, y, "\u22B8", "\\multimap"),
                  l(r, o, y, "\u21AD", "\\leftrightsquigarrow"),
                  l(r, o, y, "\u21C9", "\\rightrightarrows"),
                  l(r, o, y, "\u21C4", "\\rightleftarrows"),
                  l(r, o, y, "\u21A0", "\\twoheadrightarrow"),
                  l(r, o, y, "\u21A3", "\\rightarrowtail"),
                  l(r, o, y, "\u21AC", "\\looparrowright"),
                  l(r, o, y, "\u21B7", "\\curvearrowright"),
                  l(r, o, y, "\u21BB", "\\circlearrowright"),
                  l(r, o, y, "\u21B1", "\\Rsh"),
                  l(r, o, y, "\u21CA", "\\downdownarrows"),
                  l(r, o, y, "\u21BE", "\\upharpoonright"),
                  l(r, o, y, "\u21C2", "\\downharpoonright"),
                  l(r, o, y, "\u21DD", "\\rightsquigarrow"),
                  l(r, o, y, "\u21DD", "\\leadsto"),
                  l(r, o, y, "\u21DB", "\\Rrightarrow"),
                  l(r, o, y, "\u21BE", "\\restriction"),
                  l(r, s, v, "\u2018", "`"),
                  l(r, s, v, "$", "\\$"),
                  l(n, s, v, "$", "\\$"),
                  l(n, s, v, "$", "\\textdollar"),
                  l(r, s, v, "%", "\\%"),
                  l(n, s, v, "%", "\\%"),
                  l(r, s, v, "_", "\\_"),
                  l(n, s, v, "_", "\\_"),
                  l(n, s, v, "_", "\\textunderscore"),
                  l(r, s, v, "\u2220", "\\angle"),
                  l(r, s, v, "\u221E", "\\infty"),
                  l(r, s, v, "\u2032", "\\prime"),
                  l(r, s, v, "\u25B3", "\\triangle"),
                  l(r, s, v, "\u0393", "\\Gamma", !0),
                  l(r, s, v, "\u0394", "\\Delta", !0),
                  l(r, s, v, "\u0398", "\\Theta", !0),
                  l(r, s, v, "\u039B", "\\Lambda", !0),
                  l(r, s, v, "\u039E", "\\Xi", !0),
                  l(r, s, v, "\u03A0", "\\Pi", !0),
                  l(r, s, v, "\u03A3", "\\Sigma", !0),
                  l(r, s, v, "\u03A5", "\\Upsilon", !0),
                  l(r, s, v, "\u03A6", "\\Phi", !0),
                  l(r, s, v, "\u03A8", "\\Psi", !0),
                  l(r, s, v, "\u03A9", "\\Omega", !0),
                  l(r, s, v, "\xAC", "\\neg"),
                  l(r, s, v, "\xAC", "\\lnot"),
                  l(r, s, v, "\u22A4", "\\top"),
                  l(r, s, v, "\u22A5", "\\bot"),
                  l(r, s, v, "\u2205", "\\emptyset"),
                  l(r, o, v, "\u2205", "\\varnothing"),
                  l(r, s, m, "\u03B1", "\\alpha", !0),
                  l(r, s, m, "\u03B2", "\\beta", !0),
                  l(r, s, m, "\u03B3", "\\gamma", !0),
                  l(r, s, m, "\u03B4", "\\delta", !0),
                  l(r, s, m, "\u03F5", "\\epsilon", !0),
                  l(r, s, m, "\u03B6", "\\zeta", !0),
                  l(r, s, m, "\u03B7", "\\eta", !0),
                  l(r, s, m, "\u03B8", "\\theta", !0),
                  l(r, s, m, "\u03B9", "\\iota", !0),
                  l(r, s, m, "\u03BA", "\\kappa", !0),
                  l(r, s, m, "\u03BB", "\\lambda", !0),
                  l(r, s, m, "\u03BC", "\\mu", !0),
                  l(r, s, m, "\u03BD", "\\nu", !0),
                  l(r, s, m, "\u03BE", "\\xi", !0),
                  l(r, s, m, "\u03BF", "\\omicron", !0),
                  l(r, s, m, "\u03C0", "\\pi", !0),
                  l(r, s, m, "\u03C1", "\\rho", !0),
                  l(r, s, m, "\u03C3", "\\sigma", !0),
                  l(r, s, m, "\u03C4", "\\tau", !0),
                  l(r, s, m, "\u03C5", "\\upsilon", !0),
                  l(r, s, m, "\u03D5", "\\phi", !0),
                  l(r, s, m, "\u03C7", "\\chi", !0),
                  l(r, s, m, "\u03C8", "\\psi", !0),
                  l(r, s, m, "\u03C9", "\\omega", !0),
                  l(r, s, m, "\u03B5", "\\varepsilon", !0),
                  l(r, s, m, "\u03D1", "\\vartheta", !0),
                  l(r, s, m, "\u03D6", "\\varpi", !0),
                  l(r, s, m, "\u03F1", "\\varrho", !0),
                  l(r, s, m, "\u03C2", "\\varsigma", !0),
                  l(r, s, m, "\u03C6", "\\varphi", !0),
                  l(r, s, u, "\u2217", "*"),
                  l(r, s, u, "+", "+"),
                  l(r, s, u, "\u2212", "-"),
                  l(r, s, u, "\u22C5", "\\cdot"),
                  l(r, s, u, "\u2218", "\\circ"),
                  l(r, s, u, "\xF7", "\\div"),
                  l(r, s, u, "\xB1", "\\pm"),
                  l(r, s, u, "\xD7", "\\times"),
                  l(r, s, u, "\u2229", "\\cap"),
                  l(r, s, u, "\u222A", "\\cup"),
                  l(r, s, u, "\u2216", "\\setminus"),
                  l(r, s, u, "\u2227", "\\land"),
                  l(r, s, u, "\u2228", "\\lor"),
                  l(r, s, u, "\u2227", "\\wedge"),
                  l(r, s, u, "\u2228", "\\vee"),
                  l(r, s, v, "\u221A", "\\surd"),
                  l(r, s, g, "(", "("),
                  l(r, s, g, "[", "["),
                  l(r, s, g, "\u27E8", "\\langle"),
                  l(r, s, g, "\u2223", "\\lvert"),
                  l(r, s, g, "\u2225", "\\lVert"),
                  l(r, s, p, ")", ")"),
                  l(r, s, p, "]", "]"),
                  l(r, s, p, "?", "?"),
                  l(r, s, p, "!", "!"),
                  l(r, s, p, "\u27E9", "\\rangle"),
                  l(r, s, p, "\u2223", "\\rvert"),
                  l(r, s, p, "\u2225", "\\rVert"),
                  l(r, s, y, "=", "="),
                  l(r, s, y, "<", "<"),
                  l(r, s, y, ">", ">"),
                  l(r, s, y, ":", ":"),
                  l(r, s, y, "\u2248", "\\approx"),
                  l(r, s, y, "\u2245", "\\cong"),
                  l(r, s, y, "\u2265", "\\ge"),
                  l(r, s, y, "\u2265", "\\geq"),
                  l(r, s, y, "\u2190", "\\gets"),
                  l(r, s, y, ">", "\\gt"),
                  l(r, s, y, "\u2208", "\\in"),
                  l(r, s, y, "\u2209", "\\notin"),
                  l(r, s, y, "\u0338", "\\not"),
                  l(r, s, y, "\u2282", "\\subset"),
                  l(r, s, y, "\u2283", "\\supset"),
                  l(r, s, y, "\u2286", "\\subseteq"),
                  l(r, s, y, "\u2287", "\\supseteq"),
                  l(r, o, y, "\u2288", "\\nsubseteq"),
                  l(r, o, y, "\u2289", "\\nsupseteq"),
                  l(r, s, y, "\u22A8", "\\models"),
                  l(r, s, y, "\u2190", "\\leftarrow"),
                  l(r, s, y, "\u2264", "\\le"),
                  l(r, s, y, "\u2264", "\\leq"),
                  l(r, s, y, "<", "\\lt"),
                  l(r, s, y, "\u2260", "\\ne"),
                  l(r, s, y, "\u2260", "\\neq"),
                  l(r, s, y, "\u2192", "\\rightarrow"),
                  l(r, s, y, "\u2192", "\\to"),
                  l(r, o, y, "\u2271", "\\ngeq"),
                  l(r, o, y, "\u2270", "\\nleq"),
                  l(r, s, b, null, "\\!"),
                  l(r, s, b, "\xA0", "\\ "),
                  l(r, s, b, "\xA0", "~"),
                  l(r, s, b, null, "\\,"),
                  l(r, s, b, null, "\\:"),
                  l(r, s, b, null, "\\;"),
                  l(r, s, b, null, "\\enspace"),
                  l(r, s, b, null, "\\qquad"),
                  l(r, s, b, null, "\\quad"),
                  l(r, s, b, "\xA0", "\\space"),
                  l(r, s, f, ",", ","),
                  l(r, s, f, ";", ";"),
                  l(r, s, f, ":", "\\colon"),
                  l(r, o, u, "\u22BC", "\\barwedge"),
                  l(r, o, u, "\u22BB", "\\veebar"),
                  l(r, s, u, "\u2299", "\\odot"),
                  l(r, s, u, "\u2295", "\\oplus"),
                  l(r, s, u, "\u2297", "\\otimes"),
                  l(r, s, v, "\u2202", "\\partial"),
                  l(r, s, u, "\u2298", "\\oslash"),
                  l(r, o, u, "\u229A", "\\circledcirc"),
                  l(r, o, u, "\u22A1", "\\boxdot"),
                  l(r, s, u, "\u25B3", "\\bigtriangleup"),
                  l(r, s, u, "\u25BD", "\\bigtriangledown"),
                  l(r, s, u, "\u2020", "\\dagger"),
                  l(r, s, u, "\u22C4", "\\diamond"),
                  l(r, s, u, "\u22C6", "\\star"),
                  l(r, s, u, "\u25C3", "\\triangleleft"),
                  l(r, s, u, "\u25B9", "\\triangleright"),
                  l(r, s, g, "{", "\\{"),
                  l(n, s, v, "{", "\\{"),
                  l(n, s, v, "{", "\\textbraceleft"),
                  l(r, s, p, "}", "\\}"),
                  l(n, s, v, "}", "\\}"),
                  l(n, s, v, "}", "\\textbraceright"),
                  l(r, s, g, "{", "\\lbrace"),
                  l(r, s, p, "}", "\\rbrace"),
                  l(r, s, g, "[", "\\lbrack"),
                  l(r, s, p, "]", "\\rbrack"),
                  l(n, s, v, "<", "\\textless"),
                  l(n, s, v, ">", "\\textgreater"),
                  l(r, s, g, "\u230A", "\\lfloor"),
                  l(r, s, p, "\u230B", "\\rfloor"),
                  l(r, s, g, "\u2308", "\\lceil"),
                  l(r, s, p, "\u2309", "\\rceil"),
                  l(r, s, v, "\\", "\\backslash"),
                  l(r, s, v, "\u2223", "|"),
                  l(r, s, v, "\u2223", "\\vert"),
                  l(n, s, v, "|", "\\textbar"),
                  l(r, s, v, "\u2225", "\\|"),
                  l(r, s, v, "\u2225", "\\Vert"),
                  l(n, s, v, "\u2225", "\\textbardbl"),
                  l(r, s, y, "\u2191", "\\uparrow"),
                  l(r, s, y, "\u21D1", "\\Uparrow"),
                  l(r, s, y, "\u2193", "\\downarrow"),
                  l(r, s, y, "\u21D3", "\\Downarrow"),
                  l(r, s, y, "\u2195", "\\updownarrow"),
                  l(r, s, y, "\u21D5", "\\Updownarrow"),
                  l(r, s, h, "\u2210", "\\coprod"),
                  l(r, s, h, "\u22C1", "\\bigvee"),
                  l(r, s, h, "\u22C0", "\\bigwedge"),
                  l(r, s, h, "\u2A04", "\\biguplus"),
                  l(r, s, h, "\u22C2", "\\bigcap"),
                  l(r, s, h, "\u22C3", "\\bigcup"),
                  l(r, s, h, "\u222B", "\\int"),
                  l(r, s, h, "\u222B", "\\intop"),
                  l(r, s, h, "\u222C", "\\iint"),
                  l(r, s, h, "\u222D", "\\iiint"),
                  l(r, s, h, "\u220F", "\\prod"),
                  l(r, s, h, "\u2211", "\\sum"),
                  l(r, s, h, "\u2A02", "\\bigotimes"),
                  l(r, s, h, "\u2A01", "\\bigoplus"),
                  l(r, s, h, "\u2A00", "\\bigodot"),
                  l(r, s, h, "\u222E", "\\oint"),
                  l(r, s, h, "\u2A06", "\\bigsqcup"),
                  l(r, s, h, "\u222B", "\\smallint"),
                  l(n, s, c, "\u2026", "\\textellipsis"),
                  l(r, s, c, "\u2026", "\\mathellipsis"),
                  l(n, s, c, "\u2026", "\\ldots", !0),
                  l(r, s, c, "\u2026", "\\ldots", !0),
                  l(r, s, c, "\u22EF", "\\cdots", !0),
                  l(r, s, c, "\u22F1", "\\ddots", !0),
                  l(r, s, v, "\u22EE", "\\vdots", !0),
                  l(r, s, d, "\xB4", "\\acute"),
                  l(r, s, d, "`", "\\grave"),
                  l(r, s, d, "\xA8", "\\ddot"),
                  l(r, s, d, "~", "\\tilde"),
                  l(r, s, d, "\xAF", "\\bar"),
                  l(r, s, d, "\u02D8", "\\breve"),
                  l(r, s, d, "\u02C7", "\\check"),
                  l(r, s, d, "^", "\\hat"),
                  l(r, s, d, "\u20D7", "\\vec"),
                  l(r, s, d, "\u02D9", "\\dot"),
                  l(r, s, m, "\u0131", "\\imath"),
                  l(r, s, m, "\u0237", "\\jmath"),
                  l(n, s, d, "\u02CA", "\\'"),
                  l(n, s, d, "\u02CB", "\\`"),
                  l(n, s, d, "\u02C6", "\\^"),
                  l(n, s, d, "\u02DC", "\\~"),
                  l(n, s, d, "\u02C9", "\\="),
                  l(n, s, d, "\u02D8", "\\u"),
                  l(n, s, d, "\u02D9", "\\."),
                  l(n, s, d, "\u02DA", "\\r"),
                  l(n, s, d, "\u02C7", "\\v"),
                  l(n, s, d, "\xA8", '\\"'),
                  l(n, s, d, "\u030B", "\\H"),
                  l(n, s, v, "\u2013", "--"),
                  l(n, s, v, "\u2013", "\\textendash"),
                  l(n, s, v, "\u2014", "---"),
                  l(n, s, v, "\u2014", "\\textemdash"),
                  l(n, s, v, "\u2018", "`"),
                  l(n, s, v, "\u2018", "\\textquoteleft"),
                  l(n, s, v, "\u2019", "'"),
                  l(n, s, v, "\u2019", "\\textquoteright"),
                  l(n, s, v, "\u201C", "``"),
                  l(n, s, v, "\u201C", "\\textquotedblleft"),
                  l(n, s, v, "\u201D", "''"),
                  l(n, s, v, "\u201D", "\\textquotedblright"),
                  l(r, s, v, "\xB0", "\\degree"),
                  l(n, s, v, "\xB0", "\\degree"),
                  l(r, s, m, "\xA3", "\\pounds"),
                  l(r, s, m, "\xA3", "\\mathsterling"),
                  l(n, s, m, "\xA3", "\\pounds"),
                  l(n, s, m, "\xA3", "\\textsterling"),
                  l(r, o, v, "\u2720", "\\maltese"),
                  l(n, o, v, "\u2720", "\\maltese"),
                  l(n, s, b, "\xA0", "\\ "),
                  l(n, s, b, "\xA0", " "),
                  l(n, s, b, "\xA0", "~");
                for (var x = '0123456789/@."', k = 0, i; k < x.length; k++)
                  (i = x.charAt(k)), l(r, s, v, i, i);
                for (
                  var w = '0123456789!@*()-=+[]<>|";:?/.,', M = 0, S;
                  M < w.length;
                  M++
                )
                  (S = w.charAt(M)), l(n, s, v, S, S);
                for (
                  var z =
                      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ",
                    A = 0,
                    T;
                  A < z.length;
                  A++
                )
                  (T = z.charAt(A)), l(r, s, m, T, T), l(n, s, v, T, T);
                for (var C = 192, N; 214 >= C; C++)
                  (N = a(C)), l(r, s, m, N, N), l(n, s, v, N, N);
                for (var R = 216, L; 246 >= R; R++)
                  (L = a(R)), l(r, s, m, L, L), l(n, s, v, L, L);
                for (var E = 248, q; 255 >= E; E++)
                  (q = a(E)), l(r, s, m, q, q), l(n, s, v, q, q);
                for (var O = 1040, _; 1103 >= O; O++)
                  (_ = a(O)), l(n, s, v, _, _);
                l(n, s, v, "\u2013", "\u2013"),
                  l(n, s, v, "\u2014", "\u2014"),
                  l(n, s, v, "\u2018", "\u2018"),
                  l(n, s, v, "\u2019", "\u2019"),
                  l(n, s, v, "\u201C", "\u201C"),
                  l(n, s, v, "\u201D", "\u201D");
              },
              {},
            ],
            49: [
              function (e, t) {
                var a = /[\uAC00-\uD7AF]/,
                  i = /[\u3000-\u30FF\u4E00-\u9FAF\uAC00-\uD7AF\uFF00-\uFF60]/;
                t.exports = { cjkRegex: i, hangulRegex: a };
              },
              {},
            ],
            50: [
              function (e, t) {
                var a = e("./ParseError"),
                  i = (function (e) {
                    return e && e.__esModule ? e : { default: e };
                  })(a),
                  l = {
                    pt: 1,
                    mm: 2.8452755905511813,
                    cm: 28.45275590551181,
                    in: 72.27,
                    bp: 1.00375,
                    pc: 12,
                    dd: 1.070008643042351,
                    cc: 12.84010371650821,
                    nd: 1.0669781931464175,
                    nc: 12.80373831775701,
                    sp: 0.0000152587890625,
                    px: 1.00375,
                  },
                  r = { ex: !0, em: !0, mu: !0 };
                t.exports = {
                  validUnit: function (e) {
                    return (
                      e.unit && (e = e.unit), e in l || e in r || "ex" === e
                    );
                  },
                  calculateSize: function (e, t) {
                    var a;
                    if (e.unit in l)
                      a =
                        l[e.unit] / t.fontMetrics().ptPerEm / t.sizeMultiplier;
                    else if ("mu" === e.unit) a = t.fontMetrics().cssEmPerMu;
                    else {
                      var r;
                      if (
                        ((r = t.style.isTight()
                          ? t.havingStyle(t.style.text())
                          : t),
                        "ex" === e.unit)
                      )
                        a = r.fontMetrics().xHeight;
                      else if ("em" === e.unit) a = r.fontMetrics().quad;
                      else
                        throw new i.default("Invalid unit: '" + e.unit + "'");
                      r !== t && (a *= r.sizeMultiplier / t.sizeMultiplier);
                    }
                    return e.number * a;
                  },
                };
              },
              { "./ParseError": 29 },
            ],
            51: [
              function (e, t) {
                function a(e) {
                  return n[e];
                }
                var r = Array.prototype.indexOf,
                  i = function (e, t) {
                    if (null == e) return -1;
                    if (r && e.indexOf === r) return e.indexOf(t);
                    for (var a = e.length, l = 0; l < a; l++)
                      if (e[l] === t) return l;
                    return -1;
                  },
                  l = /([A-Z])/g,
                  n = {
                    "&": "&amp;",
                    ">": "&gt;",
                    "<": "&lt;",
                    '"': "&quot;",
                    "'": "&#x27;",
                  },
                  s = /[&><"']/g,
                  o;
                if ("undefined" != typeof document) {
                  var d = document.createElement("span");
                  o =
                    "textContent" in d
                      ? function (e, t) {
                          e.textContent = t;
                        }
                      : function (e, t) {
                          e.innerText = t;
                        };
                }
                t.exports = {
                  contains: function (e, t) {
                    return -1 !== i(e, t);
                  },
                  deflt: function (e, t) {
                    return e === void 0 ? t : e;
                  },
                  escape: function (e) {
                    return ("" + e).replace(s, a);
                  },
                  hyphenate: function (e) {
                    return e.replace(l, "-$1").toLowerCase();
                  },
                  indexOf: i,
                  setTextContent: o,
                  clearNode: function (e) {
                    o(e, "");
                  },
                };
              },
              {},
            ],
          },
          {},
          [1],
        )(1);
      });
    }),
    P = (function (e) {
      return e && e.__esModule ? e["default"] : e;
    })(I);
  const H = function (e, t, a) {
      let i = a,
        l = 0;
      for (const r = e.length; i < t.length; ) {
        const a = t[i];
        if (0 >= l && t.slice(i, i + r) === e) return i;
        "\\" === a ? i++ : "{" === a ? l++ : "}" === a && l--;
        i++;
      }
      return -1;
    },
    F = function (e, t, a, i) {
      const l = [];
      for (let r = 0; r < e.length; r++)
        if ("text" === e[r].type) {
          const n = e[r].data;
          let s = !0,
            o = 0,
            d;
          for (
            d = n.indexOf(t),
              -1 !== d &&
                ((o = d),
                l.push({ type: "text", data: n.slice(0, o) }),
                (s = !1));
            ;

          ) {
            if (s) {
              if (((d = n.indexOf(t, o)), -1 === d)) break;
              l.push({ type: "text", data: n.slice(o, d) }), (o = d);
            } else {
              if (((d = H(a, n, o + t.length)), -1 === d)) break;
              l.push({
                type: "math",
                data: n.slice(o + t.length, d),
                rawData: n.slice(o, d + a.length),
                display: i,
              }),
                (o = d + a.length);
            }
            s = !s;
          }
          l.push({ type: "text", data: n.slice(o) });
        } else l.push(e[r]);
      return l;
    },
    U = function (e, t) {
      let a = [{ type: "text", data: e }];
      for (let l = 0; l < t.length; l++) {
        const e = t[l];
        a = F(a, e.left, e.right, e.display || !1);
      }
      return a;
    },
    j = function (e, t) {
      const a = U(e, t.delimiters),
        l = document.createDocumentFragment();
      for (let r = 0; r < a.length; r++)
        if ("text" === a[r].type)
          l.appendChild(document.createTextNode(a[r].data));
        else {
          const e = document.createElement("d-math"),
            i = a[r].data;
          t.displayMode = a[r].display;
          try {
            (e.textContent = i), t.displayMode && e.setAttribute("block", "");
          } catch (i) {
            if (!(i instanceof katex.ParseError)) throw i;
            t.errorCallback(
              "KaTeX auto-render: Failed to parse `" + a[r].data + "` with ",
              i,
            ),
              l.appendChild(document.createTextNode(a[r].rawData));
            continue;
          }
          l.appendChild(e);
        }
      return l;
    },
    Y = function (e, t) {
      for (let a = 0; a < e.childNodes.length; a++) {
        const i = e.childNodes[a];
        if (3 === i.nodeType) {
          const l = j(i.textContent, t);
          (a += l.childNodes.length - 1), e.replaceChild(l, i);
        } else if (1 === i.nodeType) {
          const e = -1 === t.ignoredTags.indexOf(i.nodeName.toLowerCase());
          e && Y(i, t);
        }
      }
    },
    V = {
      delimiters: [
        { left: "$$", right: "$$", display: !0 },
        { left: "\\[", right: "\\]", display: !0 },
        { left: "\\(", right: "\\)", display: !1 },
      ],
      ignoredTags: [
        "script",
        "noscript",
        "style",
        "textarea",
        "pre",
        "code",
        "svg",
      ],
      errorCallback: function (e, t) {
        console.error(e, t);
      },
    },
    G = function (e, t) {
      if (!e) throw new Error("No element provided to render");
      const a = Object.assign({}, V, t);
      Y(e, a);
    };
  var W = /["'&<>]/,
    K = function (e) {
      var t = "" + e,
        a = W.exec(t);
      if (!a) return t;
      var i = "",
        l = 0,
        r = 0,
        n;
      for (l = a.index; l < t.length; l++) {
        switch (t.charCodeAt(l)) {
          case 34:
            n = "&quot;";
            break;
          case 38:
            n = "&amp;";
            break;
          case 39:
            n = "&#39;";
            break;
          case 60:
            n = "&lt;";
            break;
          case 62:
            n = "&gt;";
            break;
          default:
            continue;
        }
        r !== l && (i += t.substring(r, l)), (r = l + 1), (i += n);
      }
      return r === l ? i : i + t.substring(r, l);
    };
  const J = `
window.addEventListener('WebComponentsReady', function() {
  console.warn('WebComponentsReady');
  const loaderTag = document.createElement('script');
  loaderTag.src = 'https://distill.pub/template.v2.js';
  document.head.insertBefore(loaderTag, document.head.firstChild);
});
`,
    X = `
d-citation-list {
  contain: style;
}

d-citation-list .references {
  grid-column: text;
}

d-citation-list .references .title {
  font-weight: 500;
}
`;
  const $ = `
<style>
  distill-appendix {
    contain: layout style;
  }

  distill-appendix .citation {
    font-size: 11px;
    line-height: 15px;
    border-left: 1px solid rgba(0, 0, 0, 0.1);
    padding-left: 18px;
    border: 1px solid rgba(0,0,0,0.1);
    background: rgba(0, 0, 0, 0.02);
    padding: 10px 18px;
    border-radius: 3px;
    color: rgba(150, 150, 150, 1);
    overflow: hidden;
    margin-top: -12px;
    white-space: pre-wrap;
    word-wrap: break-word;
  }

  distill-appendix > * {
    grid-column: text;
  }
</style>
`;
  const Q = new Map([
      [
        "ExtractFrontmatter",
        function (e, t) {
          const i = e.querySelector("d-front-matter");
          if (!i) return void console.warn("No front matter tag found!");
          const r = l(i);
          a(t, r);
        },
      ],
      [
        "ExtractBibliography",
        function (e, a) {
          const i = e.querySelector("d-bibliography");
          if (!i) return void console.warn("No bibliography tag found!");
          const l = i.getAttribute("src");
          if (l) {
            const r = a.inputDirectory + "/" + l,
              n = t.readFileSync(r, "utf-8"),
              s = o(n),
              d = e.createElement("script");
            (d.type = "text/json"),
              (d.textContent = JSON.stringify([...s])),
              i.appendChild(d),
              i.removeAttribute("src");
          }
          a.bibliography = u(i);
        },
      ],
      [
        "ExtractCitations",
        function (e, t) {
          const a = new Set(t.citations),
            i = p(e);
          for (const l of i) a.add(l);
          t.citations = Array.from(a);
        },
      ],
    ]),
    Z = new Map([
      [
        "HTML",
        function (e) {
          const t = e.querySelector("head");
          if (
            (e.querySelector("html").getAttribute("lang") ||
              e.querySelector("html").setAttribute("lang", "en"),
            !e.querySelector("meta[charset]"))
          ) {
            const a = e.createElement("meta");
            a.setAttribute("charset", "utf-8"), t.appendChild(a);
          }
          if (!e.querySelector("meta[name=viewport]")) {
            const a = e.createElement("meta");
            a.setAttribute("name", "viewport"),
              a.setAttribute("content", "width=device-width, initial-scale=1"),
              t.appendChild(a);
          }
        },
      ],
      [
        "makeStyleTag",
        function (e) {
          const t = "distill-prerendered-styles",
            a = e.getElementById(t);
          if (!a) {
            const a = e.createElement("style");
            (a.id = t), (a.type = "text/css");
            const i = e.createTextNode(
              '/*\n * Copyright 2018 The Distill Template Authors\n *\n * Licensed under the Apache License, Version 2.0 (the "License");\n * you may not use this file except in compliance with the License.\n * You may obtain a copy of the License at\n *\n *      http://www.apache.org/licenses/LICENSE-2.0\n *\n * Unless required by applicable law or agreed to in writing, software\n * distributed under the License is distributed on an "AS IS" BASIS,\n * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n * See the License for the specific language governing permissions and\n * limitations under the License.\n */\n\nhtml {\n  font-size: 14px;\n\tline-height: 1.6em;\n  /* font-family: "Libre Franklin", "Helvetica Neue", sans-serif; */\n  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", Arial, sans-serif;\n  /*, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";*/\n  text-size-adjust: 100%;\n  -ms-text-size-adjust: 100%;\n  -webkit-text-size-adjust: 100%;\n}\n\n@media(min-width: 768px) {\n  html {\n    font-size: 16px;\n  }\n}\n\nbody {\n  margin: 0;\n}\n\n/* a {\n  color: #004276;\n} */\n\nfigure {\n  margin: 0;\n}\n\ntable {\n\tborder-collapse: collapse;\n\tborder-spacing: 0;\n}\n\ntable th {\n\ttext-align: left;\n}\n\ntable thead {\n  border-bottom: 1px solid rgba(0, 0, 0, 0.05);\n}\n\ntable thead th {\n  padding-bottom: 0.5em;\n}\n\ntable tbody :first-child td {\n  padding-top: 0.5em;\n}\n\npre {\n  overflow: auto;\n  max-width: 100%;\n}\n\np {\n  margin-top: 0;\n  margin-bottom: 1em;\n}\n\nsup, sub {\n  vertical-align: baseline;\n  position: relative;\n  top: -0.4em;\n  line-height: 1em;\n}\n\nsub {\n  top: 0.4em;\n}\n\n.kicker,\n.marker {\n  font-size: 15px;\n  font-weight: 600;\n  color: rgba(0, 0, 0, 0.5);\n}\n\n\n/* Headline */\n\n@media(min-width: 1024px) {\n  d-title h1 span {\n    display: block;\n  }\n}\n\n/* Figure */\n\nfigure {\n  position: relative;\n  margin-bottom: 2.5em;\n  margin-top: 1.5em;\n}\n\nfigcaption+figure {\n\n}\n\nfigure img {\n  width: 100%;\n}\n\nfigure svg text,\nfigure svg tspan {\n}\n\nfigcaption,\n.figcaption {\n  color: rgba(0, 0, 0, 0.6);\n  font-size: 12px;\n  line-height: 1.5em;\n}\n\n@media(min-width: 1024px) {\nfigcaption,\n.figcaption {\n    font-size: 13px;\n  }\n}\n\nfigure.external img {\n  background: white;\n  border: 1px solid rgba(0, 0, 0, 0.1);\n  box-shadow: 0 1px 8px rgba(0, 0, 0, 0.1);\n  padding: 18px;\n  box-sizing: border-box;\n}\n\nfigcaption a {\n  color: rgba(0, 0, 0, 0.6);\n}\n\nfigcaption b,\nfigcaption strong, {\n  font-weight: 600;\n  color: rgba(0, 0, 0, 1.0);\n}\n' +
                '/*\n * Copyright 2018 The Distill Template Authors\n *\n * Licensed under the Apache License, Version 2.0 (the "License");\n * you may not use this file except in compliance with the License.\n * You may obtain a copy of the License at\n *\n *      http://www.apache.org/licenses/LICENSE-2.0\n *\n * Unless required by applicable law or agreed to in writing, software\n * distributed under the License is distributed on an "AS IS" BASIS,\n * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n * See the License for the specific language governing permissions and\n * limitations under the License.\n */\n\n@supports not (display: grid) {\n  .base-grid,\n  distill-header,\n  d-title,\n  d-abstract,\n  d-article,\n  d-appendix,\n  distill-appendix,\n  d-byline,\n  d-footnote-list,\n  d-citation-list,\n  distill-footer {\n    display: block;\n    padding: 8px;\n  }\n}\n\n.base-grid,\ndistill-header,\nd-title,\nd-abstract,\nd-article,\nd-appendix,\ndistill-appendix,\nd-byline,\nd-footnote-list,\nd-citation-list,\ndistill-footer {\n  display: grid;\n  justify-items: stretch;\n  grid-template-columns: [screen-start] 8px [page-start kicker-start text-start gutter-start middle-start] 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr [text-end page-end gutter-end kicker-end middle-end] 8px [screen-end];\n  grid-column-gap: 8px;\n}\n\n.grid {\n  display: grid;\n  grid-column-gap: 8px;\n}\n\n@media(min-width: 768px) {\n  .base-grid,\n  distill-header,\n  d-title,\n  d-abstract,\n  d-article,\n  d-appendix,\n  distill-appendix,\n  d-byline,\n  d-footnote-list,\n  d-citation-list,\n  distill-footer {\n    grid-template-columns: [screen-start] 1fr [page-start kicker-start middle-start text-start] 45px 45px 45px 45px 45px 45px 45px 45px [ kicker-end text-end gutter-start] 45px [middle-end] 45px [page-end gutter-end] 1fr [screen-end];\n    grid-column-gap: 16px;\n  }\n\n  .grid {\n    grid-column-gap: 16px;\n  }\n}\n\n@media(min-width: 1000px) {\n  .base-grid,\n  distill-header,\n  d-title,\n  d-abstract,\n  d-article,\n  d-appendix,\n  distill-appendix,\n  d-byline,\n  d-footnote-list,\n  d-citation-list,\n  distill-footer {\n    grid-template-columns: [screen-start] 1fr [page-start kicker-start] 50px [middle-start] 50px [text-start kicker-end] 50px 50px 50px 50px 50px 50px 50px 50px [text-end gutter-start] 50px [middle-end] 50px [page-end gutter-end] 1fr [screen-end];\n    grid-column-gap: 16px;\n  }\n\n  .grid {\n    grid-column-gap: 16px;\n  }\n}\n\n@media(min-width: 1180px) {\n  .base-grid,\n  distill-header,\n  d-title,\n  d-abstract,\n  d-article,\n  d-appendix,\n  distill-appendix,\n  d-byline,\n  d-footnote-list,\n  d-citation-list,\n  distill-footer {\n    grid-template-columns: [screen-start] 1fr [page-start kicker-start] 60px [middle-start] 60px [text-start kicker-end] 60px 60px 60px 60px 60px 60px 60px 60px [text-end gutter-start] 60px [middle-end] 60px [page-end gutter-end] 1fr [screen-end];\n    grid-column-gap: 32px;\n  }\n\n  .grid {\n    grid-column-gap: 32px;\n  }\n}\n\n@media(min-width: 1280px) {\n  .base-grid,\n  distill-header,\n  d-title,\n  d-abstract,\n  d-article,\n  d-appendix,\n  distill-appendix,\n  d-byline,\n  d-footnote-list,\n  d-citation-list,\n  distill-footer {\n    grid-template-columns: [screen-start] 1fr [page-start kicker-start] 70px [middle-start] 70px [text-start kicker-end] 70px 70px 70px 70px 70px 70px 70px 70px [text-end gutter-start] 70px [middle-end] 70px [page-end gutter-end] 1fr [screen-end];\n    grid-column-gap: 32px;\n  }\n\n  .grid {\n    grid-column-gap: 32px;\n  }\n}\n\n@media(min-width: 1320px) {\n  .base-grid,\n  distill-header,\n  d-title,\n  d-abstract,\n  d-article,\n  d-appendix,\n  distill-appendix,\n  d-byline,\n  d-footnote-list,\n  d-citation-list,\n  distill-footer {\n    grid-template-columns: [screen-start] 1fr [page-start kicker-start] 75px [middle-start] 75px [text-start kicker-end] 75px 75px 75px 75px 75px 75px 75px 75px [text-end gutter-start] 75px [middle-end] 75px [page-end gutter-end] 1fr [screen-end];\n    grid-column-gap: 32px;\n  }\n\n  .grid {\n    grid-column-gap: 32px;\n  }\n}\n\n\n\n\n.base-grid {\n  grid-column: screen;\n}\n\n/* .l-body,\nd-article > *  {\n  grid-column: text;\n}\n\n.l-page,\nd-title > *,\nd-figure {\n  grid-column: page;\n} */\n\n.l-gutter {\n  grid-column: gutter;\n}\n\n.l-text,\n.l-body {\n  grid-column: text;\n}\n\n.l-page {\n  grid-column: page;\n}\n\n.l-body-outset {\n  grid-column: middle;\n}\n\n.l-page-outset {\n  grid-column: page;\n}\n\n.l-screen {\n  grid-column: screen;\n}\n\n.l-screen-inset {\n  grid-column: screen;\n  padding-left: 16px;\n  padding-left: 16px;\n}\n\n\n/* Aside */\n\nd-article aside {\n  grid-column: gutter;\n  font-size: 12px;\n  line-height: 1.6em;\n  color: rgba(0, 0, 0, 0.6)\n}\n\n@media(min-width: 768px) {\n  aside {\n    grid-column: gutter;\n  }\n\n  .side {\n    grid-column: gutter;\n  }\n}\n\nd-article .fake-img {\n    background: #bbb;\n    border: 1px solid rgba(0, 0, 0, 0.1);\n    box-shadow: 0 0px 4px rgba(0, 0, 0, 0.1);\n    margin-bottom: 12px;\n}\n\nd-article .fake-img > p {\n    font-family: monospace;\n    color: white;\n    text-align: left;\n    margin: 12px 0;\n    text-align: center;\n    font-size: 16px;\n}\n' +
                '/*\n * Copyright 2018 The Distill Template Authors\n *\n * Licensed under the Apache License, Version 2.0 (the "License");\n * you may not use this file except in compliance with the License.\n * You may obtain a copy of the License at\n *\n *      http://www.apache.org/licenses/LICENSE-2.0\n *\n * Unless required by applicable law or agreed to in writing, software\n * distributed under the License is distributed on an "AS IS" BASIS,\n * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n * See the License for the specific language governing permissions and\n * limitations under the License.\n */\n\nd-title {\n  padding: 2rem 0 1.5rem;\n  contain: layout style;\n  overflow-x: hidden;\n}\n\n@media(min-width: 768px) {\n  d-title {\n    padding: 4rem 0 1.5rem;\n  }\n}\n\nd-title h1 {\n  grid-column: text;\n  font-size: 40px;\n  font-weight: 700;\n  line-height: 1.1em;\n  margin: 0 0 0.5rem;\n}\n\n@media(min-width: 768px) {\n  d-title h1 {\n    font-size: 50px;\n  }\n}\n\nd-title p {\n  font-weight: 300;\n  font-size: 1.2rem;\n  line-height: 1.55em;\n  grid-column: text;\n}\n\nd-title .status {\n  margin-top: 0px;\n  font-size: 12px;\n  color: #009688;\n  opacity: 0.8;\n  grid-column: kicker;\n}\n\nd-title .status span {\n  line-height: 1;\n  display: inline-block;\n  padding: 6px 0;\n  border-bottom: 1px solid #80cbc4;\n  font-size: 11px;\n  text-transform: uppercase;\n}\n' +
                '/*\n * Copyright 2018 The Distill Template Authors\n *\n * Licensed under the Apache License, Version 2.0 (the "License");\n * you may not use this file except in compliance with the License.\n * You may obtain a copy of the License at\n *\n *      http://www.apache.org/licenses/LICENSE-2.0\n *\n * Unless required by applicable law or agreed to in writing, software\n * distributed under the License is distributed on an "AS IS" BASIS,\n * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n * See the License for the specific language governing permissions and\n * limitations under the License.\n */\n\nd-byline {\n  contain: style;\n  overflow: hidden;\n  border-top: 1px solid rgba(0, 0, 0, 0.1);\n  font-size: 0.8rem;\n  line-height: 1.8em;\n  padding: 1.5rem 0;\n  min-height: 1.8em;\n}\n\n\nd-byline .byline {\n  grid-template-columns: 1fr 1fr;\n  grid-column: text;\n}\n\n@media(min-width: 768px) {\n  d-byline .byline {\n    grid-template-columns: 1fr 1fr 1fr 1fr;\n  }\n}\n\nd-byline .authors-affiliations {\n  grid-column-end: span 2;\n  grid-template-columns: 1fr 1fr;\n  margin-bottom: 1em;\n}\n\n@media(min-width: 768px) {\n  d-byline .authors-affiliations {\n    margin-bottom: 0;\n  }\n}\n\nd-byline h3 {\n  font-size: 0.6rem;\n  font-weight: 400;\n  color: rgba(0, 0, 0, 0.5);\n  margin: 0;\n  text-transform: uppercase;\n}\n\nd-byline p {\n  margin: 0;\n}\n\nd-byline a,\nd-article d-byline a {\n  color: rgba(0, 0, 0, 0.8);\n  text-decoration: none;\n  border-bottom: none;\n}\n\nd-article d-byline a:hover {\n  text-decoration: underline;\n  border-bottom: none;\n}\n\nd-byline p.author,\nd-byline p.editor,\nd-byline p.lecturer {\n  font-weight: 500;\n}\n\nd-byline .affiliations {\n\n}\n' +
                '/*\n * Copyright 2018 The Distill Template Authors\n *\n * Licensed under the Apache License, Version 2.0 (the "License");\n * you may not use this file except in compliance with the License.\n * You may obtain a copy of the License at\n *\n *      http://www.apache.org/licenses/LICENSE-2.0\n *\n * Unless required by applicable law or agreed to in writing, software\n * distributed under the License is distributed on an "AS IS" BASIS,\n * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n * See the License for the specific language governing permissions and\n * limitations under the License.\n */\n\nd-article {\n  contain: layout style;\n  overflow-x: hidden;\n  border-top: 1px solid rgba(0, 0, 0, 0.1);\n  padding-top: 2rem;\n  color: rgba(0, 0, 0, 0.8);\n}\n\nd-article > * {\n  grid-column: text;\n}\n\n@media(min-width: 768px) {\n  d-article {\n    font-size: 16px;\n  }\n}\n\n@media(min-width: 1024px) {\n  d-article {\n    font-size: 1.06rem;\n    line-height: 1.7em;\n  }\n}\n\n\n/* H2 */\n\n\nd-article .marker {\n  text-decoration: none;\n  border: none;\n  counter-reset: section;\n  grid-column: kicker;\n  line-height: 1.7em;\n}\n\nd-article .marker:hover {\n  border: none;\n}\n\nd-article .marker span {\n  padding: 0 3px 4px;\n  border-bottom: 1px solid rgba(0, 0, 0, 0.2);\n  position: relative;\n  top: 4px;\n}\n\nd-article .marker:hover span {\n  color: rgba(0, 0, 0, 0.7);\n  border-bottom: 1px solid rgba(0, 0, 0, 0.7);\n}\n\nd-article h2 {\n  font-weight: 600;\n  font-size: 24px;\n  line-height: 1.25em;\n  margin: 2rem 0 1.5rem 0;\n  border-bottom: 1px solid rgba(0, 0, 0, 0.1);\n  padding-bottom: 1rem;\n}\n\n@media(min-width: 1024px) {\n  d-article h2 {\n    font-size: 36px;\n  }\n}\n\n/* H3 */\n\nd-article h3 {\n  font-weight: 700;\n  font-size: 18px;\n  line-height: 1.4em;\n  margin-bottom: 1em;\n  margin-top: 2em;\n}\n\n@media(min-width: 1024px) {\n  d-article h3 {\n    font-size: 20px;\n  }\n}\n\n/* H4 */\n\nd-article h4 {\n  font-weight: 600;\n  text-transform: uppercase;\n  font-size: 14px;\n  line-height: 1.4em;\n}\n\nd-article a {\n  color: inherit;\n}\n\nd-article p,\nd-article ul,\nd-article ol,\nd-article blockquote {\n  margin-top: 0;\n  margin-bottom: 1em;\n  margin-left: 0;\n  margin-right: 0;\n}\n\nd-article blockquote {\n  border-left: 2px solid rgba(0, 0, 0, 0.2);\n  padding-left: 2em;\n  font-style: italic;\n  color: rgba(0, 0, 0, 0.6);\n}\n\nd-article a {\n  border-bottom: 1px solid rgba(0, 0, 0, 0.4);\n  text-decoration: none;\n}\n\nd-article a:hover {\n  border-bottom: 1px solid rgba(0, 0, 0, 0.8);\n}\n\nd-article .link {\n  text-decoration: underline;\n  cursor: pointer;\n}\n\nd-article ul,\nd-article ol {\n  padding-left: 24px;\n}\n\nd-article li {\n  margin-bottom: 1em;\n  margin-left: 0;\n  padding-left: 0;\n}\n\nd-article li:last-child {\n  margin-bottom: 0;\n}\n\nd-article pre {\n  font-size: 14px;\n  margin-bottom: 20px;\n}\n\nd-article hr {\n  grid-column: screen;\n  width: 100%;\n  border: none;\n  border-bottom: 1px solid rgba(0, 0, 0, 0.1);\n  margin-top: 60px;\n  margin-bottom: 60px;\n}\n\nd-article section {\n  margin-top: 60px;\n  margin-bottom: 60px;\n}\n\nd-article span.equation-mimic {\n  font-family: georgia;\n  font-size: 115%;\n  font-style: italic;\n}\n\nd-article > d-code,\nd-article section > d-code  {\n  display: block;\n}\n\nd-article > d-math[block],\nd-article section > d-math[block]  {\n  display: block;\n}\n\n@media (max-width: 768px) {\n  d-article > d-code,\n  d-article section > d-code,\n  d-article > d-math[block],\n  d-article section > d-math[block] {\n      overflow-x: scroll;\n      -ms-overflow-style: none;  // IE 10+\n      overflow: -moz-scrollbars-none;  // Firefox\n  }\n\n  d-article > d-code::-webkit-scrollbar,\n  d-article section > d-code::-webkit-scrollbar,\n  d-article > d-math[block]::-webkit-scrollbar,\n  d-article section > d-math[block]::-webkit-scrollbar {\n    display: none;  // Safari and Chrome\n  }\n}\n\nd-article .citation {\n  color: #668;\n  cursor: pointer;\n}\n\nd-include {\n  width: auto;\n  display: block;\n}\n\nd-figure {\n  contain: layout style;\n}\n\n/* KaTeX */\n\n.katex, .katex-prerendered {\n  contain: style;\n  display: inline-block;\n}\n\n/* Tables */\n\nd-article table {\n  border-collapse: collapse;\n  margin-bottom: 1.5rem;\n  border-bottom: 1px solid rgba(0, 0, 0, 0.2);\n}\n\nd-article table th {\n  border-bottom: 1px solid rgba(0, 0, 0, 0.2);\n}\n\nd-article table td {\n  border-bottom: 1px solid rgba(0, 0, 0, 0.05);\n}\n\nd-article table tr:last-of-type td {\n  border-bottom: none;\n}\n\nd-article table th,\nd-article table td {\n  font-size: 15px;\n  padding: 2px 8px;\n}\n\nd-article table tbody :first-child td {\n  padding-top: 2px;\n}\n' +
                '/*\n * Copyright 2018 The Distill Template Authors\n *\n * Licensed under the Apache License, Version 2.0 (the "License");\n * you may not use this file except in compliance with the License.\n * You may obtain a copy of the License at\n *\n *      http://www.apache.org/licenses/LICENSE-2.0\n *\n * Unless required by applicable law or agreed to in writing, software\n * distributed under the License is distributed on an "AS IS" BASIS,\n * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n * See the License for the specific language governing permissions and\n * limitations under the License.\n */\n\nspan.katex-display {\n  text-align: center;\n  padding: 8px 0 8px 0;\n  margin: 0.5em 0 0.5em 1em;\n  max-width: 100%;\n}\n\nspan.katex {\n  -webkit-font-smoothing: antialiased;\n  color: rgba(0, 0, 0, 0.8);\n  font-size: 1.18em;\n}\n' +
                '/*\n * Copyright 2018 The Distill Template Authors\n *\n * Licensed under the Apache License, Version 2.0 (the "License");\n * you may not use this file except in compliance with the License.\n * You may obtain a copy of the License at\n *\n *      http://www.apache.org/licenses/LICENSE-2.0\n *\n * Unless required by applicable law or agreed to in writing, software\n * distributed under the License is distributed on an "AS IS" BASIS,\n * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n * See the License for the specific language governing permissions and\n * limitations under the License.\n */\n\n@media print {\n\n  @page {\n    size: 8in 11in;\n    @bottom-right {\n      content: counter(page) " of " counter(pages);\n    }\n  }\n\n  html {\n    /* no general margins -- CSS Grid takes care of those */\n    color: black;\n  }\n\n  header {\n    /* no need to display the header */\n    display: none;\n  }\n\n  .page-content {\n    /* removes superfluous padding */\n    padding: 0;\n  }\n\n  p, code, ul, ol, li, img, d-math, div.equation {\n    page-break-inside: avoid;\n  }\n\n  h1, h2, h3, h4, h5, h6 {\n    page-break-after: avoid;\n    page-break-inside: avoid;\n  }\n\n  d-appendix {\n    page-break-before: always;\n  }\n\n  d-article hr {\n    margin-top: 20px;\n    margin-bottom: 20px;\n  }\n\n  d-header {\n    visibility: hidden;\n  }\n\n  d-footer {\n    display: none!important;\n  }\n\n}\n',
            );
            a.appendChild(i);
            const l = e.head.querySelector("script");
            e.head.insertBefore(a, l);
          }
        },
      ],
      [
        "OptionalComponents",
        function (e, t) {
          const a = e.body,
            i = a.querySelector("d-article");
          if (!i)
            return void console.warn(
              "No d-article tag found; skipping adding optional components!",
            );
          let l = e.querySelector("d-byline");
          l ||
            (t.authors
              ? ((l = e.createElement("d-byline")), a.insertBefore(l, i))
              : console.warn(
                  "No authors found in front matter; please add them before submission!",
                ));
          let r = e.querySelector("d-title");
          r || ((r = e.createElement("d-title")), a.insertBefore(r, l));
          let n = r.querySelector("h1");
          n ||
            ((n = e.createElement("h1")),
            (n.textContent = t.title),
            r.insertBefore(n, r.firstChild));
          const s = "undefined" != typeof t.password;
          let o = a.querySelector("d-interstitial");
          if (s && !o) {
            const i = "undefined" != typeof window,
              l = i && window.location.hostname.includes("localhost");
            (i && l) ||
              ((o = e.createElement("d-interstitial")),
              (o.password = t.password),
              a.insertBefore(o, a.firstChild));
          } else !s && o && o.parentElement.removeChild(this);
          let d = e.querySelector("d-appendix");
          d || ((d = e.createElement("d-appendix")), e.body.appendChild(d));
          let u = e.querySelector("d-footnote-list");
          u || ((u = e.createElement("d-footnote-list")), d.appendChild(u));
          let p = e.querySelector("d-citation-list");
          p || ((p = e.createElement("d-citation-list")), d.appendChild(p));
        },
      ],
      [
        "TOC",
        function (e) {
          const t = e.querySelector("d-article"),
            a = e.querySelector("d-toc");
          if (a) {
            const e = t.querySelectorAll("h2, h3");
            k(a, e), a.setAttribute("prerendered", "true");
          }
        },
      ],
      [
        "Byline",
        function (e, t) {
          const a = e.querySelector("d-byline");
          a && (a.innerHTML = b(t));
        },
      ],
      [
        "Mathematics",
        function (e, t) {
          let a = !1;
          const i = e.querySelector("body");
          if (!i) return void console.warn("No body tag found!");
          t.katex &&
            t.katex.delimiters &&
            ((global.document = e), G(i, t.katex));
          const l = i.querySelectorAll("d-math");
          if (0 < l.length) {
            (a = !0), console.warn(`Prerendering ${l.length} math tags...`);
            for (const a of l) {
              const i = { displayMode: a.hasAttribute("block") },
                l = Object.assign(i, t.katex),
                r = P.renderToString(a.textContent, l),
                n = e.createElement("span");
              (n.innerHTML = r),
                a.parentElement.insertBefore(n, a),
                a.parentElement.removeChild(a);
            }
          }
          if (a) {
            e.head.insertAdjacentHTML(
              "beforeend",
              '<link rel="stylesheet" href="https://distill.pub/third-party/katex/katex.min.css" crossorigin="anonymous">',
            );
          }
        },
      ],
      [
        "Meta",
        function (e, t) {
          function i(e, t, i) {
            (t || i) && a(`    <meta name="${e}" content="${K(t)}" >\n`);
          }
          let l = e.querySelector("head"),
            a = (e) => v(l, e);
          if (
            (a(`
    <meta http-equiv="X-UA-Compatible" content="IE=Edge,chrome=1">
    <link rel="icon" type="image/png" href="data:image/png;base64,${"iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA99JREFUeNrsG4t1ozDMzQSM4A2ODUonKBucN2hugtIJ6E1AboLcBiQTkJsANiAb9OCd/OpzMWBJBl5TvaeXPiiyJetry0J8wW3D3QpjRh3GjneXDq+fSQA9s2mH9x3KDhN4foJfCb8N/Jrv+2fnDn8vLRQOplWHVYdvHZYdZsBcZP1vBmh/n8DzEmhUQDPaOuP9pFuY+JwJHwHnCLQE2tnWBGEyXozY9xCUgHMhhjE2I4heVWtgIkZ83wL6Qgxj1obfWBxymPwe+b00BCCRNPbwfb60yleAkkBHGT5AEehIYz7eJrFDMF9CvH4wwhcGHiHMneFvLDQwlwvMLQq58trRcYBWfYn0A0OgHWQUSu25mE+BnoYKnnEJoeIWAifzOv7vLWd2ZKRfWAIme3tOiUaQ3UnLkb0xj1FxRIeEGKaGIHOs9nEgLaaA9i0JRYo1Ic67wJW86KSKE/ZAM8KuVMk8ITVhmxUxJ3Cl2xlm9Vtkeju1+mpCQNxaEGNCY8bs9X2YqwNoQeGjBWut/ma0QAWy/TqAsHx9wSya3I5IRxOfTC+leG+kA/4vSeEcGBtNUN6byhu3+keEZCQJUNh8MAO7HL6H8pQLnsW/Hd4T4lv93TPjfM7A46iEEqbB5EDOvwYNW6tGNZzT/o+CZ6sqZ6wUtR/wf7mi/VL8iNciT6rHih48Y55b4nKCHJCCzb4y0nwFmin3ZEMIoLfZF8F7nncFmvnWBaBj7CGAYA/WGJsUwHdYqVDwAmNsUgAx4CGgAA7GOOxADYOFWOaIKifuVYzmOpREqA21Mo7aPsgiY1PhOMAmxtR+AUbYH3Id2wc0SAFIQTsn9IUGWR8k9jx3vtXSiAacFxTAGakBk9UudkNECd6jLe+6HrshshvIuC6IlLMRy7er+JpcKma24SlE4cFZSZJDGVVrsNvitQhQrDhW0jfiOLfFd47C42eHT56D/BK0To+58Ahj+cAT8HT1UWlfLZCCd/uKawzU0Rh2EyIX/Icqth3niG8ybNroezwe6khdCNxRN+l4XGdOLVLlOOt2hTRJlr1ETIuMAltVTMz70mJrkdGAaZLSmnBEqmAE32JCMmuTlCnRgsBENtOUpHhvvsYIL0ibnBkaC6QvKcR7738GKp0AKnim7xgUSNv1bpS8QwhBt8r+EP47v/oyRK/S34yJ9nT+AN0Tkm4OdB9E4BsmXM3SnMlRFUrtp6IDpV2eKzdYvF3etm3KhQksbOLChGkSmcBdmcEwvqkrMy5BzL00NZeu3qPYJOOuCc+5NjcWKXQxFvTa3NoXJ4d8in7fiAUuTt781dkvuHX4K8AA2Usy7yNKLy0AAAAASUVORK5CYII=\n"}">
    <link href="/rss.xml" rel="alternate" type="application/rss+xml" title="Articles from Distill">
  `),
            t.title &&
              a(`
    <title>${K(t.title)}</title>
    `),
            t.url &&
              a(`
    <link rel="canonical" href="${t.url}">
    `),
            t.publishedDate &&
              a(`
    <!--  https://schema.org/Article -->
    <meta property="description"       itemprop="description"   content="${K(t.description)}" />
    <meta property="article:published" itemprop="datePublished" content="${t.publishedISODateOnly}" />
    <meta property="article:created"   itemprop="dateCreated"   content="${t.publishedISODateOnly}" />
    `),
            t.updatedDate &&
              a(`
    <meta property="article:modified"  itemprop="dateModified"  content="${t.updatedDate.toISOString()}" />
    `),
            (t.authors || []).forEach((e) => {
              v(
                l,
                `
    <meta property="article:author" content="${K(e.firstName)} ${K(e.lastName)}" />`,
              );
            }),
            a(`
    <!--  https://developers.facebook.com/docs/sharing/webmasters#markup -->
    <meta property="og:type" content="article"/>
    <meta property="og:title" content="${K(t.title)}"/>
    <meta property="og:description" content="${K(t.description)}">
    <meta property="og:url" content="${t.url}"/>
    <meta property="og:image" content="${t.previewURL}"/>
    <meta property="og:locale" content="en_US" />
    <meta property="og:site_name" content="Distill" />
  `),
            a(`
    <!--  https://dev.twitter.com/cards/types/summary -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${K(t.title)}">
    <meta name="twitter:description" content="${K(t.description)}">
    <meta name="twitter:url" content="${t.url}">
    <meta name="twitter:image" content="${t.previewURL}">
    <meta name="twitter:image:width" content="560">
    <meta name="twitter:image:height" content="295">
  `),
            t.doiSuffix)
          ) {
            a(`
      <!--  https://scholar.google.com/intl/en/scholar/inclusion.html#indexing -->\n`),
              i("citation_title", t.title),
              i("citation_fulltext_html_url", t.url),
              i("citation_volume", t.volume),
              i("citation_issue", t.issue),
              i("citation_firstpage", t.doiSuffix ? `e${t.doiSuffix}` : void 0),
              i("citation_doi", t.doi);
            let e = t.journal || {};
            i("citation_journal_title", e.full_title || e.title),
              i("citation_journal_abbrev", e.abbrev_title),
              i("citation_issn", e.issn),
              i("citation_publisher", e.publisher),
              i("citation_fulltext_world_readable", "", !0),
              t.publishedDate &&
                (i(
                  "citation_online_date",
                  `${t.publishedYear}/${t.publishedMonthPadded}/${t.publishedDayPadded}`,
                ),
                i(
                  "citation_publication_date",
                  `${t.publishedYear}/${t.publishedMonthPadded}/${t.publishedDayPadded}`,
                )),
              (t.authors || []).forEach((e) => {
                i("citation_author", `${e.lastName}, ${e.firstName}`),
                  i("citation_author_institution", e.affiliation);
              });
          } else
            console.warn(
              "No DOI suffix in data; not adding citation meta tags!",
            );
          t.citations
            ? t.citations.forEach((e) => {
                if (t.bibliography && t.bibliography.has(e)) {
                  const a = t.bibliography.get(e);
                  i("citation_reference", x(a));
                } else console.warn("No bibliography data found for " + e);
              })
            : console.warn(
                "No citations found; not adding any references meta tags!",
              );
        },
      ],
      [
        "Typeset",
        function (e) {
          for (
            var t = e.createTreeWalker(
              e.body,
              e.defaultView.NodeFilter.SHOW_TEXT,
            );
            t.nextNode();

          ) {
            var a = t.currentNode,
              i = a.nodeValue;
            i && w(a) && ((i = S(i)), (i = M(i)), (a.nodeValue = i));
          }
        },
      ],
      [
        "Polyfills",
        function (e) {
          const t = e.querySelector('script[src*="template.v2.js"]');
          t
            ? t.parentNode.removeChild(t)
            : console.debug(
                "FYI: Did not find template tag when trying to remove it. You may not have added it. Be aware that our polyfills will add it.",
              );
          const a = e.createElement("script");
          (a.src =
            "https://cdnjs.cloudflare.com/ajax/libs/webcomponentsjs/1.0.17/webcomponents-loader.js"),
            e.head.insertBefore(a, e.head.firstChild);
          const i = e.createElement("script");
          (i.innerHTML = J), e.head.insertBefore(i, e.head.firstChild);
        },
      ],
      [
        "CitationList",
        function (e, t) {
          const a = e.querySelector("d-citation-list");
          if (a) {
            const i = new Map(
              t.citations.map((e) => {
                return [e, t.bibliography.get(e)];
              }),
            );
            z(a, i, e), a.setAttribute("distill-prerendered", "true");
          }
        },
      ],
      [
        "Reorder",
        function (e) {
          const t = e.head,
            a = t.querySelector("meta[http-equiv]");
          t.insertBefore(a, t.firstChild);
          const i = t.querySelector("meta[name=viewport]");
          t.insertBefore(i, t.firstChild);
          const l = t.querySelector("meta[charset]");
          t.insertBefore(l, t.firstChild);
        },
      ],
    ]),
    ee = new Map([
      [
        "DistillHeader",
        function (e) {
          const t = e.querySelector("distill-header");
          if (!t) {
            const t = e.createElement("distill-header"),
              a = e.querySelector("body");
            a.insertBefore(t, a.firstChild);
          }
        },
      ],
      [
        "DistillAppendix",
        function (e, t) {
          const a = e.querySelector("d-appendix");
          if (!a) return void console.warn("No appendix tag found!");
          const i = a.querySelector("distill-appendix");
          if (!i) {
            const i = e.createElement("distill-appendix");
            a.appendChild(i), (i.innerHTML = A(t));
          }
        },
      ],
      [
        "DistillFooter",
        function (e) {
          const t = e.querySelector("distill-footer");
          if (!t) {
            const t = e.createElement("distill-footer"),
              a = e.querySelector("body");
            a.appendChild(t);
          }
        },
      ],
    ]);
  (e.render = function (e, t, a = !0) {
    let i = t instanceof D ? t : D.fromObject(t);
    for (const [l, r] of Q.entries())
      a && console.warn("Running extractor: " + l), r(e, i, a);
    for (const [l, r] of Z.entries())
      a && console.warn("Running transform: " + l), r(e, i, a);
    e.body.setAttribute("distill-prerendered", ""),
      t instanceof D || i.assignToObject(t);
  }),
    (e.distillify = function (e, t, a = !0) {
      for (const [i, l] of ee.entries())
        a && console.warn("Running distillify: ", i), l(e, t, a);
    }),
    (e.usesTemplateV2 = function (e) {
      const t = e.querySelectorAll("script");
      let a;
      for (const i of t) {
        const e = i.src;
        if (e.includes("template.v1.js")) a = !1;
        else if (e.includes("template.v2.js")) a = !0;
        else if (e.includes("template."))
          throw new Error("Uses distill template, but unknown version?!");
      }
      if (a === void 0)
        throw new Error("Does not seem to use Distill template at all.");
      else return a;
    }),
    (e.FrontMatter = D),
    (e.testing = { extractors: Q, transforms: Z, distillTransforms: ee }),
    Object.defineProperty(e, "__esModule", { value: !0 });
});
//# sourceMappingURL=transforms.v2.js.map
