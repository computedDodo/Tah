"use strict";
/* ==========================================================================
   IBNIDREES PROTOTYPE — public pages: Home, Subjects, Enroll, Portal picker
   ========================================================================== */
(function () {
  var U = window.U, DATA = window.DATA, Router = window.Router;

  function levelBadges(levels) {
    return levels.map(function (l) { return '<span class="pill pill--level">' + l + "</span>"; }).join("");
  }

  function subjectCard(s, opts) {
    opts = opts || {};
    return (
      '<div class="subject-card' + (s.featured ? " subject-card--featured" : "") + '">' +
        (s.featured ? '<span class="subject-card__badge">' + U.icon("target", "icon--sm") + " Special focus" : "") +
        '<div class="subject-card__icon">' + U.icon("book") + "</div>" +
        '<h3 class="subject-card__title">' + U.escapeHTML(s.name) + "</h3>" +
        '<p class="subject-card__desc">' + U.escapeHTML(s.desc) + "</p>" +
        '<div class="subject-card__levels">' + levelBadges(s.levels) + "</div>" +
        (opts.withCta
          ? '<button class="btn btn--outline btn--sm subject-card__cta" data-nav="/enroll" data-subject="' + s.id + '">Enrol in this subject ' + U.icon("arrowRight", "icon--sm") + "</button>"
          : "") +
      "</div>"
    );
  }

  /* ----------------------------------------------------------------- HOME */
  function renderHome(root) {
    var subjects = DATA.getSubjects().slice(0, 6);
    root.innerHTML =
      '<section class="hero">' +
        '<div class="hero__pattern" aria-hidden="true"></div>' +
        '<div class="wrap hero__inner">' +
          '<span class="pill pill--session">' + U.icon("cap", "icon--sm") + " 2026/2027 Session" + "</span>" +
          '<h1 class="hero__title">Ibnidrees Educational<br>Services</h1>' +
          '<p class="hero__tagline">Intensive private tutoring &mdash; effective, sufficient, results-focused.</p>' +
          '<p class="hero__sub">For Primary, JSS &amp; SSS students. Qur\u2019an, Islamiyyat, Arabic and core academic subjects, taught online across Nigeria or in person in Lafia.</p>' +
          '<div class="hero__actions">' +
            '<button class="btn btn--gold btn--lg" data-nav="/enroll">Enrol now ' + U.icon("arrowRight", "icon--sm") + "</button>" +
            '<button class="btn btn--ghost-light btn--lg" data-nav="/subjects">View subjects</button>' +
          "</div>" +
        "</div>" +
      "</section>" +

      '<section class="wrap section">' +
        '<div class="section__head">' +
          '<h2 class="section__title">Subjects &amp; support</h2>' +
          '<p class="section__sub">A full track for Primary, JSS and SSS \u2014 plus exam preparation for internal exams, WAEC, NECO and JAMB.</p>' +
        "</div>" +
        '<div class="grid grid--cards">' + subjects.map(function (s) { return subjectCard(s); }).join("") + "</div>" +
        '<div class="section__more"><button class="btn btn--outline" data-nav="/subjects">See all subjects ' + U.icon("arrowRight", "icon--sm") + "</button></div>" +
      "</section>" +

      '<section class="band">' +
        '<div class="wrap grid grid--two">' +
          '<div class="mode-card">' +
            '<div class="mode-card__icon">' + U.icon("globe") + "</div>" +
            '<h3>Online classes</h3>' +
            '<p>Available worldwide \u2014 join live sessions from anywhere in Nigeria, plus recorded lessons for revision.</p>' +
          "</div>" +
          '<div class="mode-card">' +
            '<div class="mode-card__icon">' + U.icon("mapPin") + "</div>" +
            '<h3>Physical sessions</h3>' +
            '<p>In-person tutoring at our study centre, for students based in Lafia, Nasarawa State only.</p>' +
          "</div>" +
        "</div>" +
      "</section>" +

      '<section class="wrap section section--quote">' +
        '<blockquote class="quote">&ldquo;Strong foundations today.<br>Outstanding results tomorrow.&rdquo;</blockquote>' +
      "</section>" +

      '<section class="wrap section">' +
        '<div class="section__head"><h2 class="section__title">How enrolling works</h2></div>' +
        '<div class="grid grid--three steps">' +
          '<div class="step"><span class="step__num">1</span><h3>Browse subjects</h3><p>Pick a level and see what\u2019s taught, online or in Lafia.</p></div>' +
          '<div class="step"><span class="step__num">2</span><h3>Enrol &amp; confirm</h3><p>Submit a request, then confirm payment by bank transfer over WhatsApp.</p></div>' +
          '<div class="step"><span class="step__num">3</span><h3>Start learning</h3><p>Get your class schedule, homework and recorded lessons in one place.</p></div>' +
        "</div>" +
      "</section>" +

      '<section class="cta-band">' +
        '<div class="wrap cta-band__inner">' +
          '<h2>Ready to enrol?</h2>' +
          '<div class="cta-band__actions">' +
            '<button class="btn btn--gold btn--lg" data-nav="/enroll">Enrol now</button>' +
            '<a class="btn btn--ghost-light btn--lg" href="' + U.waLink("Hello, I'd like to ask about Ibnidrees tutoring.") + '" target="_blank" rel="noopener">' + U.icon("whatsapp", "icon--sm") + " WhatsApp: 0810 935 1073</a>" +
          "</div>" +
        "</div>" +
      "</section>";
  }

  /* ------------------------------------------------------------- SUBJECTS */
  function renderSubjects(root) {
    var all = DATA.getSubjects();
    var activeLevel = "All";

    function draw() {
      var filtered = activeLevel === "All" ? all : all.filter(function (s) { return s.levels.indexOf(activeLevel) !== -1; });
      U.$("#subjects-grid", root).innerHTML = filtered.map(function (s) { return subjectCard(s, { withCta: true }); }).join("");
      U.$all(".subject-card__cta", root).forEach(function (btn) {
        btn.addEventListener("click", function () { Router.navigate("/enroll", { subject: btn.dataset.subject }); });
      });
    }

    root.innerHTML =
      '<section class="wrap page-head">' +
        '<h1>Subjects</h1>' +
        '<p>Available across Primary, JSS and SSS levels. Choose one to start an enrolment request.</p>' +
        '<div class="tabbar" id="level-tabs">' +
          ["All", "Primary", "JSS", "SSS"].map(function (l) {
            return '<button class="tabbar__tab' + (l === "All" ? " is-active" : "") + '" data-level="' + l + '">' + l + "</button>";
          }).join("") +
        "</div>" +
      "</section>" +
      '<section class="wrap section"><div class="grid grid--cards" id="subjects-grid"></div></section>';

    U.$all(".tabbar__tab", root).forEach(function (tab) {
      tab.addEventListener("click", function () {
        activeLevel = tab.dataset.level;
        U.$all(".tabbar__tab", root).forEach(function (t) { t.classList.toggle("is-active", t === tab); });
        draw();
      });
    });
    draw();
  }

  /* --------------------------------------------------------------- ENROLL */
  function renderEnroll(root, params) {
    var subjects = DATA.getSubjects();
    var wizard = {
      step: 1,
      guardianName: "", phone: "", studentName: "", level: "",
      subjectIds: params.subject ? [params.subject] : [],
      examTrack: "", mode: "online", confirmedLafia: false
    };

    function subjectsForLevel() {
      return wizard.level ? subjects.filter(function (s) { return s.levels.indexOf(wizard.level) !== -1; }) : subjects;
    }

    function stepIndicator() {
      var labels = ["Student", "Subjects", "Mode", "Review"];
      return '<div class="wizard-steps">' + labels.map(function (l, i) {
        var n = i + 1;
        var cls = n === wizard.step ? "is-active" : n < wizard.step ? "is-done" : "";
        return '<div class="wizard-steps__item ' + cls + '"><span class="wizard-steps__num">' + (n < wizard.step ? U.icon("check", "icon--sm") : n) + "</span>" + l + "</div>";
      }).join('<span class="wizard-steps__line"></span>') + "</div>";
    }

    function renderStep1() {
      return (
        '<div class="form-grid">' +
          '<label class="field"><span>Parent / guardian full name</span><input type="text" id="f-guardian" value="' + U.escapeHTML(wizard.guardianName) + '" placeholder="e.g. Malama Amina Yusuf"></label>' +
          '<label class="field"><span>Phone number</span><input type="tel" id="f-phone" value="' + U.escapeHTML(wizard.phone) + '" placeholder="080..."></label>' +
          '<label class="field"><span>Student\u2019s full name</span><input type="text" id="f-student" value="' + U.escapeHTML(wizard.studentName) + '" placeholder="e.g. Fatima Yusuf"></label>' +
          '<label class="field"><span>Level</span><select id="f-level">' +
            '<option value="">Select level</option>' +
            ["Primary", "JSS", "SSS"].map(function (l) { return '<option value="' + l + '"' + (wizard.level === l ? " selected" : "") + ">" + l + "</option>"; }).join("") +
          "</select></label>" +
        "</div>" +
        '<p class="field-hint">' + U.icon("alert", "icon--sm") + " This is a prototype form \u2014 nothing is sent for real yet." + "</p>"
      );
    }

    function renderStep2() {
      var list = subjectsForLevel();
      var showExam = wizard.level === "SSS";
      return (
        '<p class="field-hint">Choose one or more subjects' + (wizard.level ? " for " + wizard.level : "") + ".</p>" +
        '<div class="check-grid">' + list.map(function (s) {
          var checked = wizard.subjectIds.indexOf(s.id) !== -1;
          return '<label class="check-card' + (checked ? " is-checked" : "") + '"><input type="checkbox" data-subject-id="' + s.id + '"' + (checked ? " checked" : "") + "><span>" + U.escapeHTML(s.name) + "</span></label>";
        }).join("") + "</div>" +
        (showExam
          ? '<label class="field" style="margin-top:18px"><span>Exam prep track (optional)</span><select id="f-exam"><option value="">None specifically</option>' +
            DATA.getExamTracks().map(function (t) { return '<option value="' + t + '"' + (wizard.examTrack === t ? " selected" : "") + ">" + t + "</option>"; }).join("") +
            "</select></label>"
          : "")
      );
    }

    function renderStep3() {
      return (
        '<div class="mode-choice">' +
          '<label class="mode-choice__opt' + (wizard.mode === "online" ? " is-checked" : "") + '">' +
            '<input type="radio" name="mode" value="online"' + (wizard.mode === "online" ? " checked" : "") + ">" +
            '<div>' + U.icon("globe") + "<strong>Online</strong><span>Anywhere in Nigeria</span></div>" +
          "</label>" +
          '<label class="mode-choice__opt' + (wizard.mode === "physical" ? " is-checked" : "") + '">' +
            '<input type="radio" name="mode" value="physical"' + (wizard.mode === "physical" ? " checked" : "") + ">" +
            '<div>' + U.icon("mapPin") + "<strong>Physical</strong><span>Lafia, Nasarawa only</span></div>" +
          "</label>" +
        "</div>" +
        (wizard.mode === "physical"
          ? '<label class="check-card check-card--wide' + (wizard.confirmedLafia ? " is-checked" : "") + '" style="margin-top:14px"><input type="checkbox" id="f-lafia"' + (wizard.confirmedLafia ? " checked" : "") + "><span>I confirm the student is based in Lafia, Nasarawa State</span></label>"
          : "")
      );
    }

    function renderStep4() {
      var chosen = subjects.filter(function (s) { return wizard.subjectIds.indexOf(s.id) !== -1; });
      return (
        '<div class="review-card">' +
          '<div class="review-row"><span>Guardian</span><strong>' + U.escapeHTML(wizard.guardianName || "\u2014") + "</strong></div>" +
          '<div class="review-row"><span>Phone</span><strong>' + U.escapeHTML(wizard.phone || "\u2014") + "</strong></div>" +
          '<div class="review-row"><span>Student</span><strong>' + U.escapeHTML(wizard.studentName || "\u2014") + " (" + U.escapeHTML(wizard.level || "\u2014") + ")</strong></div>" +
          '<div class="review-row"><span>Subjects</span><strong>' + (chosen.map(function (s) { return U.escapeHTML(s.name); }).join(", ") || "\u2014") + "</strong></div>" +
          (wizard.examTrack ? '<div class="review-row"><span>Exam track</span><strong>' + U.escapeHTML(wizard.examTrack) + "</strong></div>" : "") +
          '<div class="review-row"><span>Mode</span><strong>' + (wizard.mode === "online" ? "Online" : "Physical \u2014 Lafia") + "</strong></div>" +
        "</div>" +
        '<p class="field-hint">' + U.icon("alert", "icon--sm") + " After submitting, you\u2019ll confirm payment by bank transfer over WhatsApp \u2014 the same as enrolling today." + "</p>"
      );
    }

    function validateStep() {
      if (wizard.step === 1) return wizard.guardianName.trim() && wizard.phone.trim() && wizard.studentName.trim() && wizard.level;
      if (wizard.step === 2) return wizard.subjectIds.length > 0;
      if (wizard.step === 3) return wizard.mode === "online" || wizard.confirmedLafia;
      return true;
    }

    function draw() {
      var stepRenderers = { 1: renderStep1, 2: renderStep2, 3: renderStep3, 4: renderStep4 };
      var canProceed = validateStep();
      root.innerHTML =
        '<section class="wrap page-head"><h1>Enrol a student</h1><p>Takes about a minute. Our team confirms every request.</p></section>' +
        '<section class="wrap section wizard">' +
          stepIndicator() +
          '<div class="wizard-card">' + stepRenderers[wizard.step]() + "</div>" +
          '<div class="wizard-actions">' +
            (wizard.step > 1 ? '<button class="btn btn--outline" id="w-back">Back</button>' : "<span></span>") +
            '<button class="btn btn--gold" id="w-next"' + (canProceed ? "" : " disabled") + ">" + (wizard.step === 4 ? "Submit request" : "Continue") + " " + U.icon("arrowRight", "icon--sm") + "</button>" +
          "</div>" +
        "</section>";

      wireStepInputs();

      var backBtn = U.$("#w-back", root);
      if (backBtn) backBtn.addEventListener("click", function () { wizard.step -= 1; draw(); });

      U.$("#w-next", root).addEventListener("click", function () {
        if (!validateStep()) return;
        if (wizard.step < 4) { wizard.step += 1; draw(); return; }
        submitWizard();
      });
    }

    function wireStepInputs() {
      if (wizard.step === 1) {
        U.$("#f-guardian", root).addEventListener("input", function (e) { wizard.guardianName = e.target.value; syncNextButton(); });
        U.$("#f-phone", root).addEventListener("input", function (e) { wizard.phone = e.target.value; syncNextButton(); });
        U.$("#f-student", root).addEventListener("input", function (e) { wizard.studentName = e.target.value; syncNextButton(); });
        U.$("#f-level", root).addEventListener("change", function (e) { wizard.level = e.target.value; wizard.subjectIds = []; draw(); });
      }
      if (wizard.step === 2) {
        U.$all("[data-subject-id]", root).forEach(function (cb) {
          cb.addEventListener("change", function () {
            var id = cb.dataset.subjectId;
            if (cb.checked) wizard.subjectIds.push(id);
            else wizard.subjectIds = wizard.subjectIds.filter(function (x) { return x !== id; });
            cb.closest(".check-card").classList.toggle("is-checked", cb.checked);
            syncNextButton();
          });
        });
        var examSel = U.$("#f-exam", root);
        if (examSel) examSel.addEventListener("change", function (e) { wizard.examTrack = e.target.value; });
      }
      if (wizard.step === 3) {
        U.$all('input[name="mode"]', root).forEach(function (r) {
          r.addEventListener("change", function () { wizard.mode = r.value; draw(); });
        });
        var lafiaCb = U.$("#f-lafia", root);
        if (lafiaCb) lafiaCb.addEventListener("change", function (e) {
          wizard.confirmedLafia = e.target.checked;
          e.target.closest(".check-card").classList.toggle("is-checked", e.target.checked);
          syncNextButton();
        });
      }
    }

    function syncNextButton() {
      var btn = U.$("#w-next", root);
      if (btn) btn.disabled = !validateStep();
    }

    function submitWizard() {
      wizard.subjectIds.forEach(function (subjectId) {
        DATA.submitEnrollment({
          studentName: wizard.studentName, subjectId: subjectId, level: wizard.level, mode: wizard.mode
        });
      });
      renderConfirmation();
    }

    function renderConfirmation() {
      var msg = "Hello, I just submitted an enrolment request for " + wizard.studentName + ". I'd like to confirm payment.";
      root.innerHTML =
        '<section class="wrap section confirm-panel">' +
          '<div class="confirm-panel__icon">' + U.icon("check") + "</div>" +
          "<h1>Request received</h1>" +
          '<p>Thanks, ' + U.escapeHTML(wizard.guardianName) + '. We\u2019ve logged the request for ' + U.escapeHTML(wizard.studentName) + ". Our team reviews new enrolments and will reach out shortly." + "</p>" +
          '<div class="confirm-panel__box">' +
            "<h3>Next: confirm payment</h3>" +
            "<p>Pay the subject fee by bank transfer, then send your payment receipt on WhatsApp so we can confirm your spot.</p>" +
            '<div class="bank-details">' +
              '<div><span>Bank</span><strong>Placeholder Bank Plc</strong></div>' +
              '<div><span>Account name</span><strong>Ibnidrees Educational Services</strong></div>' +
              '<div><span>Account number</span><strong>0000000000</strong></div>' +
            "</div>" +
            '<a class="btn btn--gold" href="' + U.waLink(msg) + '" target="_blank" rel="noopener">' + U.icon("whatsapp", "icon--sm") + " Confirm on WhatsApp</a>" +
          "</div>" +
          '<button class="btn btn--ghost" data-nav="/">Back to home</button>' +
        "</section>";
    }

    draw();
  }

  /* ------------------------------------------------------------ PORTAL PICKER */
  function renderPortalPicker(root) {
    var family = DATA.getFamily(), tutor = DATA.getTutor(), admin = DATA.getAdmin();
    root.innerHTML =
      '<section class="wrap page-head">' +
        "<h1>Preview the portal</h1>" +
        "<p>This prototype has no real sign-in yet \u2014 pick a role below to see what that person would experience.</p>" +
      "</section>" +
      '<section class="wrap section grid grid--three persona-grid">' +
        '<button class="persona-card" data-persona="family">' + U.icon("users") + "<h3>Family</h3><p>" + U.escapeHTML(family.guardianName) + "</p><span class=\"persona-card__cta\">Continue " + U.icon("arrowRight", "icon--sm") + "</span></button>" +
        '<button class="persona-card" data-persona="tutor">' + U.icon("userCircle") + "<h3>Tutor</h3><p>" + U.escapeHTML(tutor.name) + "</p><span class=\"persona-card__cta\">Continue " + U.icon("arrowRight", "icon--sm") + "</span></button>" +
        '<button class="persona-card" data-persona="admin">' + U.icon("shield") + "<h3>Admin</h3><p>" + U.escapeHTML(admin.name) + "</p><span class=\"persona-card__cta\">Continue " + U.icon("arrowRight", "icon--sm") + "</span></button>" +
      "</section>";

    U.$all(".persona-card", root).forEach(function (card) {
      card.addEventListener("click", function () {
        var role = card.dataset.persona;
        window.sessionStorage.setItem("ibnidrees_persona", role);
        Router.navigate("/portal/" + role);
      });
    });
  }

  window.Pages = window.Pages || {};
  window.Pages.home = renderHome;
  window.Pages.subjects = renderSubjects;
  window.Pages.enroll = renderEnroll;
  window.Pages.portalPicker = renderPortalPicker;
})();
