// === ១. ព័ត៌មាន Telegram API និង Chat ID របស់អ្នក ===
const TELEGRAM_BOT_TOKEN = '9009284989:AAEGjR718FYqJO5uSGltw5rQAEIx9lLi7qA'; 
const TELEGRAM_CHAT_ID = '1663298440';
const BOT_USERNAME = 'phatchamnancardbot'; 

let studentPhotoBase64 = ""; 

// ២. ចាប់យកព្រឹត្តិការណ៍នៅពេលសិស្សជ្រើសរើសរូបថតពីកុំព្យូទ័រ
document.getElementById('photoInput').addEventListener('change', function(e) {
    const file = e.target.files[0]; 
    if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            studentPhotoBase64 = event.target.result; 
            document.getElementById('cardImage').src = studentPhotoBase64;
            
            document.getElementById('uploadStatusText').innerText = "✅ បានជ្រើសរើសរូបថតរួចរាល់";
            document.getElementById('uploadStatusText').style.color = "#2563eb";
        };
        reader.readAsDataURL(file);
    }
});

// ៣. ចាប់យកព្រឹត្តិការណ៍នៅពេលចុចប៊ូតុង Submit Form
document.getElementById('studentForm').addEventListener('submit', function(e) {
    e.preventDefault(); 

    if (!studentPhotoBase64) {
        alert("សូមមេត្តាជ្រើសរើសរូបថតសិស្សជាមុនសិន!");
        return;
    }

    // ទាញយកតម្លៃពី Form Inputs នីមួយៗ
    const nameKh = document.getElementById('nameKh').value;
    const nameEn = document.getElementById('nameEn').value;
    const studentId = document.getElementById('studentId').value;
    const gender = document.querySelector('input[name="gender"]:checked').value;
    const dob = document.getElementById('dob').value;
    
    const majorSelect = document.getElementById('major');
    const major = majorSelect.options[majorSelect.selectedIndex].text; 

    // បំប្លែងថ្ងៃខែឆ្នាំកំណើតទៅជាទម្រង់ DD-MM-YYYY
    const dateObj = new Date(dob);
    const formattedDob = `${String(dateObj.getDate()).padStart(2, '0')}-${String(dateObj.getMonth() + 1).padStart(2, '0')}-${dateObj.getFullYear()}`;

    // បញ្ចូលអក្សរទៅក្នុងកាត Pop-up
    document.getElementById('cardNameKh').innerText = nameKh;
    document.getElementById('cardNameEn').innerText = nameEn;
    document.getElementById('cardId').innerText = studentId;
    document.getElementById('cardGender').innerText = gender;
    document.getElementById('cardDob').innerText = formattedDob;
    document.getElementById('cardMajor').innerText = major;

    // បង្ហាញផ្ទាំង Pop-up Modal ព្រមទាំងដំណើរការចលនា (Animation)
    const modal = document.getElementById('cardModal');
    modal.classList.add('flex', 'fade-in');
    document.getElementById('idCard').classList.add('pop-up-card');

    // រៀបចំសារអត្ថបទសម្រាប់ផ្ញើ
    const message = `🔔 មានសិស្សចុះឈ្មោះថ្មី!\n🆔 ID: ${studentId}\n👤 ឈ្មោះខ្មែរ៖ ${nameKh}\n👤 ឈ្មោះអង់គ្លេស៖ ${nameEn}\n🚻 ភេទ៖ ${gender}\n📅 ថ្ងៃកំណើត៖ ${formattedDob}\n🎓 ជំនាញ៖ ${major}`;

    // === ជួសជុលបន្ទាត់កូដផ្ញើទៅ Telegram API ឱ្យត្រឹមត្រូវ និងដំណើរការពីក្រោយខ្នងស្វ័យប្រវត្តិ ===
    const apiUrl = 'https://telegram.org' + TELEGRAM_BOT_TOKEN + '/sendMessage';
    
    fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            chat_id: TELEGRAM_CHAT_ID, 
            text: message
        })
    })
    .then(res => {
        if(res.ok) {
            console.log('ទិន្នន័យត្រូវបានបញ្ជូនទៅ Telegram រួចរាល់!');
        } else {
            console.error('ការផ្ញើមានបញ្ហា សូមពិនិត្យមើល Bot Token ឬ Chat ID');
        }
    })
    .catch(err => console.error("Error:", err));
});

// ៤. មុខងារប៊ូតុងពិសេស៖ ពេលចុច វានឹងបើកកម្មវិធី Telegram លោតអក្សរជាស្រេច
document.getElementById('sendToTelegramBtn').addEventListener('click', function() {
    const nameKh = document.getElementById('nameKh').value;
    const nameEn = document.getElementById('nameEn').value;
    const studentId = document.getElementById('studentId').value;
    const gender = document.querySelector('input[name="gender"]:checked').value;
    const dob = document.getElementById('dob').value;
    const majorSelect = document.getElementById('major');
    const major = majorSelect.options[majorSelect.selectedIndex].text; 

    const dateObj = new Date(dob);
    const formattedDob = `${String(dateObj.getDate()).padStart(2, '0')}-${String(dateObj.getMonth() + 1).padStart(2, '0')}-${dateObj.getFullYear()}`;

    const textMessage = `🔔 មានសិស្សចុះឈ្មោះថ្មី!\n🆔 ID: ${studentId}\n👤 ឈ្មោះខ្មែរ៖ ${nameKh}\n👤 ឈ្មោះអង់គ្លេស៖ ${nameEn}\n🚻 ភេទ៖ ${gender}\n📅 ថ្ងៃកំណើត៖ ${formattedDob}\n🎓 ជំនាញ៖ ${major}`;

    const encodedMessage = encodeURIComponent(textMessage);
    const telegramUrl = 'https://t.me/' + BOT_USERNAME + '?text=' + encodedMessage;
    
    window.open(telegramUrl, '_blank');
});

// ៥. មុខងារសម្រាប់ចុចប៊ូតុងបិទផ្ទាំង Pop-up Modal
document.getElementById('closeModalBtn').addEventListener('click', function() {
    const modal = document.getElementById('cardModal');
    modal.classList.remove('flex', 'fade-in');
});

// ==========================================
// ផ្នែកកូដបន្ថែមសម្រាប់បង្កើត QR Code ដោយមិនប៉ះពាល់កូដចាស់
// ==========================================

// ១. ចាប់យកទម្រង់ Form ពី HTML
const extensionForm = document.getElementById('studentForm');

if (extensionForm) {
    // ២. បន្ថែមព្រឹត្តិការណ៍នៅពេលចុច Submit បង្កើតកាត
    extensionForm.addEventListener('submit', function() {
        // ចាប់យកអត្តសញ្ញាណ ID ដែលអ្នកប្រើប្រាស់បានវាយបញ្ចូល
        const studentIdField = document.getElementById('studentId');
        const qrcodeContainer = document.getElementById('qrcode');
        
        if (studentIdField && qrcodeContainer) {
            const studentId = studentIdField.value;

            // បង្កើតតំណភ្ជាប់ (URL) ផ្ញើ ID ទៅកាន់ទំព័រ student_card.html
            const studentCardUrl = "http://172.20.10" + studentId;


            // សម្អាត QR Code ចាស់ចេញ រួចបង្កើតថ្មីចូលទៅក្នុង <div id="qrcode"></div>
            qrcodeContainer.innerHTML = ""; 
            new QRCode(qrcodeContainer, {
                text: studentCardUrl,
                width: 150,
                height: 150,
                colorDark : "#000000",
                colorLight : "#ffffff",
                correctLevel : QRCode.CorrectLevel.H
            });
            
            // កំណត់ Style បន្ថែមឱ្យ QR Code រំកិលមកចំកណ្តាល និងមានគម្លាតស្អាត
            qrcodeContainer.style.display = "flex";
            qrcodeContainer.style.justifyContent = "center";
            qrcodeContainer.style.marginTop = "20px";
        }
    });
}
