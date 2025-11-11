var scorm = pipwerks.SCORM;

function init() {
  scorm.init();
}

function set(param, value) {
  scorm.set(param, value);
}

function get(param) {
  scorm.get(param);
}

function end() {
  scorm.quit();
}

window.onload = function () {
  init();
};

window.onunload = function () {
  end();
};
var scorm = pipwerks.SCORM;

function init() {
  scorm.init();
}

function set(param, value) {
  scorm.set(param, value);
}

function get(param) {
  scorm.get(param);
}

function end() {
  scorm.quit();
}

window.onload = function () {
  init();
};

window.onunload = function () {
  end();
};

var onCompleted = function (result) {
  if (!result.score) {
    return;
  }

  var masteryScore;
  if (scorm.version == '2004') {
    masteryScore = scorm.get('cmi.scaled_passing_score');
  } else if (scorm.version == '1.2') {
    masteryScore = scorm.get('cmi.student_data.mastery_score') / 100;
  }

  // 設定分數值到 LMS (學習管理系統)
  var finalRawScore = result.score.scaled * 100;

  scorm.set('cmi.core.score.raw', finalRawScore);
  scorm.set('cmi.core.score.min', '0');
  scorm.set('cmi.core.score.max', '100');
  scorm.set('cmi.core.score.scaled', result.score.scaled * 100);


  // --- START: CUSTOM CODE FOR EXTERNAL SCORE REPORTING (將分數回傳到您的連結) ---
  // 嘗試取得學員 ID，如果 LMS 沒有提供，則使用 'Unknown_Student'
  var studentID = scorm.get('cmi.core.student_id') || scorm.get('cmi.core.learner_id') || 'Unknown_Student';

  var dataToSend = {
      // 課程名稱 (從 imsmanifest.xml 獲取)
      course_title: "Find the words", 
      // 原始分數 (0-100)
      raw_score: finalRawScore, 
      // 標準化分數比例 (0-1)
      scaled_score_ratio: result.score.scaled,
      // 學員識別碼
      user_identifier: studentID, 
      // 紀錄時間
      timestamp: new Date().toISOString(), 
      // SCORM 版本
      scorm_version: scorm.version, 
  };

  // 使用 fetch API 發送 POST 請求到您的連結
  fetch('https://yiwen115.github.io/20251108/', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
          // 如果目標伺服器需要，可能需要額外的 Headers
      },
      // 將數據轉換為 JSON 字符串發送
      body: JSON.stringify(dataToSend) 
  })
  .then(function(response) {
      if (response.ok) {
          console.log('成績已成功發送到外部連結。 HTTP Status:', response.status);
      } else {
          console.warn('發送成績到外部連結失敗。 HTTP Status:', response.status);
      }
  })
  .catch(function(error) {
      console.error('發送成績到外部連結時發生網路錯誤:', error);
  });
  // --- END: CUSTOM CODE FOR EXTERNAL SCORE REPORTING ---


  if (masteryScore === undefined) {
    scorm.status('set', 'completed');
  } else {
    var passed = result.score.scaled >= masteryScore;
    if (scorm.version == '2004') {
      scorm.status('set', 'completed');
      if (passed) {
        scorm.set('cmi.success_status', 'passed');
      } else {
        scorm.set('cmi.success_status', 'failed');
      }
    } else if (scorm.version == '1.2') {
      if (passed) {
        scorm.status('set', 'passed');
      } else {
        scorm.status('set', 'failed');
      }
    }
  }
};

// Some H5P content types require this to be set on the platform in order to allow submission of results
H5PIntegration.reportingIsEnabled = true;

H5P.externalDispatcher.on('xAPI', function (event) {
  if (event.data.statement.result) {
    onCompleted(event.data.statement.result);
  }
});
var onCompleted = function (result) {
  if (!result.score) {
    return;
  }

  var masteryScore;
  if (scorm.version == '2004') {
    masteryScore = scorm.get('cmi.scaled_passing_score');
  } else if (scorm.version == '1.2') {
    masteryScore = scorm.get('cmi.student_data.mastery_score') / 100;
  }

  scorm.set('cmi.core.score.raw', result.score.scaled * 100);
  scorm.set('cmi.core.score.min', '0');
  scorm.set('cmi.core.score.max', '100');
  scorm.set('cmi.core.score.scaled', result.score.scaled * 100);

  if (masteryScore === undefined) {
    scorm.status('set', 'completed');
  } else {
    var passed = result.score.scaled >= masteryScore;
    if (scorm.version == '2004') {
      scorm.status('set', 'completed');
      if (passed) {
        scorm.set('cmi.success_status', 'passed');
      } else {
        scorm.set('cmi.success_status', 'failed');
      }
    } else if (scorm.version == '1.2') {
      if (passed) {
        scorm.status('set', 'passed');
      } else {
        scorm.status('set', 'failed');
      }
    }
  }
};

// Some H5P content types require this to be set on the platform in order to allow submission of results
H5PIntegration.reportingIsEnabled = true;

H5P.externalDispatcher.on('xAPI', function (event) {
  if (event.data.statement.result) {
    onCompleted(event.data.statement.result);
  }
});

