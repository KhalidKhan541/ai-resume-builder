// Theme Toggle
const themeToggle = document.getElementById('themeToggle');
const themeIcon = themeToggle.querySelector('.theme-icon');

function setTheme(isDark) {
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    themeIcon.textContent = isDark ? '☀️' : '🌙';
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
}

const savedTheme = localStorage.getItem('theme') || 'light';
setTheme(savedTheme === 'dark');

themeToggle.addEventListener('click', () => {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    setTheme(!isDark);
});

// Live Preview Updates
const formInputs = {
    fullName: document.getElementById('fullName'),
    email: document.getElementById('email'),
    phone: document.getElementById('phone'),
    summary: document.getElementById('summary'),
    skills: document.getElementById('skills')
};

const previewElements = {
    name: document.getElementById('previewName'),
    email: document.getElementById('previewEmail'),
    phone: document.getElementById('previewPhone'),
    summary: document.getElementById('previewSummary'),
    experience: document.getElementById('previewExperience'),
    education: document.getElementById('previewEducation'),
    skills: document.getElementById('previewSkills')
};

function updatePreview() {
    previewElements.name.textContent = formInputs.fullName.value || 'Your Name';
    previewElements.email.textContent = formInputs.email.value || 'email@example.com';
    previewElements.phone.textContent = formInputs.phone.value || '+1 (555) 000-0000';
    previewElements.summary.textContent = formInputs.summary.value || 'Your professional summary will appear here...';
    previewElements.skills.textContent = formInputs.skills.value || 'Your skills will appear here...';

    // Update Experience
    const expEntries = document.querySelectorAll('.experience-entry');
    let expHTML = '';
    expEntries.forEach(entry => {
        const title = entry.querySelector('.exp-title').value || 'Job Title';
        const company = entry.querySelector('.exp-company').value || 'Company';
        const start = entry.querySelector('.exp-start').value || '';
        const end = entry.querySelector('.exp-end').value || 'Present';
        const desc = entry.querySelector('.exp-desc').value || 'Description of your role and achievements.';
        expHTML += `
            <div class="experience-item">
                <div class="exp-header">
                    <strong>${title}</strong>
                    <span class="date">${company} | ${start} - ${end}</span>
                </div>
                <p>${desc}</p>
            </div>
        `;
    });
    previewElements.experience.innerHTML = expHTML || '<div class="experience-item"><div class="exp-header"><strong>Job Title</strong><span class="date">Company | Date</span></div><p>Description of your role and achievements.</p></div>';

    // Update Education
    const eduEntries = document.querySelectorAll('.education-entry');
    let eduHTML = '';
    eduEntries.forEach(entry => {
        const degree = entry.querySelector('.edu-degree').value || 'Degree';
        const school = entry.querySelector('.edu-school').value || 'Institution';
        const year = entry.querySelector('.edu-year').value || 'Year';
        eduHTML += `
            <div class="education-item">
                <strong>${degree}</strong>
                <span class="date">${school} | ${year}</span>
            </div>
        `;
    });
    previewElements.education.innerHTML = eduHTML || '<div class="education-item"><strong>Degree</strong><span class="date">Institution | Year</span></div>';
}

// Add event listeners to all inputs
document.querySelectorAll('input, textarea').forEach(input => {
    input.addEventListener('input', updatePreview);
});

// Add Experience
document.getElementById('addExperience').addEventListener('click', () => {
    const container = document.getElementById('experienceContainer');
    const newEntry = document.createElement('div');
    newEntry.className = 'experience-entry';
    newEntry.innerHTML = `
        <div class="form-row">
            <div class="form-group">
                <label>Job Title</label>
                <input type="text" class="exp-title" placeholder="Software Engineer" required>
            </div>
            <div class="form-group">
                <label>Company</label>
                <input type="text" class="exp-company" placeholder="Tech Corp" required>
            </div>
        </div>
        <div class="form-row">
            <div class="form-group">
                <label>Start Date</label>
                <input type="text" class="exp-start" placeholder="Jan 2020" required>
            </div>
            <div class="form-group">
                <label>End Date</label>
                <input type="text" class="exp-end" placeholder="Present">
            </div>
        </div>
        <div class="form-group">
            <label>Description</label>
            <textarea class="exp-desc" rows="3" placeholder="Key achievements and responsibilities..."></textarea>
        </div>
    `;
    container.appendChild(newEntry);
    newEntry.querySelectorAll('input, textarea').forEach(input => {
        input.addEventListener('input', updatePreview);
    });
});

// Add Education
document.getElementById('addEducation').addEventListener('click', () => {
    const container = document.getElementById('educationContainer');
    const newEntry = document.createElement('div');
    newEntry.className = 'education-entry';
    newEntry.innerHTML = `
        <div class="form-row">
            <div class="form-group">
                <label>Degree</label>
                <input type="text" class="edu-degree" placeholder="Bachelor of Science" required>
            </div>
            <div class="form-group">
                <label>Institution</label>
                <input type="text" class="edu-school" placeholder="University of Technology" required>
            </div>
        </div>
        <div class="form-row">
            <div class="form-group">
                <label>Year</label>
                <input type="text" class="edu-year" placeholder="2016 - 2020">
            </div>
        </div>
    `;
    container.appendChild(newEntry);
    newEntry.querySelectorAll('input').forEach(input => {
        input.addEventListener('input', updatePreview);
    });
});

// PDF Download
let downloadCount = parseInt(localStorage.getItem('downloadCount') || '0');
const paywallModal = document.getElementById('paywallModal');

document.getElementById('downloadBtn').addEventListener('click', async () => {
    if (downloadCount >= 1) {
        paywallModal.classList.add('active');
        return;
    }

    try {
        const element = document.getElementById('resumePreview');
        const canvas = await html2canvas(element, { scale: 2 });
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgData = canvas.toDataURL('image/png');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save('resume.pdf');

        downloadCount++;
        localStorage.setItem('downloadCount', downloadCount.toString());

        if (downloadCount >= 1) {
            paywallModal.classList.add('active');
        }
    } catch (error) {
        console.error('Error generating PDF:', error);
        alert('Error generating PDF. Please try again.');
    }
});

// Close Modal
document.getElementById('closeModal').addEventListener('click', () => {
    paywallModal.classList.remove('active');
});

paywallModal.addEventListener('click', (e) => {
    if (e.target === paywallModal) {
        paywallModal.classList.remove('active');
    }
});

// Paywall Form
document.getElementById('paywallForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('paywallEmail').value;
    alert(`Thank you! Payment link sent to ${email}. (This is a demo - integrate Stripe for production)`);
    paywallModal.classList.remove('active');
    downloadCount = 0;
    localStorage.setItem('downloadCount', '0');
});
