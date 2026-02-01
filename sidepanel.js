// sidepanel.js
import { scanForSubscriptions } from './utils.js';

document.addEventListener('DOMContentLoaded', () => {
  const scanBtn = document.getElementById('scan-btn');
  const listContainer = document.getElementById('sub-list');

  scanBtn.addEventListener('click', async () => {
    // UI Loading State
    scanBtn.textContent = 'Scanning...';
    scanBtn.disabled = true;
    listContainer.innerHTML = ''; // Clear previous

    // Run the scan
    const subscriptions = await scanForSubscriptions();

    // Render results
    if (subscriptions.length === 0) {
        listContainer.innerHTML = '<div class="item">No active subscriptions found.</div>';
    } else {
        subscriptions.forEach(sub => {
            const div = document.createElement('div');
            div.className = 'item';
            div.innerHTML = `
                <div class="sender">${sub.name}</div>
                <div class="subject">${sub.subject}</div>
            `;
            listContainer.appendChild(div);
        });
    }

    // Reset Button
    scanBtn.textContent = 'Scan Inbox';
    scanBtn.disabled = false;
  });
});