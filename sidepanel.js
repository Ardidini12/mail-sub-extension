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

    try {
      // Run the scan
      const subscriptions = await scanForSubscriptions();

      // Render results
      if (!subscriptions || subscriptions.length === 0) {
        const div = document.createElement('div');
        div.className = 'item';
        div.textContent = 'No active subscriptions found.';
        listContainer.appendChild(div);
      } else {
        subscriptions.forEach(sub => {
          const div = document.createElement('div');
          div.className = 'item';

          const senderEl = document.createElement('div');
          senderEl.className = 'sender';
          senderEl.textContent = sub.name;

          const subjectEl = document.createElement('div');
          subjectEl.className = 'subject';
          subjectEl.textContent = sub.subject;

          div.appendChild(senderEl);
          div.appendChild(subjectEl);
          listContainer.appendChild(div);
        });
      }
    } catch (error) {
      console.error(error);
      listContainer.innerHTML = '<div class="item">Error scanning inbox. Please try again.</div>';
    } finally {
      // Reset Button
      scanBtn.textContent = 'Scan Inbox';
      scanBtn.disabled = false;
    }
  });
});