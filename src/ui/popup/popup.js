import { EmailScanner } from '../../core/scanner.js';

const scanner = new EmailScanner();

const elements = {
  scanBtn: document.getElementById('scan-btn'),
  retryBtn: document.getElementById('retry-btn'),
  subList: document.getElementById('sub-list'),
  subCount: document.getElementById('sub-count'),
  scanInfo: document.getElementById('scan-info'),
  resultsSection: document.getElementById('results-section'),
  emptyState: document.getElementById('empty-state'),
  errorState: document.getElementById('error-state'),
  errorMessage: document.querySelector('.error-message')
};

function validateElements() {
  const required = ['scanBtn', 'retryBtn', 'subList', 'resultsSection', 'errorState', 'errorMessage'];
  for (const key of required) {
    if (!elements[key]) {
      console.error(`Critical element missing: ${key}`);
      return false;
    }
  }
  return true;
}

if (!validateElements()) {
  console.error('Failed to initialize popup: missing required DOM elements');
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
  
  const sender = document.createElement('div');
  sender.className = 'sub-sender';
  sender.textContent = sub.name;
  
  const email = document.createElement('div');
  email.className = 'sub-email';
  email.textContent = sub.email;
  
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
  
  if (sub.unsubLink && isValidUrl(sub.unsubLink)) {
    unsubLink.href = sub.unsubLink;
    unsubLink.target = '_blank';
    unsubLink.rel = 'noopener noreferrer';
  } else {
    unsubLink.href = '#';
    unsubLink.onclick = (e) => e.preventDefault();
    unsubLink.style.opacity = '0.5';
    unsubLink.style.cursor = 'not-allowed';
  }
  
  unsubLink.textContent = 'Unsubscribe →';
  unsubLink.title = 'Click to unsubscribe from ' + sub.name;
  
  actions.appendChild(unsubLink);
  
  div.appendChild(sender);
  div.appendChild(email);
  div.appendChild(subject);
  div.appendChild(actions);
  
  return div;
}

async function performScan() {
  showLoading();
  
  try {
    const result = await scanner.scan({
      maxResults: 50,
      maxSubscriptions: 20,
      daysBack: 30
    });
    
    if (result.success) {
      showResults(result.subscriptions);
      
      if (result.count > 0) {
        elements.scanInfo.textContent = `Last scanned: ${new Date().toLocaleTimeString()}`;
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

async function loadStoredSubscriptions() {
  try {
    const subscriptions = await scanner.getStoredSubscriptions();
    const lastScan = await scanner.getLastScanTime();
    
    if (subscriptions && subscriptions.length > 0) {
      showResults(subscriptions);
      
      if (lastScan) {
        const scanDate = new Date(lastScan);
        elements.scanInfo.textContent = `Last scanned: ${scanDate.toLocaleString()}`;
      }
    }
  } catch (error) {
    console.error('Error loading stored subscriptions:', error);
  }
}

if (elements.scanBtn) {
  elements.scanBtn.addEventListener('click', performScan);
}

if (elements.retryBtn) {
  elements.retryBtn.addEventListener('click', performScan);
}

loadStoredSubscriptions();
