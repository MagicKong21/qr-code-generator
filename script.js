async function generate() {
  const goodsIdInput = document.getElementById("goodsId").value.trim();
  const dateInput = document.getElementById("date").value.trim();
  const goodsIds = goodsIdInput.split(',').map(id => id.trim());
  const outputDiv = document.getElementById("output");

  // 检查输入是否合法
  if (!goodsIdInput || !dateInput) {
    alert("请输入商品 ID 和日期！");
    return;
  }

  outputDiv.innerHTML = ""; // 清空输出内容

  for (const goodsId of goodsIds) {
    try {
      // 获取图片 URL
      const imageUrl = `https://union.lizhi.io/partner/product/${goodsId}/poster?cid=53qvofdc`;

      // 下载图片
      const response = await fetch(imageUrl);
      if (!response.ok) {
        throw new Error(`无法获取商品 ${goodsId} 的图片`);
      }
      const imageBlob = await response.blob();
      const imageUrlObject = URL.createObjectURL(imageBlob);

      // 创建图片对象
      const img = new Image();
      img.src = imageUrlObject;

      img.onload = () => {
        // 创建 canvas 绘制图片和二维码
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        canvas.width = img.width;
        canvas.height = img.height;

        // 绘制原始图片
        ctx.drawImage(img, 0, 0);

        // 生成二维码
        const qrCodeUrl = `https://lizhi.shop/site/products/id/${goodsId}?cid=53qvofdc&hmsr=wechat&hmpl=p${dateInput}`;
        QRCode.toCanvas(document.createElement("canvas"), qrCodeUrl, { width: 180 }, (err, qrCanvas) => {
          if (err) {
            console.error(err);
            return;
          }
          // 将二维码绘制到指定位置
          ctx.drawImage(qrCanvas, 760, 172); // 位置可以调整
          // 将生成的图片显示在页面上
          const finalImage = document.createElement("img");
          finalImage.src = canvas.toDataURL("image/png");
          outputDiv.appendChild(finalImage);

          // 提供下载按钮
          const downloadLink = document.createElement("a");
          downloadLink.href = finalImage.src;
          downloadLink.download = `${dateInput}_${goodsId}.png`;
          downloadLink.textContent = "下载图片";
          outputDiv.appendChild(downloadLink);
        });
      };
    } catch (error) {
      console.error(error);
      alert(`处理商品 ${goodsId} 时出错：${error.message}`);
    }
  }
}