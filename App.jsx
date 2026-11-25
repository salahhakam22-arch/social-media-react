import React, { useState } from "react";
import "./style.css";

const API_BASE = "https://route-posts.routemisr.com";
const POSTMAN_DOCS =
  "https://documenter.getpostman.com/view/5709532/2sBXcBnNAq";
const SOCIAL = {
  Facebook: "",
  LinkedIn: "",
  Instagram: "",
  YouTube: "",
  TikTok: "",
};
const MODULES = {
  "Users & Auth": [
    [
      "POST",
      "/users/signup",
      "Create account and return token + user payload",
      "No",
    ],
    ["POST", "/users/signin", "Sign in by login/email/username", "No"],
    ["PATCH", "/users/change-password", "Rotate password and token", "Yes"],
    [
      "PUT",
      "/users/upload-photo",
      "Upload profile photo to Cloudflare R2",
      "Yes",
    ],
    ["GET", "/users/profile-data", "Current authenticated profile", "Yes"],
    [
      "GET",
      "/users/suggestions?page=&limit=",
      "Follow suggestions with pagination",
      "Yes",
    ],
  ],
  "Posts & Feed": [
    ["GET", "/posts", "Public post listing (default newest first)", "Yes"],
    [
      "GET",
      "/posts/feed?only=&page=&limit=",
      "Home timeline (following/me/all)",
      "Yes",
    ],
    ["POST", "/posts", "Create post with body/image", "Yes"],
    ["PUT", "/posts/:postId", "Update body/image or remove image", "Yes"],
    ["PUT", "/posts/:postId/like", "Toggle like", "Yes"],
    [
      "GET",
      "/posts/:postId/likes?page=&limit=",
      "List users who liked a post",
      "Yes",
    ],
    ["PUT", "/posts/:postId/bookmark", "Toggle bookmark", "Yes"],
    [
      "POST",
      "/posts/:postId/share",
      "Create share post linked to original post",
      "Yes",
    ],
  ],
  "Comments & Replies": [
    [
      "GET",
      "/posts/:postId/comments?page=&limit=",
      "Paginated post comments",
      "Yes",
    ],
    ["POST", "/posts/:postId/comments", "Create comment (text/image)", "Yes"],
    [
      "GET",
      "/posts/:postId/comments/:commentId/replies",
      "Paginated replies",
      "Yes",
    ],
    [
      "POST",
      "/posts/:postId/comments/:commentId/replies",
      "Create reply",
      "Yes",
    ],
    [
      "PUT",
      "/posts/:postId/comments/:commentId",
      "Edit comment by owner",
      "Yes",
    ],
    [
      "DELETE",
      "/posts/:postId/comments/:commentId",
      "Delete by comment owner or post owner",
      "Yes",
    ],
    [
      "PUT",
      "/posts/:postId/comments/:commentId/like",
      "Toggle comment like",
      "Yes",
    ],
  ],
  Notifications: [
    [
      "GET",
      "/notifications?page=&limit=",
      "Notifications list with entity details",
      "Yes",
    ],
    ["GET", "/notifications/unread-count", "Unread badge count", "Yes"],
    ["PATCH", "/notifications/:notificationId/read", "Mark one as read", "Yes"],
    ["PATCH", "/notifications/read-all", "Mark all as read", "Yes"],
  ],
};

const about =
  "Route Academy is the premier IT training center in Egypt, established in 2012. We specialize in delivering high-quality training courses in programming, web development, and application development. We've identified the unique challenges people may face when learning new technology and made efforts to provide strategies to overcome them.";

export default function App() {
  const [module, setModule] = useState("Users & Auth");
  const [health, setHealth] = useState({
    status: "Not executed yet",
    output: 'Click "Run Health Check" to fetch /api/health...',
  });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState("");
  const notify = (name) => {
    setToast(`${name} link coming soon.`);
    window.clearTimeout(notify.timer);
    notify.timer = window.setTimeout(() => setToast(""), 2800);
  };
  const runHealth = async () => {
    setLoading(true);
    setHealth({
      status: "Request in progress…",
      output: `GET ${API_BASE}/api/health`,
    });
    try {
      const response = await fetch(`${API_BASE}/api/health`, {
        headers: { Accept: "application/json" },
      });
      const body = await response.text();
      let result;
      try {
        result = JSON.stringify(JSON.parse(body), null, 2);
      } catch {
        result = body || "(empty response)";
      }
      setHealth({
        status: `${response.status} ${response.statusText || (response.ok ? "OK" : "Error")}`,
        output: result,
        ok: response.ok,
      });
    } catch (error) {
      setHealth({
        status: "Request failed",
        output: `Unable to reach the health endpoint. ${error.message}\n\nCheck your connection and try again.`,
        ok: false,
      });
    } finally {
      setLoading(false);
    }
  };
  const socialLink = (name) =>
    SOCIAL[name] ? (
      <a href={SOCIAL[name]} target="_blank" rel="noopener">
        {name}
      </a>
    ) : (
      <a
        href="#connect"
        onClick={(event) => {
          event.preventDefault();
          notify(name);
        }}
      >
        {name}
      </a>
    );
  const healthOutputClass = `term${health.ok === true ? " success" : health.ok === false ? " error" : ""}`;
  return (
    <>
      <main className="w">
        <div className="hero">
          <section className="card l">
            <span className="pill">Route Academy</span>
            <h1>route-posts</h1>
            <p className="lead">
              A complete social API learning playground with professional docs,
              clear endpoint contracts, and fast testing workflow.
            </p>
            <div className="chips">
              {[
                "Auth & Users",
                "Feed & Timeline",
                "Comments & Mentions",
                "Notifications",
              ].map((x) => (
                <span className="pill" key={x}>
                  {x}
                </span>
              ))}
            </div>
            <div className="btns">
              <a className="btn p" href="#modules">
                Explore Docs
              </a>
              <a
                className="btn"
                href={POSTMAN_DOCS}
                target="_blank"
                rel="noopener"
              >
                Open Postman Documentation
              </a>
              <a className="btn" href="#demo">
                Open Demo
              </a>
            </div>
          </section>
          <aside className="card qa">
            <div className="logo">
              <img
                src="https://content.pstmn.io/6eea5c8b-f51d-4b1c-8acd-b8799d80944e/cm91dGUucG5n"
                alt="Route Academy logo"
                onError={(e) =>
                  e.currentTarget.replaceWith(document.createTextNode("ROUTE"))
                }
              />
            </div>
            <h2>Quick Access</h2>
            <a className="q" href={POSTMAN_DOCS} target="_blank" rel="noopener">
              Postman Documentation
            </a>
            <a className="q" href="#demo">
              Frontend Demo
            </a>
            <a
              className="q"
              href={`${API_BASE}/api/health`}
              target="_blank"
              rel="noopener"
            >
              API Health
            </a>
            <div className="st">
              <div>
                <b>2012</b>Founded
              </div>
              <div>
                <b>40K+</b>Graduates
              </div>
              <div>
                <b>5</b>Branches
              </div>
            </div>
          </aside>
        </div>
        <section className="card" id="about">
          <h2 className="t">About Route Academy</h2>
          <p className="sub">Egypt's Leading IT Training Center Since 2012</p>
          <p>{about}</p>
          <div className="stats">
            {[
              ["2012", "Founded"],
              ["40K+", "Graduates"],
              ["50+", "Partner Companies"],
              ["5", "Branches"],
              ["20", "Diplomas Available"],
            ].map(([n, l]) => (
              <div key={l}>
                <b>{n}</b>
                {l}
              </div>
            ))}
          </div>
        </section>
        <section className="card" id="demo">
          <h2 className="t">Live Demo</h2>
          <p>
            Use this quick demo to verify the backend is reachable from your
            browser.
          </p>
          <div className="run">
            <button className="btn p" onClick={runHealth} disabled={loading}>
              {loading ? "Checking…" : "Run Health Check"}
            </button>
            <code id="hs" aria-live="polite">
              {health.status}
            </code>
          </div>
          <pre className={healthOutputClass} aria-live="polite">
            {health.output}
          </pre>
        </section>
        <section className="card" id="workflow">
          <h2 className="t">Testing Workflow</h2>
          <ol>
            <li>
              Open the Postman public documentation and fork the collection to
              your workspace.
            </li>
            <li>
              Create a user with <code>POST /users/signup</code>, then sign in
              using <code>POST /users/signin</code>.
            </li>
            <li>
              Save <code>data.token</code> and send it as{" "}
              <code>Authorization: Bearer &lt;token&gt;</code> for protected
              routes.
            </li>
            <li>
              Run the core journey: create post, comment/reply,
              like/bookmark/share, then check notifications.
            </li>
            <li>
              Validate pagination and filters using <code>page</code>,{" "}
              <code>limit</code>, <code>only</code>, and <code>cursor</code>{" "}
              where available.
            </li>
          </ol>
          <div className="note">
            Free for testing and educational use. Not intended for production
            workloads.
          </div>
        </section>
        <section className="card" id="connect">
          <h2 className="t">Connect With Route Academy</h2>
          <p>Follow Route Academy and join the learning community.</p>
          <div className="soc">
            {Object.keys(SOCIAL).map((name) => (
              <React.Fragment key={name}>{socialLink(name)}</React.Fragment>
            ))}
          </div>
        </section>
        <section className="card" id="modules">
          <h2 className="t">API Modules</h2>
          <div className="tabs" role="tablist">
            {Object.keys(MODULES).map((name) => (
              <button
                key={name}
                type="button"
                role="tab"
                aria-selected={module === name}
                className="tab"
                onClick={() => setModule(name)}
              >
                {name}
              </button>
            ))}
          </div>
          <div className="tw">
            <table>
              <thead>
                <tr>
                  <th>Method</th>
                  <th>Endpoint</th>
                  <th>Purpose</th>
                  <th>Auth</th>
                </tr>
              </thead>
              <tbody>
                {MODULES[module].map(([method, endpoint, purpose, auth]) => (
                  <tr key={`${method}${endpoint}`}>
                    <td>
                      <span className={`method ${method.toLowerCase()}`}>
                        {method}
                      </span>
                    </td>
                    <td className="endpoint">{endpoint}</td>
                    <td>{purpose}</td>
                    <td className="auth">{auth}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
        <section className="card" id="contract">
          <h2 className="t">Response Contract</h2>
          <pre className="term">{`{
  "success": true,
  "message": "success",
  "data": {},
  "meta": {}
}`}</pre>
          <div style={{ height: 14 }} />
          <pre className="term">{`{
  "success": false,
  "message": "Validation error message",
  "errors": ["field error 1", "field error 2"]
}`}</pre>
        </section>
      </main>
      <footer>
        <div className="w fg">
          <div>
            <h4 style={{ fontSize: 22, color: "#0a3d9c" }}>route-posts</h4>
            <p>
              Official Route Academy API learning playground for social app
              backend training and testing.
            </p>
          </div>
          <div>
            <h4>Documentation</h4>
            <a href={POSTMAN_DOCS} target="_blank" rel="noopener">
              Postman Public Docs
            </a>
          </div>
          <div>
            <h4>Platform</h4>
            <a href={`${API_BASE}/api/health`} target="_blank" rel="noopener">
              API Health
            </a>
            <a href="#modules">Endpoints</a>
            <a href="#workflow">Quick Start</a>
          </div>
          <div>
            <h4>Route Academy</h4>
            {["Facebook", "LinkedIn", "Instagram"].map((name) => (
              <React.Fragment key={name}>{socialLink(name)}</React.Fragment>
            ))}
          </div>
        </div>
        <div className="w fb">
          <span>© 2026 Route Academy. All rights reserved.</span>
          <span>Built for students and API testing practice.</span>
        </div>
      </footer>
      <div id="toast" role="status" className={toast ? "show" : ""}>
        {toast}
      </div>
    </>
  );
}
