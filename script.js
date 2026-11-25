const API_BASE = 'https://route-posts.routemisr.com';
const POSTMAN_DOCS = 'https://documenter.getpostman.com/view/5709532/2sBXcBnNAq';
const SOCIAL = {
  Facebook: '',
  LinkedIn: '',
  Instagram: '',
  YouTube: '',
  TikTok: ''
};

const MODULES = {
  'Users & Auth': [
    ['POST','/users/signup','Create account and return token + user payload','No'],
    ['POST','/users/signin','Sign in by login/email/username','No'],
    ['PATCH','/users/change-password','Rotate password and token','Yes'],
    ['PUT','/users/upload-photo','Upload profile photo to Cloudflare R2','Yes'],
    ['GET','/users/profile-data','Current authenticated profile','Yes'],
    ['GET','/users/suggestions?page=&limit=','Follow suggestions with pagination','Yes']
  ],
  'Posts & Feed': [
    ['GET','/posts','Public post listing (default newest first)','Yes'],
    ['GET','/posts/feed?only=&page=&limit=','Home timeline (following/me/all)','Yes'],
    ['POST','/posts','Create post with body/image','Yes'],
    ['PUT','/posts/:postId','Update body/image or remove image','Yes'],
    ['PUT','/posts/:postId/like','Toggle like','Yes'],
    ['GET','/posts/:postId/likes?page=&limit=','List users who liked a post','Yes'],
    ['PUT','/posts/:postId/bookmark','Toggle bookmark','Yes'],
    ['POST','/posts/:postId/share','Create share post linked to original post','Yes']
  ],
  'Comments & Replies': [
    ['GET','/posts/:postId/comments?page=&limit=','Paginated post comments','Yes'],
    ['POST','/posts/:postId/comments','Create comment (text/image)','Yes'],
    ['GET','/posts/:postId/comments/:commentId/replies','Paginated replies','Yes'],
    ['POST','/posts/:postId/comments/:commentId/replies','Create reply','Yes'],
    ['PUT','/posts/:postId/comments/:commentId','Edit comment by owner','Yes'],
    ['DELETE','/posts/:postId/comments/:commentId','Delete by comment owner or post owner','Yes'],
    ['PUT','/posts/:postId/comments/:commentId/like','Toggle comment like','Yes']
  ],
  'Notifications': [
    ['GET','/notifications?page=&limit=','Notifications list with entity details','Yes'],
    ['GET','/notifications/unread-count','Unread badge count','Yes'],
    ['PATCH','/notifications/:notificationId/read','Mark one as read','Yes'],
    ['PATCH','/notifications/read-all','Mark all as read','Yes']
  ]
};

const toast = document.getElementById('toast');
let toastTimer;
function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2800);
}

document.querySelectorAll('[data-k="docs"]').forEach(link => {
  link.href = POSTMAN_DOCS;
});
document.querySelectorAll('[data-k="health"]').forEach(link => {
  link.href = `${API_BASE}/api/health`;
});
document.querySelectorAll('[data-s]').forEach(link => {
  const name = link.dataset.s;
  const url = SOCIAL[name];
  if (url) {
    link.href = url;
    link.target = '_blank';
    link.rel = 'noopener';
  } else {
    link.removeAttribute('href');
    link.setAttribute('role', 'link');
    link.tabIndex = 0;
    link.addEventListener('click', () => showToast(`${name} link coming soon.`));
    link.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        showToast(`${name} link coming soon.`);
      }
    });
  }
});

const tabs = document.getElementById('tabs');
const rows = document.getElementById('rows');
function renderModule(name) {
  rows.replaceChildren(...MODULES[name].map(([method, endpoint, purpose, auth]) => {
    const tr = document.createElement('tr');
    const m = document.createElement('td');
    const badge = document.createElement('span');
    badge.className = `method ${method.toLowerCase()}`;
    badge.textContent = method;
    m.append(badge);
    const e = document.createElement('td');
    e.className = 'endpoint';
    e.textContent = endpoint;
    const p = document.createElement('td');
    p.textContent = purpose;
    const a = document.createElement('td');
    a.className = 'auth';
    a.textContent = auth;
    tr.append(m,e,p,a);
    return tr;
  }));
}
Object.keys(MODULES).forEach((name, index) => {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'tab';
  button.textContent = name;
  button.setAttribute('role','tab');
  button.setAttribute('aria-selected', index === 0 ? 'true' : 'false');
  button.addEventListener('click', () => {
    tabs.querySelectorAll('[role="tab"]').forEach(tab => tab.setAttribute('aria-selected','false'));
    button.setAttribute('aria-selected','true');
    renderModule(name);
  });
  tabs.append(button);
});
tabs.setAttribute('role','tablist');
renderModule(Object.keys(MODULES)[0]);

document.getElementById('hc').addEventListener('click', async event => {
  const button = event.currentTarget;
  const status = document.getElementById('hs');
  const output = document.getElementById('ho');
  button.disabled = true;
  button.textContent = 'Checking…';
  status.textContent = 'Request in progress…';
  output.className = 'term';
  output.textContent = `GET ${API_BASE}/api/health`;
  try {
    const response = await fetch(`${API_BASE}/api/health`, {headers:{Accept:'application/json'}});
    const body = await response.text();
    let result;
    try { result = JSON.stringify(JSON.parse(body), null, 2); }
    catch { result = body || '(empty response)'; }
    status.textContent = `${response.status} ${response.statusText || (response.ok ? 'OK' : 'Error')}`;
    output.textContent = result;
    output.classList.add(response.ok ? 'success' : 'error');
  } catch (error) {
    status.textContent = 'Request failed';
    output.textContent = `Unable to reach the health endpoint. ${error.message}\n\nCheck your connection and try again.`;
    output.classList.add('error');
  } finally {
    button.disabled = false;
    button.textContent = 'Run Health Check';
  }
});
