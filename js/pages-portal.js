"use strict";
/* ==========================================================================
   IBNIDREES PROTOTYPE — portal dashboards: Family, Tutor, Admin
   ========================================================================== */
(function () {
  var U = window.U, DATA = window.DATA, Router = window.Router;

  function statusPill(status) {
    var tone = U.STATUS_TONES[status] || "neutral";
    return '<span class="pill pill--' + tone + '">' + (U.STATUS_LABELS[status] || status) + "</span>";
  }

  function portalToolbar(roleLabel, personaName) {
    return (
      '<div class="portal-toolbar">' +
        '<div class="portal-toolbar__who">' +
          '<span class="portal-toolbar__tag">Previewing as</span>' +
          "<strong>" + roleLabel + " \u2014 " + U.escapeHTML(personaName) + "</strong>" +
        "</div>" +
        '<div class="portal-toolbar__actions">' +
          '<button class="btn btn--outline btn--sm" data-nav="/portal">Switch role</button>' +
          '<button class="btn btn--ghost btn--sm" data-nav="/">Exit to site</button>' +
        "</div>" +
      "</div>"
    );
  }

  function requirePersona(root, expected) {
    var stored = window.sessionStorage.getItem("ibnidrees_persona");
    if (stored !== expected) {
      Router.navigate("/portal");
      return false;
    }
    return true;
  }

  function joinLiveModal(session) {
    U.showModal("Join live class", "<p>In the live product, this opens " + U.escapeHTML(session.tutorName) + "\u2019s Zoom or Google Meet link at the scheduled time.</p><p>For now, this is a placeholder in the prototype.</p>");
  }
  function playRecordingModal(resource) {
    U.showModal("Recorded lesson", "<p>In the live product, this plays \u201c" + U.escapeHTML(resource.title) + "\u201d from YouTube.</p><p>This is a placeholder thumbnail in the prototype.</p>");
  }

  /* --------------------------------------------------------------- FAMILY */
  function renderFamily(root) {
    if (!requirePersona(root, "family")) return;
    var family = DATA.getFamily();

    function studentBlock(student) {
      var enrollments = DATA.getEnrollmentsForStudent(student.id);
      var approvedSubjectIds = enrollments.filter(function (e) { return e.status === "approved"; }).map(function (e) { return e.subjectId; });
      var sessions = DATA.getSessionsForSubjects(approvedSubjectIds);
      var resources = DATA.getResourcesForSubjects(approvedSubjectIds);

      return (
        '<div class="dash-card">' +
          '<div class="dash-card__head"><h3>' + U.escapeHTML(student.name) + '</h3><span class="pill pill--level">' + U.escapeHTML(student.grade) + "</span></div>" +

          '<h4 class="dash-subhead">Enrolled subjects</h4>' +
          '<div class="enrolment-list">' + (enrollments.length ? enrollments.map(function (e) {
            var subj = DATA.getSubject(e.subjectId);
            return '<div class="enrolment-row"><span>' + U.escapeHTML(subj ? subj.name : e.subjectId) + '</span><span class="enrolment-row__pills">' + statusPill(e.status) + statusPill(e.paymentStatus) + "</span></div>";
          }).join("") : '<p class="empty-note">No subjects enrolled yet.</p>') + "</div>" +

          (sessions.length ? '<h4 class="dash-subhead">Upcoming sessions</h4><div class="session-list">' + sessions.map(function (s) {
            var subj = DATA.getSubject(s.subjectId);
            return (
              '<div class="session-row">' +
                '<div class="session-row__icon">' + U.icon(s.mode === "online" ? "video" : "mapPin") + "</div>" +
                '<div class="session-row__info"><strong>' + U.escapeHTML(subj ? subj.name : "") + '</strong>' +
                '<span>' + U.formatDateTime(s.startsAt) + " \u2022 " + (s.mode === "online" ? "Online" : U.escapeHTML(s.location)) + "</span></div>" +
                (s.mode === "online" ? '<button class="btn btn--gold btn--sm" data-join="' + s.id + '">Join</button>' : "") +
              "</div>"
            );
          }).join("") + "</div>" : "") +

          (resources.length ? '<h4 class="dash-subhead">Homework &amp; lessons</h4><div class="resource-list">' + resources.map(function (r) { return resourceRow(r); }).join("") + "</div>" : "") +
        "</div>"
      );
    }

    root.innerHTML =
      portalToolbar("Family", family.guardianName) +
      '<section class="wrap section">' +
        '<div class="section__head"><h2 class="section__title">Your family</h2><p class="section__sub">' + family.students.length + " student(s) linked to this account." + "</p></div>" +
        '<div class="dash-grid">' + family.students.map(studentBlock).join("") + "</div>" +
        '<div class="section__more"><button class="btn btn--gold" data-nav="/enroll">Enrol another subject ' + U.icon("arrowRight", "icon--sm") + "</button></div>" +
      "</section>";

    U.$all("[data-join]", root).forEach(function (btn) {
      btn.addEventListener("click", function () {
        var session = DATA.getAllSessions().filter(function (s) { return s.id === btn.dataset.join; })[0];
        if (session) joinLiveModal(session);
      });
    });
    U.$all("[data-play]", root).forEach(function (btn) {
      btn.addEventListener("click", function () {
        var res = DATA.getResourcesForSubject(btn.dataset.subjectForPlay).filter(function (r) { return r.id === btn.dataset.play; })[0];
        if (res) playRecordingModal(res);
      });
    });
  }

  function resourceRow(r) {
    if (r.type === "recording") {
      return (
        '<button class="resource-row resource-row--video" data-play="' + r.id + '" data-subject-for-play="' + r.subjectId + '">' +
          '<span class="resource-row__thumb">' + U.icon("play") + "</span>" +
          '<span class="resource-row__info"><strong>' + U.escapeHTML(r.title) + "</strong><span>" + r.durationLabel + " \u2022 via YouTube \u2022 " + U.timeAgo(r.addedAt) + "</span></span>" +
        "</button>"
      );
    }
    return (
      '<div class="resource-row">' +
        '<span class="resource-row__thumb resource-row__thumb--doc">' + U.icon("book") + "</span>" +
        '<span class="resource-row__info"><strong>' + U.escapeHTML(r.title) + "</strong><span>Due " + U.formatDate(r.dueAt) + "</span></span>" +
      "</div>"
    );
  }

  /* ---------------------------------------------------------------- TUTOR */
  function renderTutor(root) {
    if (!requirePersona(root, "tutor")) return;
    var tutor = DATA.getTutor();
    var mySubjects = tutor.subjectIds.map(function (id) { return DATA.getSubject(id); }).filter(Boolean);
    var roster = DATA.getEnrollments().filter(function (e) { return tutor.subjectIds.indexOf(e.subjectId) !== -1 && e.status === "approved"; });
    var sessions = DATA.getSessionsForSubjects(tutor.subjectIds);
    var resources = DATA.getResourcesForSubjects(tutor.subjectIds);

    function draw() {
      root.innerHTML =
        portalToolbar("Tutor", tutor.name) +
        '<section class="wrap section">' +
          '<div class="dash-grid dash-grid--sidebar">' +

            '<div class="dash-card">' +
              '<h3 class="dash-card__title">My subjects</h3>' +
              '<div class="tag-row">' + mySubjects.map(function (s) { return '<span class="pill pill--level">' + U.escapeHTML(s.name) + "</span>"; }).join("") + "</div>" +

              '<h4 class="dash-subhead">Upcoming sessions</h4>' +
              '<div class="session-list">' + (sessions.length ? sessions.map(function (s) {
                var subj = DATA.getSubject(s.subjectId);
                return '<div class="session-row"><div class="session-row__icon">' + U.icon(s.mode === "online" ? "video" : "mapPin") + '</div><div class="session-row__info"><strong>' + U.escapeHTML(subj.name) + "</strong><span>" + U.formatDateTime(s.startsAt) + "</span></div></div>";
              }).join("") : '<p class="empty-note">No sessions scheduled.</p>') + "</div>" +

              '<h4 class="dash-subhead">My roster</h4>' +
              '<div class="roster-list">' + (roster.length ? roster.map(function (e) {
                var subj = DATA.getSubject(e.subjectId);
                return '<div class="roster-row"><span>' + U.escapeHTML(e.studentName) + '</span><span class="pill pill--level">' + U.escapeHTML(subj ? subj.name : "") + "</span></div>";
              }).join("") : '<p class="empty-note">No approved students yet.</p>') + "</div>" +
            "</div>" +

            '<div class="dash-card">' +
              '<h3 class="dash-card__title">Post homework or a recorded lesson</h3>' +
              '<div class="form-grid">' +
                '<label class="field"><span>Subject</span><select id="t-subject">' + mySubjects.map(function (s) { return '<option value="' + s.id + '">' + U.escapeHTML(s.name) + "</option>"; }).join("") + "</select></label>" +
                '<label class="field"><span>Type</span><select id="t-type"><option value="homework">Homework</option><option value="recording">Recorded lesson (YouTube)</option></select></label>' +
                '<label class="field field--wide"><span>Title</span><input type="text" id="t-title" placeholder="e.g. Chapter 4 practice questions"></label>' +
              "</div>" +
              '<button class="btn btn--gold" id="t-post" style="margin-top:14px">' + U.icon("plus", "icon--sm") + " Post to class" + "</button>" +

              '<h4 class="dash-subhead">Recently posted</h4>' +
              '<div class="resource-list">' + (resources.length ? resources.map(resourceRow).join("") : '<p class="empty-note">Nothing posted yet.</p>') + "</div>" +
            "</div>" +

          "</div>" +
        "</section>";

      U.$("#t-post", root).addEventListener("click", function () {
        var subjectId = U.$("#t-subject", root).value;
        var type = U.$("#t-type", root).value;
        var title = U.$("#t-title", root).value.trim();
        if (!title) { U.$("#t-title", root).focus(); return; }
        DATA.addResource({
          subjectId: subjectId, tutorName: tutor.name, type: type, title: title,
          durationLabel: type === "recording" ? "New" : null,
          dueAt: type === "homework" ? new Date(Date.now() + 5 * 86400000).toISOString() : null
        });
        resources = DATA.getResourcesForSubjects(tutor.subjectIds);
        draw();
      });
      U.$all("[data-play]", root).forEach(function (btn) {
        btn.addEventListener("click", function () {
          var res = resources.filter(function (r) { return r.id === btn.dataset.play; })[0];
          if (res) playRecordingModal(res);
        });
      });
    }

    draw();
  }

  /* ---------------------------------------------------------------- ADMIN */
  function renderAdmin(root) {
    if (!requirePersona(root, "admin")) return;
    var admin = DATA.getAdmin();

    function draw() {
      var subjects = DATA.getSubjects();
      var all = DATA.getEnrollments();
      var pending = all.filter(function (e) { return e.status === "pending"; });
      var approved = all.filter(function (e) { return e.status === "approved"; });
      var studentCount = new Set(all.map(function (e) { return e.studentId; })).size;

      root.innerHTML =
        portalToolbar("Admin", admin.name) +
        '<section class="wrap section">' +

          '<div class="stat-grid">' +
            '<div class="stat-card"><span class="stat-card__value">' + studentCount + "</span><span>Students</span></div>" +
            '<div class="stat-card"><span class="stat-card__value">' + all.length + "</span><span>Enrolments</span></div>" +
            '<div class="stat-card stat-card--warn"><span class="stat-card__value">' + pending.length + "</span><span>Pending review</span></div>" +
            '<div class="stat-card"><span class="stat-card__value">' + subjects.length + "</span><span>Subjects</span></div>" +
          "</div>" +

          '<div class="dash-card" style="margin-top:22px">' +
            '<h3 class="dash-card__title">Pending enrolments</h3>' +
            (pending.length ? pending.map(function (e) {
              var subj = DATA.getSubject(e.subjectId);
              return (
                '<div class="approval-row">' +
                  '<div><strong>' + U.escapeHTML(e.studentName) + "</strong><span>" + U.escapeHTML(subj ? subj.name : e.subjectId) + " \u2022 " + e.level + " \u2022 " + (e.mode === "online" ? "Online" : "Physical") + "</span></div>" +
                  '<div class="approval-row__actions">' +
                    '<button class="btn btn--outline btn--sm" data-reject="' + e.id + '">Decline</button>' +
                    '<button class="btn btn--gold btn--sm" data-approve="' + e.id + '">' + U.icon("check", "icon--sm") + " Approve" + "</button>" +
                  "</div>" +
                "</div>"
              );
            }).join("") : '<p class="empty-note">Nothing waiting on you \u2014 all caught up.</p>') +
          "</div>" +

          '<div class="dash-grid" style="margin-top:22px">' +
            '<div class="dash-card">' +
              '<h3 class="dash-card__title">Subjects</h3>' +
              subjects.map(function (s) { return '<div class="roster-row"><span>' + U.escapeHTML(s.name) + '</span><span class="tag-row">' + s.levels.map(function (l) { return '<span class="pill pill--level">' + l + "</span>"; }).join("") + "</span></div>"; }).join("") +
            "</div>" +
            '<div class="dash-card">' +
              '<h3 class="dash-card__title">Approved enrolments</h3>' +
              (approved.length ? approved.map(function (e) {
                var subj = DATA.getSubject(e.subjectId);
                return '<div class="roster-row"><span>' + U.escapeHTML(e.studentName) + '</span><span class="pill pill--level">' + U.escapeHTML(subj ? subj.name : "") + "</span></div>";
              }).join("") : '<p class="empty-note">None yet.</p>') +
            "</div>" +
          "</div>" +

        "</section>";

      U.$all("[data-approve]", root).forEach(function (btn) {
        btn.addEventListener("click", function () { DATA.approveEnrollment(btn.dataset.approve); draw(); });
      });
      U.$all("[data-reject]", root).forEach(function (btn) {
        btn.addEventListener("click", function () { DATA.rejectEnrollment(btn.dataset.reject); draw(); });
      });
    }

    draw();
  }

  window.Pages = window.Pages || {};
  window.Pages.portalFamily = renderFamily;
  window.Pages.portalTutor = renderTutor;
  window.Pages.portalAdmin = renderAdmin;
})();
