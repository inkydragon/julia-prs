import { LitElement, html, css, customElement, property } from 'lit-element';

import PageContent from 'src/shared/components/PageContent';
import SharedNavigation from 'src/shared/components/SharedNavigation';
import IndexHeader from "./components/IndexHeader";
import IndexDescription from "./components/IndexDescription";

import PullFilter from './components/filters/PullFilter';
import FileList from "./components/files/FileList";
import PullList from "./components/pulls/PullRequestList"

@customElement('entry-component')
export default class EntryComponent extends LitElement {
    static get styles() {
        return css`
          /** Colors and variables **/
          :host {
          }
          @media (prefers-color-scheme: dark) {
            :host {
            }
          }

          /** Component styling **/
          :host {
          }

          :host .files {
            display: flex;
            padding: 24px 0;
          }

          @media only screen and (max-width: 900px) {
            :host .files {
              flex-wrap: wrap;
            }
          }
        `;
    }

    constructor() {
        super();

        this._entryRequested = false;
        this._isLoading = true;
        this._generatedAt = null;

        this._authors = {};
        this._branches = [];
        this._files = {};
        this._pulls = [];

        this._selectedRepository = greports.config.DEFAULT_REPOSITORY;
        this._selectedBranch = greports.config.DEFAULT_BRANCH;
        this._selectedPath = "";
        this._selectedPathPulls = [];

        this._filteredPull = "";
        this._filterAuthor = "";
        this._urlState = greports.util.getPageState();

        this._restoreUserPreferences();
        this._requestData();
    }

    connectedCallback() {
        super.connectedCallback();
        this._onPopState = this._handlePopState.bind(this);
        window.addEventListener("popstate", this._onPopState);
    }

    disconnectedCallback() {
        window.removeEventListener("popstate", this._onPopState);
        super.disconnectedCallback();
    }

    performUpdate() {
        this._requestData();
        super.performUpdate();
    }

    _restoreUserPreferences() {
        const userPreferences = greports.util.getLocalPreferences();

        this._selectedRepository = this._urlState.repository || userPreferences["selectedRepository"];
        this._restoreSelectedBranch();

        if (this._urlState.branch !== "") {
            this._selectedBranch = this._urlState.branch;
        }
        this._selectedPath = this._urlState.path || "";
        this._filteredPull = this._urlState.pull || "";
        this._filterAuthor = this._urlState.author || "";
    }

    _restoreSelectedBranch() {
        const userPreferences = greports.util.getLocalPreferences();

        if (typeof userPreferences["selectedBranches"][this._selectedRepository] !== "undefined") {
            this._selectedBranch = userPreferences["selectedBranches"][this._selectedRepository];
        } else {
            this._selectedBranch = "master";
        }
    }

    /**
     * Extract the version string from a release-ish branch, e.g. "release-1.11" -> "1.11".
     * @param {string} branch
     * @returns {string}
     */
    _getBranchVersion(branch) {
        const match = branch.match(/^(release-|backports-release-)([\d.]+)$/);
        return match ? match[2] : "";
    }

    /**
     * Sort branches: master first, then release / backports (by version, descending), others last.
     * @param {string[]} branches
     * @returns {void}
     */
    _sortBranches(branches) {
        branches.sort((a, b) => {
            if (a === "master") return -1;
            if (b === "master") return 1;

            const aVer = this._getBranchVersion(a);
            const bVer = this._getBranchVersion(b);
            const aPriority = a.startsWith("backports-release-") ? 2 : (a.startsWith("release-") ? 1 : 3);
            const bPriority = b.startsWith("backports-release-") ? 2 : (b.startsWith("release-") ? 1 : 3);
            if (aPriority !== bPriority) {
                return aPriority - bPriority;
            }

            // Same category: sort by version number in descending order.
            if (aVer !== "" && bVer !== "" && aVer !== bVer) {
                return bVer.localeCompare(aVer, undefined, { numeric: true });
            }

            if (a > b) return 1;
            if (a < b) return -1;
            return 0;
        });
    }

    _saveUserPreferences() {
        const storedPreferences = greports.util.getLocalPreferences();
        let selectedBranches = storedPreferences["selectedBranches"];
        selectedBranches[this._selectedRepository] = this._selectedBranch;

        const currentPreferences = {
            "selectedRepository" : this._selectedRepository,
            "selectedBranches"   : selectedBranches,
        };

        greports.util.setLocalPreferences(currentPreferences);
    }

    async _requestData() {
        if (this._entryRequested) {
            return;
        }
        this._entryRequested = true;
        this._isLoading = true;

        const requested_repo = this._urlState.repository;
        if (requested_repo !== "" && this._selectedRepository !== requested_repo) {
            this._selectedRepository = requested_repo;
            this._restoreSelectedBranch();
        }
        const data = await greports.api.getData(this._selectedRepository);

        if (data) {
            this._generatedAt = data.generated_at;
            this._authors = data.authors;
            this._pulls = data.pulls;

            data.branches.forEach((branch) => {
                if (typeof data.files[branch] === "undefined") {
                    return;
                }

                this._branches.push(branch);
                const branchFiles = {};

                data.files[branch].forEach((file) => {
                    if (file.type === "file" || file.type === "folder") {
                        if (typeof branchFiles[file.parent] === "undefined") {
                            branchFiles[file.parent] = [];
                        }

                        branchFiles[file.parent].push(file);
                    }
                });

                for (let folderName in branchFiles) {
                    branchFiles[folderName].sort((a, b) => {
                        if (a.type === "folder" && b.type !== "folder") {
                            return -1;
                        }
                        if (b.type === "folder" && a.type !== "folder") {
                            return 1;
                        }

                        const a_name = a.path.toLowerCase();
                        const b_name = b.path.toLowerCase();

                        if (a_name > b_name) return 1;
                        if (a_name < b_name) return -1;
                        return 0;
                    });
                }

                this._files[branch] = branchFiles;
            });

            // Sort branches: master first, then release/backports by version descending, others last.
            this._sortBranches(this._branches);

            // If our preferred branch doesn't exist, pick master.
            if (typeof this._files[this._selectedBranch] === "undefined") {
                this._selectedBranch = "master";
            }
            // If master doesn't exist, pick the first available.
            if (typeof this._files[this._selectedBranch] === "undefined" && data.branches.length > 0) {
                this._selectedBranch = data.branches[0];
            }

            this._restoreSelectedPathPulls();
            this._syncUrlState(true);
        } else {
            this._generatedAt = null;

            this._authors = {};
            this._branches = [];
            this._files = {};
            this._pulls = [];

            this._selectedBranch = "master";
            this._selectedPath = "";
            this._selectedPathPulls = [];
            this._syncUrlState(true);
        }

        this._isLoading = false;
        this.requestUpdate();
    }

    _restoreSelectedPathPulls() {
        if (this._selectedPath === "") {
            this._selectedPathPulls = [];
            return;
        }

        const branchFiles = this._files[this._selectedBranch] || {};
        const topLevel = branchFiles[""] || [];
        const selectedEntry = this._findFileEntry(branchFiles, topLevel, this._selectedPath);

        if (!selectedEntry) {
            this._selectedPath = "";
            this._selectedPathPulls = [];
            return;
        }

        this._selectedPathPulls = selectedEntry.pulls || [];

        if (this._filteredPull !== "") {
            const pullNumber = parseInt(this._filteredPull, 10);
            if (!this._selectedPathPulls.includes(pullNumber)) {
                this._selectedPath = "";
                this._selectedPathPulls = [];
            }
        }
    }

    _findFileEntry(branchFiles, entries, targetPath) {
        for (const item of entries) {
            if (item.path === targetPath) {
                return item;
            }

            if (item.type === "folder") {
                const childEntry = this._findFileEntry(branchFiles, branchFiles[item.path] || [], targetPath);
                if (childEntry) {
                    return childEntry;
                }
            }
        }

        return null;
    }

    /**
     * Find the first path of a pull request that actually exists in the
     * branch tree, so the file list can highlight it. Newly added files are
     * not part of the tree snapshot and are therefore skipped.
     * @param {Object} branchFiles
     * @param {Object} pull
     * @returns {string}
     */
    _findLocatedPullPath(branchFiles, pull) {
        const topLevel = branchFiles[""] || [];
        if (!pull.files) {
            return "";
        }

        for (const file of pull.files) {
            const path = (file && typeof file === "object") ? file.path : null;
            if (path && this._findFileEntry(branchFiles, topLevel, path)) {
                return path;
            }
        }

        return "";
    }

    /**
     * Adjust the UI so the given pull request is reachable: switch to its
     * target branch and select one of its files. The PR stays reachable even
     * when it only touches newly added files, so we always pin its number.
     * @param {number} pullNumber
     * @param {Object} pull
     * @returns {void}
     */
    _locatePullInUi(pullNumber, pull) {
        const branchFiles = typeof this._files[pull.target_branch] === "undefined"
            ? null
            : this._files[pull.target_branch];
        if (branchFiles === null) {
            return;
        }

        if (pull.target_branch !== this._selectedBranch) {
            this._selectedBranch = pull.target_branch;
        }

        this._selectedPath = this._findLocatedPullPath(branchFiles, pull);
        this._selectedPathPulls = [pullNumber];
    }

    _syncUrlState(replace = false) {
        const generatedAt = (this._generatedAt ? greports.format.formatDate(this._generatedAt) : "");

        greports.util.setPageState({
            repository: this._selectedRepository,
            branch: this._selectedBranch,
            path: this._selectedPath,
            pull: this._filteredPull,
            author: this._filterAuthor,
            generatedAt: generatedAt,
        }, replace);
    }

    _handlePopState() {
        this._urlState = greports.util.getPageState();
        if (this._urlState.repository !== "" && this._urlState.repository !== this._selectedRepository) {
            window.location.reload();
            return;
        }

        this._restoreUserPreferences();
        this._restoreSelectedPathPulls();
        this.requestUpdate();
    }

    _onPullFilterChanged(event) {
        this._filteredPull = event.detail.pull;
        if (this._filteredPull !== "") {
            const pullNumber = parseInt(this._filteredPull, 10);
            const pull = this._pulls.find((item) => item.public_id === pullNumber);
            if (pull) {
                this._locatePullInUi(pullNumber, pull);
            }
        }

        this._syncUrlState();
        this.requestUpdate();
    }

    _onBranchSelected(event) {
        if (this._selectedBranch === event.detail.branch) {
            return;
        }

        this._selectedBranch = event.detail.branch;
        this._selectedPath = "";
        this._selectedPathPulls = [];

        this._saveUserPreferences()
        this._syncUrlState();
        this.requestUpdate();
    }

    _onPathClicked(event) {
        this._selectedPath = event.detail.path;
        this._selectedPathPulls = event.detail.pulls;
        this._syncUrlState();
        this.requestUpdate();

        window.scrollTo(0, 0);
    }

    render(){
        return html`
            <page-content>
                <shared-nav></shared-nav>
                <gr-index-entry .generated_at="${this._generatedAt}"></gr-index-entry>
                <gr-index-description></gr-index-description>

                ${(this._isLoading ? html`
                    <h3>Loading...</h3>
                ` : html`
                    <gr-pull-filter
                        .value="${this._filteredPull}"
                        @filterchanged="${this._onPullFilterChanged}"
                    ></gr-pull-filter>

                    <div class="files">
                        <gr-file-list
                            .branches="${this._branches}"
                            .files="${this._files}"
                            .selectedRepository="${this._selectedRepository}"
                            .selectedBranch="${this._selectedBranch}"
                            .selectedPath="${this._selectedPath}"
                            .filteredPull="${this._filteredPull}"
                            @branchselect="${this._onBranchSelected}"
                            @pathclick="${this._onPathClicked}"
                        ></gr-file-list>

                        <gr-pull-list
                            .pulls="${this._pulls}"
                            .authors="${this._authors}"
                            .selectedRepository="${this._selectedRepository}"
                            .selectedBranch="${this._selectedBranch}"
                            .selectedPath="${this._selectedPath}"
                            .selectedPulls="${this._selectedPathPulls}"
                            .filteredPull="${this._filteredPull}"
                        ></gr-pull-list>
                    </div>
                `)}
            </page-content>
        `;
    }
}
