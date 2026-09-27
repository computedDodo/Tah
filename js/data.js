"use strict";
/* ==========================================================================
   IBNIDREES PROTOTYPE — mock data layer
   Everything here simulates what the Flask + MySQL backend will eventually
   do. Only this file touches localStorage; every page reads/writes through
   the DATA object below. Swapping this file for real API calls later should
   be enough to connect the same UI to a real backend.
   ========================================================================== */
(function () {
  var STORAGE_KEY = "ibnidrees_demo_v1";

  function uid(prefix) {
    return prefix + "_" + Math.random().toString(36).slice(2, 8);
  }

  function seed() {
    var now = Date.now();
    var daysFromNow = function (n) { return new Date(now + n * 86400000).toISOString(); };
    var daysAgo = function (n) { return new Date(now - n * 86400000).toISOString(); };

    return {
      subjects: [
        { id: "quran", name: "Qur'an", levels: ["Primary", "JSS", "SSS"], desc: "Tajweed-focused recitation and memorisation, paced to the student's level." },
        { id: "islamiyyat", name: "Islamiyyat", levels: ["Primary", "JSS", "SSS"], desc: "Islamic studies covering aqeedah, fiqh, and seerah." },
        { id: "arabic", name: "Arabic Language", levels: ["Primary", "JSS", "SSS"], desc: "Reading, writing, and conversational Arabic." },
        { id: "biology", name: "Biology", levels: ["JSS", "SSS"], desc: "Core biology with a dedicated exam-prep track for SSS students.", featured: true },
        { id: "mathematics", name: "Mathematics", levels: ["Primary", "JSS"], desc: "Foundations through JSS-level mathematics." },
        { id: "english", name: "English Language", levels: ["Primary", "JSS"], desc: "Reading, grammar, and comprehension." },
        { id: "basic-science", name: "Basic Science & Technology", levels: ["Primary", "JSS"], desc: "Introductory science and technology concepts." }
      ],

      examTracks: ["Internal exams", "WAEC", "NECO", "JAMB"],

      family: {
        id: "fam_1",
        guardianName: "Malama Amina Yusuf",
        phone: "0803 555 0142",
        students: [
          { id: "stu_1", name: "Fatima Yusuf", level: "Primary", grade: "Primary 3" },
          { id: "stu_2", name: "Ahmad Yusuf", level: "SSS", grade: "SSS 2" }
        ]
      },

      tutor: { id: "tut_1", name: "Malam Ibrahim Sule", subjectIds: ["quran", "arabic", "islamiyyat"] },
      admin: { id: "admin_1", name: "Ibnidrees Admin" },

      enrollments: [
        { id: "enr_1", studentId: "stu_1", studentName: "Fatima Yusuf", subjectId: "quran", level: "Primary",
          mode: "online", status: "approved", paymentStatus: "confirmed", createdAt: daysAgo(20) },
        { id: "enr_2", studentId: "stu_1", studentName: "Fatima Yusuf", subjectId: "arabic", level: "Primary",
          mode: "online", status: "approved", paymentStatus: "confirmed", createdAt: daysAgo(20) },
        { id: "enr_3", studentId: "stu_2", studentName: "Ahmad Yusuf", subjectId: "biology", level: "SSS",
          mode: "physical", status: "approved", paymentStatus: "confirmed", createdAt: daysAgo(14) },
        { id: "enr_4", studentId: "stu_2", studentName: "Ahmad Yusuf", subjectId: "islamiyyat", level: "SSS",
          mode: "online", status: "pending", paymentStatus: "awaiting_confirmation", createdAt: daysAgo(1) }
      ],

      sessions: [
        { id: "ses_1", subjectId: "quran", tutorName: "Malam Ibrahim Sule", mode: "online",
          startsAt: daysFromNow(1), durationMins: 45 },
        { id: "ses_2", subjectId: "arabic", tutorName: "Malam Ibrahim Sule", mode: "online",
          startsAt: daysFromNow(2), durationMins: 45 },
        { id: "ses_3", subjectId: "biology", tutorName: "Malama Zainab Yakubu", mode: "physical",
          location: "Ibnidrees Study Centre, Lafia", startsAt: daysFromNow(3), durationMins: 60 }
      ],

      resources: [
        { id: "res_1", subjectId: "quran", tutorName: "Malam Ibrahim Sule", type: "recording",
          title: "Tajweed basics — Noon Sakinah rules", durationLabel: "18:24", addedAt: daysAgo(3) },
        { id: "res_2", subjectId: "arabic", tutorName: "Malam Ibrahim Sule", type: "homework",
          title: "Worksheet: Arabic greetings and self-introduction", dueAt: daysFromNow(2), addedAt: daysAgo(1) },
        { id: "res_3", subjectId: "biology", tutorName: "Malama Zainab Yakubu", type: "homework",
          title: "SSS2 Biology — Past-question set (Cell structure, WAEC style)", dueAt: daysFromNow(4), addedAt: daysAgo(2) },
        { id: "res_4", subjectId: "biology", tutorName: "Malama Zainab Yakubu", type: "recording",
          title: "Cell structure and function — full recap", durationLabel: "26:10", addedAt: daysAgo(6) }
      ],

      meta: { seededAt: new Date(now).toISOString() }
    };
  }

  function load() {
    try {
      var raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        var fresh = seed();
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh));
        return fresh;
      }
      return JSON.parse(raw);
    } catch (e) {
      var fresh2 = seed();
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh2));
      return fresh2;
    }
  }

  var state = load();

  function persist() {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  var DATA = {
    resetDemo: function () { state = seed(); persist(); },

    getSubjects: function () { return state.subjects.slice(); },
    getSubject: function (id) {
      var list = state.subjects.filter(function (s) { return s.id === id; });
      return list[0] || null;
    },
    getExamTracks: function () { return state.examTracks.slice(); },

    getFamily: function () { return state.family; },
    getTutor: function () { return state.tutor; },
    getAdmin: function () { return state.admin; },

    getEnrollments: function () { return state.enrollments.slice().sort(function (a, b) { return new Date(b.createdAt) - new Date(a.createdAt); }); },
    getEnrollmentsForStudent: function (studentId) {
      return state.enrollments.filter(function (e) { return e.studentId === studentId; });
    },
    getPendingEnrollments: function () {
      return state.enrollments.filter(function (e) { return e.status === "pending"; });
    },

    submitEnrollment: function (data) {
      var enrollment = {
        id: uid("enr"),
        studentId: data.studentId || uid("stu"),
        studentName: data.studentName,
        subjectId: data.subjectId,
        level: data.level,
        mode: data.mode,
        status: "pending",
        paymentStatus: "awaiting_confirmation",
        createdAt: new Date().toISOString()
      };
      state.enrollments.push(enrollment);
      persist();
      return enrollment;
    },

    approveEnrollment: function (id) {
      var e = state.enrollments.filter(function (x) { return x.id === id; })[0];
      if (e) { e.status = "approved"; e.paymentStatus = "confirmed"; persist(); }
      return e || null;
    },
    rejectEnrollment: function (id) {
      var e = state.enrollments.filter(function (x) { return x.id === id; })[0];
      if (e) { e.status = "rejected"; persist(); }
      return e || null;
    },

    getSessionsForSubjects: function (subjectIds) {
      return state.sessions.filter(function (s) { return subjectIds.indexOf(s.subjectId) !== -1; })
        .sort(function (a, b) { return new Date(a.startsAt) - new Date(b.startsAt); });
    },
    getAllSessions: function () { return state.sessions.slice(); },

    getResourcesForSubjects: function (subjectIds) {
      return state.resources.filter(function (r) { return subjectIds.indexOf(r.subjectId) !== -1; })
        .sort(function (a, b) { return new Date(b.addedAt) - new Date(a.addedAt); });
    },
    getResourcesForSubject: function (subjectId) {
      return state.resources.filter(function (r) { return r.subjectId === subjectId; })
        .sort(function (a, b) { return new Date(b.addedAt) - new Date(a.addedAt); });
    },
    addResource: function (data) {
      var resource = {
        id: uid("res"), subjectId: data.subjectId, tutorName: data.tutorName, type: data.type,
        title: data.title, durationLabel: data.durationLabel || null, dueAt: data.dueAt || null,
        addedAt: new Date().toISOString()
      };
      state.resources.push(resource);
      persist();
      return resource;
    }
  };

  window.DATA = DATA;
})();
