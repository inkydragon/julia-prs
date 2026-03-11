import { LitElement, html, css, customElement, property } from 'lit-element';

@customElement('gr-pull-request')
export default class PullRequestItem extends LitElement {
    static get styles() {
        return css`
          /** Colors and variables **/
          :host {
            --pr-border-color: #fcfcfa;
            --star-font-color: #ffcc31;
            --ghost-font-color: #738b99;
          }

          @media (prefers-color-scheme: dark) {
            :host {
              --pr-border-color: #0d1117;
              --star-font-color: #e0c537;
              --ghost-font-color: #495d68;
            }
          }

          /** Component styling **/
          :host {
            border-bottom: 3px solid var(--pr-border-color);
            display: block;
            padding: 14px 12px 20px 12px;
          }

          :host .pr-container {
            display: grid;
            grid-template-columns: minmax(0, 1fr) max-content;
            grid-template-areas:
              "title title"
              "author updated"
              "details created";
            column-gap: 24px;
            row-gap: 8px;
            align-items: start;
          }

          :host a {
            color: var(--link-font-color);
            text-decoration: none;
          }
          :host a:hover {
            color: var(--link-font-color-hover);
          }

          :host .pr-title-block {
            grid-area: title;
            min-width: 0;
          }

          :host .pr-title {
            display: inline;
            font-size: 20px;
            margin-top: 6px;
            min-width: 0;
          }

          :host .pr-title-line {
            line-height: 1.35;
            margin-top: 6px;
            min-width: 0;
            word-break: break-word;
          }

          :host .pr-state {
            color: var(--light-font-color);
            font-family: monospace;
            font-size: 16px;
            font-weight: 700;
            margin-right: 8px;
          }

          :host .pr-title-id {
            margin-right: 4px;
          }

          :host .pr-title-name {
            color: var(--g-font-color);
          }

          :host .pr-open-age {
            color: var(--light-font-color);
            font-size: 13px;
            margin-left: 10px;
            white-space: nowrap;
          }

          :host .pr-container--draft .pr-title {
            filter: saturate(0.4);
          }
          :host .pr-container--draft .pr-title-name {
            opacity: 0.7;
          }
          :host .pr-container--draft .pr-state {
            opacity: 0.8;
          }

          :host .pr-meta {
            color: var(--dimmed-font-color);
            font-size: 13px;
          }

          :host .pr-author {
            grid-area: author;
          }

          :host .pr-details {
            grid-area: details;
            display: flex;
            flex-wrap: wrap;
            gap: 18px;
          }

          :host .pr-detail {
            white-space: nowrap;
          }

          :host .pr-detail--actions {
            color: var(--light-font-color);
          }

          :host .pr-detail-value {
            font-weight: 700;
          }

          :host .pr-time {
            color: var(--dimmed-font-color);
            font-size: 13px;
            text-align: right;
            white-space: nowrap;
          }
          :host .pr-time-value {
            border-bottom: 1px dashed var(--g-font-color);
            cursor: help;
            font-weight: 700;
          }

          :host .pr-author-value {
            font-weight: 700;
          }
          :host .pr-author-value--hot:before {
            content: "★";
            color: var(--star-font-color);
          }
          :host .pr-author-value--ghost {
            color: var(--ghost-font-color);
            font-weight: 600;
          }

          :host .pr-updated {
            grid-area: updated;
          }

          :host .pr-created {
            grid-area: created;
          }

          @media only screen and (max-width: 900px) {
            :host {
              padding: 14px 0 20px 0;
            }

            :host .pr-container {
              grid-template-columns: minmax(0, 1fr);
              grid-template-areas:
                "title"
                "author"
                "updated"
                "created"
                "details";
              row-gap: 10px;
            }

            :host .pr-updated,
            :host .pr-created {
              text-align: left;
            }

            :host .pr-open-age {
              display: inline-block;
              margin-left: 0;
              margin-top: 6px;
            }
          }
        `;
    }

    @property({ type: String }) id = '';
    @property({ type: String }) title = '';
    @property({ type: String, reflect: true }) url = '';
    @property({ type: String, reflect: true }) diff_url = '';
    @property({ type: String, reflect: true }) patch_url = '';

    @property({ type: Boolean }) draft = false;
    @property({ type: String, reflect: true }) milestone = '';
    @property({ type: String, reflect: true }) branch = '';

    @property({ type: String }) created_at = '';
    @property({ type: String }) updated_at = '';
    @property({ type: Object }) author = null;

    @property({ type: String }) repository = '';

    _formatOpenAge(timestamp) {
        const createdAt = new Date(timestamp);
        if (Number.isNaN(createdAt.getTime())) {
            return 'open';
        }

        const diffMs = Math.max(0, Date.now() - createdAt.getTime());
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        if (diffDays < 14) {
            return `open ${Math.max(1, diffDays)}d`;
        }
        if (diffDays < 60) {
            return `open ${Math.floor(diffDays / 7)}wk`;
        }
        if (diffDays < 365) {
            return `open ${Math.floor(diffDays / 30)}mo`;
        }
        return `open ${Math.floor(diffDays / 365)}yr`;
    }

    render(){
        const author = this.author || {
            id: '',
            user: 'ghost',
            pull_count: 0,
        };
        const authorClassList = [ "pr-author-value" ];
        if (author.pull_count > 40) {
            authorClassList.push("pr-author-value--hot");
        }
        if (author.id === "") {
            authorClassList.push("pr-author-value--ghost");
        }
        const stateLabel = this.draft ? '[~]' : '[o]';
        const openAge = this._formatOpenAge(this.created_at);

        return html`
            <div class="pr-container ${(this.draft ? "pr-container--draft" : "")}">
                <div class="pr-title-block">
                    <div class="pr-title-line">
                        <span class="pr-state" title="${this.draft ? 'Draft PR' : 'Open PR'}">${stateLabel}</span>
                        <a
                            class="pr-title"
                            href="${this.url}"
                            target="_blank"
                        >
                            <span class="pr-title-id">#${this.id}</span>
                            <span class="pr-title-name">${this.title}</span>
                        </a>
                        <span class="pr-open-age">${openAge}</span>
                    </div>
                </div>

                <div class="pr-author pr-meta">
                    <span>author: </span>
                    <a
                        class="${authorClassList.join(" ")}"
                        href="https://github.com/${this.repository}/pulls/${author.user}"
                        target="_blank"
                        title="Open ${author.pull_count} ${(author.pull_count > 1) ? 'PRs' : 'PR'} by ${author.user}"
                    >
                        ${author.user}
                    </a>
                </div>

                <div class="pr-details pr-meta">
                    <div class="pr-detail">
                        <span>branch: </span>
                        <span class="pr-detail-value">
                            ${this.branch}
                        </span>
                    </div>
                    <div class="pr-detail">
                        <span>milestone: </span>
                        ${(this.milestone != null) ? html`
                            <a
                                href="${this.milestone.url}"
                                target="_blank"
                                class="pr-detail-value"
                            >
                                ${this.milestone.title}
                            </a>
                        ` : html`
                            <span class="pr-detail-value">none</span>
                        `}
                    </div>
                    <span class="pr-detail pr-detail--actions">
                        (
                        <a
                            href="${this.diff_url}"
                            target="_blank"
                        >
                            diff
                        </a> |
                        <a
                            href="${this.patch_url}"
                            target="_blank"
                        >
                            patch
                        </a>
                        )
                    </span>
                </div>

                <div class="pr-time pr-updated">
                    <span>updated: </span>
                    <span
                        class="pr-time-value"
                        title="${greports.format.formatTimestamp(this.updated_at)}"
                    >
                        ${greports.format.formatDate(this.updated_at)}
                    </span>
                </div>

                <div class="pr-time pr-created">
                    <span>created: </span>
                    <span
                        class="pr-time-value"
                        title="${greports.format.formatTimestamp(this.created_at)}"
                    >
                        ${greports.format.formatDate(this.created_at)}
                    </span>
                </div>
            </div>
        `;
    }
}
