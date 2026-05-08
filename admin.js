function logout() {
    localStorage.removeItem('adminToken');
    window.location.href = '/login.html';
}

function switchTab(tabId, btnElement) {
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    const tab = document.getElementById(tabId + '-tab');
    if (tab) tab.classList.add('active');
    if (btnElement) btnElement.classList.add('active');
}

document.addEventListener('DOMContentLoaded', () => {
    // Bind Buttons
    document.getElementById('btn-reviews').addEventListener('click', function() { switchTab('reviews', this); });
    document.getElementById('btn-settings').addEventListener('click', function() { switchTab('settings', this); });
    document.getElementById('btn-logout').addEventListener('click', logout);

    fetchReviews();
    fetchSettings();

    // Single Upload
    document.getElementById('addReviewForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = document.getElementById('submitBtn');
        btn.innerText = 'Uploading...'; btn.disabled = true;

        const formData = new FormData();
        formData.append('clientName', document.getElementById('clientName').value);
        formData.append('platform', document.getElementById('platform').value);
        formData.append('text', document.getElementById('reviewText').value);
        formData.append('image', document.getElementById('reviewImage').files[0]);

        try {
            const res = await fetch('/api/reviews', { method: 'POST', body: formData });
            if (res.ok) { document.getElementById('addReviewForm').reset(); fetchReviews(); }
        } catch (err) { alert('Network error.'); } 
        finally { btn.innerText = 'Upload Review'; btn.disabled = false; }
    });

    // Bulk Upload
    document.getElementById('bulkUploadForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = document.getElementById('bulkSubmitBtn');
        btn.innerText = 'Uploading...'; btn.disabled = true;

        const files = document.getElementById('bulkImages').files;
        const formData = new FormData();
        for (let i = 0; i < files.length; i++) { formData.append('images', files[i]); }

        try {
            const res = await fetch('/api/reviews/bulk', { method: 'POST', body: formData });
            if (res.ok) { document.getElementById('bulkUploadForm').reset(); fetchReviews(); }
        } catch (err) { alert('Network error.'); } 
        finally { btn.innerText = 'Upload All'; btn.disabled = false; }
    });

    // Save Settings
    document.getElementById('settingsForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = document.getElementById('saveSettingsBtn');
        btn.innerText = 'Saving...'; btn.disabled = true;

        const formData = new FormData();
        formData.append('whatsappNumber', document.getElementById('set-whatsapp').value);
        formData.append('phoneNumber', document.getElementById('set-phone').value);
        formData.append('email', document.getElementById('set-email').value);
        formData.append('facebook', document.getElementById('set-facebook').value);
        formData.append('youtube', document.getElementById('set-youtube').value);
        formData.append('linkedin', document.getElementById('set-linkedin').value);
        formData.append('instagram', document.getElementById('set-instagram').value);

        const logoFile = document.getElementById('set-logo').files[0];
        if (logoFile) {
            formData.append('logo', logoFile);
        }

        try {
            const res = await fetch('/api/settings', {
                method: 'PUT',
                body: formData
            });
            if (res.ok) alert('Settings saved successfully!');
        } catch (err) { alert('Network error.'); } 
        finally { btn.innerText = 'Save Settings'; btn.disabled = false; }
    });
});

async function fetchReviews() {
    try {
        const res = await fetch('/api/reviews');
        const reviews = await res.json();
        const list = document.getElementById('reviewList');
        if(!list) return;
        list.innerHTML = '';
        if (reviews.length === 0) { list.innerHTML = '<p>No reviews added yet.</p>'; return; }

        reviews.forEach(review => {
            const div = document.createElement('div');
            div.className = 'review-item';
            div.innerHTML = `
                <div style="display: flex; align-items: center;">
                    ${review.imageUrl ? `<img src="${review.imageUrl}" alt="Screenshot">` : ''}
                    <div class="review-content">
                        <h4>${review.clientName} <small>(${review.platform})</small></h4>
                        <p style="font-size: 0.85rem; color: #a0aec0;">${review.text || 'No description'}</p>
                    </div>
                </div>
                <div>
                    <button class="btn btn-secondary" style="padding: 5px 10px; font-size: 0.8rem; margin-right: 10px;" onclick="editReview('${review.id}', \`${review.clientName}\`, \`${review.text || ''}\`, '${review.platform}')"><i class="fas fa-edit"></i> Edit</button>
                    <button class="delete-btn" onclick="deleteReview('${review.id}')"><i class="fas fa-trash"></i> Delete</button>
                </div>
            `;
            list.appendChild(div);
        });
    } catch (err) { console.error(err); }
}

async function fetchSettings() {
    try {
        const res = await fetch('/api/settings');
        const settings = await res.json();
        const wa = document.getElementById('set-whatsapp');
        if (wa) {
            wa.value = settings.whatsappNumber || '';
            document.getElementById('set-phone').value = settings.phoneNumber || '';
            document.getElementById('set-email').value = settings.email || '';
            document.getElementById('set-facebook').value = settings.facebook || '';
            document.getElementById('set-youtube').value = settings.youtube || '';
            document.getElementById('set-linkedin').value = settings.linkedin || '';
            document.getElementById('set-instagram').value = settings.instagram || '';
        }
    } catch (err) { console.error(err); }
}

async function deleteReview(id) {
    if (confirm('Delete review?')) {
        const res = await fetch(`/api/reviews/${id}`, { method: 'DELETE' });
        if (res.ok) fetchReviews();
    }
}

async function editReview(id, currentName, currentText, currentPlatform) {
    const newName = prompt("Edit Client Name:", currentName);
    if (newName === null) return;
    const newPlatform = prompt("Edit Platform:", currentPlatform);
    if (newPlatform === null) return;
    const newText = prompt("Edit Description:", currentText);
    if (newText === null) return;

    const res = await fetch(`/api/reviews/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clientName: newName, platform: newPlatform, text: newText })
    });
    if (res.ok) fetchReviews();
}
