const numberInput = document.getElementById('numberInput');
const generateBtn = document.getElementById('generateBtn');
const downloadBtn = document.getElementById('downloadBtn');
const barcodeContainer = document.getElementById('barcodeContainer');
const barcodeSvg = document.getElementById('barcode');
const errorMessage = document.getElementById('errorMessage');

// Faqat raqamlarni kirishga ruxsat berish
numberInput.addEventListener('input', function(e) {
    this.value = this.value.replace(/[^0-9]/g, '');
    hideError();
});

// Enter tugmasi bosilganda
numberInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        generateBarcode();
    }
});

// Barcode yaratish
generateBtn.addEventListener('click', generateBarcode);

function generateBarcode() {
    const number = numberInput.value.trim();
    
    // Validatsiya
    if (!number) {
        showError('Iltimos, raqam kiriting!');
        return;
    }
    
    if (number.length !== 12) {
        showError('Raqam 12 xonali bo\'lishi kerak!');
        return;
    }
    
    if (!/^\d{12}$/.test(number)) {
        showError('Faqat raqamlar kiritilishi kerak!');
        return;
    }
    
    hideError();
    
    try {
        // Mobil qurilma tekshiruvi
        const isMobile = window.innerWidth <= 768;
        
        // Barcode yaratish - telefon skaner uchun optimallashtirilgan
        JsBarcode(barcodeSvg, number, {
            format: "CODE128",
            width: isMobile ? 3.5 : 2.5,  // Mobil uchun kattaroq chiziqlar
            height: isMobile ? 180 : 120,  // Mobil uchun balandroq
            displayValue: true,
            fontSize: isMobile ? 28 : 22,  // Mobil uchun kattaroq font
            margin: isMobile ? 20 : 15,  // Mobil uchun kattaroq margin
            background: "#ffffff",
            lineColor: "#000000",
            marginTop: isMobile ? 20 : 15,
            marginBottom: isMobile ? 20 : 15,
            marginLeft: isMobile ? 20 : 15,
            marginRight: isMobile ? 20 : 15
        });
        
        // Barcode SVG fonini oq qilish va kattalashtirish
        barcodeSvg.style.backgroundColor = '#ffffff';
        barcodeSvg.style.display = 'block';
        barcodeSvg.style.width = '100%';
        barcodeSvg.style.height = 'auto';
        
        // Barcode ko'rsatish
        barcodeContainer.classList.remove('hidden');
        
        // Scroll qilish
        barcodeContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    } catch (error) {
        showError('Barcode yaratishda xatolik yuz berdi. Iltimos, qayta urinib ko\'ring.');
        console.error('Barcode generation error:', error);
    }
}

// Barcode yuklab olish
downloadBtn.addEventListener('click', function() {
    const svg = barcodeSvg;
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    // Mobil uchun kattaroq canvas
    const isMobile = window.innerWidth <= 768;
    canvas.width = svg.clientWidth || (isMobile ? 600 : 500);
    canvas.height = svg.clientHeight || (isMobile ? 250 : 180);
    
    img.onload = function() {
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        
        // PNG sifatida yuklab olish
        const pngFile = canvas.toDataURL('image/png');
        const downloadLink = document.createElement('a');
        downloadLink.download = `barcode_${numberInput.value}.png`;
        downloadLink.href = pngFile;
        downloadLink.click();
    };
    
    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
});

function showError(message) {
    const errorText = errorMessage.querySelector('.error-text');
    if (errorText) {
        errorText.textContent = message;
    } else {
        errorMessage.textContent = message;
    }
    errorMessage.classList.remove('hidden');
    barcodeContainer.classList.add('hidden');
}

function hideError() {
    errorMessage.classList.add('hidden');
}
