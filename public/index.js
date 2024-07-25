document.getElementById('camera').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            // 업로드된 이미지 파일을 Data URL로 읽어옴
            const img = new Image();
            img.src = e.target.result;
            
            img.onload = function() {
                // 필터를 적용할 준비가 되었을 때
                applyFilter(img);
            };
        };
        reader.readAsDataURL(file);
    }
});

function applyFilter(image) {
    const filterName = 'filter1'; // 여기에서 사용자가 스캔한 QR 코드에 해당하는 필터 이름을 설정합니다.
    
    const filterImg = new Image();
    filterImg.src = `/filters/${filterName}.png`; // 필터 이미지 URL

    filterImg.onload = function() {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        canvas.width = image.width;
        canvas.height = image.height;
        
        // 이미지와 필터를 캔버스에 그립니다
        ctx.drawImage(image, 0, 0);
        ctx.globalAlpha = 0.5; // 필터의 투명도를 설정할 수 있습니다.
        ctx.drawImage(filterImg, 0, 0, canvas.width, canvas.height);
        
        // 필터가 적용된 이미지를 웹 페이지에 표시합니다.
        document.getElementById('filter-preview').src = canvas.toDataURL();
    };
}
