import { EmailScanner } from '../../core/scanner.js';
import { AuthApi } from '../../api/auth.js';
import { SubscriptionApi } from '../../api/subscriptions.js';
import { UserApi } from '../../api/user.js';

const scanner = new EmailScanner();
const authApi = new AuthApi();
const subscriptionApi = new SubscriptionApi();
const userApi = new UserApi();

const elements = {
  scanBtn: document.getElementById('scan-btn'),
  retryBtn: document.getElementById('retry-btn'),
  subList: document.getElementById('sub-list'),
  subCount: document.getElementById('sub-count'),
  scanInfo: document.getElementById('scan-info'),
  resultsSection: document.getElementById('results-section'),
  emptyState: document.getElementById('empty-state'),
  errorState: document.getElementById('error-state'),
  errorMessage: document.querySelector('.error-message'),
  authSection: document.getElementById('auth-section'),
  userSection: document.getElementById('user-section'),
  loginTab: document.getElementById('login-tab'),
  registerTab: document.getElementById('register-tab'),
  loginForm: document.getElementById('login-form'),
  registerForm: document.getElementById('register-form'),
  logoutBtn: document.getElementById('logout-btn'),
  userEmail: document.getElementById('user-email'),
  emailsScanned: document.getElementById('emails-scanned'),
  totalSubs: document.getElementById('total-subs')
};

let currentUser = null;
let subscriptionIdMap = new Map();

function showAuthSection() {
  elements.authSection.style.display = 'block';
  elements.userSection.style.display = 'none';
  elements.scanBtn.disabled = true;
  elements.scanBtn.title = 'Please login or register to scan your inbox';
  elements.emptyState.innerHTML = '<p>🔒 Please login or register to scan your inbox</p>';
}

function showUserSection(user) {
  elements.authSection.style.display = 'none';
  elements.userSection.style.display = 'block';
  elements.userEmail.textContent = user.email;
  elements.scanBtn.disabled = false;
  elements.scanBtn.title = 'Scan your inbox for subscriptions';
  elements.emptyState.innerHTML = '<p>👆 Click "Scan Inbox" to find your email subscriptions</p>';
  currentUser = user;
}

function showLoading() {
  elements.scanBtn.disabled = true;
  elements.emptyState.style.display = 'none';
  elements.errorState.style.display = 'none';
  elements.resultsSection.style.display = 'none';
}

function hideLoading() {
  elements.scanBtn.disabled = false;
}

function showError(message) {
  elements.errorState.style.display = 'block';
  elements.errorMessage.textContent = message;
  elements.emptyState.style.display = 'none';
  elements.resultsSection.style.display = 'none';
}

function showAuthError(formType, message) {
  const form = formType === 'login' ? elements.loginForm : elements.registerForm;
  const errorDiv = form.querySelector('.auth-error');
  errorDiv.textContent = message;
  errorDiv.style.display = 'block';
  setTimeout(() => {
    errorDiv.style.display = 'none';
  }, 5000);
}

function showResults(subscriptions) {
  elements.resultsSection.style.display = 'flex';
  elements.emptyState.style.display = 'none';
  elements.errorState.style.display = 'none';
  
  elements.subCount.textContent = subscriptions.length;
  elements.subList.innerHTML = '';
  
  if (subscriptions.length === 0) {
    const emptyDiv = document.createElement('div');
    emptyDiv.className = 'empty-state';
    emptyDiv.innerHTML = '<p>🎉 No subscriptions found! Your inbox is clean.</p>';
    elements.subList.appendChild(emptyDiv);
    return;
  }
  
  subscriptions.forEach(sub => {
    const item = createSubscriptionItem(sub);
    elements.subList.appendChild(item);
  });
}

function createSubscriptionItem(sub) {
  const div = document.createElement('div');
  div.className = 'sub-item';
  div.dataset.subId = sub._id || sub.id;
  
  const sender = document.createElement('div');
  sender.className = 'sub-sender';
  sender.textContent = sub.senderName || sub.name;
  
  const email = document.createElement('div');
  email.className = 'sub-email';
  email.textContent = sub.senderEmail || sub.email;
  
  const subject = document.createElement('div');
  subject.className = 'sub-subject';
  subject.textContent = sub.subject;
  
  const actions = document.createElement('div');
  actions.className = 'sub-actions';
  
  const unsubLink = document.createElement('a');
  unsubLink.className = 'unsub-link';
  
  const isValidUrl = (url) => {
    try {
      const parsed = new URL(url);
      return parsed.protocol === 'http:' || parsed.protocol === 'https:';
    } catch {
      return false;
    }
  };
  
  const unsubUrl = sub.unsubscribeLink || sub.unsubLink;
  
  if (unsubUrl && isValidUrl(unsubUrl)) {
    unsubLink.href = unsubUrl;
    unsubLink.target = '_blank';
    unsubLink.rel = 'noopener noreferrer';
    
    unsubLink.addEventListener('click', async (e) => {
      if (currentUser && sub._id) {
        try {
          await subscriptionApi.markUnsubscribed(sub._id);
          div.style.opacity = '0.5';
          div.style.transition = 'opacity 0.3s';
          setTimeout(() => {
            div.remove();
            const currentCount = parseInt(elements.subCount.textContent);
            elements.subCount.textContent = currentCount - 1;
            updateStats();
          }, 300);
        } catch (error) {
          console.error('Error marking unsubscribed:', error);
        }
      }
    });
  } else {
    unsubLink.href = '#';
    unsubLink.onclick = (e) => e.preventDefault();
    unsubLink.style.opacity = '0.5';
    unsubLink.style.cursor = 'not-allowed';
  }
  
  unsubLink.textContent = 'Unsubscribe →';
  unsubLink.title = 'Click to unsubscribe from ' + (sub.senderName || sub.name);
  
  actions.appendChild(unsubLink);
  
  div.appendChild(sender);
  div.appendChild(email);
  div.appendChild(subject);
  div.appendChild(actions);
  
  return div;
}

async function updateStats() {
  if (!currentUser) return;
  
  try {
    const history = await subscriptionApi.getScanHistory();
    elements.emailsScanned.textContent = history.totalEmailsScanned || 0;
    
    const subs = await subscriptionApi.getSubscriptions();
    elements.totalSubs.textContent = subs.count || 0;
  } catch (error) {
    console.error('Error updating stats:', error);
  }
}

async function performScan() {
  if (!currentUser) {
    showError('Please login or register before scanning your inbox.');
    return;
  }

  showLoading();
  
  try {
    const result = await scanner.scan({
      maxResults: 50,
      maxSubscriptions: 20,
      daysBack: 30
    });
    
    if (result.success) {
      try {
        await subscriptionApi.saveSubscriptions(
          result.subscriptions,
          result.count,
          result.provider
        );
        
        const savedSubs = await subscriptionApi.getSubscriptions();
        showResults(savedSubs.subscriptions);
        await updateStats();
      } catch (error) {
        console.error('Error saving to backend:', error);
        showError('Failed to save subscriptions. Please try again.');
      }
      
      if (result.count > 0) {
        elements.scanInfo.textContent = `Last scanned: ${new Date().toLocaleTimeString()} (${result.count} emails scanned)`;
      }
    } else {
      showError(result.error || 'Failed to scan inbox. Please try again.');
    }
  } catch (error) {
    console.error('Scan error:', error);
    showError('An unexpected error occurred. Please try again.');
  } finally {
    hideLoading();
  }
}

async function loadSubscriptions() {
  if (currentUser) {
    try {
      const response = await subscriptionApi.getSubscriptions();
      if (response.success && response.subscriptions.length > 0) {
        showResults(response.subscriptions);
        elements.scanInfo.textContent = `Showing ${response.count} active subscriptions`;
      }
    } catch (error) {
      console.error('Error loading subscriptions from backend:', error);
    }
  }
}

async function handleLogin(e) {
  e.preventDefault();
  
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;
  
  try {
    const response = await authApi.login(email, password);
    
    if (response.success) {
      showUserSection(response.user);
      await updateStats();
      await loadSubscriptions();
    }
  } catch (error) {
    showAuthError('login', error.message || 'Login failed. Please try again.');
  }
}

async function handleRegister(e) {
  e.preventDefault();
  
  const email = document.getElementById('register-email').value;
  const password = document.getElementById('register-password').value;
  
  try {
    const response = await authApi.register(email, password);
    
    if (response.success) {
      showUserSection(response.user);
      await updateStats();
    }
  } catch (error) {
    showAuthError('register', error.message || 'Registration failed. Please try again.');
  }
}

async function handleLogout() {
  await authApi.logout();
  currentUser = null;
  showAuthSection();
  elements.resultsSection.style.display = 'none';
  elements.emptyState.style.display = 'block';
}

async function checkAuth() {
  try {
    const isAuth = await authApi.isAuthenticated();
    
    if (isAuth) {
      const response = await authApi.getCurrentUser();
      if (response.success) {
        showUserSection(response.user);
        await updateStats();
        await loadSubscriptions();
        return;
      }
    }
  } catch (error) {
    console.log('Not authenticated');
  }
  
  showAuthSection();
  await loadSubscriptions();
}

elements.loginTab.addEventListener('click', () => {
  elements.loginTab.classList.add('active');
  elements.registerTab.classList.remove('active');
  elements.loginForm.style.display = 'flex';
  elements.registerForm.style.display = 'none';
});

elements.registerTab.addEventListener('click', () => {
  elements.registerTab.classList.add('active');
  elements.loginTab.classList.remove('active');
  elements.registerForm.style.display = 'flex';
  elements.loginForm.style.display = 'none';
});

elements.loginForm.addEventListener('submit', handleLogin);
elements.registerForm.addEventListener('submit', handleRegister);
elements.logoutBtn.addEventListener('click', handleLogout);
elements.scanBtn.addEventListener('click', performScan);
elements.retryBtn.addEventListener('click', performScan);

checkAuth();
