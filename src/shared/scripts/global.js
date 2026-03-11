const LOCAL_PREFERENCE_PREFIX = "_jl_prbf"

const DEFAULT_REPO = "JuliaLang/julia";
const DEFAULT_BRANCH = "master";
const ReportsConfig = {
  DEFAULT_REPOSITORY: DEFAULT_REPO,
  DEFAULT_BRANCH: DEFAULT_BRANCH,

  DEFAULT_BRANCH_BY_REPOSITORY: {
    DEFAULT_REPO: DEFAULT_BRANCH,
  },
  AVAILABLE_REPOSITORIES: [
    DEFAULT_REPO,
  ],
};

const LOCAL_PREFERENCE_DEFAULTS = {
  "selectedRepository" : ReportsConfig.DEFAULT_REPOSITORY,
  "selectedBranches"   : { ...ReportsConfig.DEFAULT_BRANCH_BY_REPOSITORY },
};

// API Interaction
const ReportsAPI = {
  async get(path = '/') {
    const res = await fetch(`${path}`);
    if (res.status !== 200) {
      return null;
    }

    return await res.json();
  },

  async getData(repositoryId) {
    const idBits = repositoryId.split("/");

    return await this.get(`${idBits[0]}.${idBits[1]}.data.json`);
  },
};

// Content helpers
const ReportsFormatter = {
  formatDate(dateString) {
    const date = new Date(dateString);
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const day = String(date.getUTCDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  },

  formatTimestamp(timeString) {
    const options = {
      year: 'numeric', month: 'long', day: 'numeric',
      hour: 'numeric', hour12: false, minute: 'numeric',
      timeZone: 'UTC', timeZoneName: 'short',
    };
    const dateFormatter = new Intl.DateTimeFormat('en-US', options);

    const date = new Date(timeString);
    return dateFormatter.format(date);
  },

  formatTimespan(timeValue, timeUnit) {
    const options = {
      style: 'long',
    };
    const timeFormatter = new Intl.RelativeTimeFormat('en-US', options);

    return timeFormatter.format(timeValue, timeUnit);
  },

  getDaysSince(dateString) {
    const date = new Date(dateString);
    const msBetween = (new Date()) - date;
    const days = Math.floor(msBetween / (1000 * 60 * 60 * 24));

    return days;
  },

  formatDays(days) {
    return days + " " + (days !== 1 ? "days" : "day");
  },
};

const ReportsUtils = {
  createEvent(name, detail = {}) {
    return  new CustomEvent(name, {
      detail: detail
    });
  },

  getHistoryHash() {
    let rawHash = window.location.hash;
    if (rawHash !== "") {
      return rawHash.substr(1);
    }

    return "";
  },

  getPageState() {
    const url = new URL(window.location);
    const params = url.searchParams;
    const legacyRepo = this.getHistoryHash();

    return {
      repository: params.get("repo") || legacyRepo || "",
      branch: params.get("branch") || "",
      path: params.get("path") || "",
      pull: params.get("pr") || "",
      author: params.get("author") || "",
      generatedAt: params.get("data") || "",
    };
  },

  setPageState(state = {}, replace = false) {
    const url = new URL(window.location);
    const pageState = {
      repository: state.repository || "",
      branch: state.branch || "",
      path: state.path || "",
      pull: state.pull || "",
      author: state.author || "",
      generatedAt: state.generatedAt || "",
    };

    url.hash = "";
    this._setOrDeleteSearchParam(url, "repo", pageState.repository);
    this._setOrDeleteSearchParam(url, "branch", pageState.branch);
    this._setOrDeleteSearchParam(url, "path", pageState.path);
    this._setOrDeleteSearchParam(url, "pr", pageState.pull);
    this._setOrDeleteSearchParam(url, "author", pageState.author);
    this._setOrDeleteSearchParam(url, "data", pageState.generatedAt);

    const historyMethod = replace ? "replaceState" : "pushState";
    window.history[historyMethod]({}, "", url);
  },

  _setOrDeleteSearchParam(url, name, value) {
    if (value === "") {
      url.searchParams.delete(name);
    } else {
      url.searchParams.set(name, value);
    }
  },

  getLocalPreferences() {
    // Always fallback on defaults.
    const localPreferences = {
      ...LOCAL_PREFERENCE_DEFAULTS,
      "selectedBranches": { ...LOCAL_PREFERENCE_DEFAULTS.selectedBranches },
    };

    for (let key in localPreferences) {
      const storedValue = localStorage.getItem(`${LOCAL_PREFERENCE_PREFIX}_${key}`);
      if (storedValue != null) {
        localPreferences[key] = JSON.parse(storedValue);
      }
    }

    return localPreferences;
  },

  setLocalPreferences(currentPreferences) {
    for (let key in currentPreferences) {
      // Only store known properties.
      if (key in LOCAL_PREFERENCE_DEFAULTS) {
        localStorage.setItem(`${LOCAL_PREFERENCE_PREFIX}_${key}`, JSON.stringify(currentPreferences[key]));
      }
    }
  },

  resetLocalPreferences() {
    this.setLocalPreferences(LOCAL_PREFERENCE_DEFAULTS);
  },
};

const ReportsSingleton = {
  api: ReportsAPI,
  format: ReportsFormatter,
  util: ReportsUtils,
  config: ReportsConfig,
};

window.greports = ReportsSingleton;
