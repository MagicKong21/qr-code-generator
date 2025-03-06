// 获取当前日期并格式化为 YYMMDD
function getCurrentDateYYMMDD() {
  const now = new Date();
  const year = now.getFullYear().toString().slice(-2); // 获取后两位年份
  const month = String(now.getMonth() + 1).padStart(2, '0'); // 月份补齐两位
  const day = String(now.getDate()).padStart(2, '0'); // 日期补齐两位
  return `${year}${month}${day}`;
}

// 页面加载时自动填充默认日期
window.onload = () => {
  const dateInput = document.getElementById("date");
  dateInput.value = getCurrentDateYYMMDD(); // 自动设置默认日期
};

async function generate() {
  console.log("按钮被点击了");

  const goodsIdInput = document.getElementById("goodsId").value.trim();
  const dateInput = document.getElementById("date").value.trim();
  const goodsIds = goodsIdInput.split(',').map(id => id.trim());
  const outputDiv = document.getElementById("output");

  if (!goodsIdInput || !dateInput) {
    alert("请输入商品 ID 和日期！");
    return;
  }

  outputDiv.innerHTML = "";

  for (const goodsId of goodsIds) {
    try {
      const imageUrl = `https://union.lizhi.io/partner/product/${goodsId}/poster?cid=53qvofdc`;
      console.log("请求的图片 URL:", imageUrl);

      const response = await fetch(imageUrl);
      if (!response.ok) {
        throw new Error(`无法获取商品 ${goodsId} 的图片`);
      }
      const imageBlob = await response.blob();
      const imageUrlObject = URL.createObjectURL(imageBlob);
      console.log("Blob URL 被设置:", imageUrlObject);

      const img = new Image();
      img.src = imageUrlObject;

      img.onload = () => {
        console.log("图片已加载，开始绘制到 canvas");

        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        canvas.width = img.width;
        canvas.height = img.height;

        ctx.drawImage(img, 0, 0);

        const qrCodeUrl = `https://lizhi.shop/site/products/id/${goodsId}?cid=53qvofdc&hmsr=wechat&hmpl=p${dateInput}`;
        console.log("开始生成二维码，URL:", qrCodeUrl);

        QRCode.toCanvas(document.createElement("canvas"), qrCodeUrl, { width: 180 }, (err, qrCanvas) => {
          if (err) {
            console.error("二维码生成失败:", err);
            return;
          }
          console.log("二维码生成成功");

          // 显示二维码，用于调试
          document.body.appendChild(qrCanvas);

          ctx.drawImage(qrCanvas, 760, 172);

          const finalImage = document.createElement("img");
          finalImage.src = canvas.toDataURL("image/png");
          outputDiv.appendChild(finalImage);

          const downloadLink = document.createElement("a");
          downloadLink.href = finalImage.src;
          downloadLink.download = `${dateInput}_${goodsId}.png`;
          downloadLink.textContent = "下载图片";
          outputDiv.appendChild(downloadLink);
        });
      };
    } catch (error) {
      console.error("发生错误:", error);
    }
  }
}
